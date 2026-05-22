import {
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { signOut } from '../services/authService';
import { useAuthStore } from '../store/authStore';

const COLORS = {
  background: '#F4F6FA',
  surface: '#FFFFFF',
  primary: '#1A3A5C',
  accent: '#E8F0FE',
  text: '#111827',
  textMuted: '#6B7280',
  border: '#E5E7EB',
  danger: '#DC2626',
};

export default function HomeScreen() {
  const navigation = useNavigation<any>();

  const setAuthenticated =
    useAuthStore(
      (state) =>
        state.setAuthenticated
    );

  async function handleLogout() {
    try {
      await signOut();

      setAuthenticated(false);
    } catch (error: any) {
      Alert.alert(
        'Logout Failed',
        error.message
      );
    }
  }

  function confirmLogout() {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: handleLogout,
        },
      ]
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={
          COLORS.primary
        }
      />

      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoBox}>
            <Text style={styles.logo}>
              🏛️
            </Text>
          </View>

          <Text style={styles.title}>
            CivicConnect
          </Text>

          <Text style={styles.subtitle}>
            Smart Civic Grievance
            Platform
          </Text>

          {/* Quick Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text
                style={styles.statEmoji}
              >
                ⚡
              </Text>

              <Text
                style={styles.statText}
              >
                Real-time
              </Text>
            </View>

            <View style={styles.statCard}>
              <Text
                style={styles.statEmoji}
              >
                📍
              </Text>

              <Text
                style={styles.statText}
              >
                GPS Enabled
              </Text>
            </View>

            <View style={styles.statCard}>
              <Text
                style={styles.statEmoji}
              >
                🔒
              </Text>

              <Text
                style={styles.statText}
              >
                Secure
              </Text>
            </View>
          </View>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          <Text
            style={styles.sectionTitle}
          >
            Quick Actions
          </Text>

          {/* Create Complaint */}
          <TouchableOpacity
            style={[
              styles.actionCard,
              styles.primaryCard,
            ]}
            activeOpacity={0.85}
            onPress={() =>
              navigation.navigate(
                'CreateTab'
              )
            }
          >
            <View
              style={
                styles.actionIconBox
              }
            >
              <Text
                style={
                  styles.actionEmoji
                }
              >
                📝
              </Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text
                style={
                  styles.primaryTitle
                }
              >
                Report an Issue
              </Text>

              <Text
                style={
                  styles.primarySubtitle
                }
              >
                Submit complaints with
                images & GPS
              </Text>
            </View>

            <Text
              style={
                styles.primaryArrow
              }
            >
              ›
            </Text>
          </TouchableOpacity>

          {/* Complaint List */}
          <TouchableOpacity
            style={styles.actionCard}
            activeOpacity={0.85}
            onPress={() =>
              navigation.navigate(
                'ComplaintsTab'
              )
            }
          >
            <View
              style={[
                styles.actionIconBox,
                {
                  backgroundColor:
                    COLORS.accent,
                },
              ]}
            >
              <Text
                style={
                  styles.actionEmoji
                }
              >
                📋
              </Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text
                style={styles.cardTitle}
              >
                My Complaints
              </Text>

              <Text
                style={
                  styles.cardSubtitle
                }
              >
                Track complaint status
                & updates
              </Text>
            </View>

            <Text style={styles.arrow}>
              ›
            </Text>
          </TouchableOpacity>

          {/* Info Card */}
          <View style={styles.infoCard}>
            <Text
              style={styles.infoEmoji}
            >
              ℹ️
            </Text>

            <View style={{ flex: 1 }}>
              <Text
                style={styles.infoTitle}
              >
                CivicConnect
              </Text>

              <Text
                style={styles.infoText}
              >
                Complaints are reviewed
                and processed by local
                municipal authorities.
              </Text>
            </View>
          </View>

          {/* Logout */}
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={confirmLogout}
          >
            <Text
              style={styles.logoutText}
            >
              🚪 Logout
            </Text>
          </TouchableOpacity>

          <Text
            style={styles.footer}
          >
            CivicConnect v1.0
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:
      COLORS.background,
  },

  header: {
    backgroundColor:
      COLORS.primary,
    paddingTop: 70,
    paddingBottom: 40,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: 'center',
  },

  logoBox: {
    width: 78,
    height: 78,
    borderRadius: 22,
    backgroundColor:
      'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },

  logo: {
    fontSize: 38,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 6,
  },

  subtitle: {
    color:
      'rgba(255,255,255,0.75)',
    fontSize: 15,
    marginBottom: 28,
  },

  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },

  statCard: {
    backgroundColor:
      'rgba(255,255,255,0.12)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    alignItems: 'center',
    minWidth: 90,
  },

  statEmoji: {
    fontSize: 16,
    marginBottom: 4,
  },

  statText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },

  content: {
    padding: 22,
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textMuted,
    marginBottom: 16,
    letterSpacing: 0.5,
  },

  actionCard: {
    backgroundColor:
      COLORS.surface,
    borderRadius: 22,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.06,
    shadowRadius: 6,

    elevation: 4,
  },

  primaryCard: {
    backgroundColor:
      COLORS.primary,
  },

  actionIconBox: {
    width: 58,
    height: 58,
    borderRadius: 16,
    backgroundColor:
      'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },

  actionEmoji: {
    fontSize: 28,
  },

  primaryTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 5,
  },

  primarySubtitle: {
    color:
      'rgba(255,255,255,0.75)',
    fontSize: 13,
    lineHeight: 18,
  },

  primaryArrow: {
    color:
      'rgba(255,255,255,0.6)',
    fontSize: 28,
  },

  cardTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 5,
  },

  cardSubtitle: {
    color: COLORS.textMuted,
    fontSize: 13,
    lineHeight: 18,
  },

  arrow: {
    color: COLORS.textMuted,
    fontSize: 28,
  },

  infoCard: {
    backgroundColor:
      COLORS.accent,
    borderRadius: 18,
    padding: 18,
    flexDirection: 'row',
    marginTop: 8,
    marginBottom: 26,
  },

  infoEmoji: {
    fontSize: 24,
    marginRight: 12,
  },

  infoTitle: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },

  infoText: {
    color: COLORS.textMuted,
    lineHeight: 18,
    fontSize: 13,
  },

  logoutButton: {
    alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 26,
  },

  logoutText: {
    color: COLORS.danger,
    fontSize: 15,
    fontWeight: '600',
  },

  footer: {
    textAlign: 'center',
    color: COLORS.textMuted,
    marginTop: 18,
    fontSize: 12,
  },
});