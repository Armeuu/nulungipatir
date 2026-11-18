import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase, testCloudBridge } from '@/lib/supabase';
import { useRouter } from 'expo-router';

interface CloudStatus {
  loading: boolean;
  message: string | null;
  success: boolean | null;
}

export default function CloudHealthScreen() {
  const router = useRouter();
  const [cloudStatus, setCloudStatus] = useState<CloudStatus>({
    loading: false,
    message: null,
    success: null,
  });

  const checkConnection = async () => {
    setCloudStatus({ loading: true, message: null, success: null });

    const result = await testCloudBridge();

    setCloudStatus({
      loading: false,
      message: result
        ? 'Connection to PostgreSQL Supabase established successfully!'
        : 'Failed to establish connection to Supabase.',
      success: result,
    });
  };

  useEffect(() => {
    checkConnection();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.cardWrapper}>
          <View style={styles.cloudCard}>
            <Text style={styles.sectionHeader}>CODELAB 2: CLOUD BRIDGE</Text>
            <Text style={styles.cardTitle}>Supabase Health Check</Text>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>TARGET URL</Text>
              <Text style={styles.infoValue} numberOfLines={1}>
                {(supabase as any)?.supabaseUrl || 'Missing .env configuration'}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.checkBtn}
              onPress={checkConnection}
              disabled={cloudStatus.loading}
              activeOpacity={0.8}
            >
              {cloudStatus.loading ? (
                <ActivityIndicator color="#000000" size="small" />
              ) : (
                <Text style={styles.checkBtnText}>Test Cloud Bridge</Text>
              )}
            </TouchableOpacity>

            {cloudStatus.message && (
              <View
                style={[
                  styles.statusBox,
                  cloudStatus.success ? styles.statusSuccess : styles.statusError,
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    cloudStatus.success ? styles.textSuccess : styles.textError,
                  ]}
                >
                  {cloudStatus.message}
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => router.back()}
              activeOpacity={0.8}
            >
              <Text style={styles.backBtnText}>← Back to HQ</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollContent: {
    padding: 24,
    justifyContent: 'center',
    flexGrow: 1,
  },
  cardWrapper: {
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
  cloudCard: {
    backgroundColor: '#0a0a0a',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#262626',
    alignItems: 'center',
  },
  sectionHeader: {
    color: '#737373',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  cardTitle: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 20,
    textAlign: 'center',
  },
  infoRow: {
    width: '100%',
    backgroundColor: '#171717',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#262626',
  },
  infoLabel: {
    color: '#737373',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 4,
  },
  infoValue: {
    color: '#a3a3a3',
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  checkBtn: {
    width: '100%',
    backgroundColor: '#ffffff',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  checkBtnText: {
    color: '#000000',
    fontWeight: '700',
    fontSize: 14,
  },
  backBtn: {
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  backBtnText: {
    color: '#a1a1aa',
    fontSize: 13,
    fontWeight: '600',
  },
  statusBox: {
    width: '100%',
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  statusSuccess: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    borderColor: 'rgba(34, 197, 94, 0.3)',
  },
  statusError: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  statusText: {
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
  },
  textSuccess: {
    color: '#4ade80',
  },
  textError: {
    color: '#f87171',
  },
});
