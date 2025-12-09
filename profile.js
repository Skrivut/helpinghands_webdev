// profile.js - Complete Profile Page JavaScript

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  console.log('Profile page loaded');
  loadLoggedInUser();
  loadUserItems();
  setupTabSwitching();
  setupModalListeners();
  setupEditProfile();
  setupAvatarUpload();
  setupBackgroundChanger();
  setupAddItemModal();
});

// Load logged-in user
function loadLoggedInUser() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) {
    alert("Please log in to view your profile");
    window.location.href = "./login_signup.html";
    return;
  }

  document.getElementById("profileName").textContent = currentUser.username;
  if (currentUser.bio)
    document.getElementById("profileBio").textContent = currentUser.bio;
  if (currentUser.avatar)
    document.getElementById("profileAvatar").src = currentUser.avatar;
  if (currentUser.location) {
    document.querySelector(".profile-location").innerHTML = `<i class="uil uil-map-marker"></i> ${currentUser.location}`;
  }

  const savedBg = localStorage.getItem(`profileBackground_${currentUser.username}`);
  if (savedBg) {
    document.getElementById("profileCover").style.backgroundImage = savedBg;
  }
}

// Setup Add Item Modal
function setupAddItemModal() {
  console.log('Setting up Add Item modal');
  
  const addItemButtons = document.querySelectorAll('.btn-add-item');
  console.log('Found add item buttons:', addItemButtons.length);
  
  addItemButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('Add Item button clicked');
      openAddItemModal();
    });
  });
  
  // Setup image upload
  const itemImageUploadArea = document.getElementById('itemImageUploadArea');
  if (itemImageUploadArea) {
    itemImageUploadArea.addEventListener('click', function() {
      document.getElementById('itemImage').click();
    });
  }
  
  // Setup image preview
  const itemImageInput = document.getElementById('itemImage');
  if (itemImageInput) {
    itemImageInput.addEventListener('change', handleImageSelect);
  }
  
  // Setup drag and drop
  if (itemImageUploadArea) {
    itemImageUploadArea.addEventListener('dragover', handleDragOver);
    itemImageUploadArea.addEventListener('dragleave', handleDragLeave);
    itemImageUploadArea.addEventListener('drop', handleDrop);
  }
  
  // Setup form submission
  const addItemForm = document.getElementById('addItemForm');
  if (addItemForm) {
    addItemForm.addEventListener('submit', handleFormSubmit);
  }
}

// Open Add Item Modal
function openAddItemModal() {
  console.log('Opening Add Item modal');
  const modal = document.getElementById('addItemModal');
  if (modal) {
    modal.classList.add('show');
  } else {
    console.error('Add Item modal not found in DOM');
  }
}

// Close Add Item Modal
function closeAddItemModal() {
  const modal = document.getElementById('addItemModal');
  if (modal) {
    modal.classList.remove('show');
  }
  const form = document.getElementById('addItemForm');
  if (form) {
    form.reset();
  }
  const preview = document.getElementById('imagePreview');
  if (preview) {
    preview.style.display = 'none';
  }
}

// Handle image selection
function handleImageSelect(e) {
  const file = e.target.files[0];
  if (file) {
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      e.target.value = '';
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
      document.getElementById('previewImg').src = e.target.result;
      document.getElementById('imagePreview').style.display = 'block';
    };
    reader.readAsDataURL(file);
  }
}

// Remove Image
function removeImage() {
  document.getElementById('itemImage').value = '';
  document.getElementById('imagePreview').style.display = 'none';
  document.getElementById('previewImg').src = '';
}

// Drag and drop handlers
function handleDragOver(e) {
  e.preventDefault();
  this.style.borderColor = '#764ba2';
  this.style.background = 'rgba(102, 126, 234, 0.15)';
}

function handleDragLeave() {
  this.style.borderColor = '#667eea';
  this.style.background = 'rgba(102, 126, 234, 0.05)';
}

function handleDrop(e) {
  e.preventDefault();
  this.style.borderColor = '#667eea';
  this.style.background = 'rgba(102, 126, 234, 0.05)';
  
  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) {
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    document.getElementById('itemImage').files = dataTransfer.files;
    
    const event = new Event('change', { bubbles: true });
    document.getElementById('itemImage').dispatchEvent(event);
  } else {
    alert('Please drop a valid image file');
  }
}

