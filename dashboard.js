// dashboard.js - Load dynamic items from database

// Add this at the very top of dashboard.js temporarily
console.log('Attempting to fetch items...');

fetch('get_dashboard_items.php')
    .then(response => {
        console.log('Response status:', response.status);
        return response.text(); // Get raw response first
    })
    .then(text => {
        console.log('Raw response:', text);
        try {
            const data = JSON.parse(text);
            console.log('Parsed data:', data);
        } catch(e) {
            console.error('JSON parse error:', e);
        }
    });
    
document.addEventListener('DOMContentLoaded', function() {
    loadAvailableItems();
    loadTradeOffers();
});

function loadAvailableItems() {
    const grid = document.querySelector('.dashboard-grid');
    
    fetch('get_dashboard_items.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayItems(data.items, grid);
            } else {
                showError(grid, data.message || 'Failed to load items');
            }
        })
        .catch(error => {
            console.error('Error loading items:', error);
            showError(grid, 'Failed to load items. Please try again.');
        });
}

function displayItems(items, container) {
    if (items.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="uil uil-shopping-cart-alt" style="font-size: 3rem; color: #bdc3c7;"></i>
                <p class="mt-3">No items available yet. Be the first to list an item!</p>
            </div>
        `;
        return;
    }

    container.innerHTML = items.map(item => `
        <a href="./page.html?id=${item.id}" class="item-card item-card-link">
            <div class="item-image-container">
                <img
                    src="${item.image_path || './images/placeholder.jpg'}"
                    alt="${escapeHtml(item.item_name)}"
                    class="item-image"
                    onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'"
                />
            </div>
            <div class="item-content">
                <h3 class="item-name">${escapeHtml(item.item_name)}</h3>
                <p class="item-description">
                    ${escapeHtml(item.description || 'No description available')}
                </p>
                <div class="item-meta">
                    <span class="item-condition">${escapeHtml(item.item_condition)}</span>
                    <span class="item-category">${escapeHtml(item.category)}</span>
                </div>
                <div class="item-owner" style="margin-top: 10px; font-size: 0.9rem; color: #7f8c8d;">
                    <i class="uil uil-user"></i> Listed by: <strong>${escapeHtml(item.owner_name)}</strong>
                </div>
            </div>
        </a>
    `).join('');
}

function loadTradeOffers() {
    const container = document.getElementById('tradeOffersContainer');
    
    fetch('get_trade_offers.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayTradeOffers(data.offers, container);
            } else {
                showError(container, data.message || 'Failed to load trade offers');
            }
        })
        .catch(error => {
            console.error('Error loading trade offers:', error);
            showError(container, 'Failed to load trade offers. Please try again.');
        });
}

function displayTradeOffers(offers, container) {
    if (offers.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="uil uil-exchange-alt" style="font-size: 3rem; color: #bdc3c7;"></i>
                <p class="mt-3">No trade offers yet.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = offers.map(offer => `
        <div class="trade-offer-card">
            <div class="offer-header">
                <h4>${escapeHtml(offer.item_name)}</h4>
                <span class="offer-status status-${offer.status}">${escapeHtml(offer.status)}</span>
            </div>
            <p class="offer-description">${escapeHtml(offer.offer_message || 'No message')}</p>
            <div class="offer-meta">
                <span><i class="uil uil-user"></i> From: ${escapeHtml(offer.offerer_name)}</span>
                <span><i class="uil uil-dollar-alt"></i> $${parseFloat(offer.offer_amount).toFixed(2)}</span>
            </div>
            <div class="offer-actions">
                <button class="btn btn-success btn-sm" onclick="handleOffer(${offer.id}, 'accept')">
                    <i class="uil uil-check"></i> Accept
                </button>
                <button class="btn btn-danger btn-sm" onclick="handleOffer(${offer.id}, 'reject')">
                    <i class="uil uil-times"></i> Reject
                </button>
            </div>
        </div>
    `).join('');
}

function handleOffer(offerId, action) {
    if (!confirm(`Are you sure you want to ${action} this offer?`)) {
        return;
    }

    fetch('handle_offer.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            offer_id: offerId,
            action: action
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(`Offer ${action}ed successfully!`);
            loadTradeOffers(); // Reload offers
        } else {
            alert(data.message || `Failed to ${action} offer`);
        }
    })
    .catch(error => {
        console.error('Error handling offer:', error);
        alert(`Failed to ${action} offer. Please try again.`);
    });
}

function showError(container, message) {
    container.innerHTML = `
        <div class="col-12 text-center py-5">
            <i class="uil uil-exclamation-triangle" style="font-size: 3rem; color: #e74c3c;"></i>
            <p class="mt-3 text-danger">${escapeHtml(message)}</p>
            <button class="btn btn-primary mt-3" onclick="location.reload()">
                <i class="uil uil-refresh"></i> Retry
            </button>
        </div>
    `;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}