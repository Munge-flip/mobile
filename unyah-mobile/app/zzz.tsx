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
    { id: 'm4', name: 'Full Patch (6 weeks)', price: 1700 },
  ],
  quests: [
    { id: 'q1', name: 'Short quests', price: 60 },
    { id: 'q2', name: 'Long quests', price: 170 },
  ],
  events: [
    { id: 'e1', name: 'Light events untouched', price: 120 },
    { id: 'e2', name: 'Full event untouched', price: 120 },
    { id: 'e3', name: 'Light events halfway', price: 100 },
    { id: 'e4', name: 'Full event halfway', price: 200 },
  ],
  endgame: [
    { id: 'eg1', name: 'Shiyu Defense', price: 150 },
    { id: 'eg2', name: 'Deadly Assault', price: 150 },
  ],
  hollowZero: [
    { id: 'hz1', name: '20 levels', price: 200 },
    { id: 'hz2', name: 'Full level', price: 1000 },
  ],
  completion: [
    { id: 'c1', name: '1 Location', price: 170 },
    { id: 'c2', name: 'Whole Location', price: 500 },
  ],
};

export default function ZZZServicesScreen() {
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
      if (selectedServices.includes(s.id)) {
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
          <Section title="Maintenance" items={SERVICES.maintenance} selected={selectedServices} onToggle={toggleService} color="#EAB308" />
          <Section title="Regular Quests" items={SERVICES.quests} selected={selectedServices} onToggle={toggleService} color="#EAB308" />
          <Section title="Events" items={SERVICES.events} selected={selectedServices} onToggle={toggleService} color="#EAB308" />
          <Section title="Endgame" items={SERVICES.endgame} selected={selectedServices} onToggle={toggleService} color="#EAB308" />
          
          {/* Hollow Zero */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>HOLLOW ZERO</Text>
            <View style={styles.gridRow}>
              <TouchableOpacity style={styles.gridItem}><Text style={styles.gridItemText}>Lost Void</Text></TouchableOpacity>
              <TouchableOpacity style={styles.gridItem}><Text style={styles.gridItemText}>Withered Domain</Text></TouchableOpacity>
            </View>
            <View style={styles.sectionItems}>
              {SERVICES.hollowZero.map(item => (
                <TouchableOpacity 
                  key={item.id} 
                  style={[styles.serviceItem, selectedServices.includes(item.id) && styles.serviceItemActive]}
                  onPress={() => toggleService(item.id)}
                >
                  <Text style={styles.serviceName}>{item.name}</Text>
                  <Text style={[styles.servicePrice, { color: '#CA8A04' }]}>₱{item.price}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <Section title="100% Area Completion" items={SERVICES.completion} selected={selectedServices} onToggle={toggleService} color="#EAB308" />

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
        <TouchableOpacity style={[styles.placeOrderBtn, { backgroundColor: '#EAB308' }]}>
          <Text style={[styles.placeOrderBtnText, { color: '#000' }]}>Get Started</Text>
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
              selected.includes(item.id) && styles.serviceItemActive
            ]}
            onPress={() => onToggle(item.id)}
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
  placeOrderBtnText: {
    fontWeight: '900',
    fontSize: 14,
    textTransform: 'uppercase',
    fontStyle: 'italic',
  },
});
