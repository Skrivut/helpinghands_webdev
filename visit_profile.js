// Sample user data
const sampleUser = {
  id: 2,
  name: 'Sarah Johnson',
  avatar: './images/obsidian.jpg',
  location: 'Cebu City, Philippines',
  bio: 'Passionate about sustainable trading and helping the community.',
  status: 'Active',
  tradeCount: 8,
  itemCount: 15,
  rating: 4.9,
  memberSince: 'March 2024'
};

// Sample user items
const userItems = [
  {
    id: 1,
    name: 'Wooden Chair Set',
    image: './images/oak_sign.png',
    condition: 'Excellent',
    description: 'Beautiful handcrafted wooden chairs. Slightly used but in excellent condition.'
  },
  {
    id: 2,
    name: 'Vintage Coffee Table',
    image: './images/spruce_plank.jpg',
    condition: 'Good',
    description: 'Classic vintage coffee table with original finish. Perfect for living rooms.'
  },
  {
    id: 3,
    name: 'Garden Tool Collection',
    image: './images/iron_chain.png',
    condition: 'Like New',
    description: 'Complete set of garden tools. Barely used, excellent for gardening enthusiasts.'
  },
  {
    id: 4,
    name: 'Blue Ceramic Vase',
    image: './images/obsidian.jpg',
    condition: 'Excellent',
    description: 'Beautiful handmade ceramic vase. Perfect decoration for any room.'
  }
];

// Sample reviews
const userReviews = [
  {
    id: 1,
    reviewer: 'John Smith',
    avatar: './images/oak_sign.png',
    rating: 5,
    text: 'Excellent trader! The item was exactly as described. Very reliable and friendly.',
    date: '2 weeks ago'
  },
  {
    id: 2,
    reviewer: 'Maria Garcia',
    avatar: './images/spruce_plank.jpg',
    rating: 5,
    text: 'Great experience trading with Sarah. She was responsive and honest about the condition.',
    date: '1 month ago'
  },
  {
    id: 3,
    reviewer: 'David Lee',
    avatar: './images/iron_chain.png',
    rating: 4,
    text: 'Good trader. Item arrived in good condition. Would trade again.',
    date: '1 month ago'
  },
  {
    id: 4,
    reviewer: 'Emma Wilson',
    avatar: './images/stone-brick.png',
    rating: 5,
    text: 'Perfect! Sarah is a fantastic person to trade with. Highly recommended!',
    date: '2 months ago'
  }
];

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
  loadUserProfile();
  loadUserItems();
  loadUserReviews();
  setupTabSwitching();
  setupModalListeners();
  setupActionButtons();
});

// Load user profile data
function loadUserProfile() {
  document.getElementById('visitProfileName').textContent = sampleUser.name;
  document.getElementById('visitProfileLocation').textContent = '📍 ' + sampleUser.location;
  document.getElementById('visitProfileBio').textContent = sampleUser.bio;
  document.getElementById('visitProfileAvatar').src = sampleUser.avatar;
  document.getElementById('visitTradeCount').textContent = sampleUser.tradeCount;
  document.getElementById('visitItemCount').textContent = sampleUser.itemCount;
  document.getElementById('visitRatingCount').textContent = sampleUser.rating;
  document.getElementById('visitRatingNumber').textContent = sampleUser.rating;

  // Set page title
  document.title = `${sampleUser.name}'s Profile - Helping Hands`;
}

// Load user items
function loadUserItems() {
  const container = document.getElementById('visitItemsContainer');
  container.innerHTML = '';

  userItems.forEach((item, index) => {
    const card = document.createElement('div');
    card.className = 'visit-item-card';
    card.style.animationDelay = `${index * 0.1}s`;
    
    card.innerHTML = `
      <img src="${item.image}" alt="${item.name}" class="visit-item-image" />
      <div class="visit-item-card-content">
        <h3 class="visit-item-name">${item.name}</h3>
        <span class="visit-item-condition">${item.condition}</span>
        <p class="visit-item-description">${item.description}</p>
        <div class="visit-item-footer">
          <button class="visit-item-btn" onclick="openItemDetails(${item.id})">View Details</button>
        </div>
      </div>
    `;

    container.appendChild(card);
  });
}

