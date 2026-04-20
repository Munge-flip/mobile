<div class="payment-section">
    <h2>Choose Payment Method</h2>

    <div class="payment-type">
        <h3>QR / E-Wallet</h3>
        <div class="payment-options">
            <div class="payment-option">
                <input type="radio" id="gcash" name="payment-method" value="gcash">
                <label for="gcash" class="payment-card">
                    <strong>GCash</strong>
                    <span style="font-size: 12px; color: #666;">Scan to Pay</span>
                </label>
            </div>
            <div class="payment-option">
                <input type="radio" id="paypal" name="payment-method" value="paypal">
                <label for="paypal" class="payment-card">
                    <strong>PayPal</strong>
                    <span style="font-size: 12px; color: #666;">Redirect to Pay</span>
                </label>
            </div>
        </div>
    </div>
</div>

<div id="qrModal" class="modal" style="display: none;">
    <div class="modal-content" style="text-align: center;">
        <div class="modal-header">
            <h2>Proceed with Payment</h2>
            <span class="close-modal" style="cursor: pointer;">&times;</span>
        </div>
        <div class="modal-body" style="padding: 30px;">
            <p style="margin-bottom: 20px;">
                You are about to place an order for <strong id="qrAmount">₱0.00</strong> via <strong id="qrMethod"></strong>.
            </p>
            
            <p style="margin-bottom: 20px; font-size: 14px; color: #666;">
                After placing the order, you will be redirected to the <strong>Order Details</strong> page where you can scan the QR code and upload your proof of payment.
            </p>

            <div style="display: flex; gap: 10px; justify-content: center; margin-top: 10px;">
                <button type="button" class="btn-secondary close-modal" style="flex: 1;">Cancel</button>
                <button type="button" class="btn-primary" id="btnConfirmOrder" style="flex: 1;">Place Order</button>
            </div>
        </div>
    </div>
</div>