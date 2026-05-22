import {
  RouteProp,
} from '@react-navigation/native';

import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type Props = {
  route: RouteProp<any>;
};

const COLORS = {
  background: '#F4F6FA',
  surface: '#FFFFFF',
  primary: '#1A3A5C',
  text: '#111827',
  textMuted: '#6B7280',
};

export default function ComplaintDetailScreen({
  route,
}: Props) {
  const { complaint } =
    route.params;

  function formatDate(date: string) {
    return new Date(
      date
    ).toLocaleString();
  }

  function getStatusStyle(
    status: string
  ) {
    switch (status) {
      case 'resolved':
        return {
          bg: '#DCFCE7',
          text: '#166534',
          label: 'Resolved',
        };

      case 'in_progress':
        return {
          bg: '#DBEAFE',
          text: '#1D4ED8',
          label: 'In Progress',
        };

      default:
        return {
          bg: '#FEF3C7',
          text: '#92400E',
          label: 'Pending',
        };
    }
  }

  const statusStyle =
    getStatusStyle(
      complaint.status
    );

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
        {/* Image */}
        {complaint.image_url ? (
          <Image
            source={{
              uri: complaint.image_url,
            }}
            style={styles.image}
          />
        ) : (
          <View
            style={
              styles.placeholderImage
            }
          >
            <Text
              style={
                styles.placeholderEmoji
              }
            >
              🏛️
            </Text>
          </View>
        )}

        {/* Main Card */}
        <View style={styles.card}>
          {/* Status */}
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor:
                  statusStyle.bg,
              },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                {
                  color:
                    statusStyle.text,
                },
              ]}
            >
              {statusStyle.label}
            </Text>
          </View>

          {/* Title */}
          <Text style={styles.title}>
            {complaint.title}
          </Text>

          {/* Category */}
          {complaint.category && (
            <View
              style={
                styles.categoryChip
              }
            >
              <Text
                style={
                  styles.categoryText
                }
              >
                {complaint.category}
              </Text>
            </View>
          )}

          {/* Description */}
          <View
            style={styles.section}
          >
            <Text
              style={styles.label}
            >
              Description
            </Text>

            <Text
              style={
                styles.description
              }
            >
              {complaint.description}
            </Text>
          </View>

          {/* Date */}
          <View
            style={styles.section}
          >
            <Text
              style={styles.label}
            >
              Submitted On
            </Text>

            <Text style={styles.date}>
              {formatDate(
                complaint.created_at
              )}
            </Text>
          </View>

          {/* Timeline Card */}
          <View
            style={
              styles.timelineCard
            }
          >
            <Text
              style={
                styles.timelineTitle
              }
            >
              Complaint Status
            </Text>

            <View
              style={
                styles.timelineRow
              }
            >
              <View
                style={
                  styles.timelineDot
                }
              />

              <View>
                <Text
                  style={
                    styles.timelineStatus
                  }
                >
                  {statusStyle.label}
                </Text>

                <Text
                  style={
                    styles.timelineText
                  }
                >
                  Your complaint is
                  currently being
                  processed by civic
                  authorities.
                </Text>
              </View>
            </View>
          </View>
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

  image: {
    width: '100%',
    height: 280,
  },

  placeholderImage: {
    height: 280,
    backgroundColor:
      '#E8F0FE',
    justifyContent: 'center',
    alignItems: 'center',
  },

  placeholderEmoji: {
    fontSize: 70,
  },

  card: {
    backgroundColor:
      COLORS.surface,
    marginTop: -24,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    minHeight: 500,
  },

  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 18,
  },

  statusText: {
    fontWeight: '700',
    fontSize: 13,
  },

  title: {
    fontSize: 30,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 18,
    lineHeight: 38,
  },

  categoryChip: {
    alignSelf: 'flex-start',
    backgroundColor:
      '#E8F0FE',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    marginBottom: 26,
  },

  categoryText: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: 13,
  },

  section: {
    marginBottom: 28,
  },

  label: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textMuted,
    marginBottom: 10,
    letterSpacing: 0.5,
  },

  description: {
    fontSize: 16,
    lineHeight: 28,
    color: COLORS.text,
  },

  date: {
    fontSize: 15,
    color: COLORS.textMuted,
  },

  timelineCard: {
    backgroundColor:
      '#F8FAFC',
    borderRadius: 20,
    padding: 18,
    marginTop: 10,
  },

  timelineTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 18,
    color: COLORS.text,
  },

  timelineRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  timelineDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor:
      COLORS.primary,
    marginTop: 5,
    marginRight: 14,
  },

  timelineStatus: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 5,
  },

  timelineText: {
    color: COLORS.textMuted,
    lineHeight: 22,
    maxWidth: '92%',
  },
});