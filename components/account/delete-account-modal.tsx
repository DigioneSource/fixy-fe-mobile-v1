import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as React from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { getApiErrorMessage } from '@/services/api/client';
import { deleteMyAccount } from '@/services/api/user';
import { useAuthStore } from '@/store/store';

const CONFIRM_WORD = 'XOA';

type DeleteAccountModalProps = {
  visible: boolean;
  onClose: () => void;
  role: 'customer' | 'worker';
};

function normalizeConfirm(value: string) {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim()
    .toUpperCase();
}

export function DeleteAccountModal({ visible, onClose, role }: DeleteAccountModalProps) {
  const logout = useAuthStore((state) => state.logout);
  const [confirmText, setConfirmText] = React.useState('');
  const [deleting, setDeleting] = React.useState(false);

  const canDelete = normalizeConfirm(confirmText) === CONFIRM_WORD && !deleting;

  const consequences =
    role === 'worker'
      ? [
          'Hồ sơ KTV, CCCD, chứng chỉ, lịch làm việc và đánh giá sẽ bị xoá.',
          'Vui lòng rút hết số dư ví trước khi xoá. Số dư còn lại không thể khôi phục.',
          'Bạn không thể xoá khi còn đơn đang thực hiện.',
        ]
      : [
          'Thông tin cá nhân, địa chỉ đã lưu và lịch sử đặt dịch vụ sẽ bị xoá.',
          'Số dư ví và voucher chưa dùng sẽ không thể khôi phục.',
          'Bạn không thể xoá khi còn đơn đang thực hiện.',
        ];

  const close = () => {
    if (deleting) return;
    setConfirmText('');
    onClose();
  };

  const handleDelete = async () => {
    if (!canDelete) return;
    setDeleting(true);
    try {
      await deleteMyAccount();
      await logout();
      setConfirmText('');
      onClose();
      router.replace('/' as any);
      Alert.alert('Đã xoá tài khoản', 'Tài khoản TAYZEN của bạn đã được xoá.');
    } catch (error) {
      Alert.alert('Không thể xoá tài khoản', getApiErrorMessage(error));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={close}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Pressable style={StyleSheet.absoluteFill} onPress={close} />
        <View style={styles.sheet}>
          <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.body}>
            <View style={styles.header}>
              <MaterialIcons name="delete-forever" size={26} color="#B42318" />
              <Text style={styles.title}>Xoá tài khoản vĩnh viễn</Text>
            </View>
            <Text style={styles.desc}>Thao tác này không thể hoàn tác.</Text>
            {consequences.map((item) => (
              <View key={item} style={styles.row}>
                <MaterialIcons name="error-outline" size={16} color="#B42318" style={styles.rowIcon} />
                <Text style={styles.rowText}>{item}</Text>
              </View>
            ))}
            <Text style={styles.label}>
              Nhập <Text style={styles.labelStrong}>{CONFIRM_WORD}</Text> để xác nhận
            </Text>
            <TextInput
              style={styles.input}
              value={confirmText}
              onChangeText={setConfirmText}
              autoCapitalize="characters"
              autoCorrect={false}
              placeholder={CONFIRM_WORD}
              placeholderTextColor="#B0B7C3"
              editable={!deleting}
            />
            <Pressable
              style={[styles.deleteButton, !canDelete && styles.deleteButtonDisabled]}
              onPress={handleDelete}
              disabled={!canDelete}
              accessibilityRole="button">
              {deleting ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.deleteText}>Xoá tài khoản</Text>
              )}
            </Pressable>
            <Pressable style={styles.cancelButton} onPress={close} disabled={deleting}>
              <Text style={styles.cancelText}>Giữ tài khoản</Text>
            </Pressable>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
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
    maxHeight: '90%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: '#FFFFFF',
  },
  body: {
    gap: 10,
    padding: 20,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    color: '#B42318',
    fontFamily: 'Montserrat_700Bold',
    fontSize: 19,
  },
  desc: {
    color: '#475467',
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 14,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  rowIcon: {
    marginTop: 2,
  },
  rowText: {
    flex: 1,
    color: '#344054',
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    lineHeight: 20,
  },
  label: {
    marginTop: 6,
    color: '#344054',
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
  },
  labelStrong: {
    color: '#B42318',
    fontFamily: 'Montserrat_700Bold',
  },
  input: {
    height: 48,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D0D5DD',
    color: '#101828',
    fontFamily: 'Montserrat_700Bold',
    fontSize: 16,
    letterSpacing: 2,
  },
  deleteButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    marginTop: 6,
    borderRadius: 14,
    backgroundColor: '#B42318',
  },
  deleteButtonDisabled: {
    opacity: 0.4,
  },
  deleteText: {
    color: '#FFFFFF',
    fontFamily: 'Montserrat_700Bold',
    fontSize: 16,
  },
  cancelButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
  },
  cancelText: {
    color: '#0F382C',
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 15,
  },
});
