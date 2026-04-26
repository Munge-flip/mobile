import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';

const { width } = Dimensions.get('window');

const SERVICES = {
  maintenance: [
    { id: 'm1', name: 'Daily', price: 57 },
    { id: 'm2', name: 'Weekly', price: 300 },
    { id: 'm3', name: 'Monthly', price: 1300 },
    { id: 'm4', name: 'Full Patch (6 weeks)', price: 700 },
  ],
  quests: [
    { id: 'q1', name: 'Short quests (1-2 parts)', price: 50 },
    { id: 'q2', name: 'Long quests (multiple parts)', price: 170 },
  ],
  events: [
    { id: 'e1', name: 'Light events', price: 120 },
    { id: 'e2', name: 'Full event', price: 120 },
    { id: 'e3', name: 'Light events (Half)', price: 100 },
    { id: 'e4', name: 'Full event (Half)', price: 200 },
  ],
  endgame: [
    { id: 'eg1', name: 'Spiral abyss', price: 120 },
    { id: 'eg2', name: 'Imaginarium Theater', price: 120 },
    { id: 'eg3', name: 'Stygian Onslaught', price: 120 },
  ],
  explorations: [
    { id: 'ex1', name: 'Mondstadt' },
    { id: 'ex2', name: 'Liyue' },
    { id: 'ex3', name: 'Inazuma' },
    { id: 'ex4', name: 'Fontaine' },
    { id: 'ex5', name: 'Sumeru' },
    { id: 'ex6', name: 'Natlan' },
  ],
};

export default function GenshinServicesScreen() {
  const router = useRouter();
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const toggleService = (id: string) => {
    setSelectedServices(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const calculateTotal = () => {
    let total = 0;
    Object.values(SERVICES).flat().forEach(s => {
      if (selectedServices.includes(s.id) && 'price' in s) {
        total += s.price;
      }
    });
    return total;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <View style={styles.bannerContainer}>
          <Image 
            source={require('../assets/images/icon.png')} // Placeholder for banner
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
                source={require('../assets/images/icon.png')} 
                style={styles.gameLogo}
              />
            </View>
            <View>
              <Text style={styles.gameName}>Genshin Impact</Text>
              <Text style={styles.gameSubtitle}>Service Piloting</Text>
            </View>
          </View>
        </View>

        {/* Sections */}
        <View style={styles.mainPadding}>
          <Section title="Maintenance" items={SERVICES.maintenance} selected={selectedServices} onToggle={toggleService} />
          <Section title="Regular Quests" items={SERVICES.quests} selected={selectedServices} onToggle={toggleService} />
          <Section title="Events" items={SERVICES.events} selected={selectedServices} onToggle={toggleService} />
          <Section title="Endgame" items={SERVICES.endgame} selected={selectedServices} onToggle={toggleService} />
          
          <Text style={styles.sectionTitle}>Explorations</Text>
          <View style={styles.regionGrid}>
            {SERVICES.explorations.map(ex => (
              <TouchableOpacity 
                key={ex.id}
                style={[
                  styles.regionCard,
                  selectedServices.includes(ex.id) && styles.regionCardActive
                ]}
                onPress={() => toggleService(ex.id)}
              >
                <View style={styles.regionPlaceholder} />
                <Text style={styles.regionName}>{ex.name}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Payment Methods Placeholder */}
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
          </View>
        </View>
      </ScrollView>

      {/* Sticky Footer */}
      <View style={styles.footer}>
        <View>
          <Text style={styles.totalLabel}>Total Order</Text>
          <Text style={styles.totalPrice}>₱{calculateTotal().toLocaleString()}</Text>
        </View>
        <TouchableOpacity style={styles.placeOrderBtn}>
          <Text style={styles.placeOrderBtnText}>Place Order</Text>
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
              selected.includes(item.id) && styles.serviceItemActive
            ]}
            onPress={() => onToggle(item.id)}
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
    backgroundColor: '#F8FAFC',
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
    backgroundColor: '#1E3C72',
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
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
    shadowColor: '#7C3AED',
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
    backgroundColor: '#A38141',
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
    gap: 12,
    marginBottom: 40,
  },
  regionCard: {
    width: (width - 60) / 2,
    backgroundColor: '#FFF',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  regionCardActive: {
    borderColor: '#A78BFA',
  },
  regionPlaceholder: {
    height: 80,
    backgroundColor: '#E2E8F0',
  },
  regionName: {
    padding: 12,
    textAlign: 'center',
    fontSize: 12,
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
  placeOrderBtnText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14,
    textTransform: 'uppercase',
  },
});
