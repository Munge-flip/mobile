import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { Stack, useRouter, useFocusEffect } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@/constants/api';

interface Order {
  id: number;
  game: string;
  service_category: string;
  service_type: string;
  price: string;
  status: string;
  payment_status: string;
  created_at: string;
}

const STATUS_STYLES: { [key: string]: { bg: string, text: string } } = {
  pending: { bg: '#FEF9C3', text: '#CA8A04' },
  in_progress: { bg: '#EFF6FF', text: '#2563EB' },
  completed: { bg: '#F0FDF4', text: '#16A34A' },
  cancelled: { bg: '#FEF2F2', text: '#DC2626' },
};

const FILTERS = ['All Orders', 'Pending', 'In Progress', 'Completed'];

export default function OrdersScreen() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState('All Orders');

  const applyFilter = useCallback((allOrders: Order[], filter: string) => {
    if (filter === 'All Orders') {
      setFilteredOrders(allOrders);
    } else {
      const statusKey = filter.toLowerCase().replace(' ', '_');
      setFilteredOrders(allOrders.filter(o => o.status === statusKey));
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const token = await AsyncStorage.getItem('auth_token');

      if (!token) {
        router.replace('/login');
        return;
      }

      const response = await axios.get(`${API_URL}/user/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        const allOrders = response.data.data;
        setOrders(allOrders);
        applyFilter(allOrders, activeFilter);
      } else {
        setError('Failed to load orders');
      }
    } catch (err) {
      setError('An error occurred while fetching orders');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [activeFilter, applyFilter, router]);

  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, [fetchOrders])
  );

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    applyFilter(orders, filter);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Track Orders</Text>
        <TouchableOpacity style={styles.searchBtn}>
          <IconSymbol name="magnifyingglass" size={20} color="#64748B" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Filters */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.filterScroll}
          contentContainerStyle={styles.filterContent}
        >
          {FILTERS.map((filter) => (
            <TouchableOpacity 
              key={filter} 
              style={[
                styles.filterBtn, 
                activeFilter === filter && styles.filterBtnActive,
                activeFilter === filter && styles.activeShadow
              ]}
              onPress={() => handleFilterChange(filter)}
            >
              <Text style={[styles.filterText, activeFilter === filter && styles.filterTextActive]}>{filter}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#7C3AED" />
          </View>
        ) : error ? (
          <View style={styles.center}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={fetchOrders}>
              <Text style={styles.retryBtnText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* Order Cards */
          <View style={styles.orderList}>
            {filteredOrders.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No orders found.</Text>
              </View>
            ) : (
              filteredOrders.map(order => {
                const statusStyle = STATUS_STYLES[order.status] || STATUS_STYLES.pending;
                return (
                  <View key={order.id} style={styles.orderCard}>
                    <View style={styles.cardHeader}>
                      <View>
                        <Text style={styles.orderId}>ORDER #HP-{order.id.toString().padStart(4, '0')}</Text>
                        <Text style={styles.orderDate}>{formatDate(order.created_at)}</Text>
                      </View>
                      <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                        <Text style={[styles.statusText, { color: statusStyle.text }]}>
                          {order.status.replace('_', ' ')}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.cardBody}>
                      <View style={styles.row}>
                        <Text style={styles.rowLabel}>Service:</Text>
                        <Text style={styles.rowValue}>{order.service_type}</Text>
                      </View>
                      <View style={styles.row}>
                        <Text style={styles.rowLabel}>Game:</Text>
                        <Text style={styles.rowValue}>{order.game}</Text>
                      </View>
                      <View style={styles.row}>
                        <Text style={styles.rowLabel}>Total:</Text>
                        <Text style={styles.priceValue}>₱{parseFloat(order.price).toFixed(2)}</Text>
                      </View>
                    </View>

                    <TouchableOpacity 
                      style={styles.detailsBtn} 
                      onPress={() => router.push(`/orders/${order.id}` as any)}
                    >
                      <Text style={styles.detailsBtnText}>View Details</Text>
                    </TouchableOpacity>
                  </View>
                );
              })
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  center: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  retryBtn: {
    backgroundColor: '#7C3AED',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryBtnText: {
    color: '#FFF',
    fontWeight: '700',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: '#64748B',
    fontSize: 16,
  },
  scrollContent: {
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
  searchBtn: {
    width: 40,
    height: 40,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterScroll: {
    marginTop: 16,
    marginBottom: 8,
  },
  filterContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  filterBtn: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    backgroundColor: '#FFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  filterBtnActive: {
    backgroundColor: '#7C3AED',
    borderColor: '#7C3AED',
  },
  activeShadow: {
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  filterTextActive: {
    color: '#FFF',
  },
  orderList: {
    padding: 20,
    gap: 16,
  },
  orderCard: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  orderId: {
    fontSize: 14,
    fontWeight: '900',
    color: '#1E293B',
    letterSpacing: -0.5,
  },
  orderDate: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
    textTransform: 'uppercase',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  cardBody: {
    gap: 8,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowLabel: {
    fontSize: 14,
    color: '#64748B',
  },
  rowValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  priceValue: {
    fontSize: 14,
    fontWeight: '900',
    color: '#7C3AED',
  },
  detailsBtn: {
    backgroundColor: '#F8FAFC',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  detailsBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#7C3AED',
  },
});
