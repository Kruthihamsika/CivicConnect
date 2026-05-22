import {
  useEffect,
  useState,
} from 'react';

import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  useNavigation,
} from '@react-navigation/native';

import {
  fetchComplaints,
} from '../services/complaintService';

import { supabase } from '../services/supabase';

const COLORS = {
  background: '#F4F6FA',
  surface: '#FFFFFF',
  primary: '#1A3A5C',
  accent: '#E8F0FE',
  text: '#111827',
  textMuted: '#6B7280',
  border: '#E5E7EB',
};

export default function ComplaintListScreen() {
  const navigation =
    useNavigation<any>();

  const [complaints, setComplaints] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  useEffect(() => {
    loadComplaints();

    const channel =
      supabase
        .channel('complaints-realtime')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'complaints',
          },
          () => {
            loadComplaints();
          }
        )
        .subscribe();

    return () => {
      supabase.removeChannel(
        channel
      );
    };
  }, []);

  async function loadComplaints() {
    try {
      const data =
        await fetchComplaints();

      setComplaints(data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  async function onRefresh() {
    setRefreshing(true);

    await loadComplaints();
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleString();
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

  if (loading) {
    return (
      <SafeAreaView
        style={styles.loaderContainer}
      >
        <ActivityIndicator
          size="large"
          color={COLORS.primary}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={styles.container}
    >
      <StatusBar
        barStyle="dark-content"
      />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          My Complaints
        </Text>

        <Text
          style={styles.headerSubtitle}
        >
          Track complaint progress
          and updates
        </Text>
      </View>

      <FlatList
        data={complaints}
        keyExtractor={(item) =>
          item.id
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        contentContainerStyle={{
          padding: 20,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={
          false
        }
        renderItem={({ item }) => {
          const statusStyle =
            getStatusStyle(
              item.status
            );

          return (
            <TouchableOpacity
              activeOpacity={0.88}
              style={styles.card}
              onPress={() =>
                navigation.navigate(
                  'ComplaintDetail',
                  {
                    complaint: item,
                  }
                )
              }
            >
              {item.image_url ? (
                <Image
                  source={{
                    uri: item.image_url,
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

              <View
                style={
                  styles.cardContent
                }
              >
                {/* Status */}
                <View
                  style={
                    styles.topRow
                  }
                >
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
                      {
                        statusStyle.label
                      }
                    </Text>
                  </View>

                  <Text
                    style={
                      styles.date
                    }
                  >
                    {formatDate(
                      item.created_at
                    )}
                  </Text>
                </View>

                {/* Title */}
                <Text
                  style={styles.title}
                >
                  {item.title}
                </Text>

                {/* Description */}
                <Text
                  style={
                    styles.description
                  }
                  numberOfLines={3}
                >
                  {item.description}
                </Text>

                {/* Footer */}
                <View
                  style={
                    styles.footerRow
                  }
                >
                  <Text
                    style={
                      styles.viewText
                    }
                  >
                    View Details
                  </Text>

                  <Text
                    style={
                      styles.arrow
                    }
                  >
                    ›
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View
            style={styles.emptyContainer}
          >
            <Text
              style={styles.emptyEmoji}
            >
              📭
            </Text>

            <Text
              style={styles.emptyTitle}
            >
              No Complaints Yet
            </Text>

            <Text
              style={styles.emptyText}
            >
              Your submitted complaints
              will appear here.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:
      COLORS.background,
  },

  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:
      COLORS.background,
  },

  header: {
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 10,
  },

  headerTitle: {
    fontSize: 30,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },

  headerSubtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
  },

  card: {
    backgroundColor:
      COLORS.surface,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 22,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.07,
    shadowRadius: 8,

    elevation: 4,
  },

  image: {
    width: '100%',
    height: 210,
  },

  placeholderImage: {
    height: 210,
    backgroundColor:
      COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },

  placeholderEmoji: {
    fontSize: 54,
  },

  cardContent: {
    padding: 18,
  },

  topRow: {
    flexDirection: 'row',
    justifyContent:
      'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },

  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 30,
  },

  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },

  date: {
    color: COLORS.textMuted,
    fontSize: 11,
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 10,
  },

  description: {
    color: COLORS.textMuted,
    lineHeight: 22,
    fontSize: 14,
    marginBottom: 18,
  },

  footerRow: {
    flexDirection: 'row',
    justifyContent:
      'space-between',
    alignItems: 'center',
  },

  viewText: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: 14,
  },

  arrow: {
    color: COLORS.primary,
    fontSize: 24,
  },

  emptyContainer: {
    alignItems: 'center',
    marginTop: 80,
    paddingHorizontal: 40,
  },

  emptyEmoji: {
    fontSize: 60,
    marginBottom: 18,
  },

  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 10,
  },

  emptyText: {
    textAlign: 'center',
    color: COLORS.textMuted,
    lineHeight: 22,
    fontSize: 14,
  },
});