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

import { signOut } from '../services/authService';
import { useAuthStore } from '../store/authStore';

const COLORS = {
  background: '#F4F6FA',
  surface: '#FFFFFF',
  primary: '#1A3A5C',
  accent: '#E8F0FE',
  text: '#111827',
  textMuted: '#6B7280',
  danger: '#DC2626',
};

export default function ProfileScreen() {
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
      'Logout',
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
    <SafeAreaView
      style={styles.container}
    >
      <StatusBar
        barStyle="dark-content"
      />

      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text
              style={
                styles.avatarText
              }
            >
              C
            </Text>
          </View>

          <Text style={styles.name}>
            Citizen Account
          </Text>

          <Text style={styles.role}>
            Civic Grievance Platform
          </Text>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text
              style={styles.statNumber}
            >
              📋
            </Text>

            <Text
              style={styles.statLabel}
            >
              Complaints
            </Text>
          </View>

          <View style={styles.statCard}>
            <Text
              style={styles.statNumber}
            >
              📍
            </Text>

            <Text
              style={styles.statLabel}
            >
              GPS Enabled
            </Text>
          </View>

          <View style={styles.statCard}>
            <Text
              style={styles.statNumber}
            >
              ⚡
            </Text>

            <Text
              style={styles.statLabel}
            >
              Real-time
            </Text>
          </View>
        </View>

        {/* Account Section */}
        <View style={styles.card}>
          <Text
            style={styles.sectionTitle}
          >
            Account
          </Text>

          <View style={styles.item}>
            <Text style={styles.icon}>
              👤
            </Text>

            <View
              style={styles.itemText}
            >
              <Text
                style={
                  styles.itemTitle
                }
              >
                Citizen Profile
              </Text>

              <Text
                style={
                  styles.itemSubtitle
                }
              >
                Verified civic user
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.item}>
            <Text style={styles.icon}>
              🔒
            </Text>

            <View
              style={styles.itemText}
            >
              <Text
                style={
                  styles.itemTitle
                }
              >
                Secure Authentication
              </Text>

              <Text
                style={
                  styles.itemSubtitle
                }
              >
                Protected by Supabase
              </Text>
            </View>
          </View>
        </View>

        {/* About App */}
        <View style={styles.card}>
          <Text
            style={styles.sectionTitle}
          >
            About CivicConnect
          </Text>

          <Text
            style={styles.aboutText}
          >
            CivicConnect helps citizens
            report civic issues with
            real-time complaint
            tracking, GPS-enabled
            reporting, and image-based
            issue submission.
          </Text>
        </View>

        {/* Logout */}
        <TouchableOpacity
          style={styles.logoutButton}
          activeOpacity={0.85}
          onPress={confirmLogout}
        >
          <Text
            style={styles.logoutText}
          >
            🚪 Logout
          </Text>
        </TouchableOpacity>

        {/* Footer */}
        <Text style={styles.footer}>
          CivicConnect v1.0
        </Text>
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
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 30,
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor:
      COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 8,

    elevation: 5,
  },

  avatarText: {
    color: '#FFFFFF',
    fontSize: 42,
    fontWeight: '700',
  },

  name: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 6,
  },

  role: {
    color: COLORS.textMuted,
    fontSize: 15,
  },

  statsRow: {
    flexDirection: 'row',
    justifyContent:
      'space-between',
    paddingHorizontal: 20,
    marginBottom: 24,
  },

  statCard: {
    flex: 1,
    backgroundColor:
      COLORS.surface,
    marginHorizontal: 6,
    borderRadius: 20,
    paddingVertical: 22,
    alignItems: 'center',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 6,

    elevation: 3,
  },

  statNumber: {
    fontSize: 26,
    marginBottom: 10,
  },

  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textMuted,
  },

  card: {
    backgroundColor:
      COLORS.surface,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 22,
    padding: 22,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 6,

    elevation: 3,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 20,
  },

  item: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  icon: {
    fontSize: 24,
    marginRight: 16,
  },

  itemText: {
    flex: 1,
  },

  itemTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },

  itemSubtitle: {
    color: COLORS.textMuted,
    fontSize: 13,
  },

  divider: {
    height: 1,
    backgroundColor: '#EEF2F7',
    marginVertical: 18,
  },

  aboutText: {
    color: COLORS.textMuted,
    lineHeight: 24,
    fontSize: 14,
  },

  logoutButton: {
    backgroundColor: '#FEE2E2',
    marginHorizontal: 20,
    paddingVertical: 18,
    borderRadius: 18,
    alignItems: 'center',
    marginTop: 8,
  },

  logoutText: {
    color: COLORS.danger,
    fontWeight: '700',
    fontSize: 16,
  },

  footer: {
    textAlign: 'center',
    color: COLORS.textMuted,
    marginTop: 24,
    marginBottom: 40,
    fontSize: 12,
  },
});