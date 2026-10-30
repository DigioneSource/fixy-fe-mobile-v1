import { MaterialIcons } from '@expo/vector-icons';
import * as React from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  CUSTOMER_REPORT_REASONS,
  REPORT_ISSUE_PRIORITY_HIGH,
  SOS_ISSUE_CATEGORY,
} from '@/features/safety/safety-config';
import { reportBookingIssue } from '@/services/api/bookings';
import { getApiErrorMessage } from '@/services/api/client';

type ReportCustomerModalProps = {
  bookingId: string;
  visible: boolean;
  onClose: () => void;
};

// KTV báo cáo khách vi phạm (quấy rối, yêu cầu dịch vụ trái pháp luật...) qua API report-issue có sẵn.
export function ReportCustomerModal({ bookingId, visible, onClose }: ReportCustomerModalProps) {
  const [reason, setReason] = React.useState<string | null>(null);
  const [detail, setDetail] = React.useState('');
  const [sending, setSending] = React.useState(false);

  const close = () => {
    setReason(null);
    setDetail('');
    onClose();
  };

  const submit = async () => {
    if (!reason) {
      Alert.alert('Chưa chọn lý do', 'Vui lòng chọn lý do báo cáo.');
      return;
    }
    setSending(true);
    try {
      await reportBookingIssue(bookingId, {
        category: SOS_ISSUE_CATEGORY,
        priority: REPORT_ISSUE_PRIORITY_HIGH,
        subject: `[KTV báo cáo khách] ${reason}`,
        description: detail.trim() || reason,
      });
      close();
      Alert.alert(
        'Đã gửi báo cáo',
        'TAYZEN sẽ xem xét và liên hệ bạn. Bạn có quyền dừng phục vụ ngay nếu cảm thấy không an toàn.'
      );
    } catch (error) {
      Alert.alert('Gửi báo cáo thất bại', getApiErrorMessage(error));
    } finally {
      setSending(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={close}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={close} />
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Báo cáo khách hàng</Text>
            <Pressable onPress={close} hitSlop={12}>
              <MaterialIcons name="close" size={24} color="#383838" />
            </Pressable>
          </View>
          <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
            {CUSTOMER_REPORT_REASONS.map((item) => {
              const selected = reason === item;
              return (
                <Pressable
                  key={item}
                  style={[styles.reason, selected && styles.reasonSelected]}
                  onPress={() => setReason(item)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected }}>
                  <MaterialIcons
                    name={selected ? 'radio-button-checked' : 'radio-button-unchecked'}
                    size={20}
                    color={selected ? '#B42318' : '#98A2B3'}
                  />
                  <Text style={styles.reasonText}>{item}</Text>
                </Pressable>
              );
            })}
            <TextInput
              style={styles.input}
              multiline
              numberOfLines={3}
              placeholder="Mô tả thêm (không bắt buộc)"
              placeholderTextColor="#9A9A9A"
              value={detail}
              onChangeText={setDetail}
              maxLength={1000}
            />
          </ScrollView>
          <Pressable
            style={[styles.submit, (!reason || sending) && styles.submitDisabled]}
            onPress={submit}
            disabled={!reason || sending}>
            {sending ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.submitText}>Gửi báo cáo</Text>
            )}
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheet: {
    maxHeight: '85%',
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
    marginBottom: 12,
  },
  title: {
    color: '#0F382C',
    fontFamily: 'Montserrat_700Bold',
    fontSize: 18,
  },
  body: {
    gap: 8,
    paddingBottom: 12,
  },
  reason: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minHeight: 48,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EAECF0',
  },
  reasonSelected: {
    borderColor: '#B42318',
    backgroundColor: '#FEF3F2',
  },
  reasonText: {
    flex: 1,
    color: '#344054',
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 14,
  },
  input: {
    minHeight: 84,
    marginTop: 4,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D0D5DD',
    color: '#101828',
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    textAlignVertical: 'top',
  },
  submit: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    marginTop: 8,
    borderRadius: 14,
    backgroundColor: '#B42318',
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
