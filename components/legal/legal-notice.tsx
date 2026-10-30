import { MaterialIcons } from '@expo/vector-icons';
import * as React from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  LAW_VIOLATION_NOTICE,
  LEGAL_VERSION,
  REGISTRATION_TERMS,
} from '@/features/legal/legal-content';

export function LawViolationBanner({ detail }: Readonly<{ detail?: string }>) {
  return (
    <View style={styles.banner} accessibilityRole="alert">
      <MaterialIcons name="gpp-maybe" size={20} color="#B42318" />
      <View style={styles.bannerCopy}>
        <Text style={styles.bannerTitle}>{LAW_VIOLATION_NOTICE.toUpperCase()}</Text>
        {detail ? <Text style={styles.bannerDetail}>{detail}</Text> : null}
      </View>
    </View>
  );
}

export function TermsModal({ visible, onClose }: Readonly<{ visible: boolean; onClose: () => void }>) {
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={[styles.modalScreen, { paddingTop: insets.top }]}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Điều khoản sử dụng</Text>
          <Pressable onPress={onClose} hitSlop={12} accessibilityLabel="Đóng">
            <MaterialIcons name="close" size={24} color="#0F382C" />
          </Pressable>
        </View>
        <ScrollView contentContainerStyle={styles.modalBody}>
          <LawViolationBanner />
          {REGISTRATION_TERMS.map((section) => (
            <View key={section.title} style={styles.section}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              {section.items.map((item) => (
                <Text key={item} style={styles.item}>
                  • {item}
                </Text>
              ))}
            </View>
          ))}
          <Text style={styles.version}>Phiên bản {LEGAL_VERSION}</Text>
        </ScrollView>
        <View style={[styles.modalFooter, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Tôi đã đọc</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FDA29B',
    backgroundColor: '#FEF3F2',
  },
  bannerCopy: {
    flex: 1,
    gap: 2,
  },
  bannerTitle: {
    color: '#B42318',
    fontFamily: 'Montserrat_700Bold',
    fontSize: 13,
    lineHeight: 18,
  },
  bannerDetail: {
    color: '#7A271A',
    fontFamily: 'Montserrat_400Regular',
    fontSize: 12,
    lineHeight: 18,
  },
  modalScreen: {
    flex: 1,
    backgroundColor: '#FBF9F5',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#EFECE6',
  },
  modalTitle: {
    color: '#0F382C',
    fontFamily: 'Montserrat_700Bold',
    fontSize: 18,
  },
  modalBody: {
    padding: 20,
    gap: 16,
  },
  section: {
    gap: 6,
  },
  sectionTitle: {
    color: '#0F382C',
    fontFamily: 'Montserrat_700Bold',
    fontSize: 15,
    lineHeight: 22,
  },
  item: {
    color: '#374151',
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    lineHeight: 21,
  },
  version: {
    color: '#9CA3AF',
    fontFamily: 'Montserrat_400Regular',
    fontSize: 12,
  },
  modalFooter: {
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#EFECE6',
  },
  closeButton: {
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: '#0F382C',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Montserrat_700Bold',
    fontSize: 16,
  },
});
