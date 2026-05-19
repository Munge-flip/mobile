import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Stack, useRouter, useFocusEffect } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL, ENDPOINTS } from '@/constants/api';

interface UserData {
  name: string;
  email: string;
  phone: string;
  role: string;
}

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<UserData>({
    name: 'Traveler',
    email: '',
    phone: '',
    role: 'traveler',
  });
  const [totalOrders, setTotalOrders] = useState(0);
  const [completedOrders, setCompletedOrders] = useState(0);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('auth_token');
      const storedUser = await AsyncStorage.getItem('user');

      if (!token) {
        router.replace('/login');
        return;
      }

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }

      const headers = { Authorization: `Bearer ${token}` };

      // Fetch Profile & Orders in parallel
      const [profileRes, ordersRes] = await Promise.all([
        axios.get(ENDPOINTS.profile, { headers }),
        axios.get(ENDPOINTS.orders, { headers })
      ]);

      if (profileRes.data.success) {
        const freshUser = profileRes.data.data;
        setUser(freshUser);
        await AsyncStorage.setItem('user', JSON.stringify(freshUser));
      }

      if (ordersRes.data.success) {
        const orders = ordersRes.data.data;
        setTotalOrders(orders.length);
        const completed = orders.filter((o: any) => o.status === 'completed' || o.status === 'Completed').length;
        setCompletedOrders(completed);
      }

    } catch (error: any) {
      console.error('Error fetching profile data:', error);
      if (error.response?.status === 401) {
        handleSignOut();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await AsyncStorage.clear();
      router.replace('/login');
    } catch (error) {
      Alert.alert('Error', 'Failed to sign out. Please try again.');
    }
  };

  const getInitials = (name: string) => {
    return name.slice(0, 2).toUpperCase();
  };

  const capitalize = (s: string) => {
    if (!s) return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  if (loading && !user.email) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#7C3AED" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Profile</Text>
        <TouchableOpacity style={styles.settingsBtn}>
          <IconSymbol name="gearshape.fill" size={24} color="#64748B" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* User Info Card */}
        <View style={styles.userCard}>
          <View style={styles.userInfoRow}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>{getInitials(user.name)}</Text>
              </View>
            </View>
            <View>
              <Text style={styles.userName}>{user.name}</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{capitalize(user.role)}</Text>
              </View>
            </View>
          </View>

          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Total Orders</Text>
              <Text style={styles.statValue}>{totalOrders}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Completed</Text>
              <Text style={styles.statValue}>{completedOrders}</Text>
            </View>
          </View>
        </View>

        {/* Account Details */}
        <View style={styles.detailsSection}>
          <Text style={styles.sectionHeader}>Account Details</Text>
          <View style={styles.detailsCard}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Email Address</Text>
              <Text style={styles.detailValue}>{user.email}</Text>
            </View>
            <View style={[styles.detailItem, { borderBottomWidth: 0 }]}>
              <Text style={styles.detailLabel}>Phone Number</Text>
              <Text style={styles.detailValue}>{user.phone || 'Not set'}</Text>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.editBtn}
            onPress={() => router.push('/edit-profile')}
          >
            <Text style={styles.editBtnText}>Edit Information</Text>
          </TouchableOpacity>
        </View>

        {/* Danger Zone */}
        <View style={styles.dangerZone}>
          <TouchableOpacity 
            style={styles.signOutBtn}
            onPress={handleSignOut}
          >
            <IconSymbol name="rectangle.portrait.and.arrow.right" size={20} color="#EF4444" />
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
  },
  settingsBtn: {
    padding: 4,
  },
  userCard: {
    backgroundColor: '#7C3AED', // Fallback for gradient
    borderRadius: 32,
    padding: 24,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
    marginBottom: 32,
  },
  userInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 24,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    padding: 2,
  },
  avatarPlaceholder: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#7C3AED',
  },
  userName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  badge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  statBox: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.6)',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  detailsSection: {
    gap: 16,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '900',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginLeft: 4,
  },
  detailsCard: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  detailItem: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  detailLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#334155',
  },
  editBtn: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  editBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
  },
  dangerZone: {
    marginTop: 48,
  },
  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FEF2F2',
    paddingVertical: 16,
    borderRadius: 16,
  },
  signOutText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#EF4444',
  },
});