// Handle Form Submission
async function handleFormSubmit(e) {
  e.preventDefault();
  console.log('Form submitted');
  
  const submitBtn = document.getElementById('submitItemBtn');
  const originalBtnText = submitBtn.innerHTML;
  
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="uil uil-spinner-alt" style="animation: spin 1s linear infinite;"></i> Adding Item...';
  
  const formData = new FormData();
  formData.append('itemName', document.getElementById('itemName').value);
  formData.append('itemDescription', document.getElementById('itemDescription').value);
  formData.append('itemCategory', document.getElementById('itemCategory').value);
  formData.append('itemCondition', document.getElementById('itemCondition').value);
  formData.append('itemPrice', document.getElementById('itemPrice').value);
  
  const imageFile = document.getElementById('itemImage').files[0];
  if (imageFile) {
    formData.append('itemImage', imageFile);
  }
  
  try {
    const response = await fetch('./add_item.php', {
      method: 'POST',
      body: formData
    });
    
    const result = await response.json();
    console.log('Server response:', result);
    
    if (result.success) {
      alert('Item added successfully!');
      closeAddItemModal();
      loadUserItems();
    } else {
      alert('Error: ' + (result.error || 'Failed to add item'));
    }
  } catch (error) {
    console.error('Error adding item:', error);
    alert('An error occurred while adding the item. Please try again.');
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalBtnText;
  }
}

// Load user items from database
async function loadUserItems() {
  const container = document.getElementById('myItemsContainer');
  
  if (!container) {
    console.error('myItemsContainer not found');
    return;
  }
  
  container.innerHTML = `
    <div style="grid-column: 1/-1; text-align: center; padding: 40px;">
      <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem; border-width: 0.3em;">
        <span class="sr-only">Loading...</span>
      </div>
      <p style="margin-top: 15px; color: #7f8c8d;">Loading your items...</p>
    </div>
  `;

  try {
    const response = await fetch('./get_user_items.php', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'same-origin'
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('User items loaded:', result);
    
    if (result.success && result.data.length > 0) {
      container.innerHTML = '';
      
      const itemCountElement = document.getElementById('itemCount');
      if (itemCountElement) {
        itemCountElement.textContent = result.count;
      }
      
      result.data.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'item-card-profile';
        card.style.animationDelay = `${index * 0.1}s`;
        
        const itemImage = item.image_path || './images/placeholder.png';
        const conditionDisplay = formatCondition(item.item_condition);
        const priceDisplay = parseFloat(item.price).toFixed(2);
        
        card.innerHTML = `
          <img 
            src="${itemImage}" 
            alt="${escapeHtml(item.item_name)}" 
            class="item-image-profile"
            onerror="this.src='./images/placeholder.png'"
          />
          <div class="item-card-content-profile">
            <div class="item-name-profile">${escapeHtml(item.item_name)}</div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
              <span class="item-condition-profile">${conditionDisplay}</span>
              <span style="font-weight: 600; color: #667eea;">₱${priceDisplay}</span>
            </div>
            <div class="item-actions-profile">
              <button class="btn-edit-item" onclick="editItem(${item.id})">
                <i class="uil uil-edit"></i> Edit
              </button>
              <button class="btn-delete-item" onclick="deleteItem(${item.id}, '${escapeHtml(item.item_name)}')">
                <i class="uil uil-trash"></i> Delete
              </button>
            </div>
          </div>
        `;
        
        container.appendChild(card);
      });
    } else {
      container.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
          <i class="uil uil-box" style="font-size: 4rem; color: #bdc3c7; margin-bottom: 15px; display: block;"></i>
          <h3 style="color: #7f8c8d; margin-bottom: 10px;">No items yet</h3>
          <p style="color: #95a5a6; margin-bottom: 20px;">Start adding items to trade with others!</p>
          <button class="btn-add-item" onclick="openAddItemModal()">
            <i class="uil uil-plus"></i> Add Your First Item
          </button>
        </div>
      `;
    }
  } catch (error) {
    console.error('Error loading user items:', error);
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 40px;">
        <i class="uil uil-exclamation-triangle" style="font-size: 3rem; color: #e74c3c; margin-bottom: 15px; display: block;"></i>
        <p style="color: #7f8c8d;">Error loading items. Please try again later.</p>
        <button onclick="loadUserItems()" style="margin-top: 15px; padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 6px; cursor: pointer;">
          <i class="uil uil-redo"></i> Retry
        </button>
      </div>
    `;
  }
}

// Helper function to format condition
function formatCondition(condition) {
  if (!condition) return 'Good Condition';
  
  const conditionMap = {
    'mint': 'Mint Condition',
    'excellent': 'Excellent',
    'like_new': 'Like New',
    'good': 'Good Condition',
    'fair': 'Fair',
    'poor': 'Poor'
  };
  
  return conditionMap[condition] || condition
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

// Helper function to escape HTML
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return String(text).replace(/[&<>"']/g, m => map[m]);
}

// Delete item function
async function deleteItem(itemId, itemName) {
  if (!confirm(`Are you sure you want to delete "${itemName}"?\n\nThis action cannot be undone.`)) {
    return;
  }
  
  try {
    const response = await fetch('./delete_item.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'same-origin',
      body: JSON.stringify({ item_id: itemId })
    });
    
    const result = await response.json();
    
    if (result.success) {
      alert('Item deleted successfully!');
      loadUserItems();
    } else {
      alert('Error: ' + (result.error || 'Failed to delete item'));
    }
  } catch (error) {
    console.error('Error deleting item:', error);
    alert('An error occurred while deleting the item. Please try again.');
  }
}

// Edit item function
function editItem(itemId) {
  alert(`Edit functionality for item #${itemId} coming soon!\n\nThis will allow you to update item details.`);
}

// Tab switching
function setupTabSwitching() {
  const tabs = document.querySelectorAll('.tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const tabName = this.getAttribute('data-tab');
      
      document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      
      this.classList.add('active');
      const tabContent = document.getElementById(`${tabName}-tab`);
      if (tabContent) {
        tabContent.classList.add('active');
      }
    });
  });
}

