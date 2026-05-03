import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';
import axios from 'axios';
import { API_URL } from '@/constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

interface Service {
  id: number | string;
  game: string;
  category_name: string;
  category: string;
  name: string;
  price: string | number;
  is_active: boolean;
}

const EXPLORATIONS = [
  { id: 'ex1', name: 'Herta Space Station' },
  { id: 'ex2', name: 'Jarilo-VI' },
  { id: 'ex3', name: 'Xianzhou Luofu' },
  { id: 'ex4', name: 'Penacony' },
  { id: 'ex5', name: 'Amphoreus' },
];

const WORLDS = ['Swarm Disaster', 'Gold & Gears', 'Unknowable Domain'];

export default function HSRServicesScreen() {
  const router = useRouter();
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedWorld, setSelectedWorld] = useState(WORLDS[0]);
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
        const hsrServices = response.data.data.filter(
          (s: Service) => s.game === "Honkai Star Rail" && s.is_active
        );
        
        // Group by category_name
        const grouped = hsrServices.reduce((acc: any, service: Service) => {
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
    // Count selected regions (explorations)
    const selectedRegions = EXPLORATIONS.filter(ex => 
      selectedServices.includes(ex.id)
    ).length;
    
    // Use at least 1 as multiplier even if no region selected
    const multiplier = selectedRegions > 0 ? selectedRegions : 1;

    let total = 0;
    Object.values(services).flat().forEach(s => {
      if (selectedServices.includes(String(s.id))) {
        total += Number(s.price) * multiplier;
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

    const selectedRegionsCount = EXPLORATIONS.filter(ex => 
      selectedServices.includes(ex.id)
    ).length;
    const multiplier = selectedRegionsCount > 0 ? selectedRegionsCount : 1;

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
          game: 'Honkai Star Rail',
          service_category: s.category_name,
          service_type: s.name,
          price: Number(s.price) * multiplier,
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
        <ActivityIndicator size="large" color="#7C3AED" />
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
            source={require('../assets/images/hsr banner.png')}
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
                source={require('../assets/images/hsr icon.png')} 
                style={styles.gameLogo}
              />
            </View>
            <View>
              <Text style={styles.gameName}>Honkai Star Rail</Text>
              <Text style={styles.gameSubtitle}>Stellar Piloting</Text>
            </View>
          </View>
        </View>

        {/* Sections */}
        <View style={styles.mainPadding}>
          <Section title="Maintenance" items={services['Maintenance'] || []} selected={selectedServices} onToggle={toggleService} />
          <Section title="Regular Quests" items={services['Regular Quests'] || []} selected={selectedServices} onToggle={toggleService} />
          <Section title="Events" items={services['Events'] || []} selected={selectedServices} onToggle={toggleService} />
          <Section title="Endgame" items={services['Endgame'] || []} selected={selectedServices} onToggle={toggleService} />
          
          {/* Simulated Universe */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Simulated Universe</Text>
            <Text style={styles.italicSub}>Choose a World</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.worldScroll}>
              {WORLDS.map(w => (
                <TouchableOpacity 
                  key={w} 
                  style={[styles.worldBtn, selectedWorld === w && styles.worldBtnActive]}
                  onPress={() => setSelectedWorld(w)}
                >
                  <Text style={[styles.worldBtnText, selectedWorld === w && styles.worldBtnTextActive]}>{w}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View style={styles.sectionItems}>
              {(services['Simulated Universe'] || []).map(item => (
                <TouchableOpacity 
                  key={item.id} 
                  style={[styles.serviceItem, selectedServices.includes(String(item.id)) && styles.serviceItemActive]}
                  onPress={() => toggleService(String(item.id))}
                >
                  <Text style={styles.serviceName}>{item.name}</Text>
                  <Text style={styles.servicePrice}>₱{item.price}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <Section title="Divergent Universe" items={services['Divergent Universe'] || []} selected={selectedServices} onToggle={toggleService} />

          <Text style={styles.sectionTitle}>Explorations</Text>
          <View style={styles.regionGrid}>
            {EXPLORATIONS.map(ex => (
              <TouchableOpacity 
                key={ex.id}
                style={[
                  styles.regionCard,
                  selectedServices.includes(ex.id) && styles.regionCardActive
                ]}
                onPress={() => toggleService(ex.id)}
              >
                <View style={styles.regionImgContainer}>
                  <Image 
                    source={
                      ex.name === 'Herta Space Station' ? require('../assets/images/Herta-Space-Station banner.png') :
                      ex.name === 'Jarilo-VI' ? require('../assets/images/jarilo banner.png') :
                      ex.name === 'Xianzhou Luofu' ? require('../assets/images/xianzhou banner.png') :
                      ex.name === 'Penacony' ? require('../assets/images/penacony banner.png') :
                      ex.name === 'Amphoreus' ? require('../assets/images/amphoreus banner.png') :
                      require('../assets/images/icon.png')
                    }
                    style={styles.regionImg}
                    resizeMode="cover"
                  />
                </View>
                <Text style={styles.regionName}>{ex.name}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Section title="100% Area Completion" items={services['100% Area Completion'] || []} selected={selectedServices} onToggle={toggleService} />

          {orderError && (
            <Text style={styles.inlineError}>{orderError}</Text>
          )}

          {/* Payment Method Group */}
          <View style={styles.paymentSection}>
            <Text style={styles.paymentHeader}>Payment Method</Text>
            
            <View style={styles.paymentGroup}>
               <Text style={styles.paymentGroupLabel}>QR Payment</Text>
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
          <Text style={styles.totalPrice}>₱{calculateTotal().toLocaleString()}</Text>
        </View>
        <TouchableOpacity 
          style={[styles.placeOrderBtn, isOrdering && styles.placeOrderBtnDisabled]}
          onPress={handlePlaceOrder}
          disabled={isOrdering}
        >
          {isOrdering ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.placeOrderBtnText}>Place Order</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

function Section({ title, items, selected, onToggle }: any) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
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
            <Text style={styles.servicePrice}>₱{item.price}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F2F5',
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
    backgroundColor: '#7C3AED',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryBtnText: {
    color: '#FFF',
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
    backgroundColor: '#8B5CF6',
  },
  gameLogo: {
    width: '100%',
    height: '100%',
  },
  gameName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
  },
  gameSubtitle: {
    fontSize: 10,
    fontWeight: '900',
    color: '#7C3AED',
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
    fontWeight: '700',
    color: '#334155',
    marginBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#DDD6FE',
    paddingBottom: 4,
  },
  italicSub: {
    fontSize: 12,
    color: '#94A3B8',
    fontStyle: 'italic',
    marginBottom: 12,
  },
  worldScroll: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  worldBtn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#FFF',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#F1F5F9',
    marginRight: 12,
  },
  worldBtnActive: {
    borderColor: '#A78BFA',
    backgroundColor: '#F5F3FF',
  },
  worldBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  worldBtnTextActive: {
    color: '#7C3AED',
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
    borderColor: '#A78BFA',
    backgroundColor: '#F5F3FF',
  },
  serviceName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
  },
  servicePrice: {
    fontSize: 14,
    fontWeight: '900',
    color: '#7C3AED',
  },
  regionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 40,
  },
  regionCard: {
    width: (width - 48 - 12) / 2,
    backgroundColor: '#FFF',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  regionCardActive: {
    borderColor: '#A78BFA',
  },
  regionImgContainer: {
    height: 80,
    width: '100%',
    backgroundColor: '#E2E8F0',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  regionImg: {
    width: '100%',
    height: '100%',
  },
  regionName: {
    padding: 12,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
    color: '#334155',
  },
  paymentSection: {
    marginTop: 24,
  },
  paymentHeader: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1E293B',
    textTransform: 'uppercase',
    borderBottomWidth: 2,
    borderBottomColor: '#FB923C',
    paddingBottom: 8,
    marginBottom: 24,
  },
  paymentGroup: {
    marginBottom: 24,
  },
  paymentGroupLabel: {
    backgroundColor: '#FB923C',
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
    borderColor: '#FFF7ED',
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
    color: '#1E293B',
  },
  placeOrderBtn: {
    backgroundColor: '#7C3AED',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    shadowColor: '#7C3AED',
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
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14,
    textTransform: 'uppercase',
  },
});
