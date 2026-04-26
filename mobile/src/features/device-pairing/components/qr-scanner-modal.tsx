import { Ionicons } from '@expo/vector-icons'
import type { CameraView as CameraViewType } from 'expo-camera'
import * as Haptics from 'expo-haptics'
import { useEffect, useRef, useState } from 'react'
import {
  Animated,
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { theme } from '../../../shared/theme'

// expo-camera requires a dev build (not available in Expo Go).
// Load at module level so we know immediately if it's linked.
type CameraModule = {
  CameraView: typeof CameraViewType
  useCameraPermissions: () => [{ granted: boolean } | null, () => Promise<void>]
}

const cameraModule = (() => {
  try {
    return require('expo-camera') as CameraModule
  } catch {
    return null
  }
})()

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window')
const SCAN_BOX = Math.min(SCREEN_W * 0.65, 260)
const CORNER = 24
const CORNER_T = 3

interface QRScannerModalProps {
  visible: boolean
  onClose: () => void
  onScan: (code: string) => void
}

function DevBuildRequired({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  return (
    <Modal visible={visible} animationType="fade" transparent statusBarTranslucent>
      <View style={styles.permissionBg}>
        <View style={styles.permissionCard}>
          <View style={styles.permissionIcon}>
            <Ionicons name="construct-outline" size={32} color={theme.colors.primary} />
          </View>
          <Text style={styles.permissionTitle}>Dev build necessário</Text>
          <Text style={styles.permissionSub}>
            O scanner QR não funciona no Expo Go.{'\n'}
            Execute <Text style={styles.code}>expo run:ios</Text> ou{' '}
            <Text style={styles.code}>expo run:android</Text> para habilitar.
          </Text>
          <Pressable onPress={onClose} style={styles.permissionBtn}>
            <Text style={styles.permissionBtnText}>Entendido</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  )
}

function CameraScanner({
  visible,
  onClose,
  onScan,
}: QRScannerModalProps) {
  const { CameraView, useCameraPermissions } = cameraModule!
  const [permission, requestPermission] = useCameraPermissions()
  const [scanned, setScanned] = useState(false)
  const scanLineY = useRef(new Animated.Value(0)).current
  const fadeIn = useRef(new Animated.Value(0)).current
  const insets = useSafeAreaInsets()

  useEffect(() => {
    if (!visible) {
      setScanned(false)
      scanLineY.setValue(0)
      fadeIn.setValue(0)
      return
    }

    Animated.timing(fadeIn, {
      toValue: 1,
      duration: 220,
      useNativeDriver: true,
    }).start()

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scanLineY, { toValue: 1, duration: 1800, useNativeDriver: true }),
        Animated.timing(scanLineY, { toValue: 0, duration: 1800, useNativeDriver: true }),
      ]),
    )
    loop.start()
    return () => loop.stop()
  }, [visible, scanLineY, fadeIn])

  const handleScan = async ({ data }: { data: string }) => {
    if (scanned) return
    setScanned(true)
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    onScan(data)
    onClose()
  }

  const topH = (SCREEN_H - SCAN_BOX) / 2 - 20
  const sideW = (SCREEN_W - SCAN_BOX) / 2

  const scanTranslate = scanLineY.interpolate({
    inputRange: [0, 1],
    outputRange: [0, SCAN_BOX - 2],
  })

  if (!permission) return null

  if (!permission.granted) {
    return (
      <Modal visible={visible} animationType="fade" transparent statusBarTranslucent>
        <View style={styles.permissionBg}>
          <View style={styles.permissionCard}>
            <View style={styles.permissionIcon}>
              <Ionicons name="camera-outline" size={32} color={theme.colors.primary} />
            </View>
            <Text style={styles.permissionTitle}>Câmera necessária</Text>
            <Text style={styles.permissionSub}>
              Para escanear o QR Code do dispositivo Lery
            </Text>
            <Pressable
              style={({ pressed }) => [styles.permissionBtn, pressed && { opacity: 0.85 }]}
              onPress={requestPermission}
            >
              <Text style={styles.permissionBtnText}>Permitir câmera</Text>
            </Pressable>
            <Pressable onPress={onClose} style={styles.cancelBtn}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    )
  }

  return (
    <Modal visible={visible} animationType="none" transparent statusBarTranslucent>
      <Animated.View style={[StyleSheet.absoluteFillObject, { opacity: fadeIn }]}>
        <CameraView
          style={StyleSheet.absoluteFillObject}
          facing="back"
          onBarcodeScanned={scanned ? undefined : handleScan}
          barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        />

        <View style={[styles.overlay, { top: 0, left: 0, right: 0, height: topH }]} />
        <View style={[styles.overlay, { top: topH, left: 0, width: sideW, height: SCAN_BOX }]} />
        <View style={[styles.overlay, { top: topH, right: 0, width: sideW, height: SCAN_BOX }]} />
        <View style={[styles.overlay, { top: topH + SCAN_BOX, left: 0, right: 0, bottom: 0 }]} />

        <View
          style={{ position: 'absolute', top: topH, left: sideW, width: SCAN_BOX, height: SCAN_BOX }}
        >
          <View style={[styles.corner, styles.cTL]} />
          <View style={[styles.corner, styles.cTR]} />
          <View style={[styles.corner, styles.cBL]} />
          <View style={[styles.corner, styles.cBR]} />
          <Animated.View
            style={[styles.scanLine, { transform: [{ translateY: scanTranslate }] }]}
          />
        </View>

        <View style={[styles.closeRow, { top: insets.top + 12, left: 0, right: 0 }]}>
          <Pressable
            style={({ pressed }) => [styles.closeBtn, pressed && { opacity: 0.7 }]}
            onPress={onClose}
            hitSlop={12}
          >
            <Ionicons name="close" size={20} color="#fff" />
          </Pressable>
        </View>

        <View style={[styles.instructionRow, { top: topH + SCAN_BOX + 28 }]}>
          <Ionicons name="qr-code-outline" size={16} color={theme.colors.primary} />
          <Text style={styles.instructionText}>Aponte para o QR Code do dispositivo</Text>
        </View>
      </Animated.View>
    </Modal>
  )
}

