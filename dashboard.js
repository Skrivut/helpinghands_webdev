document.addEventListener('DOMContentLoaded', () => {
    const tradeOffers = [
        {
            id: 't1',
            title: 'Handcrafted Oak Lantern',
            description: 'Small oak lantern with glass panels. Adds rustic charm to any room.',
            image: './images/oak_sign.png',
            owner: { id: 'sarah-johnson', name: 'Sarah J.', avatar: './images/obsidian.jpg' }
        },
        {
            id: 't2',
            title: 'Obsidian Display Piece',
            description: 'A glossy obsidian specimen ideal for collectors or display shelves.',
            image: './images/obsidian.jpg',
            owner: { id: 'mike-chen', name: 'Mike C.', avatar: './images/iron_chain.png' }
        },
        {
            id: 't3',
            title: 'Spruce Project Plank',
            description: 'Ready-to-use spruce plank for your next DIY or furniture project.',
            image: './images/spruce_plank.jpg',
            owner: { id: 'emily-rodriguez', name: 'Emily R.', avatar: './images/spruce_plank.jpg' }
        }
    ];

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
});
