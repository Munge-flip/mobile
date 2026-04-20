<template>
    <div class="payment-section">
        <h2>Choose Payment Method</h2>

        <!-- QR SECTION -->
        <div class="payment-type">
            <h3>QR</h3>
            <div class="payment-options">
                <div class="payment-option">
                    <button 
                        type="button" 
                        :class="['service-btn', { 'selected': serviceStore.paymentMethod === 'gcash_qr' }]"
                        @click="serviceStore.paymentMethod = 'gcash_qr'"
                    >
                        <span>GCash</span>
                        <span class="price">Scan to Pay</span>
                    </button>
                </div>
                <div class="payment-option">
                    <button 
                        type="button" 
                        :class="['service-btn', { 'selected': serviceStore.paymentMethod === 'paypal_qr' }]"
                        @click="serviceStore.paymentMethod = 'paypal_qr'"
                    >
                        <span>PayPal</span>
                        <span class="price">Scan to Pay</span>
                    </button>
                </div>
            </div>
        </div>

        <!-- E-WALLET SECTION -->
        <div class="payment-type">
            <h3>E-wallet</h3>
            <div class="payment-options">
                <div class="payment-option">
                    <button 
                        type="button" 
                        :class="['service-btn', { 'selected': serviceStore.paymentMethod === 'gcash_wallet' }]"
                        @click="serviceStore.paymentMethod = 'gcash_wallet'"
                    >
                        <span>GCash</span>
                        <span class="price">Direct Pay</span>
                    </button>
                </div>
                <div class="payment-option">
                    <button 
                        type="button" 
                        :class="['service-btn', { 'selected': serviceStore.paymentMethod === 'paypal_wallet' }]"
                        @click="serviceStore.paymentMethod = 'paypal_wallet'"
                    >
                        <span>PayPal</span>
                        <span class="price">Direct Pay</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { serviceStore } from '../stores/serviceStore';
</script>

<style scoped>
/* Inheriting core styles from services.css for .payment-section, .payment-type, etc. */
.service-btn {
    width: 100%;
    /* Override flex for payment layout if needed, though services.css default is usually good */
}

.price {
    font-size: 12px !important;
    opacity: 0.8;
}
</style>
