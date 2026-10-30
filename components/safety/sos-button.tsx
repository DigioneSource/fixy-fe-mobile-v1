import { MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import * as React from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  Modal,
  Pressable,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  EMERGENCY_NUMBERS,
  SAFETY_HOTLINE,
  SOS_ISSUE_CATEGORY,
  SOS_ISSUE_PRIORITY,
} from '@/features/safety/safety-config';
import { reportBookingIssue } from '@/services/api/bookings';
import { getApiErrorMessage } from '@/services/api/client';

type SosButtonProps = {
  bookingId?: string | null;
  role: 'customer' | 'worker';
  variant?: 'pill' | 'icon';
};

async function getCurrentCoords() {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return null;
    const last = await Location.getLastKnownPositionAsync();
    const position =
      last ?? (await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High }));
    return position.coords;
  } catch {
    return null;
  }
}

function mapsLink(coords: { latitude: number; longitude: number }) {
  return `https://maps.google.com/?q=${coords.latitude},${coords.longitude}`;
}

export function SosButton({ bookingId, role, variant = 'pill' }: SosButtonProps) {
  const [open, setOpen] = React.useState(false);
  const [sending, setSending] = React.useState(false);

  const callNumber = (number: string) => {
    Linking.openURL(`tel:${number}`).catch(() =>
      Alert.alert('Không gọi được', `Vui lòng gọi ${number}.`)
    );
  };

  const sendAlert = async () => {
    if (!bookingId) {
      Alert.alert('Không gửi được', 'Không tìm thấy đơn hàng. Hãy gọi ngay số khẩn cấp.');
      return;
    }
    setSending(true);
    try {
      const coords = await getCurrentCoords();
      const who = role === 'worker' ? 'Kỹ thuật viên' : 'Khách hàng';
      await reportBookingIssue(bookingId, {
        category: SOS_ISSUE_CATEGORY,
        priority: SOS_ISSUE_PRIORITY,
        subject: `[SOS] ${who} cần hỗ trợ khẩn cấp`,
        description: [
          `${who} bấm nút SOS lúc ${new Date().toLocaleString('vi-VN')}.`,
          coords ? `Vị trí: ${mapsLink(coords)}` : 'Không lấy được vị trí (chưa cấp quyền GPS).',
        ].join('\n'),
      });
      setOpen(false);
      Alert.alert(
        'Đã gửi cảnh báo',
        'TAYZEN đã nhận cảnh báo khẩn cấp của bạn. Nếu đang gặp nguy hiểm, hãy gọi ngay 113.'
      );
    } catch (error) {
      Alert.alert('Gửi cảnh báo thất bại', `${getApiErrorMessage(error)}\nHãy gọi ngay 113.`);
    } finally {
      setSending(false);
    }
  };

  const shareLocation = async () => {
    const coords = await getCurrentCoords();
    if (!coords) {
      Alert.alert('Chưa có vị trí', 'Vui lòng cấp quyền vị trí cho TAYZEN để chia sẻ.');
      return;
    }
    Share.share({
      message: `Tôi đang dùng dịch vụ TAYZEN và cần hỗ trợ. Vị trí của tôi: ${mapsLink(coords)}`,
    }).catch(() => undefined);
  };

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        style={variant === 'icon' ? styles.iconButton : styles.pillButton}
        accessibilityRole="button"
        accessibilityLabel="SOS – hỗ trợ khẩn cấp">
        <MaterialIcons name="sos" size={variant === 'icon' ? 22 : 18} color="#FFFFFF" />
        {variant === 'pill' ? <Text style={styles.pillText}>Khẩn cấp</Text> : null}
      </Pressable>

      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <View style={styles.overlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setOpen(false)} />
          <View style={styles.sheet}>
            <View style={styles.sheetHeader}>
              <MaterialIcons name="warning" size={26} color="#B42318" />
              <Text style={styles.sheetTitle}>Hỗ trợ khẩn cấp</Text>
            </View>
            <Text style={styles.sheetDesc}>
              Nếu bạn đang gặp nguy hiểm, hãy rời khỏi tình huống và gọi ngay số khẩn cấp.
            </Text>

            {EMERGENCY_NUMBERS.map((item) => (
              <Pressable
                key={item.number}
                style={[styles.option, styles.optionDanger]}
                onPress={() => callNumber(item.number)}>
                <MaterialIcons name="call" size={20} color="#FFFFFF" />
                <Text style={styles.optionDangerText}>
                  Gọi {item.number} – {item.label}
                </Text>
              </Pressable>
            ))}

            {SAFETY_HOTLINE ? (
              <Pressable style={styles.option} onPress={() => callNumber(SAFETY_HOTLINE)}>
                <MaterialIcons name="support-agent" size={20} color="#0F382C" />
                <Text style={styles.optionText}>Gọi hotline an toàn TAYZEN</Text>
              </Pressable>
            ) : null}

            <Pressable style={styles.option} onPress={sendAlert} disabled={sending}>
              {sending ? (
                <ActivityIndicator size="small" color="#0F382C" />
              ) : (
                <MaterialIcons name="campaign" size={20} color="#0F382C" />
              )}
              <Text style={styles.optionText}>Gửi cảnh báo kèm vị trí cho TAYZEN</Text>
            </Pressable>

            <Pressable style={styles.option} onPress={shareLocation}>
              <MaterialIcons name="share-location" size={20} color="#0F382C" />
              <Text style={styles.optionText}>Chia sẻ vị trí cho người thân</Text>
            </Pressable>

            <Pressable style={styles.closeButton} onPress={() => setOpen(false)}>
              <Text style={styles.closeText}>Đóng</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  pillButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    height: 36,
    paddingHorizontal: 12,
    borderRadius: 18,
    backgroundColor: '#D92D20',
  },
  pillText: {
    color: '#FFFFFF',
    fontFamily: 'Montserrat_700Bold',
    fontSize: 13,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D92D20',
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheet: {
    gap: 10,
    padding: 20,
    paddingBottom: 32,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: '#FFFFFF',
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sheetTitle: {
    color: '#B42318',
    fontFamily: 'Montserrat_700Bold',
    fontSize: 20,
  },
  sheetDesc: {
    marginBottom: 4,
    color: '#475467',
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    lineHeight: 20,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minHeight: 52,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#D0D5DD',
    backgroundColor: '#FFFFFF',
  },
  optionText: {
    flex: 1,
    color: '#0F382C',
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 15,
  },
  optionDanger: {
    borderColor: '#D92D20',
    backgroundColor: '#D92D20',
  },
  optionDangerText: {
    flex: 1,
    color: '#FFFFFF',
    fontFamily: 'Montserrat_700Bold',
    fontSize: 15,
  },
  closeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    marginTop: 4,
  },
  closeText: {
    color: '#475467',
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 15,
  },
});
