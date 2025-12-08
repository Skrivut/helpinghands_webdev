// Sample trade offers data
const tradeOffers = [
  {
    id: 1,
    userName: 'Sarah Johnson',
    userAvatar: './images/obsidian.jpg',
    date: 'Dec 5, 2024',
    status: 'Pending',
    message: 'I really love your oak sign! I have some excellent wooden chairs that might interest you.',
    theirItems: ['Wooden Chair Set', 'Vintage Coffee Table'],
    yourItem: 'Oak Sign'
  },
  {
    id: 2,
    userName: 'Mike Chen',
    userAvatar: './images/iron_chain.png',
    date: 'Dec 3, 2024',
    status: 'Pending',
    message: 'Great spruce plank! I can trade three items for it.',
    theirItems: ['Garden Tools', 'Blue Vase', 'Picture Frame'],
    yourItem: 'Spruce Plank'
  },
  {
    id: 3,
    userName: 'Emily Rodriguez',
    userAvatar: './images/stone-brick.png',
    date: 'Dec 1, 2024',
    status: 'Accepted',
    message: 'Perfect! Looking forward to the trade.',
    theirItems: ['Decorative Plates'],
    yourItem: 'Iron Chain'
  },
  {
    id: 4,
    userName: 'James Wilson',
    userAvatar: './images/spruce_plank.jpg',
    date: 'Nov 28, 2024',
    status: 'Pending',
    message: 'Your collectible figurine is amazing. Check out my stone collection!',
    theirItems: ['Rare Stone Collection', 'Mineral Kit'],
    yourItem: 'Collectible Figurine'
  }
];

// Sample user items
const userItems = [
  {
    id: 1,
    name: 'Oak Sign',
    image: './images/oak_sign.png',
    condition: 'Good Condition'
  },
  {
    id: 2,
    name: 'Spruce Plank',
    image: './images/spruce_plank.jpg',
    condition: 'Like New'
  },
  {
    id: 3,
    name: 'Stone Brick',
    image: './images/stone-brick.png',
    condition: 'Good Condition'
  },
  {
    id: 4,
    name: 'Iron Chain',
    image: './images/iron_chain.png',
    condition: 'Excellent'
  }
];

// Initialize profile
document.addEventListener('DOMContentLoaded', function() {
  loadTradeOffers();
  loadUserItems();
  setupTabSwitching();
  setupModalListeners();
  setupEditProfileListener();
  setupBackgroundChanger();
});

// Load and display trade offers
function loadTradeOffers() {
  const container = document.getElementById('tradeOffersContainer');
  container.innerHTML = '';

  tradeOffers.forEach((trade, index) => {
    const card = document.createElement('div');
    card.className = 'trade-offer-card';
    card.style.animationDelay = `${index * 0.1}s`;
    
    const statusBadgeColor = trade.status === 'Accepted' ? '#27ae60' : '#f39c12';
    
    card.innerHTML = `
      <div class="trade-offer-header">
        <div>
          <span class="trade-status" style="background: ${statusBadgeColor}20; color: ${statusBadgeColor};">
            ${trade.status}
          </span>
          <div class="trade-user">${trade.userName}</div>
          <div class="trade-date">Received on ${trade.date}</div>
        </div>
      </div>
      <div class="trade-offer-body">
        <div class="trade-items-info">
          <span class="trade-items-label">Their Items:</span>
          <ul class="trade-items-list">
            ${trade.theirItems.map(item => `<li>${item}</li>`).join('')}
          </ul>
        </div>

        <div class="trade-items-info">
          <span class="trade-items-label">For Your:</span>
          <ul class="trade-items-list">
            <li>${trade.yourItem}</li>
          </ul>
        </div>

        <div class="trade-message-preview">
          "${trade.message}"
        </div>

        <div class="trade-offer-footer">
          <button class="btn-view-details" onclick="openTradeDetails(${trade.id})">View Details</button>
          ${trade.status === 'Pending' ? `
            <button class="btn-accept" onclick="acceptTrade(${trade.id})">Accept</button>
            <button class="btn-reject" onclick="rejectTrade(${trade.id})">Reject</button>
          ` : ''}
        </div>
      </div>
    `;

    container.appendChild(card);
  });

  // Show message if no trades
  if (tradeOffers.length === 0) {
    container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #7f8c8d;">No trade offers yet. Start trading!</p>';
  }
}

