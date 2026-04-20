document.addEventListener('DOMContentLoaded', function() {
    
    const selectedServices = {
        maintenance: null,
        quests: null,
        events: null,
        endgame: null,
        waypoints: null,
        chest: null,
        oculi: null,
        completion: null,
        'hollow-zero': null,
        'simulated-clear': null,
        divergent: null,
        explorations: [],      
        'hollow-modes': [],    
        worlds: []            
    };

    // Categories that should be multiplied by region/world/mode count
    const multiplierCategories = ['waypoints', 'chest', 'oculi', 'completion', 'simulated-clear', 'divergent', 'hollow-zero'];

    const serviceButtons = document.querySelectorAll('.service-btn');
    const explorationCards = document.querySelectorAll('.exploration-card');
    const modeCards = document.querySelectorAll('.mode-card');
    const worldCards = document.querySelectorAll('.world-card');
    
    const form = document.getElementById('serviceForm');
    const totalPriceElement = document.getElementById('totalPrice');
    const selectedServicesElement = document.getElementById('selectedServices');
    const submitBtn = document.querySelector('.submit-btn'); 

    const qrModal = document.getElementById('qrModal');
    const closeModalBtn = document.querySelector('.close-modal');
    // const confirmPaymentBtn = document.querySelector('#qrModal .btn-primary'); 
    const btnConfirmOrder = document.getElementById('btnConfirmOrder');
    const qrAmountText = document.getElementById('qrAmount');
    const qrMethodText = document.getElementById('qrMethod');
    
    const inputCategory = document.querySelector('input[name="service_category"]');
    const inputService = document.querySelector('input[name="service_type"]');
    const inputPrice = document.querySelector('input[name="price"]');
    const inputPayment = document.querySelector('input[name="payment_method"]');

    serviceButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.dataset.category;
            const service = this.dataset.service;
            const price = parseInt(this.dataset.price);
            const label = this.querySelector('span').textContent;

            const categoryButtons = document.querySelectorAll(`[data-category="${category}"]`);
            
            if (this.classList.contains('selected')) {
                this.classList.remove('selected');
                selectedServices[category] = null;
            } else {
                categoryButtons.forEach(btn => btn.classList.remove('selected'));
                this.classList.add('selected');
                selectedServices[category] = { name: label, price: price, id: service };
            }
            updateOrderSummary();
        });
    });

    explorationCards.forEach(card => {
        card.addEventListener('click', function() {
            this.classList.toggle('selected');
            const regionName = this.querySelector('h4').textContent.trim();

            if (this.classList.contains('selected')) {
                if (!selectedServices.explorations.includes(regionName)) selectedServices.explorations.push(regionName);
            } else {
                selectedServices.explorations = selectedServices.explorations.filter(item => item !== regionName);
            }
            updateOrderSummary();
        });
    });

    modeCards.forEach(card => {
        card.addEventListener('click', function() {
            this.classList.toggle('selected');
            const modeName = this.querySelector('.mode-label').textContent.trim();

            if (this.classList.contains('selected')) {
                if (!selectedServices['hollow-modes'].includes(modeName)) selectedServices['hollow-modes'].push(modeName);
            } else {
                selectedServices['hollow-modes'] = selectedServices['hollow-modes'].filter(item => item !== modeName);
            }
            updateOrderSummary();
        });
    });

    worldCards.forEach(card => {
        card.addEventListener('click', function() {
            this.classList.toggle('selected');
            const worldName = this.querySelector('.world-label').textContent.trim();

            if (this.classList.contains('selected')) {
                if (!selectedServices.worlds.includes(worldName)) selectedServices.worlds.push(worldName);
            } else {
                selectedServices.worlds = selectedServices.worlds.filter(item => item !== worldName);
            }
            updateOrderSummary();
        });
    });

    function updateOrderSummary() {
        let total = 0;
        let summaryHTML = '';

        const regionCount = selectedServices.explorations.length || 1;
        const worldCount = selectedServices.worlds.length || 1;
        const modeCount = selectedServices['hollow-modes'].length || 1;

        Object.keys(selectedServices).forEach(category => {
            if (category !== 'explorations' && category !== 'hollow-modes' && category !== 'worlds') {
                if (selectedServices[category]) {
                    const service = selectedServices[category];
                    let servicePrice = service.price;
                    let multiplier = 1;

                    if (multiplierCategories.includes(category)) {
                        if (category === 'simulated-clear' && selectedServices.worlds.length > 0) {
                            multiplier = worldCount;
                        } else if (category === 'hollow-zero' && selectedServices['hollow-modes'].length > 0) {
                            multiplier = modeCount;
                        } else if (selectedServices.explorations.length > 0) {
                            multiplier = regionCount;
                        }
                    }

                    const finalPrice = servicePrice * multiplier;
                    total += finalPrice;

                    const priceDisplay = multiplier > 1 
                        ? `₱${servicePrice} × ${multiplier} = ₱${finalPrice}`
                        : `₱${finalPrice}`;

                    summaryHTML += `
                        <div class="selected-item">
                            <span>${service.name}</span>
                            <span>${priceDisplay}</span>
                        </div>
                    `;
                }
            }
        });

        if (selectedServices.explorations.length > 0) {
            summaryHTML += `<div class="selected-item" style="background: #f0f0f0; padding: 10px; border-radius: 8px; margin-top: 10px;"><span style="font-weight: 600;">Regions:</span><span>${selectedServices.explorations.join(', ')}</span></div>`;
        }
        if (selectedServices['hollow-modes'].length > 0) {
            summaryHTML += `<div class="selected-item" style="background: #f0f0f0; padding: 10px; border-radius: 8px; margin-top: 10px;"><span style="font-weight: 600;">Modes:</span><span>${selectedServices['hollow-modes'].join(', ')}</span></div>`;
        }
        if (selectedServices.worlds.length > 0) {
            summaryHTML += `<div class="selected-item" style="background: #f0f0f0; padding: 10px; border-radius: 8px; margin-top: 10px;"><span style="font-weight: 600;">Worlds:</span><span>${selectedServices.worlds.join(', ')}</span></div>`;
        }

        selectedServicesElement.innerHTML = summaryHTML || '<p style="color: #888; font-style: italic;">No services selected</p>';
        totalPriceElement.textContent = total.toLocaleString();

        updateHiddenInputs(total);
    }

    function updateHiddenInputs(total) {
        const categories = Object.keys(selectedServices).filter(k => !['explorations', 'hollow-modes', 'worlds'].includes(k)).filter(k => selectedServices[k] !== null).join(', ');
        if (inputCategory) inputCategory.value = categories;

        const serviceNames = Object.keys(selectedServices).filter(k => !['explorations', 'hollow-modes', 'worlds'].includes(k)).filter(k => selectedServices[k] !== null).map(k => selectedServices[k].name);
        const allCardSelections = [...selectedServices.explorations, ...selectedServices['hollow-modes'], ...selectedServices.worlds];
        
        let fullService = serviceNames.join(', ');
        if (allCardSelections.length > 0) fullService += " (" + allCardSelections.join(', ') + ")";
        
        if (inputService) inputService.value = fullService;
        if (inputPrice) inputPrice.value = total;
    }

    const paymentRadios = document.querySelectorAll('input[name="payment-method"]');
    paymentRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (inputPayment) inputPayment.value = this.value;
            document.querySelectorAll('.payment-input').forEach(input => {
                input.disabled = true;
                input.style.opacity = '0.5';
            });
            const selectedInput = this.parentElement.querySelector('.payment-input');
            if (selectedInput) {
                selectedInput.disabled = false;
                selectedInput.style.opacity = '1';
                selectedInput.focus();
            }
        });
    });
    document.querySelectorAll('.payment-input').forEach(input => { input.disabled = true; input.style.opacity = '0.5'; });

    const hiddenStatusInput = document.getElementById('finalPaymentStatus');
    // 1. UPDATED SUBMIT BUTTON LOGIC
    if (submitBtn) {
        submitBtn.addEventListener('click', function(e) {
            e.preventDefault();

            let hasSelection = false;
            Object.keys(selectedServices).forEach(category => {
                if (!['explorations', 'hollow-modes', 'worlds'].includes(category) && selectedServices[category]) {
                    hasSelection = true;
                }
            });

            if (!hasSelection) {
                alert('Please select at least one service!');
                return;
            }

            if (!inputPayment.value) {
                alert('Please select a payment method!');
                return;
            }
            
            const paymentMethod = document.querySelector('input[name="payment-method"]:checked');
            const paymentInput = paymentMethod ? paymentMethod.parentElement.querySelector('.payment-input') : null;
            if (paymentInput && !paymentInput.value.trim()) {
                alert('Please fill in your payment details!');
                return;
            }

            const isQrMethod = inputPayment.value.includes('gcash') || inputPayment.value.includes('paypal'); 

            if (isQrMethod) {
                if (qrAmountText) qrAmountText.textContent = '₱' + totalPriceElement.textContent;
                // Display the selected payment method in the modal text
                if (qrMethodText) qrMethodText.textContent = inputPayment.value.toUpperCase();
                if (qrModal) qrModal.style.display = 'block';
            } else {
                form.submit();
            }
        });
    }

    // 2. NEW "PLACE ORDER" CONFIRMATION BUTTON
    if (btnConfirmOrder) {
        btnConfirmOrder.addEventListener('click', function() {
            form.submit();
        });
    }

    // 3. MODAL CLOSING LOGIC (Keep this)
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', function() {
            qrModal.style.display = 'none';
        });
    }

    window.onclick = function(event) {
        if (event.target == qrModal) {
            qrModal.style.display = "none";
        }
    }

    const btnPaid = document.getElementById('btnPaid');
    if (btnPaid) {
        btnPaid.addEventListener('click', function() {
            if(hiddenStatusInput) hiddenStatusInput.value = 'paid';
            form.submit();
        });
    }

    const btnPayLater = document.getElementById('btnPayLater');
    if (btnPayLater) {
        btnPayLater.addEventListener('click', function() {
            if(hiddenStatusInput) hiddenStatusInput.value = 'unpaid';
            form.submit();
        });
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', function() {
            qrModal.style.display = 'none';
        });
    }

    window.onclick = function(event) {
        if (event.target == qrModal) {
            qrModal.style.display = "none";
        }
    }

    if (confirmPaymentBtn) {
        confirmPaymentBtn.addEventListener('click', function() {
            form.submit();
        });
    }

    updateOrderSummary();
});