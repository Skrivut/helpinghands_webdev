// Item data
const itemsData = {
  'oak-sign': {
    title: 'Oak Sign',
    image: './images/oak_sign.png',
    condition: 'Good Condition',
    category: 'Home Decor',
    owner: { id: 'sarah-johnson', name: 'Sarah Johnson', avatar: './images/obsidian.jpg' },
    description: 'A beautiful handcrafted oak sign. Perfect for decorating your home or garden. Made from sustainable oak wood with a natural finish. This sign has been gently used and maintained in excellent condition. The wood grain is still vibrant, and the construction is sturdy and durable. Great for outdoor or indoor use.',
    date: '2024-12-01'
  },
  'obsidian': {
    title: 'Obsidian Stone',
    image: './images/obsidian.jpg',
    condition: 'Excellent',
    category: 'Collectibles',
    owner: { id: 'mike-chen', name: 'Mike Chen', avatar: './images/iron_chain.png' },
    description: 'A stunning natural obsidian stone. Perfect for collectors or those interested in minerals and geological specimens. Great for display. This high-quality obsidian features natural volcanic glass formation with beautiful dark luster. It comes with information about its geological origin and properties. A wonderful addition to any mineral collection or as a decorative piece.',
    date: '2024-11-28'
  },
  'spruce-plank': {
    title: 'Spruce Plank',
    image: './images/spruce_plank.jpg',
    condition: 'Like New',
    category: 'Building Materials',
    owner: { id: 'emily-rodriguez', name: 'Emily Rodriguez', avatar: './images/spruce_plank.jpg' },
    description: 'High-quality spruce wood plank. Suitable for woodworking projects, furniture building, or construction. Treated and ready to use. This plank has been carefully stored and maintained, showing minimal wear. The wood is straight and free from major defects. Perfect for DIY enthusiasts, carpenters, and builders looking for quality material at great value.',
    date: '2024-11-25'
  },
  'stone-brick': {
    title: 'Stone Brick',
    image: './images/stone-brick.png',
    condition: 'Good Condition',
    category: 'Construction',
    owner: { id: 'james-wilson', name: 'James Wilson', avatar: './images/stone-brick.png' },
    description: 'Premium stone brick for landscaping and construction projects. Durable and weather-resistant. Perfect for garden pathways or decorative walls. These bricks are made from natural stone with excellent durability. They have been used in a previous project and are in good condition. Ideal for creating beautiful outdoor spaces or renovation projects.',
    date: '2024-11-20'
  },
  'iron-chain': {
    title: 'Iron Chain',
    image: './images/iron_chain.png',
    condition: 'Excellent',
    category: 'Hardware',
    owner: { id: 'john-smith', name: 'John Smith', avatar: './images/iron_chain.png' },
    description: 'Heavy-duty iron chain. Great for securing items, decorative purposes, or as a pet restraint. Rust-resistant coating applied. This chain is made from high-quality iron with professional-grade construction. The rust-resistant coating ensures longevity and minimal maintenance. Perfect for various applications including securing gates, decoration, or utility purposes.',
    date: '2024-11-15'
  },
  'collectible-figurine': {
    title: 'Collectible Figurine',
    image: './images/wandering_trader.gif',
    condition: 'Mint Condition',
    category: 'Collectibles',
    owner: { id: 'sarah-johnson', name: 'Sarah Johnson', avatar: './images/wandering_trader.gif' },
    description: 'A rare collectible figurine with excellent detail and craftsmanship. Perfect for enthusiasts and collectors. Comes with original packaging. This figurine features intricate details and exceptional paint work. The original packaging is included, making it even more valuable for collectors. A great piece to add to any collection or to appreciate the artistry and craftsmanship.',
    date: '2024-11-10'
  }
};

// Get item ID from URL parameters
function getItemIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

// Populate page with item data
function loadItemDetails() {
  const itemId = getItemIdFromURL();
  
  if (!itemId || !itemsData[itemId]) {
    document.querySelector('.page-container').innerHTML = '<h2>Item not found</h2>';
    return;
  }

  const item = itemsData[itemId];

  // Set image
  document.getElementById('itemImage').src = item.image;
  document.getElementById('itemImage').alt = item.title;

  // Set title
  document.getElementById('itemTitle').textContent = item.title;

  // Set description
  document.getElementById('itemDescription').textContent = item.description;

  // Set badges
  document.getElementById('itemCondition').textContent = item.condition;
  document.getElementById('itemCategory').textContent = item.category;

  // Set detail values
  document.getElementById('detailCondition').textContent = item.condition;
  document.getElementById('detailCategory').textContent = item.category;
  document.getElementById('detailDate').textContent = formatDate(item.date);

  // Set trade link
  document.getElementById('tradeLink').href = `./trade-page.html?id=${itemId}`;

  // Set owner info (link, avatar, name)
  const ownerDetail = document.getElementById('ownerDetail');
  const ownerLink = document.getElementById('ownerLink');
  const ownerAvatar = document.getElementById('ownerAvatar');
  const ownerName = document.getElementById('ownerName');

  if (item.owner && ownerDetail && ownerLink && ownerAvatar && ownerName) {
    ownerLink.href = `./visit_profile.html?id=${encodeURIComponent(item.owner.id)}`;
    ownerAvatar.src = item.owner.avatar;
    ownerAvatar.alt = item.owner.name;
    ownerName.textContent = item.owner.name;
    ownerDetail.style.display = 'flex';
  } else if (ownerDetail) {
    ownerDetail.style.display = 'none';
  }

  // Set page title
  document.title = `${item.title} - Helping Hands`;
}

// Format date to readable format
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

// Add button event listeners
function setupButtons() {
  const itemId = getItemIdFromURL();
  const item = itemsData[itemId];

  document.getElementById('interestedBtn').addEventListener('click', function() {
    alert(`You marked "${item.title}" as interested!\n\nThe owner will be notified of your interest.`);
  });

  document.getElementById('contactBtn').addEventListener('click', function() {
    alert(`Opening chat with the owner of "${item.title}"...\n\nThis feature will be available soon.`);
  });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  loadItemDetails();
  setupButtons();
});