// Load and display user items
function loadUserItems() {
  const container = document.getElementById('myItemsContainer');
  container.innerHTML = '';

  userItems.forEach((item, index) => {
    const card = document.createElement('div');
    card.className = 'item-card-profile';
    
    card.innerHTML = `
      <img src="${item.image}" alt="${item.name}" class="item-image-profile" />
      <div class="item-card-content-profile">
        <div class="item-name-profile">${item.name}</div>
        <span class="item-condition-profile">${item.condition}</span>
        <div class="item-actions-profile">
          <button class="btn-edit-item" onclick="editItem(${item.id})">Edit</button>
          <button class="btn-delete-item" onclick="deleteItem(${item.id})">Delete</button>
        </div>
      </div>
    `;

    container.appendChild(card);
  });
}

// Setup tab switching
function setupTabSwitching() {
  const tabs = document.querySelectorAll('.tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const tabName = this.getAttribute('data-tab');
      
      // Remove active class from all tabs and contents
      document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      
      // Add active class to clicked tab and corresponding content
      this.classList.add('active');
      document.getElementById(`${tabName}-tab`).classList.add('active');
    });
  });
}

// Setup modal listeners
function setupModalListeners() {
  const editProfileModal = document.getElementById('editProfileModal');
  const editProfileBtn = document.getElementById('editProfileBtn');
  const cancelEditBtn = document.getElementById('cancelEditBtn');
  const closeButtons = document.querySelectorAll('.close-btn');

  editProfileBtn.addEventListener('click', function() {
    document.getElementById('editName').value = document.getElementById('profileName').textContent;
    document.getElementById('editLocation').value = document.querySelector('.profile-location').textContent.replace('📍 ', '');
    document.getElementById('editBio').value = document.querySelector('.profile-bio').textContent;
    editProfileModal.classList.add('show');
  });

  cancelEditBtn.addEventListener('click', function() {
    editProfileModal.classList.remove('show');
  });

  closeButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      this.closest('.modal').classList.remove('show');
    });
  });

  // Close modal when clicking outside
  window.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
      e.target.classList.remove('show');
    }
  });
}

// Setup edit profile
function setupEditProfileListener() {
  const saveEditBtn = document.getElementById('saveEditBtn');
  saveEditBtn.addEventListener('click', function() {
    const newName = document.getElementById('editName').value;
    const newLocation = document.getElementById('editLocation').value;
    const newBio = document.getElementById('editBio').value;

    document.getElementById('profileName').textContent = newName;
    document.querySelector('.profile-location').textContent = '📍 ' + newLocation;
    document.querySelector('.profile-bio').textContent = newBio;

    document.getElementById('editProfileModal').classList.remove('show');
    alert('Profile updated successfully!');
  });
}

// Open trade details modal
function openTradeDetails(tradeId) {
  const trade = tradeOffers.find(t => t.id === tradeId);
  if (!trade) return;

  const modal = document.getElementById('tradeDetailsModal');
  const body = document.getElementById('tradeDetailsBody');

  body.innerHTML = `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
      <div>
        <h4 style="color: #667eea; font-weight: 600; margin-bottom: 10px;">From: ${trade.userName}</h4>
        <p style="color: #555; margin-bottom: 15px;">${trade.message}</p>
        <strong style="color: #2c3e50;">Their Items:</strong>
        <ul style="list-style: none; padding: 0; margin-top: 8px;">
          ${trade.theirItems.map(item => `<li style="color: #555; padding: 6px 0;">✓ ${item}</li>`).join('')}
        </ul>
      </div>
      <div>
        <strong style="color: #2c3e50;">Your Item:</strong>
        <ul style="list-style: none; padding: 0; margin-top: 8px;">
          <li style="color: #555; padding: 6px 0;">✓ ${trade.yourItem}</li>
        </ul>
        <div style="margin-top: 20px; padding: 15px; background: #f5f6fa; border-radius: 8px;">
          <strong style="color: #2c3e50;">Trade Date:</strong>
          <p style="color: #555; margin: 8px 0 0 0;">${trade.date}</p>
        </div>
      </div>
    </div>
  `;

  modal.classList.add('show');

  document.getElementById('acceptTradeBtn').onclick = function() {
    acceptTrade(tradeId);
  };

  document.getElementById('rejectTradeBtn').onclick = function() {
    rejectTrade(tradeId);
  };
}

