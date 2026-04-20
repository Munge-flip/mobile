<x-layouts.admin>
    <section class="content">
        <div class="section-header">
            <h1>Transaction Details</h1>
            <a href="{{ route('admin.transactions') }}" class="action-link">
                ← Back to Transactions
            </a>
        </div>

        <admin-card>
            <template #header>
                <div>
                    <h3 style="margin: 0; font-size: 18px; color: #333;">Transaction #{{ $transaction->id }}</h3>
                    <span class="order-date">
                        {{ $transaction->created_at->format('M d, Y \a\t h:i A') }}
                    </span>
                </div>
            </template>
            <template #action>
                <status-badge status="{{ $transaction->status }}"></status-badge>
            </template>
        </admin-card>

        <admin-card title="Payment Information">
            <detail-row label="Amount" value="{{ $transaction->amount }}" :is-price="true"></detail-row>
            <detail-row label="Payment Method" value="{{ $transaction->payment_method }}" value-class="text-uppercase"></detail-row>
            <detail-row label="Transaction Reference" value="{{ $transaction->transaction_reference ?? 'N/A' }}"></detail-row>
            <detail-row label="Payment Date" value="{{ $transaction->paid_at?->format('M d, Y h:i A') ?? 'N/A' }}"></detail-row>
            <detail-row label="Related Order">
                <a href="{{ route('admin.order.show', $transaction->order_id) }}" 
                   style="color: #667eea; text-decoration: underline;">
                    Order #{{ $transaction->order_id }}
                </a>
            </detail-row>
            <detail-row label="Customer" value="{{ $transaction->user->name }}"></detail-row>
        </admin-card>

        @if($transaction->payment_proof)
        <admin-card title="Payment Proof">
            <img src="{{ asset('storage/' . $transaction->payment_proof) }}" 
                 alt="Payment Proof" 
                 style="max-width: 100%; border-radius: 10px; border: 2px solid #e0e0e0;">
            <div style="margin-top: 15px;">
                <a href="{{ route('admin.transactions.download-proof', $transaction->id) }}" 
                   class="btn-secondary">
                    Download Proof
                </a>
            </div>
        </admin-card>
        @endif

        @if($transaction->status === 'pending')
        <admin-card title="Verify Transaction">
            <form action="{{ route('admin.transactions.verify', $transaction->id) }}" method="POST">
                @csrf
                @method('PATCH')

                <div class="form-group">
                    <label>Decision</label>
                    <select name="status" required class="search-input" style="width: 100%;">
                        <option value="">Select Action</option>
                        <option value="verified">Approve Payment</option>
                        <option value="rejected">Reject Payment</option>
                    </select>
                </div>

                <div class="form-group">
                    <label>Admin Notes (Optional)</label>
                    <textarea name="admin_notes" rows="3" class="search-input" 
                              style="width: 100%; resize: vertical;"
                              placeholder="Add any notes about this verification..."></textarea>
                </div>

                <div class="modal-actions">
                    <button type="submit" class="btn-primary">Submit Verification</button>
                </div>
            </form>
        </admin-card>
        @else
        <admin-card title="Verification Details">
            <detail-row label="Verified By" value="{{ $transaction->verifiedBy->name ?? 'N/A' }}"></detail-row>
            <detail-row label="Verified At" value="{{ $transaction->verified_at?->format('M d, Y h:i A') ?? 'N/A' }}"></detail-row>
            
            @if($transaction->admin_notes)
            <detail-row label="Admin Notes">
                <p style="margin-top: 5px; color: #666;">{{ $transaction->admin_notes }}</p>
            </detail-row>
            @endif
        </admin-card>
        @endif
    </section>
</x-layouts.admin>