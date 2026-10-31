import { MaterialIcons } from '@expo/vector-icons';
import * as React from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import VNPayWebView from '@/components/VNPayWebView';
import { PaymentMethod } from '@/services/api/bookings';
import { getApiErrorMessage } from '@/services/api/client';
import { topUpWallet, verifyVnpayCallback } from '@/services/api/payment';
import { formatCurrency } from '@/utils/format';

const MIN_TOPUP = 10000;

type WalletTopupModalProps = {
  visible: boolean;
  onClose: () => void;
  onDone: () => void;
  title?: string;
  note?: string;
  suggestedAmount?: number;
};

// Nạp tiền vào ví qua VNPay — dùng cho số dư bảo đảm phí của KTV (đơn tiền mặt) và các chỗ cần nạp nhanh.
export function WalletTopupModal({
  visible,
  onClose,
  onDone,
  title = 'Nạp tiền vào ví',
  note,
  suggestedAmount,
}: WalletTopupModalProps) {
  const [amountText, setAmountText] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const [paymentUrl, setPaymentUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (visible) {
      setAmountText(suggestedAmount ? String(suggestedAmount) : '');
    }
  }, [visible, suggestedAmount]);

  const amount = Number.parseInt(amountText.replace(/\D/g, ''), 10) || 0;

  const submit = async () => {
    if (amount < MIN_TOPUP) {
      Alert.alert('Số tiền không hợp lệ', `Số tiền nạp tối thiểu là ${formatCurrency(MIN_TOPUP)}.`);
      return;
    }
    setSubmitting(true);
    try {
      const result = await topUpWallet(amount, PaymentMethod.Vnpay);
      if (!result.paymentUrl) throw new Error('Không nhận được liên kết thanh toán VNPay.');
      setPaymentUrl(result.paymentUrl);
    } catch (error) {
      Alert.alert('Không nạp được tiền', getApiErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  const finish = (message: string) => {
    setPaymentUrl(null);
    onClose();
    onDone();
    Alert.alert('Nạp tiền', message);
  };

  return (
    <>
      <Modal visible={visible && !paymentUrl} transparent animationType="slide" onRequestClose={onClose}>
        <KeyboardAvoidingView
          style={styles.overlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
          <View style={styles.sheet}>
            <View style={styles.header}>
              <Text style={styles.title}>{title}</Text>
              <Pressable onPress={onClose} hitSlop={12} accessibilityLabel="Đóng">
                <MaterialIcons name="close" size={24} color="#383838" />
              </Pressable>
            </View>
            {note ? <Text style={styles.note}>{note}</Text> : null}
            <TextInput
              style={styles.input}
              value={amount ? amount.toLocaleString('vi-VN') : amountText}
              onChangeText={setAmountText}
              keyboardType="number-pad"
              placeholder="Nhập số tiền (đ)"
              placeholderTextColor="#9A9A9A"
            />
            <Pressable
              style={[styles.submit, (submitting || amount < MIN_TOPUP) && styles.submitDisabled]}
              onPress={submit}
              disabled={submitting || amount < MIN_TOPUP}>
              {submitting ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.submitText}>Nạp qua VNPay</Text>
              )}
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {paymentUrl ? (
        <VNPayWebView
          visible
          paymentUrl={paymentUrl}
          onClose={() => setPaymentUrl(null)}
          onSuccess={async (_transactionId, params) => {
            try {
              await verifyVnpayCallback(params);
              finish('Nạp tiền vào ví thành công.');
            } catch {
              finish('Đang chờ VNPay xác nhận. Số dư sẽ cập nhật trong ít phút.');
            }
          }}
          onError={(message) => {
            setPaymentUrl(null);
            Alert.alert('Nạp tiền thất bại', message);
          }}
        />
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheet: {
    gap: 12,
    padding: 20,
    paddingBottom: 32,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: '#0F382C',
    fontFamily: 'Montserrat_700Bold',
    fontSize: 18,
  },
  note: {
    color: '#475467',
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    lineHeight: 20,
  },
  input: {
    height: 52,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D0D5DD',
    color: '#101828',
    fontFamily: 'Montserrat_700Bold',
    fontSize: 18,
  },
  submit: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: 14,
    backgroundColor: '#0F382C',
  },
  submitDisabled: {
    opacity: 0.5,
  },
  submitText: {
    color: '#FFFFFF',
    fontFamily: 'Montserrat_700Bold',
    fontSize: 16,
  },
});