// Accept trade
function acceptTrade(tradeId) {
  const trade = tradeOffers.find(t => t.id === tradeId);
  alert(`Trade accepted with ${trade.userName}!\n\nYou will receive: ${trade.theirItems.join(', ')}\nThey will receive: ${trade.yourItem}`);
  document.getElementById('tradeDetailsModal').classList.remove('show');
  loadTradeOffers();
}

// Reject trade
function rejectTrade(tradeId) {
  const trade = tradeOffers.find(t => t.id === tradeId);
  if (confirm(`Are you sure you want to reject this trade from ${trade.userName}?`)) {
    tradeOffers.splice(tradeOffers.findIndex(t => t.id === tradeId), 1);
    alert('Trade rejected successfully.');
    loadTradeOffers();
    document.getElementById('tradeDetailsModal').classList.remove('show');
  }
}

// Edit item
function editItem(itemId) {
  alert('Edit item feature coming soon!');
}

// Delete item
function deleteItem(itemId) {
  if (confirm('Are you sure you want to delete this item?')) {
    userItems.splice(userItems.findIndex(i => i.id === itemId), 1);
    loadUserItems();
    alert('Item deleted successfully.');
  }
}

// Avatar upload
document.getElementById('editAvatarBtn').addEventListener('click', function() {
  document.getElementById('avatarUpload').click();
});

document.getElementById('avatarUpload').addEventListener('change', function() {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      document.getElementById('profileAvatar').src = e.target.result;
      localStorage.setItem('profileAvatar', e.target.result);
    };
    reader.readAsDataURL(file);
  }
});

// Setup background changer
function setupBackgroundChanger() {
  const editBackgroundBtn = document.getElementById('editBackgroundBtn');
  const backgroundModal = document.getElementById('backgroundModal');
  const colorOptions = document.querySelectorAll('.color-option');
  const uploadArea = document.getElementById('uploadArea');
  const backgroundUpload = document.getElementById('backgroundUpload');
  const profileCover = document.getElementById('profileCover');

  // Load saved background
  const savedBackground = localStorage.getItem('profileBackground');
  if (savedBackground) {
    if (savedBackground.startsWith('linear-gradient') || savedBackground.startsWith('url')) {
      profileCover.style.backgroundImage = savedBackground;
    } else {
      profileCover.style.background = savedBackground;
    }
  }

  // Open background modal
  editBackgroundBtn.addEventListener('click', function() {
    backgroundModal.classList.add('show');
  });

  // Color option click
  colorOptions.forEach(option => {
    option.addEventListener('click', function() {
      const color = this.getAttribute('data-color');
      profileCover.style.backgroundImage = color;
      profileCover.style.background = color;
      localStorage.setItem('profileBackground', color);
      backgroundModal.classList.remove('show');
      alert('Background updated successfully!');
    });
  });

  // Upload area click
  uploadArea.addEventListener('click', function() {
    backgroundUpload.click();
  });

  // Drag and drop
  uploadArea.addEventListener('dragover', function(e) {
    e.preventDefault();
    uploadArea.style.borderColor = '#764ba2';
    uploadArea.style.background = 'rgba(102, 126, 234, 0.15)';
  });

  uploadArea.addEventListener('dragleave', function() {
    uploadArea.style.borderColor = '#667eea';
    uploadArea.style.background = 'rgba(102, 126, 234, 0.05)';
  });

  uploadArea.addEventListener('drop', function(e) {
    e.preventDefault();
    uploadArea.style.borderColor = '#667eea';
    uploadArea.style.background = 'rgba(102, 126, 234, 0.05)';
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleBackgroundUpload(file);
    } else {
      alert('Please drop an image file.');
    }
  });

  // File input change
  backgroundUpload.addEventListener('change', function() {
    if (this.files[0]) {
      handleBackgroundUpload(this.files[0]);
    }
  });

  function handleBackgroundUpload(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const backgroundUrl = `url('${e.target.result}')`;
      profileCover.style.backgroundImage = backgroundUrl;
      profileCover.style.backgroundSize = 'cover';
      profileCover.style.backgroundPosition = 'center';
      localStorage.setItem('profileBackground', backgroundUrl);
      backgroundModal.classList.remove('show');
      alert('Background updated successfully!');
    };
    reader.readAsDataURL(file);
  }

  // Close modal when clicking outside
  window.addEventListener('click', function(e) {
    if (e.target === backgroundModal) {
      backgroundModal.classList.remove('show');
    }
  });
}
