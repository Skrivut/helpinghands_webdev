// API Client for Helping Hands Application

const API_BASE_URL = './'; // Adjust based on your setup

/**
 * Fetch all available items from the database
 */
async function getAllItems() {
    try {
        const response = await fetch(`${API_BASE_URL}get_items.php`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'same-origin'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching items:', error);
        return {
            success: false,
            error: error.message,
            data: []
        };
    }
}

/**
 * Fetch a single item by ID
 */
async function getItemById(itemId) {
    try {
        const response = await fetch(`${API_BASE_URL}get_item.php?id=${encodeURIComponent(itemId)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'same-origin'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching item:', error);
        return {
            success: false,
            error: error.message,
            data: null
        };
    }
}

/**
 * Create a new trade offer
 */
async function createTradeOffer(offerData) {
    try {
        const response = await fetch(`${API_BASE_URL}create_offer.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'same-origin',
            body: JSON.stringify(offerData)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error creating trade offer:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Add a new item for trade
 */
async function addTradeItem(itemData) {
    try {
        const response = await fetch(`${API_BASE_URL}add_item.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'same-origin',
            body: JSON.stringify(itemData)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error adding item:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Get user's trade items
 */
async function getUserItems() {
    try {
        const response = await fetch(`${API_BASE_URL}get_user_items.php`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'same-origin'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching user items:', error);
        return {
            success: false,
            error: error.message,
            data: []
        };
    }
}

/**
 * Get trade offers for a specific item
 */
async function getItemOffers(itemId) {
    try {
        const response = await fetch(`${API_BASE_URL}get_offers.php?item_id=${encodeURIComponent(itemId)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'same-origin'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching offers:', error);
        return {
            success: false,
            error: error.message,
            data: []
        };
    }
}