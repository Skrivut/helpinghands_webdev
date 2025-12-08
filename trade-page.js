// User's items database
const userItems = [
  {
    id: 'user-item-1',
    name: 'Wooden Chair',
    image: './images/oak_sign.png',
    condition: 'Good Condition'
  },
  {
    id: 'user-item-2',
    name: 'Blue Vase',
    image: './images/obsidian.jpg',
    condition: 'Excellent'
  },
  {
    id: 'user-item-3',
    name: 'Garden Tools Set',
    image: './images/iron_chain.png',
    condition: 'Like New'
  },
  {
    id: 'user-item-4',
    name: 'Vintage Books',
    image: './images/spruce_plank.jpg',
    condition: 'Good Condition'
  }
];

// Items data (same as in page.js)
const itemsData = {
  'oak-sign': {
    title: 'Oak Sign',
    image: './images/oak_sign.png',
    condition: 'Good Condition',
    category: 'Home Decor',
    description: 'A beautiful handcrafted oak sign. Perfect for decorating your home or garden. Made from sustainable oak wood with a natural finish.'
  },
  'obsidian': {
    title: 'Obsidian Stone',
    image: './images/obsidian.jpg',
    condition: 'Excellent',
    category: 'Collectibles',
    description: 'A stunning natural obsidian stone. Perfect for collectors or those interested in minerals and geological specimens. Great for display.'
  },
  'spruce-plank': {
    title: 'Spruce Plank',
    image: './images/spruce_plank.jpg',
    condition: 'Like New',
    category: 'Building Materials',
    description: 'High-quality spruce wood plank. Suitable for woodworking projects, furniture building, or construction. Treated and ready to use.'
  },
  'stone-brick': {
    title: 'Stone Brick',
    image: './images/stone-brick.png',
    condition: 'Good Condition',
    category: 'Construction',
    description: 'Premium stone brick for landscaping and construction projects. Durable and weather-resistant. Perfect for garden pathways or decorative walls.'
  },
  'iron-chain': {
    title: 'Iron Chain',
    image: './images/iron_chain.png',
    condition: 'Excellent',
    category: 'Hardware',
    description: 'Heavy-duty iron chain. Great for securing items, decorative purposes, or as a pet restraint. Rust-resistant coating applied.'
  },
  'collectible-figurine': {
    title: 'Collectible Figurine',
    image: './images/wandering_trader.gif',
    condition: 'Mint Condition',
    category: 'Collectibles',
    description: 'A rare collectible figurine with excellent detail and craftsmanship. Perfect for enthusiasts and collectors. Comes with original packaging.'
  }
};

let selectedItems = [];

// Get item ID from URL
function getItemIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

// Load and display the item being traded for
function loadTradingItem() {
  const itemId = getItemIdFromURL();
  
  if (!itemId || !itemsData[itemId]) {
    document.querySelector('.trade-container').innerHTML = '<h2>Item not found</h2>';
    return;
  }

  const item = itemsData[itemId];

  // Set trading item details
  document.getElementById('tradingItemImage').src = item.image;
  document.getElementById('tradingItemImage').alt = item.title;
  document.getElementById('tradingItemName').textContent = item.title;
  document.getElementById('tradingItemDescription').textContent = item.description;
  document.getElementById('tradingItemCondition').textContent = item.condition;
  document.getElementById('tradingItemCategory').textContent = item.category;
  document.getElementById('tradeSummaryItem').textContent = item.title;

  // Update back link
  document.getElementById('backLink').href = `./page.html?id=${itemId}`;

  // Set page title
  document.title = `Trade for ${item.title} - Helping Hands`;
}

// Load user's items
function loadUserItems() {
  const container = document.getElementById('yourItemsContainer');
  container.innerHTML = '';

  userItems.forEach((item) => {
    const itemCard = document.createElement('div');
    itemCard.className = 'your-item-card';
    itemCard.innerHTML = `
      <img src="${item.image}" alt="${item.name}" class="your-item-image" />
      <div class="your-item-info">
        <div class="your-item-name">${item.name}</div>
        <div class="your-item-condition">${item.condition}</div>
      </div>
      <input type="checkbox" class="your-item-checkbox" data-id="${item.id}" />
    `;

    itemCard.addEventListener('click', function(e) {
      if (e.target.tagName !== 'INPUT') {
        const checkbox = itemCard.querySelector('input[type="checkbox"]');
        checkbox.checked = !checkbox.checked;
        updateItemSelection(item.id, checkbox.checked);
      } else {
        updateItemSelection(item.id, e.target.checked);
      }
    });

    itemCard.querySelector('input[type="checkbox"]').addEventListener('change', function(e) {
      updateItemSelection(item.id, e.target.checked);
    });

    container.appendChild(itemCard);
  });
}

// Update selected items
function updateItemSelection(itemId, isChecked) {
  const index = selectedItems.indexOf(itemId);
  
  if (isChecked && index === -1) {
    selectedItems.push(itemId);
  } else if (!isChecked && index > -1) {
    selectedItems.splice(index, 1);
  }

  // Update card styling
  const cards = document.querySelectorAll('.your-item-card');
  cards.forEach(card => {
    const checkbox = card.querySelector('input[type="checkbox"]');
    if (checkbox.checked) {
      card.classList.add('selected');
    } else {
      card.classList.remove('selected');
    }
  });

  updateTradeList();
}

// Update trade summary list
function updateTradeList() {
  const tradeList = document.getElementById('yourItemsList');
  
  if (selectedItems.length === 0) {
    tradeList.innerHTML = '<li>No items selected</li>';
    return;
  }

  tradeList.innerHTML = '';
  selectedItems.forEach(itemId => {
    const item = userItems.find(i => i.id === itemId);
    if (item) {
      const li = document.createElement('li');
      li.textContent = item.name;
      tradeList.appendChild(li);
    }
  });
}

// Submit trade proposal
function submitTradeProposal() {
  if (selectedItems.length === 0) {
    alert('Please select at least one item to trade.');
    return;
  }

  if (!document.getElementById('agreementCheckbox').checked) {
    alert('Please agree to the trade terms and conditions.');
    return;
  }

  const itemId = getItemIdFromURL();
  const item = itemsData[itemId];
  const message = document.getElementById('tradeMessage').value;

  const selectedItemNames = selectedItems.map(id => {
    const item = userItems.find(i => i.id === id);
    return item ? item.name : '';
  }).join(', ');

  const tradeDetails = `
Trade Proposal Submitted!

You're proposing to trade:
${selectedItemNames}

For:
${item.title}

Message:
${message || '(No message provided)'}

The owner will review your proposal and respond within 24-48 hours.
  `;

  alert(tradeDetails);

  // Reset form
  document.getElementById('tradeMessage').value = '';
  document.getElementById('agreementCheckbox').checked = false;
  document.querySelectorAll('input[type="checkbox"].your-item-checkbox').forEach(checkbox => {
    checkbox.checked = false;
  });
  selectedItems = [];
  loadUserItems();
  updateTradeList();
}

// Cancel trade
function cancelTrade() {
  const itemId = getItemIdFromURL();
  window.location.href = `./page.html?id=${itemId}`;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  loadTradingItem();
  loadUserItems();
  
  // Setup button event listeners
  document.getElementById('submitTradeBtn').addEventListener('click', submitTradeProposal);
  document.getElementById('cancelTradeBtn').addEventListener('click', cancelTrade);
  document.getElementById('addItemBtn').addEventListener('click', function() {
    alert('This feature will allow you to add more items from your inventory.');
  });
});
