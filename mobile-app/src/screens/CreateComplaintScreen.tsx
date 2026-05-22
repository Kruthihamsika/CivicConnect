import { useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { createComplaint } from '../services/complaintService';
import { getCurrentLocation } from '../services/locationService';
import { pickImage } from '../services/imageService';
import { uploadImageToCloudinary } from '../services/cloudinaryService';

const COLORS = {
  background: '#F4F6FA',
  surface: '#FFFFFF',
  primary: '#1A3A5C',
  accent: '#E8F0FE',
  text: '#111827',
  textMuted: '#6B7280',
  border: '#E5E7EB',
  success: '#16A34A',
};

export default function CreateComplaintScreen() {
  const [title, setTitle] =
    useState('');

  const [description, setDescription] =
    useState('');

  const [imageUri, setImageUri] =
    useState<string | null>(
      null
    );

  const [loading, setLoading] =
    useState(false);

  const [locationText, setLocationText] =
    useState(
      'Location not fetched'
    );

  const [category, setCategory] =
    useState('Roads');

  const categories = [
    'Roads',
    'Water',
    'Sanitation',
    'Electricity',
    'Drainage',
    'Environment',
  ];

  async function handlePickImage() {
    try {
      const uri = await pickImage();

      if (uri) {
        setImageUri(uri);
      }
    } catch (error: any) {
      Alert.alert(
        'Image Error',
        error.message
      );
    }
  }

  async function handleSubmit() {
    try {
      if (
        !title ||
        !description
      ) {
        Alert.alert(
          'Validation',
          'Please fill all fields'
        );

        return;
      }

      setLoading(true);

      const location =
        await getCurrentLocation();

      setLocationText(
        `Lat: ${location.latitude}, Lng: ${location.longitude}`
      );

      let uploadedImageUrl =
        null;

      // Upload image
      if (imageUri) {
        uploadedImageUrl =
          await uploadImageToCloudinary(
            imageUri
          );

        console.log(
          'Uploaded Image URL:',
          uploadedImageUrl
        );
      }

      // Save complaint
      await createComplaint({
        title,
        description,
        image_url:
          uploadedImageUrl,
      });

      Alert.alert(
        'Success',
        'Complaint submitted successfully'
      );

      // Reset form
      setTitle('');
      setDescription('');
      setImageUri(null);

    } catch (error: any) {
      Alert.alert(
        'Submission Failed',
        error.message
      );
    } finally {
      setLoading(false);
    }
  }

  const isFormReady =
    title.trim().length > 0 &&
    description.trim().length > 0;

  return (
    <SafeAreaView
      style={styles.container}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor={
          COLORS.primary
        }
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : undefined
        }
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={
            false
          }
          contentContainerStyle={{
            paddingBottom: 40,
          }}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerEmoji}>
              📝
            </Text>

            <Text style={styles.headerTitle}>
              Report an Issue
            </Text>

            <Text
              style={
                styles.headerSubtitle
              }
            >
              Submit civic complaints
              with GPS & images
            </Text>
          </View>

          {/* Form */}
          <View style={styles.content}>
            {/* Categories */}
            <Text
              style={
                styles.sectionTitle
              }
            >
              Category
            </Text>

            <View
              style={
                styles.categoryContainer
              }
            >
              {categories.map(
                (item) => {
                  const selected =
                    item ===
                    category;

                  return (
                    <TouchableOpacity
                      key={item}
                      style={[
                        styles.categoryChip,

                        selected &&
                          styles.categoryChipActive,
                      ]}
                      onPress={() =>
                        setCategory(
                          item
                        )
                      }
                    >
                      <Text
                        style={[
                          styles.categoryChipText,

                          selected &&
                            styles.categoryChipTextActive,
                        ]}
                      >
                        {item}
                      </Text>
                    </TouchableOpacity>
                  );
                }
              )}
            </View>

            {/* Title */}
            <TextInput
              style={styles.input}
              placeholder="Issue Title"
              placeholderTextColor="#888"
              value={title}
              onChangeText={
                setTitle
              }
            />

            {/* Description */}
            <TextInput
              style={[
                styles.input,
                styles.textArea,
              ]}
              placeholder="Describe the issue..."
              placeholderTextColor="#888"
              multiline
              value={description}
              onChangeText={
                setDescription
              }
            />

            {/* Image Upload */}
            <TouchableOpacity
              style={styles.uploadCard}
              onPress={
                handlePickImage
              }
              activeOpacity={0.85}
            >
              {imageUri ? (
                <Image
                  source={{
                    uri: imageUri,
                  }}
                  style={
                    styles.previewImage
                  }
                />
              ) : (
                <>
                  <Text
                    style={
                      styles.uploadEmoji
                    }
                  >
                    📸
                  </Text>

                  <Text
                    style={
                      styles.uploadTitle
                    }
                  >
                    Upload Complaint Image
                  </Text>

                  <Text
                    style={
                      styles.uploadSubtitle
                    }
                  >
                    Tap to select image
                  </Text>
                </>
              )}
            </TouchableOpacity>

            {/* GPS */}
            <View
              style={
                styles.locationCard
              }
            >
              <Text
                style={
                  styles.locationLabel
                }
              >
                📍 GPS Location
              </Text>

              <Text
                style={
                  styles.locationText
                }
              >
                {locationText}
              </Text>
            </View>

            {/* Submit */}
            <TouchableOpacity
              style={[
                styles.submitButton,

                (!isFormReady ||
                  loading) &&
                  styles.submitDisabled,
              ]}
              disabled={
                !isFormReady ||
                loading
              }
              onPress={handleSubmit}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text
                  style={
                    styles.submitText
                  }
                >
                  Submit Complaint
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    paddingBottom: 36,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    alignItems: 'center',
  },

  headerEmoji: {
    fontSize: 46,
    marginBottom: 12,
  },

  headerTitle: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '700',
    marginBottom: 6,
  },

  headerSubtitle: {
    color:
      'rgba(255,255,255,0.75)',
    fontSize: 14,
  },

  content: {
    padding: 22,
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textMuted,
    marginBottom: 14,
  },

  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },

  categoryChip: {
    backgroundColor:
      COLORS.accent,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },

  categoryChipActive: {
    backgroundColor:
      COLORS.primary,
  },

  categoryChipText: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: 13,
  },

  categoryChipTextActive: {
    color: '#FFFFFF',
  },

  input: {
    backgroundColor:
      COLORS.surface,
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 16,
    fontSize: 15,
    marginBottom: 18,
    borderWidth: 1,
    borderColor:
      COLORS.border,
  },

  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },

  uploadCard: {
    backgroundColor:
      COLORS.surface,
    borderRadius: 22,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor:
      COLORS.border,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
    overflow: 'hidden',
    minHeight: 220,
  },

  uploadEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },

  uploadTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 6,
  },

  uploadSubtitle: {
    color: COLORS.textMuted,
    fontSize: 13,
  },

  previewImage: {
    width: '100%',
    height: 260,
    borderRadius: 18,
  },

  locationCard: {
    backgroundColor:
      '#ECFDF3',
    borderRadius: 18,
    padding: 18,
    marginBottom: 26,
  },

  locationLabel: {
    color: COLORS.success,
    fontWeight: '700',
    marginBottom: 8,
  },

  locationText: {
    color: '#166534',
    lineHeight: 20,
  },

  submitButton: {
    backgroundColor:
      COLORS.primary,
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: 'center',
  },

  submitDisabled: {
    opacity: 0.6,
  },

  submitText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});