// Setup modal listeners
function setupModalListeners() {
  const closeButtons = document.querySelectorAll('.close-btn');
  closeButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      this.closest('.modal').classList.remove('show');
    });
  });

  window.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
      e.target.classList.remove('show');
    }
  });
}

// Setup edit profile
function setupEditProfile() {
  const editProfileBtn = document.getElementById('editProfileBtn');
  const cancelEditBtn = document.getElementById('cancelEditBtn');
  const saveEditBtn = document.getElementById('saveEditBtn');
  
  if (editProfileBtn) {
    editProfileBtn.addEventListener('click', function() {
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      document.getElementById("editName").value = currentUser.username;
      document.getElementById("editLocation").value = currentUser.location || "Cebu City, Philippines";
      document.getElementById("editBio").value = currentUser.bio || "";
      document.getElementById("editProfileModal").classList.add("show");
    });
  }
  
  if (cancelEditBtn) {
    cancelEditBtn.addEventListener('click', function() {
      document.getElementById("editProfileModal").classList.remove("show");
    });
  }
  
  if (saveEditBtn) {
    saveEditBtn.addEventListener('click', function() {
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      const newName = document.getElementById("editName").value;
      const newLocation = document.getElementById("editLocation").value;
      const newBio = document.getElementById("editBio").value;

      document.getElementById("profileName").textContent = newName;
      document.querySelector(".profile-location").innerHTML = `<i class="uil uil-map-marker"></i> ${newLocation}`;
      document.getElementById("profileBio").textContent = newBio;

      currentUser.username = newName;
      currentUser.location = newLocation;
      currentUser.bio = newBio;
      localStorage.setItem("currentUser", JSON.stringify(currentUser));

      document.getElementById("editProfileModal").classList.remove("show");
      alert("Profile updated successfully!");
    });
  }
}

// Setup avatar upload
function setupAvatarUpload() {
  const editAvatarBtn = document.getElementById('editAvatarBtn');
  const avatarUpload = document.getElementById('avatarUpload');
  
  if (editAvatarBtn) {
    editAvatarBtn.addEventListener('click', () => {
      avatarUpload.click();
    });
  }

  if (avatarUpload) {
    avatarUpload.addEventListener('change', function() {
      if (this.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
          const currentUser = JSON.parse(localStorage.getItem("currentUser"));
          document.getElementById("profileAvatar").src = e.target.result;
          currentUser.avatar = e.target.result;
          localStorage.setItem("currentUser", JSON.stringify(currentUser));
        };
        reader.readAsDataURL(this.files[0]);
      }
    });
  }
}

// Setup background changer
function setupBackgroundChanger() {
  const editBackgroundBtn = document.getElementById('editBackgroundBtn');
  const backgroundModal = document.getElementById('backgroundModal');
  const uploadArea = document.getElementById('uploadArea');
  const backgroundUpload = document.getElementById('backgroundUpload');
  
  if (editBackgroundBtn) {
    editBackgroundBtn.addEventListener('click', () => {
      backgroundModal.classList.add('show');
    });
  }

  document.querySelectorAll('.color-option').forEach(option => {
    option.addEventListener('click', function() {
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      const color = this.dataset.color;
      document.getElementById("profileCover").style.backgroundImage = color;
      localStorage.setItem(`profileBackground_${currentUser.username}`, color);
      backgroundModal.classList.remove('show');
    });
  });

  if (uploadArea) {
    uploadArea.addEventListener('click', () => {
      backgroundUpload.click();
    });
  }

  if (backgroundUpload) {
    backgroundUpload.addEventListener('change', function() {
      if (this.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
          const currentUser = JSON.parse(localStorage.getItem("currentUser"));
          const bgUrl = `url('${e.target.result}')`;
          const cover = document.getElementById("profileCover");
          cover.style.backgroundImage = bgUrl;
          cover.style.backgroundSize = "cover";
          cover.style.backgroundPosition = "center";
          localStorage.setItem(`profileBackground_${currentUser.username}`, bgUrl);
          backgroundModal.classList.remove('show');
        };
        reader.readAsDataURL(this.files[0]);
      }
    });
  }
}

// Add spin animation for loading spinner
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);