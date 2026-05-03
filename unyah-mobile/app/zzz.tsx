import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';
import axios from 'axios';
import { API_URL } from '@/constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Service {
  id: number | string;
  game: string;
  category_name: string;
  category: string;
  name: string;
  price: string | number;
  is_active: boolean;
}

export default function ZZZServicesScreen() {
  const router = useRouter();
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [services, setServices] = useState<{[key: string]: Service[]}>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/services`);
      if (response.data.success) {
        const zzzServices = response.data.data.filter(
          (s: Service) => s.game === "Zenless Zone Zero" && s.is_active
        );
        
        // Group by category_name
        const grouped = zzzServices.reduce((acc: any, service: Service) => {
          const category = service.category_name;
          if (!acc[category]) acc[category] = [];
          acc[category].push({
            ...service,
            price: typeof service.price === 'string' ? parseFloat(service.price) : service.price
          });
          return acc;
        }, {});
        
        setServices(grouped);
      } else {
        setError('Failed to load services');
      }
    } catch (err) {
      setError('An error occurred while fetching services');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleService = (id: string) => {
    setSelectedServices(prev => 
      prev.includes(String(id)) ? prev.filter(s => s !== String(id)) : [...prev, String(id)]
    );
  };

  const calculateTotal = () => {
    let total = 0;
    Object.values(services).flat().forEach(s => {
      if (selectedServices.includes(String(s.id))) {
        total += Number(s.price);
      }
    });
    return total;
  };

  const handlePlaceOrder = async () => {
    setOrderError(null);
    const token = await AsyncStorage.getItem('auth_token');
    
    if (!token) {
      router.push('/login');
      return;
    }

    const selectedServiceItems = Object.values(services)
      .flat()
      .filter(s => selectedServices.includes(String(s.id)));

    if (selectedServiceItems.length === 0) {
      setOrderError('Please select at least one service');
      return;
    }

    setIsOrdering(true);
    try {
      // Set default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Place each order
      await Promise.all(selectedServiceItems.map(s => 
        axios.post(`${API_URL}/user/orders`, {
          game: 'Zenless Zone Zero',
          service_category: s.category_name,
          service_type: s.name,
          price: Number(s.price), // No multiplier for ZZZ as no explorations defined
          payment_method: 'GCASH_QR'
        })
      ));

      router.replace('/(tabs)/orders');
    } catch (err: any) {
      setOrderError(err.response?.data?.message || 'An error occurred while placing your order.');
      console.error('Order error:', err);
    } finally {
      setIsOrdering(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#EAB308" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={fetchServices}>
          <Text style={styles.retryBtnText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <View style={styles.bannerContainer}>
          <Image 
            source={require('../assets/images/zzz banner.png')}
            style={styles.bannerImg}
          />
          <View style={styles.bannerOverlay} />
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <IconSymbol name="chevron.left" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Game Info Card */}
        <View style={styles.infoCardContainer}>
          <View style={styles.infoCard}>
            <View style={styles.gameLogoContainer}>
              <Image 
                source={require('../assets/images/zzz icon.png')} 
                style={styles.gameLogo}
              />
            </View>
            <View>
              <Text style={styles.gameName}>ZENLESS ZONE ZERO</Text>
              <Text style={styles.gameSubtitle}>New Eridu Piloting</Text>
            </View>
          </View>
        </View>

        {/* Sections */}
        <View style={styles.mainPadding}>
          <Section title="Maintenance" items={services['Maintenance'] || []} selected={selectedServices} onToggle={toggleService} color="#EAB308" />
          <Section title="Regular Quests" items={services['Regular Quests'] || []} selected={selectedServices} onToggle={toggleService} color="#EAB308" />
          <Section title="Events" items={services['Events'] || []} selected={selectedServices} onToggle={toggleService} color="#EAB308" />
          <Section title="Endgame" items={services['Endgame'] || []} selected={selectedServices} onToggle={toggleService} color="#EAB308" />
          
          {/* Hollow Zero */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>HOLLOW ZERO</Text>
            <View style={styles.gridRow}>
              <TouchableOpacity style={styles.gridItem}><Text style={styles.gridItemText}>Lost Void</Text></TouchableOpacity>
              <TouchableOpacity style={styles.gridItem}><Text style={styles.gridItemText}>Withered Domain</Text></TouchableOpacity>
            </View>
            <View style={styles.sectionItems}>
              {(services['Hollow Zero'] || []).map(item => (
                <TouchableOpacity 
                  key={item.id} 
                  style={[styles.serviceItem, selectedServices.includes(String(item.id)) && styles.serviceItemActive]}
                  onPress={() => toggleService(String(item.id))}
                >
                  <Text style={styles.serviceName}>{item.name}</Text>
                  <Text style={[styles.servicePrice, { color: '#CA8A04' }]}>₱{item.price}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <Section title="100% Area Completion" items={services['100% Area Completion'] || []} selected={selectedServices} onToggle={toggleService} color="#EAB308" />

          {orderError && (
            <Text style={styles.inlineError}>{orderError}</Text>
          )}

          {/* Payment Methods */}
          <View style={styles.paymentSection}>
            <Text style={styles.paymentHeader}>Payment Method</Text>
            
            <View style={styles.paymentGroup}>
               <Text style={[styles.paymentGroupLabel, { backgroundColor: '#EAB308' }]}>QR Payment</Text>
               <View style={styles.paymentGrid}>
                  <TouchableOpacity style={styles.paymentItem}>
                    <Text style={styles.paymentItemText}>GCash</Text>
                    <Text style={styles.paymentItemSub}>Scan QR</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.paymentItem}>
                    <Text style={styles.paymentItemText}>PayPal</Text>
                    <Text style={styles.paymentItemSub}>Scan QR</Text>
                  </TouchableOpacity>
               </View>
            </View>

            <View style={styles.paymentGroup}>
               <Text style={[styles.paymentGroupLabel, { backgroundColor: '#6366F1' }]}>E-Wallet</Text>
               <View style={[styles.paymentGrid, { borderColor: '#EEF2FF' }]}>
                  <TouchableOpacity style={styles.paymentItem}>
                    <Text style={styles.paymentItemText}>GCash</Text>
                    <Text style={styles.paymentItemSub}>Direct</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.paymentItem}>
                    <Text style={styles.paymentItemText}>PayPal</Text>
                    <Text style={styles.paymentItemSub}>Direct</Text>
                  </TouchableOpacity>
               </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Footer */}
      <View style={styles.footer}>
        <View>
          <Text style={styles.totalLabel}>Total Order</Text>
          <Text style={[styles.totalPrice, { color: '#EAB308', fontStyle: 'italic' }]}>₱{calculateTotal().toLocaleString()}</Text>
        </View>
        <TouchableOpacity 
          style={[styles.placeOrderBtn, { backgroundColor: '#EAB308' }, isOrdering && styles.placeOrderBtnDisabled]}
          onPress={handlePlaceOrder}
          disabled={isOrdering}
        >
          {isOrdering ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={[styles.placeOrderBtnText, { color: '#000' }]}>Get Started</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

function Section({ title, items, selected, onToggle, color }: any) {
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { borderBottomColor: color }]}>{title.toUpperCase()}</Text>
      <View style={styles.sectionItems}>
        {items.map((item: any) => (
          <TouchableOpacity 
            key={item.id} 
            style={[
              styles.serviceItem,
              selected.includes(String(item.id)) && styles.serviceItemActive
            ]}
            onPress={() => onToggle(String(item.id))}
          >
            <Text style={styles.serviceName}>{item.name}</Text>
            <Text style={[styles.servicePrice, { color: color || '#7C3AED' }]}>₱{item.price}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  retryBtn: {
    backgroundColor: '#EAB308',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryBtnText: {
    color: '#000',
    fontWeight: '700',
  },
  inlineError: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
    backgroundColor: '#FEE2E2',
    padding: 12,
    borderRadius: 12,
  },
  scrollContent: {
    paddingBottom: 150,
  },
  bannerContainer: {
    height: 192,
    width: '100%',
  },
  bannerImg: {
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  backBtn: {
    position: 'absolute',
    top: 50,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoCardContainer: {
    paddingHorizontal: 24,
    marginTop: -40,
    zIndex: 10,
  },
  infoCard: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  gameLogoContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 4,
    borderColor: '#FFF',
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  gameLogo: {
    width: '100%',
    height: '100%',
  },
  gameName: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1E293B',
    fontStyle: 'italic',
  },
  gameSubtitle: {
    fontSize: 10,
    fontWeight: '900',
    color: '#EAB308',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  mainPadding: {
    padding: 24,
  },
  section: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#334155',
    fontStyle: 'italic',
    marginBottom: 16,
    borderBottomWidth: 2,
    paddingBottom: 4,
  },
  sectionItems: {
    gap: 12,
  },
  serviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#F1F5F9',
  },
  serviceItemActive: {
    borderColor: '#FBBF24',
    backgroundColor: '#FFFBEB',
  },
  serviceName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
  },
  servicePrice: {
    fontSize: 14,
    fontWeight: '900',
  },
  gridRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  gridItem: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFF',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#F1F5F9',
    alignItems: 'center',
  },
  gridItemText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  paymentSection: {
    marginTop: 24,
  },
  paymentHeader: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1E293B',
    textTransform: 'uppercase',
    fontStyle: 'italic',
    borderBottomWidth: 2,
    borderBottomColor: '#FB923C',
    paddingBottom: 8,
    marginBottom: 24,
  },
  paymentGroup: {
    marginBottom: 24,
  },
  paymentGroupLabel: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '900',
    paddingVertical: 4,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
    borderRadius: 8,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    textTransform: 'uppercase',
  },
  paymentGrid: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 16,
    borderTopLeftRadius: 0,
    borderWidth: 2,
    borderColor: '#F1F5F9',
  },
  paymentItem: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#F8FAFC',
    alignItems: 'center',
    gap: 4,
  },
  paymentItemText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  paymentItemSub: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 24,
    paddingBottom: 34,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 20,
  },
  totalLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: '#94A3B8',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  totalPrice: {
    fontSize: 28,
    fontWeight: '900',
  },
  placeOrderBtn: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    shadowColor: '#FACC15',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  placeOrderBtnDisabled: {
    opacity: 0.7,
    backgroundColor: '#9CA3AF',
  },
  placeOrderBtnText: {
    fontWeight: '900',
    fontSize: 14,
    textTransform: 'uppercase',
    fontStyle: 'italic',
  },
});