export function QRScannerModal(props: QRScannerModalProps) {
  if (!cameraModule) {
    return <DevBuildRequired visible={props.visible} onClose={props.onClose} />
  }
  return <CameraScanner {...props} />
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    backgroundColor: 'rgba(4, 13, 18, 0.78)',
  },
  corner: {
    position: 'absolute',
    width: CORNER,
    height: CORNER,
  },
  cTL: {
    top: 0, left: 0,
    borderTopWidth: CORNER_T, borderLeftWidth: CORNER_T,
    borderColor: theme.colors.primary, borderTopLeftRadius: 4,
  },
  cTR: {
    top: 0, right: 0,
    borderTopWidth: CORNER_T, borderRightWidth: CORNER_T,
    borderColor: theme.colors.primary, borderTopRightRadius: 4,
  },
  cBL: {
    bottom: 0, left: 0,
    borderBottomWidth: CORNER_T, borderLeftWidth: CORNER_T,
    borderColor: theme.colors.primary, borderBottomLeftRadius: 4,
  },
  cBR: {
    bottom: 0, right: 0,
    borderBottomWidth: CORNER_T, borderRightWidth: CORNER_T,
    borderColor: theme.colors.primary, borderBottomRightRadius: 4,
  },
  scanLine: {
    position: 'absolute',
    left: 6, right: 6, height: 2,
    backgroundColor: theme.colors.primary,
    shadowColor: theme.colors.primary,
    shadowOpacity: 0.9, shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
    elevation: 4,
  },
  closeRow: {
    position: 'absolute',
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  closeBtn: {
    width: 38, height: 38, borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
  },
  instructionRow: {
    position: 'absolute',
    left: 0, right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  instructionText: {
    color: 'rgba(229,250,255,0.80)',
    fontSize: 13, fontWeight: '600', letterSpacing: 0.2,
  },
  permissionBg: {
    flex: 1,
    backgroundColor: 'rgba(4,13,18,0.92)',
    alignItems: 'center', justifyContent: 'center',
    padding: 24,
  },
  permissionCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 24, borderWidth: 1, borderColor: theme.colors.border,
    padding: 24, alignItems: 'center', gap: 12,
    width: '100%', maxWidth: 340,
  },
  permissionIcon: {
    width: 64, height: 64, borderRadius: 20,
    backgroundColor: theme.colors.primarySoft,
    borderWidth: 1, borderColor: `${theme.colors.primary}33`,
    alignItems: 'center', justifyContent: 'center',
  },
  permissionTitle: {
    color: theme.colors.text, fontSize: 17,
    fontWeight: '800', letterSpacing: -0.3,
  },
  permissionSub: {
    color: theme.colors.muted, fontSize: 13,
    textAlign: 'center', lineHeight: 20,
  },
  code: {
    color: theme.colors.primary,
    fontWeight: '700',
  },
  permissionBtn: {
    backgroundColor: theme.colors.primary,
    borderRadius: 999, paddingVertical: 12, paddingHorizontal: 32, marginTop: 4,
  },
  permissionBtnText: {
    color: '#040D12', fontSize: 15, fontWeight: '800',
  },
  cancelBtn: { paddingVertical: 8 },
  cancelText: { color: theme.colors.muted, fontSize: 13, fontWeight: '600' },
})
