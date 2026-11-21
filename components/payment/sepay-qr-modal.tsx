import { MaterialIcons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import * as React from 'react';
import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { formatCurrency } from '@/utils/format';

/**
 * Chuyển khoản VietQR qua SePay (21/11/2026, thay PayOS).
 *
 * Backend trả link ảnh `https://qr.sepay.vn/img?acc=..&bank=..&amount=..&des=TZxxxxxxxxxx&name=..`.
 * Màn này hiện mã QR + thông tin chuyển khoản thủ công, rồi hỏi `checkPaid` mỗi vài giây
 * cho tới khi SePay báo tiền về (webhook) — khách không cần bấm gì thêm.
 */

export type SePayTransferInfo = {
  qrUrl: string;
  bank: string;
  account: string;
  accountName: string;
  amount: number;
  content: string;
};

export function parseSePayUrl(url: string | null | undefined): SePayTransferInfo | null {
  if (!url || !url.includes('qr.sepay.vn')) return null;
  try {
    const query = url.split('?')[1] ?? '';
    const params: Record<string, string> = {};
    for (const part of query.split('&')) {
      const [k, v = ''] = part.split('=');
      if (k) params[decodeURIComponent(k)] = decodeURIComponent(v.replace(/\+/g, ' '));
    }
    if (!params.acc || !params.des) return null;
    return {
      qrUrl: url,
      bank: params.bank ?? '',
      account: params.acc,
      accountName: params.name ?? '',
      amount: Number(params.amount) || 0,
      content: params.des,
    };
  } catch {
    return null;
  }
}

export function isSePayUrl(url: string | null | undefined): boolean {
  return parseSePayUrl(url) !== null;
}

type Props = {
  visible: boolean;
  paymentUrl: string | null;
  /** Trả true khi đơn / khoản nạp đã được ghi nhận thanh toán. */
  checkPaid: () => Promise<boolean>;
  onPaid: () => void;
  onClose: () => void;
  title?: string;
};

const POLL_MS = 4000;
const TIMEOUT_MS = 15 * 60 * 1000;

export function SePayQrModal({ visible, paymentUrl, checkPaid, onPaid, onClose, title }: Props) {
  const info = React.useMemo(() => parseSePayUrl(paymentUrl), [paymentUrl]);
  const [copied, setCopied] = React.useState<string | null>(null);
  const [timedOut, setTimedOut] = React.useState(false);
  const paidRef = React.useRef(false);
  const checkRef = React.useRef(checkPaid);
  checkRef.current = checkPaid;
  const onPaidRef = React.useRef(onPaid);
  onPaidRef.current = onPaid;

  React.useEffect(() => {
    if (!visible || !info) return;
    paidRef.current = false;
    setTimedOut(false);
    const started = Date.now();
    let stopped = false;
    let timer: ReturnType<typeof setTimeout>;
    const tick = async () => {
      if (stopped || paidRef.current) return;
      try {
        if (await checkRef.current()) {
          paidRef.current = true;
          onPaidRef.current();
          return;
        }
      } catch {
        // lỗi mạng tạm thời: hỏi lại lượt sau
      }
      if (Date.now() - started > TIMEOUT_MS) {
        setTimedOut(true);
        return;
      }
      timer = setTimeout(tick, POLL_MS);
    };
    timer = setTimeout(tick, POLL_MS);
    return () => {
      stopped = true;
      clearTimeout(timer);
    };
  }, [visible, info]);

  const copy = async (label: string, value: string) => {
    await Clipboard.setStringAsync(value);
    setCopied(label);
    setTimeout(() => setCopied((c) => (c === label ? null : c)), 1500);
  };

  if (!info) return null;

  const rows: { label: string; value: string; display?: string; copyable?: boolean }[] = [
    { label: 'Ngân hàng', value: info.bank },
    { label: 'Số tài khoản', value: info.account, copyable: true },
    ...(info.accountName ? [{ label: 'Chủ tài khoản', value: info.accountName }] : []),
    {
      label: 'Số tiền',
      value: String(info.amount),
      display: formatCurrency(info.amount),
      copyable: true,
    },
    { label: 'Nội dung', value: info.content, copyable: true },
  ];

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.screen}>
        <View style={styles.header}>
          <Text style={styles.title}>{title ?? 'Chuyển khoản QR'}</Text>
          <Pressable onPress={onClose} hitSlop={12} accessibilityLabel="Đóng">
            <MaterialIcons name="close" size={26} color="#383838" />
          </Pressable>
        </View>
        <ScrollView contentContainerStyle={styles.body}>
          <Text style={styles.hint}>
            Mở app ngân hàng, quét mã QR dưới đây (hoặc chụp màn hình rồi chọn ảnh). Giữ nguyên số
            tiền và nội dung để TAYZEN tự xác nhận.
          </Text>
          <View style={styles.qrBox}>
            <Image
              source={{ uri: info.qrUrl }}
              style={styles.qr}
              resizeMode="contain"
              accessibilityLabel="Mã QR chuyển khoản"
            />
          </View>
          <View style={styles.card}>
            {rows.map((row) => (
              <View key={row.label} style={styles.row}>
                <Text style={styles.rowLabel}>{row.label}</Text>
                <View style={styles.rowRight}>
                  <Text
                    style={[styles.rowValue, row.label === 'Nội dung' && styles.rowValueStrong]}
                    selectable>
                    {row.display ?? row.value}
                  </Text>
                  {row.copyable ? (
                    <Pressable
                      style={styles.copyBtn}
                      onPress={() => copy(row.label, row.value)}
                      accessibilityLabel={`Sao chép ${row.label}`}>
                      <MaterialIcons
                        name={copied === row.label ? 'check' : 'content-copy'}
                        size={18}
                        color="#0F382C"
                      />
                    </Pressable>
                  ) : null}
                </View>
              </View>
            ))}
          </View>
          <View style={styles.status}>
            {timedOut ? (
              <Text style={styles.statusText}>
                Chưa nhận được tiền sau 15 phút. Nếu bạn đã chuyển, trạng thái sẽ tự cập nhật khi
                ngân hàng báo về; cần hỗ trợ vui lòng liên hệ TAYZEN.
              </Text>
            ) : (
              <>
                <ActivityIndicator color="#0F382C" />
                <Text style={styles.statusText}>Đang chờ ngân hàng xác nhận…</Text>
              </>
            )}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FBF9F5', paddingTop: 52 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  title: { color: '#0F382C', fontFamily: 'Montserrat_700Bold', fontSize: 20 },
  body: { paddingHorizontal: 20, paddingBottom: 40, gap: 16 },
  hint: { color: '#475467', fontFamily: 'Montserrat_400Regular', fontSize: 14, lineHeight: 20 },
  qrBox: {
    alignSelf: 'center',
    padding: 12,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E1E7E2',
  },
  qr: { width: 260, height: 260 },
  card: {
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E1E7E2',
    paddingHorizontal: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 48,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E1E7E2',
    gap: 12,
  },
  rowLabel: { color: '#667085', fontFamily: 'Montserrat_400Regular', fontSize: 13 },
  rowRight: { flexDirection: 'row', alignItems: 'center', flexShrink: 1, gap: 6 },
  rowValue: {
    color: '#101828',
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 14,
    textAlign: 'right',
    flexShrink: 1,
  },
  rowValueStrong: { color: '#BC1B31', fontFamily: 'Montserrat_700Bold', letterSpacing: 0.5 },
  copyBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  status: { alignItems: 'center', gap: 8, paddingTop: 4 },
  statusText: {
    color: '#475467',
    fontFamily: 'Montserrat_400Regular',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 19,
  },
});
