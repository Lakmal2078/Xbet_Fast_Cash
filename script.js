// Centralized JavaScript for index.html
// Features:
// - Modal open/close (click, ESC, overlay click)
// - Copy to clipboard with toast feedback
// - Send deposit/withdraw messages via WhatsApp (validations)
// - File input name display
// - Promo code copy button

(function () {
    const phoneNumber = "94776763093"; // WhatsApp recipient (without +)
    const toastEl = document.getElementById('toast');

    // Utility: show toast
    function showToast(msg, timeout = 2200) {
        if (!toastEl) return;
        toastEl.textContent = msg;
        toastEl.style.display = 'block';
        setTimeout(() => {
            toastEl.style.display = 'none';
        }, timeout);
    }

    // Copy text with fallback and feedback
    async function copyText(text) {
        if (!text) return;
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(text);
            } else {
                // Fallback
                const ta = document.createElement('textarea');
                ta.value = text;
                document.body.appendChild(ta);
                ta.select();
                document.execCommand('copy');
                document.body.removeChild(ta);
            }
            showToast('Copied: ' + text);
        } catch (err) {
            alert('Copy failed: ' + text);
        }
    }

    // Modal handling
    function openModalById(id) {
        const modal = document.getElementById(id);
        if (!modal) return;
        modal.classList.add('show');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        // focus first input if exists
        const focusable = modal.querySelector('input, button, [tabindex]:not([tabindex="-1"])');
        if (focusable) focusable.focus();
    }
    function closeModalById(id) {
        const modal = document.getElementById(id);
        if (!modal) return;
        modal.classList.remove('show');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = 'auto';
    }

    // Close all modals (helper)
    function closeAllModals() {
        document.querySelectorAll('.modal-overlay.show').forEach(m => {
            m.classList.remove('show');
            m.setAttribute('aria-hidden', 'true');
        });
        document.body.style.overflow = 'auto';
    }

    // Setup open buttons (data-open attributes)
    document.querySelectorAll('[data-open]').forEach(btn => {
        const id = btn.getAttribute('data-open');
        btn.addEventListener('click', () => openModalById(id));
    });

    // Setup close buttons in modals
    document.querySelectorAll('.modal-content .close-btn').forEach(cb => {
        cb.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal-overlay');
            if (modal) closeModalById(modal.id);
        });
    });

    // Close when clicking overlay (but not when clicking inside content)
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeModalById(overlay.id);
        });
    });

    // ESC to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeAllModals();
    });

    // Promo copy button
    const promoBtn = document.getElementById('copyPromoBtn');
    if (promoBtn) {
        promoBtn.addEventListener('click', () => copyText('VGSL'));
    }

    // Copy buttons (bank numbers)
    document.querySelectorAll('.copy-btn[data-copy]').forEach(b => {
        const value = b.getAttribute('data-copy');
        b.addEventListener('click', () => copyText(value));
    });

    // Selected file name display
    const receiptFileInput = document.getElementById('receiptFile');
    const selectedFileName = document.getElementById('selectedFileName');
    if (receiptFileInput) {
        receiptFileInput.addEventListener('change', () => {
            const f = receiptFileInput.files && receiptFileInput.files[0];
            if (f) {
                selectedFileName.style.display = 'block';
                selectedFileName.textContent = 'Selected file: ' + f.name;
            } else {
                selectedFileName.style.display = 'none';
                selectedFileName.textContent = '';
            }
        });
    }

    // Send deposit message
    const depositBtn = document.getElementById('depositSendBtn');
    if (depositBtn) {
        depositBtn.addEventListener('click', () => {
            const id = document.getElementById('depID').value.trim();
            const amt = document.getElementById('depAmount').value.trim();
            if (!id || !amt) {
                alert('Fill all details!');
                return;
            }
            const msg = "🔵 *DEPOSIT REQUEST* 🔵\nID: " + id + "\nAmount: Rs. " + amt + "\n(I will send the receipt now)";
            const url = "https://wa.me/" + phoneNumber + "?text=" + encodeURIComponent(msg);
            window.open(url, '_blank');
        });
    }

    // Send withdraw message
    const withdrawBtn = document.getElementById('withdrawSendBtn');
    if (withdrawBtn) {
        withdrawBtn.addEventListener('click', () => {
            const id = document.getElementById('withID').value.trim();
            const sec = document.getElementById('withSec').value.trim();
            if (!id) {
                alert('Enter ID!');
                return;
            }
            const msg = "🔴 *WITHDRAW REQUEST* 🔴\nID: " + id + "\nSecurity: " + sec + "\n(මම මගේ බැංකු විස්තර දැන් එවන්නම්)";
            const url = "https://wa.me/" + phoneNumber + "?text=" + encodeURIComponent(msg);
            window.open(url, '_blank');
        });
    }

    // global click handler for any existing elements with onclick="copyText('...')" in HTML (backwards compatibility)
    window.copyText = copyText;

    // Improve overlay click handling in case old inline code used className compare
    window.onclick = function(event) {
        if (event.target.classList && event.target.classList.contains('modal-overlay')) {
            closeModalById(event.target.id);
        }
    };

    // Accessibility: trap focus inside modals when open (basic)
    document.addEventListener('focusin', (e) => {
        const openModal = document.querySelector('.modal-overlay.show');
        if (!openModal) return;
        if (!openModal.contains(e.target)) {
            // redirect focus to first focusable inside modal
            const focusable = openModal.querySelector('button, input, a, [tabindex]:not([tabindex="-1"])');
            if (focusable) focusable.focus();
        }
    });

})();