// Load user reviews
function loadUserReviews() {
  const container = document.getElementById('visitReviewsContainer');
  container.innerHTML = '';

  userReviews.forEach((review, index) => {
    const stars = '⭐'.repeat(review.rating);
    const card = document.createElement('div');
    card.className = 'visit-review-card';
    card.style.animationDelay = `${index * 0.1}s`;
    
    card.innerHTML = `
      <div class="visit-review-header">
        <img src="${review.avatar}" alt="${review.reviewer}" class="visit-review-avatar" />
        <div class="visit-review-user-info">
          <h4>${review.reviewer}</h4>
          <p>${review.date}</p>
        </div>
      </div>
      <div class="visit-review-rating">${stars}</div>
      <p class="visit-review-text">"${review.text}"</p>
    `;

    container.appendChild(card);
  });
}

// Setup tab switching
function setupTabSwitching() {
  const tabs = document.querySelectorAll('.visit-tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const tabName = this.getAttribute('data-tab');
      
      // Remove active class from all tabs and contents
      document.querySelectorAll('.visit-tab-btn').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.visit-tab-content').forEach(c => c.classList.remove('active'));
      
      // Add active class to clicked tab and corresponding content
      this.classList.add('active');
      document.getElementById(`${tabName}-tab`).classList.add('active');
    });
  });
}

// Setup modal listeners
function setupModalListeners() {
  const messageModal = document.getElementById('messageModal');
  const itemDetailsModal = document.getElementById('itemDetailsModal');
  const closeButtons = document.querySelectorAll('.close-btn');

  // Close modals
  closeButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      this.closest('.modal').classList.remove('show');
    });
  });

  // Cancel buttons
  document.getElementById('cancelMessageBtn').addEventListener('click', function() {
    messageModal.classList.remove('show');
  });

  document.getElementById('closeItemBtn').addEventListener('click', function() {
    itemDetailsModal.classList.remove('show');
  });

  // Close modal when clicking outside
  window.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
      e.target.classList.remove('show');
    }
  });
}

// Setup action buttons
function setupActionButtons() {
  document.getElementById('messageUserBtn').addEventListener('click', function() {
    openMessageModal();
  });

  document.getElementById('addFriendBtn').addEventListener('click', function() {
    alert(`You added ${sampleUser.name} as a friend!`);
  });

  document.getElementById('sendMessageBtn').addEventListener('click', function() {
    sendMessage();
  });

  document.getElementById('interestedBtn').addEventListener('click', function() {
    markInterested();
  });
}

// Open message modal
function openMessageModal() {
  const messageModal = document.getElementById('messageModal');
  document.getElementById('messageUserAvatar').src = sampleUser.avatar;
  document.getElementById('messageUserName').textContent = sampleUser.name;
  document.getElementById('messageContent').value = '';
  messageModal.classList.add('show');
}

// Send message
function sendMessage() {
  const message = document.getElementById('messageContent').value.trim();
  
  if (!message) {
    alert('Please enter a message.');
    return;
  }

  alert(`Message sent to ${sampleUser.name}!\n\nYour message: "${message}"`);
  document.getElementById('messageModal').classList.remove('show');
  document.getElementById('messageContent').value = '';
}

// Open item details
function openItemDetails(itemId) {
  const item = userItems.find(i => i.id === itemId);
  if (!item) return;

  const modal = document.getElementById('itemDetailsModal');
  const body = document.getElementById('itemDetailsBody');

  body.innerHTML = `
    <div>
      <img src="${item.image}" alt="${item.name}" class="visit-item-details-image" />
    </div>
    <div class="visit-item-details-info">
      <h3>${item.name}</h3>
      <p><strong>Condition:</strong> ${item.condition}</p>
      <p><strong>Description:</strong> ${item.description}</p>
      <p><strong>Owner:</strong> ${sampleUser.name}</p>
      <p><strong>Location:</strong> ${sampleUser.location}</p>
    </div>
  `;

  modal.classList.add('show');
}

// Mark as interested
function markInterested() {
  alert('You marked this item as interested!\n\nThe owner will be notified and may contact you soon.');
  document.getElementById('itemDetailsModal').classList.remove('show');
}
