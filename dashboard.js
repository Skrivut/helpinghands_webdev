document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('tradeOffersContainer');
    if (!container) return;

    // Fetch items from backend API
    try {
        const response = await getAllItems();
        
        if (response.success && response.data.length > 0) {
            // Use the first 3 items as trade offers
            const tradeOffers = response.data.slice(0, 3).map(item => ({
                id: item.id,
                title: item.title,
                description: item.description,
                image: item.image_url,
                owner: {
                    id: item.owner_id,
                    name: item.full_name,
                    avatar: item.avatar_url
                }
            }));
            
            renderTradeOffers(tradeOffers);
        } else {
            console.error('Failed to fetch items from API:', response.error);
        }
    } catch (error) {
        console.error('Error fetching items:', error);
    }
});

function renderTradeOffers(tradeOffers) {
    const container = document.getElementById('tradeOffersContainer');
    if (!container) return;

    function createOfferCard(offer) {
        const card = document.createElement('article');
        card.className = 'trade-offer-card';

        const img = document.createElement('img');
        img.className = 'trade-offer-image';
        img.src = offer.image;
        img.alt = offer.title;
        card.appendChild(img);

        const body = document.createElement('div');
        body.className = 'trade-offer-body';

        const title = document.createElement('a');
        title.className = 'trade-offer-link trade-offer-title';
        title.href = `./page.html?id=${encodeURIComponent(offer.id)}`;
        title.textContent = offer.title;
        body.appendChild(title);

        const desc = document.createElement('p');
        desc.className = 'trade-offer-desc';
        desc.textContent = offer.description;
        body.appendChild(desc);

        const footer = document.createElement('div');
        footer.className = 'trade-offer-footer';

        const actionLink = document.createElement('a');
        actionLink.className = 'trade-action-link';
        actionLink.href = `./page.html?id=${encodeURIComponent(offer.id)}&trade=true`;
        actionLink.textContent = 'Open Offer';
        footer.appendChild(actionLink);

        body.appendChild(footer);
        card.appendChild(body);

        return card;
    }

    // Render all offers
    tradeOffers.forEach(offer => {
        const el = createOfferCard(offer);
        container.appendChild(el);
    });
}