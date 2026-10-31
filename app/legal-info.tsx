import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as React from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TermsModal } from '@/components/legal/legal-notice';
import { COMPANY_INFO } from '@/features/legal/company-info';

type LegalDocument = 'terms' | 'privacy' | 'partner';

const PLACEHOLDER = 'Đang cập nhật';

// Màn "Thông tin pháp lý": chủ sở hữu nền tảng, đăng ký Bộ Công Thương và các văn bản áp dụng.
export default function LegalInfoScreen() {
  const insets = useSafeAreaInsets();
  const [openDocument, setOpenDocument] = React.useState<LegalDocument | null>(null);

  const rows: { label: string; value: string }[] = [
    { label: 'Chủ sở hữu nền tảng', value: COMPANY_INFO.companyName },
    { label: 'Mã số thuế', value: COMPANY_INFO.taxCode },
    { label: 'Địa chỉ trụ sở', value: COMPANY_INFO.address },
    { label: 'Người đại diện', value: COMPANY_INFO.representative },
    { label: 'Email hỗ trợ', value: COMPANY_INFO.supportEmail },
    { label: 'Đăng ký với Bộ Công Thương', value: COMPANY_INFO.moitRegistrationNumber },
  ];

  const documents: { key: LegalDocument; label: string }[] = [
    { key: 'terms', label: 'Điều khoản sử dụng' },
    { key: 'privacy', label: 'Chính sách bảo mật' },
    { key: 'partner', label: 'Hợp đồng sử dụng dịch vụ nền tảng (KTV)' },
  ];

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Quay lại">
          <MaterialIcons name="arrow-back" size={24} color="#0F382C" />
        </Pressable>
        <Text style={styles.title}>Thông tin pháp lý</Text>
      </View>

      <ScrollView contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + 24 }]}>
        <Text style={styles.intro}>
          TAYZEN là nền tảng thương mại điện tử trung gian kết nối Khách hàng với Kỹ thuật viên độc lập.
          TAYZEN không trực tiếp cung ứng dịch vụ chăm sóc; giá dịch vụ do KTV niêm yết.
        </Text>

        <View style={styles.card}>
          {rows.map((row) => (
            <View key={row.label} style={styles.row}>
              <Text style={styles.rowLabel}>{row.label}</Text>
              <Text style={styles.rowValue}>{row.value || PLACEHOLDER}</Text>
            </View>
          ))}
          {COMPANY_INFO.moitRegistrationUrl ? (
            <Pressable
              style={styles.linkRow}
              onPress={() => Linking.openURL(COMPANY_INFO.moitRegistrationUrl).catch(() => undefined)}>
              <MaterialIcons name="verified" size={18} color="#0F382C" />
              <Text style={styles.linkText}>Đã đăng ký Bộ Công Thương — xem xác nhận</Text>
            </Pressable>
          ) : null}
        </View>

        <Text style={styles.sectionTitle}>Văn bản áp dụng</Text>
        <View style={styles.card}>
          {documents.map((doc) => (
            <Pressable key={doc.key} style={styles.docRow} onPress={() => setOpenDocument(doc.key)}>
              <Text style={styles.docText}>{doc.label}</Text>
              <MaterialIcons name="chevron-right" size={22} color="#818A91" />
            </Pressable>
          ))}
          {COMPANY_INFO.operatingRulesUrl ? (
            <Pressable
              style={styles.docRow}
              onPress={() => Linking.openURL(COMPANY_INFO.operatingRulesUrl).catch(() => undefined)}>
              <Text style={styles.docText}>Quy chế hoạt động</Text>
              <MaterialIcons name="open-in-new" size={20} color="#818A91" />
            </Pressable>
          ) : null}
        </View>

        <Text style={styles.footnote}>
          Khiếu nại, tranh chấp: gửi qua mục Hỗ trợ trong ứng dụng; TAYZEN phản hồi trong 03 ngày làm việc.
        </Text>
      </ScrollView>

      <TermsModal
        visible={openDocument !== null}
        onClose={() => setOpenDocument(null)}
        document={openDocument ?? 'terms'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FBF9F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#0F382C',
    fontFamily: 'Montserrat_700Bold',
    fontSize: 18,
  },
  body: {
    gap: 12,
    paddingHorizontal: 16,
  },
  intro: {
    color: '#475467',
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    lineHeight: 20,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EAECF0',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
  },
  row: {
    gap: 2,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F4F7',
  },
  rowLabel: {
    color: '#667085',
    fontFamily: 'Montserrat_400Regular',
    fontSize: 12,
  },
  rowValue: {
    color: '#101828',
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 14,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: 44,
  },
  linkText: {
    color: '#0F382C',
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  sectionTitle: {
    marginTop: 8,
    color: '#0F382C',
    fontFamily: 'Montserrat_700Bold',
    fontSize: 15,
  },
  docRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 52,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F4F7',
  },
  docText: {
    flex: 1,
    color: '#101828',
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 14,
  },
  footnote: {
    color: '#667085',
    fontFamily: 'Montserrat_400Regular',
    fontSize: 12,
    lineHeight: 18,
  },
});
