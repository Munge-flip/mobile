document.addEventListener('DOMContentLoaded', function() {
    
    const payModal = document.getElementById('payModal');
    const btnPayNow = document.getElementById('btnPayNow');
    const closeModalBtns = document.querySelectorAll('.close-modal');

    if (btnPayNow) {
        btnPayNow.addEventListener('click', function(e) {
            e.preventDefault();
            if (payModal) {
                payModal.style.display = 'block';
            }
        });
    }

    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (payModal) {
                payModal.style.display = 'none';
            }
        });
    });

    window.onclick = function(event) {
        if (event.target == payModal) {
            payModal.style.display = "none";
        }
    }
});