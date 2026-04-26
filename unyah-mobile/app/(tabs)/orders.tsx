import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Stack, Link } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';

const ORDERS = [
  {
    id: 'HP-2026-001',
    date: 'April 20, 2026',
    service: 'Spiral Abyss Clear',
    game: 'Genshin Impact',
    total: 120,
    status: 'In Progress',
    statusBg: '#EFF6FF',
    statusText: '#2563EB',
  },
  {
    id: 'HP-2026-002',
    date: 'April 19, 2026',
    service: 'Daily Commissions',
    game: 'HSR',
    total: 57,
    status: 'Pending',
    statusBg: '#FEF9C3',
    statusText: '#CA8A04',
  },
];

const FILTERS = ['All Orders', 'Pending', 'In Progress', 'Completed'];

export default function OrdersScreen() {
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
          {FILTERS.map((filter, index) => (
            <TouchableOpacity 
              key={filter} 
              style={[
                styles.filterBtn, 
                index === 0 && styles.filterBtnActive,
                index === 0 && styles.activeShadow
              ]}
            >
              <Text style={[styles.filterText, index === 0 && styles.filterTextActive]}>{filter}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Order Cards */}
        <View style={styles.orderList}>
          {ORDERS.map(order => (
            <View key={order.id} style={styles.orderCard}>
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.orderId}>ORDER #{order.id}</Text>
                  <Text style={styles.orderDate}>{order.date}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: order.statusBg }]}>
                  <Text style={[styles.statusText, { color: order.statusText }]}>{order.status}</Text>
                </View>
              </View>

              <View style={styles.cardBody}>
                <View style={styles.row}>
                  <Text style={styles.rowLabel}>Service:</Text>
                  <Text style={styles.rowValue}>{order.service}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.rowLabel}>Game:</Text>
                  <Text style={styles.rowValue}>{order.game}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.rowLabel}>Total:</Text>
                  <Text style={styles.priceValue}>₱{order.total.toFixed(2)}</Text>
                </View>
              </View>

              <TouchableOpacity style={styles.detailsBtn}>
                <Text style={styles.detailsBtnText}>View Details</Text>
              </TouchableOpacity>
            </View>
          ))}
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
