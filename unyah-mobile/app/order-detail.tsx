import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Image,
  Modal,
  TextInput,
} from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@/constants/api';
import * as ImagePicker from 'expo-image-picker';

interface OrderDetail {
  id: number;
  game: string;
  service_category: string;
  service_type: string;
  price: string;
  status: string;
  payment_status: string;
  payment_method: string;
  created_at: string;
}

const STATUS_STYLES: { [key: string]: { bg: string, text: string, label: string } } = {
  pending: { bg: '#EAB308', text: '#FFF', label: 'Pending' },
  in_progress: { bg: '#2563EB', text: '#FFF', label: 'In Progress' },
  completed: { bg: '#16A34A', text: '#FFF', label: 'Completed' },
  cancelled: { bg: '#DC2626', text: '#FFF', label: 'Cancelled' },
};

export default function OrderDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  
  // Transaction Form State
  const [referenceNumber, setReferenceNumber] = useState('');
  const [proofImage, setProofImage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmittingError] = useState<string | null>(null);

  const fetchOrderDetail = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const token = await AsyncStorage.getItem('auth_token');

      if (!token) {
        router.replace('/login');
        return;
      }

      const response = await axios.get(`${API_URL}/user/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setOrder(response.data.data);
      } else {
        setError('Failed to load order details');
      }
    } catch (err) {
      setError('An error occurred while fetching order details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    fetchOrderDetail();
  }, [fetchOrderDetail]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setProofImage(result.assets[0].uri);
    }
  };

  const handleSubmitTransaction = async () => {
    if (!referenceNumber || !proofImage) {
      setSubmittingError('Please provide reference number and proof image');
      return;
    }

    try {
      setSubmitting(true);
      setSubmittingError(null);
      const token = await AsyncStorage.getItem('auth_token');

      const formData = new FormData();
      formData.append('order_id', String(id));
      formData.append('transaction_reference', referenceNumber);
      
      const uriParts = proofImage.split('.');
const fileType = uriParts[uriParts.length - 1]?.toLowerCase() || 'jpg';
const mimeType = fileType === 'jpg' ? 'image/jpeg' : `image/${fileType}`;

formData.append('payment_proof', {
  uri: proofImage,
  name: `proof_${Date.now()}.${fileType}`,
  type: mimeType,
} as any);

      await axios.post(`${API_URL}/user/transactions`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        }
      });

      setModalVisible(false);
      fetchOrderDetail(); // Refresh status
    } catch (err: any) {
      setSubmittingError(err.response?.data?.message || 'Failed to upload proof of payment');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#7C3AED" />
      </SafeAreaView>
    );
  }

  if (error || !order) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>{error || 'Order not found'}</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={fetchOrderDetail}>
          <Text style={styles.retryBtnText}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const statusStyle = STATUS_STYLES[order.status] || STATUS_STYLES.pending;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <IconSymbol name="chevron.left" size={24} color="#64748B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Details</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Status Banner */}
        <View style={[styles.statusBanner, { backgroundColor: statusStyle.bg }]}>
          <View>
            <Text style={styles.statusLabel}>Current Status</Text>
            <Text style={styles.statusValue}>{statusStyle.label}</Text>
          </View>
          <View style={styles.statusIconContainer}>
            <IconSymbol name="bolt.fill" size={32} color="#FFF" />
          </View>
        </View>

        {/* Service Info Card */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>Service Information</Text>
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>Game:</Text>
            <Text style={styles.cardValue}>{order.game}</Text>
          </View>
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>Category:</Text>
            <Text style={styles.cardValue}>{order.service_category}</Text>
          </View>
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>Service:</Text>
            <Text style={styles.cardValue}>{order.service_type}</Text>
          </View>
        </View>

        {/* Payment Section */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>Payment & Receipt</Text>
          <View style={styles.paymentBox}>
            <Text style={styles.scanText}>Scan to Pay (GCash)</Text>
            <View style={styles.qrContainer}>
              <IconSymbol name="qrcode" size={80} color="#E2E8F0" />
              {/* Image would go here if assets/images/gcash-qr.png existed */}
            </View>
            <Text style={styles.totalAmount}>₱{parseFloat(order.price).toFixed(2)}</Text>
          </View>

          <TouchableOpacity 
            style={styles.uploadBtn}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.uploadBtnText}>Upload Proof of Payment</Text>
          </TouchableOpacity>
        </View>

        {/* Chat Link */}
        <TouchableOpacity 
          style={styles.chatLink}
          onPress={() => router.push('/order-chat' as any)}
        >
          <View style={styles.chatContent}>
            <View style={styles.chatIconContainer}>
              <IconSymbol name="message.fill" size={24} color="#16A34A" />
            </View>
            <View>
              <Text style={styles.chatTitle}>Chat with Agent</Text>
              <Text style={styles.chatSub}>Discuss your order details</Text>
            </View>
          </View>
          <IconSymbol name="chevron.right" size={20} color="#CBD5E1" />
        </TouchableOpacity>

      </ScrollView>

      {/* Upload Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Proof of Payment</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <IconSymbol name="xmark" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.modalBody}>
                <View style={[styles.qrContainer, { marginBottom: 24 }]}>
                  <IconSymbol name="qrcode" size={120} color="#E2E8F0" />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>GCash Reference Number</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter 13-digit number"
                    value={referenceNumber}
                    onChangeText={setReferenceNumber}
                    keyboardType="number-pad"
                  />
                </View>

                <TouchableOpacity style={styles.imagePickerBtn} onPress={pickImage}>
                  {proofImage ? (
                    <Image source={{ uri: proofImage }} style={styles.previewImage} />
                  ) : (
                    <>
                      <IconSymbol name="camera.fill" size={32} color="#64748B" />
                      <Text style={styles.imagePickerText}>Select Receipt Image</Text>
                    </>
                  )}
                </TouchableOpacity>

                {submitError && (
                  <Text style={styles.modalErrorText}>{submitError}</Text>
                )}

                <TouchableOpacity 
                  style={[styles.submitBtn, submitting && styles.submitBtnDisabled]}
                  onPress={handleSubmitTransaction}
                  disabled={submitting}
                >
                  {submitting ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <Text style={styles.submitBtnText}>Submit Payment Proof</Text>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  scrollContent: {
    padding: 24,
  },
  statusBanner: {
    borderRadius: 32,
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  statusLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: 'rgba(255, 255, 255, 0.7)',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  statusValue: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFF',
    textTransform: 'uppercase',
    fontStyle: 'italic',
  },
  statusIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 32,
    padding: 24,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardHeader: {
    fontSize: 12,
    fontWeight: '900',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 16,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardLabel: {
    fontSize: 14,
    color: '#64748B',
  },
  cardValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  paymentBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
  },
  scanText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#94A3B8',
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  qrContainer: {
    width: 160,
    height: 160,
    backgroundColor: '#FFF',
    borderRadius: 24,
    borderWidth: 4,
    borderColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: '900',
    color: '#1E293B',
  },
  uploadBtn: {
    backgroundColor: '#7C3AED',
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 5,
  },
  uploadBtnText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14,
    textTransform: 'uppercase',
  },
  chatLink: {
    backgroundColor: '#FFF',
    borderRadius: 32,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  chatContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  chatIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  chatSub: {
    fontSize: 12,
    color: '#94A3B8',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    marginBottom: 16,
  },
  retryBtn: {
    backgroundColor: '#7C3AED',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryBtnText: {
    color: '#FFF',
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 24,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1E293B',
    textTransform: 'uppercase',
    fontStyle: 'italic',
  },
  modalBody: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  inputGroup: {
    width: '100%',
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 8,
    marginLeft: 12,
  },
  textInput: {
    width: '100%',
    height: 56,
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    paddingHorizontal: 20,
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  imagePickerBtn: {
    width: '100%',
    height: 200,
    backgroundColor: '#F8FAFC',
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    overflow: 'hidden',
  },
  imagePickerText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
    marginTop: 12,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  submitBtn: {
    width: '100%',
    height: 56,
    backgroundColor: '#7C3AED',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 5,
  },
  submitBtnDisabled: {
    opacity: 0.7,
    backgroundColor: '#9CA3AF',
  },
  submitBtnText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14,
    textTransform: 'uppercase',
  },
  modalErrorText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
});
