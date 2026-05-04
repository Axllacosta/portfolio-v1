let lastFocusedElement: HTMLElement | null = null;

const focusableSelectors =
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

function openModal(modal: HTMLElement) {
    lastFocusedElement = document.activeElement as HTMLElement;

    modal.classList.remove('hidden');
    modal.classList.add('flex');

    document.body.classList.add('modal-open');

    const overlay = modal.querySelector('[data-overlay]') as HTMLElement;
    if (overlay) {
        overlay.classList.add('active');
    }

    const modalContent = modal.querySelector(
        '[data-modal-content]'
    ) as HTMLElement;
    if (modalContent) {
        setTimeout(() => {
            modalContent.focus();
        }, 100);
    }

    trapFocus(modal);
}

function closeModal(modal: HTMLElement) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');

    document.body.classList.remove('modal-open');

    const overlay = modal.querySelector('[data-overlay]') as HTMLElement;
    if (overlay) {
        overlay.classList.remove('active');
    }

    if (lastFocusedElement) {
        lastFocusedElement.focus();
        lastFocusedElement = null;
    }
}

function trapFocus(modal: HTMLElement) {
    const focusableElements = Array.from(
        modal.querySelectorAll<HTMLElement>(focusableSelectors)
    );

    if (focusableElements.length === 0) return;

    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    function handleKeyDown(e: KeyboardEvent) {
        if (e.key === 'Escape') {
            closeModal(modal);
            return;
        }

        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstFocusable) {
                    e.preventDefault();
                    lastFocusable.focus();
                }
            } else {
                if (document.activeElement === lastFocusable) {
                    e.preventDefault();
                    firstFocusable.focus();
                }
            }
        }
    }

    modal.addEventListener('keydown', handleKeyDown);

    const observer = new MutationObserver(() => {
        if (modal.classList.contains('hidden')) {
            modal.removeEventListener('keydown', handleKeyDown);
            observer.disconnect();
        }
    });

    observer.observe(modal, { attributes: true, attributeFilter: ['class'] });
}

// Open modal when clicking project buttons
document.addEventListener('click', (e) => {
    const button = (e.target as HTMLElement).closest(
        '[data-project]'
    ) as HTMLElement;

    if (!button) return;

    const modalId = button.getAttribute('data-project');
    if (!modalId) return;

    const modal = document.getElementById(`${modalId}-modal`) as HTMLElement;
    if (modal) {
        openModal(modal);
    }
});

// Close modal when clicking close buttons
document.addEventListener('click', (e) => {
    const closeButton = (e.target as HTMLElement).closest(
        '[data-close-modal]'
    ) as HTMLElement;

    if (!closeButton) return;

    const modal = closeButton.closest('[data-modal]') as HTMLElement;
    if (modal) {
        closeModal(modal);
    }
});

// Close modal when clicking overlay
document.addEventListener('click', (e) => {
    const overlay = (e.target as HTMLElement).closest('[data-overlay]');

    if (!overlay) return;

    const modal = overlay.closest('[data-modal]') as HTMLElement;
    if (modal) {
        closeModal(modal);
    }
});