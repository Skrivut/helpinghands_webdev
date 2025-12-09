document.addEventListener('DOMContentLoaded', async () => {
    // Load all items for the main dashboard grid
    await loadAllItems();
    
    // Load recent trade offers
    await loadTradeOffers();
});

async function loadAllItems() {
    const dashboardGrid = document.querySelector('.dashboard-grid');
    if (!dashboardGrid) return;

    try {
        const response = await getAllItems();
        
        if (response.success && response.data.length > 0) {
            // Clear placeholder items
            dashboardGrid.innerHTML = '';
            
            // Render all items
            response.data.forEach(item => {
                const itemCard = createItemCard(item);
                dashboardGrid.appendChild(itemCard);
            });
        } else {
            dashboardGrid.innerHTML = '<p class="text-center col-12">No items available at the moment.</p>';
            console.error('Failed to fetch items:', response.error);
        }
    } catch (error) {
        console.error('Error loading items:', error);
        dashboardGrid.innerHTML = '<p class="text-center col-12">Error loading items. Please try again later.</p>';
    }
}

function createItemCard(item) {
    const card = document.createElement('a');
    card.href = `./page.html?id=${encodeURIComponent(item.id)}`;
    card.className = 'item-card item-card-link';
    
    // Image container
    const imageContainer = document.createElement('div');
    imageContainer.className = 'item-image-container';
    
    const img = document.createElement('img');
    img.src = item.image_path || './images/placeholder.png';
    img.alt = item.item_name;
    img.className = 'item-image';
    img.onerror = function() {
        this.src = './images/placeholder.png';
    };
    imageContainer.appendChild(img);
    
    // Content container
    const content = document.createElement('div');
    content.className = 'item-content';
    
    const name = document.createElement('h3');
    name.className = 'item-name';
    name.textContent = item.item_name;
    
    const description = document.createElement('p');
    description.className = 'item-description';
    description.textContent = item.description || 'No description available';
    
    // Meta information
    const meta = document.createElement('div');
    meta.className = 'item-meta';
    
    const condition = document.createElement('span');
    condition.className = 'item-condition';
    condition.textContent = formatCondition(item.item_condition);
    
    const category = document.createElement('span');
    category.className = 'item-category';
    category.textContent = item.category || 'General';
    
    meta.appendChild(condition);
    meta.appendChild(category);
    
    content.appendChild(name);
    content.appendChild(description);
    content.appendChild(meta);
    
    card.appendChild(imageContainer);
    card.appendChild(content);
    
    return card;
}

function formatCondition(condition) {
    if (!condition) return 'Good Condition';
    
    // Convert condition to proper case
    return condition
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

async function loadTradeOffers() {
    const container = document.getElementById('tradeOffersContainer');
    if (!container) return;

    try {
        const response = await getAllItems();
        
        if (response.success && response.data.length > 0) {
            // Get the most recent 3 items as trade offers
            const recentItems = response.data
                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                .slice(0, 3);
            
            // Clear container
            container.innerHTML = '';
            
            // Render trade offers
            recentItems.forEach(item => {
                const offerCard = createOfferCard(item);
                container.appendChild(offerCard);
            });
        } else {
            container.innerHTML = '<p class="text-center col-12">No recent trade offers available.</p>';
        }
    } catch (error) {
        console.error('Error fetching trade offers:', error);
        container.innerHTML = '<p class="text-center col-12">Error loading trade offers.</p>';
    }
}

function createOfferCard(item) {
    const card = document.createElement('article');
    card.className = 'trade-offer-card';

    const img = document.createElement('img');
    img.className = 'trade-offer-image';
    img.src = item.image_path || './images/placeholder.png';
    img.alt = item.item_name;
    img.onerror = function() {
        this.src = './images/placeholder.png';
    };
    card.appendChild(img);

    const body = document.createElement('div');
    body.className = 'trade-offer-body';

    const title = document.createElement('a');
    title.className = 'trade-offer-link trade-offer-title';
    title.href = `./page.html?id=${encodeURIComponent(item.id)}`;
    title.textContent = item.item_name;
    body.appendChild(title);

    const desc = document.createElement('p');
    desc.className = 'trade-offer-desc';
    desc.textContent = item.description || 'No description available';
    body.appendChild(desc);

    const footer = document.createElement('div');
    footer.className = 'trade-offer-footer';

    const ownerInfo = document.createElement('span');
    ownerInfo.className = 'offer-owner';
    ownerInfo.textContent = `Posted by User #${item.user_id}`;
    footer.appendChild(ownerInfo);

    const actionLink = document.createElement('a');
    actionLink.className = 'trade-action-link';
    actionLink.href = `./page.html?id=${encodeURIComponent(item.id)}&trade=true`;
    actionLink.textContent = 'Open Offer';
    footer.appendChild(actionLink);

    body.appendChild(footer);
    card.appendChild(body);

    return card;
}