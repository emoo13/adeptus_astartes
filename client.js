// client.js

// Function to log messages to an on-screen debug area
function logToScreen(message) {
    const debugContent = document.getElementById('debug-content');
    if (debugContent) {
      const newLog = document.createElement('div');
      newLog.textContent = message;
      debugContent.appendChild(newLog);
      // Keep the log area scrolled to the bottom
      debugContent.scrollTop = debugContent.scrollHeight;
    } else {
      alert('Debug content area not found in DOM'); // Alert if debug area is missing
    }
  }
  
  // Initial alert to confirm JavaScript is running
  alert('JavaScript is loaded and running!');
  logToScreen('JavaScript loaded successfully');
  
  // WebSocket setup for real-time feed updates
  const socket = new WebSocket('ws://localhost:3000');
  
  // Handle WebSocket messages from the server
  socket.addEventListener('open', () => {
    logToScreen('WebSocket connection established successfully');
    alert('WebSocket connected successfully');
  });
  
  socket.addEventListener('error', (error) => {
    logToScreen(`WebSocket connection error: ${error.message}`);
    alert(`WebSocket connection error: ${error.message}`);
  });
  
  socket.addEventListener('message', (event) => {
    const data = JSON.parse(event.data);
    logToScreen(`WebSocket message received: ${JSON.stringify(data)}`); // Log to screen
    if (data.type === 'like') {
      updateLikeCount(data.postId, data.likes_count);
    }
  });
  
  // Function to update like count in the DOM
  function updateLikeCount(postId, newCount) {
    const likeCountElement = document.querySelector(`#likes-${postId}`);
    if (likeCountElement) {
      likeCountElement.textContent = newCount;
      likeCountElement.classList.add('live-update');
  
      // Optionally remove the class after a short delay to remove the highlight
      setTimeout(() => {
        likeCountElement.classList.remove('live-update');
      }, 1000);
    } else {
      logToScreen(`Like count element not found for postId: ${postId}`);
    }
  }
  
  // Fetch feed and populate feed-container
  async function fetchFeed() {
    logToScreen('Fetching feed...');
    try {
      const response = await fetch('/api/feed');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const posts = await response.json();
      const feedContainer = document.getElementById('feed-container');
  
      if (!feedContainer) {
        logToScreen('Feed container not found in DOM.');
        return;
      }
  
      // Populate the feed container
      feedContainer.innerHTML = posts.map(post => `
        <div class="social-card">
            <h3>${post.title}</h3>
            <p>${post.text}</p>
            <div>
                <img src="${post.entities.images[0]?.img_url || ''}" alt="Post Image" />
            </div>
            <p><strong>Hashtags:</strong> ${post.entities.hashtags.map(h => `#${h.text}`).join(', ')}</p>
            <div class="social-actions">
                <button class="like-button" data-like-id="${post.post_id}">👍 Like (<span id="likes-${post.post_id}">${post.likes_count}</span>)</button>
                <button onclick="reactToPost(${post.post_id}, 'dislike')">👎 Dislike (${post.dislikes_count})</button>
            </div>
            <div class="comments">
                <h4>Comments:</h4>
                <ul>
                    ${post.responses.comments.map(comment => `
                        <li><strong>User ${comment.author}:</strong> ${comment.text}</li>
                    `).join('')}
                </ul>
            </div>
        </div>
      `).join('');
  
      // Attach event listeners for like buttons
      attachLikeButtonListeners();
      logToScreen('Feed fetched and displayed successfully');
    } catch (error) {
      logToScreen(`Error fetching feed: ${error.message}`); // Log to screen
      const feedContainer = document.getElementById('feed-container');
      if (feedContainer) {
        feedContainer.innerHTML = '<p>Error loading feed. Please try again later.</p>';
      }
    }
  }
  
  // Function to attach event listeners to like buttons
  function attachLikeButtonListeners() {
    const likeButtons = document.querySelectorAll('.like-button');
    likeButtons.forEach(button => {
      button.addEventListener('click', () => {
        const postId = button.getAttribute('data-like-id');
        if (postId) {
          logToScreen(`Like button clicked for post ID: ${postId}`);
          likePost(postId);
        } else {
          logToScreen('Post ID not found for like button');
        }
      });
    });
  }
  
  // Like a post and update the count dynamically
  async function likePost(postId) {
    const likeCountElement = document.getElementById(`likes-${postId}`);
    if (!likeCountElement) {
      logToScreen(`Like count element not found for post ID: ${postId}`);
      return;
    }
  
    let currentLikes = parseInt(likeCountElement.textContent, 10);
  
    // Optimistically update the like count in the UI
    likeCountElement.textContent = currentLikes + 1;
    likeCountElement.classList.add('live-update');
    logToScreen(`Attempting to like post with ID: ${postId}`);
  
    try {
      const response = await fetch('/api/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId })
      });
      const result = await response.json();
  
      if (result.success) {
        likeCountElement.textContent = result.updatedPost.likes_count;
        logToScreen(`Like successful. Updated count for post ${postId}: ${result.updatedPost.likes_count}`);
      } else {
        likeCountElement.textContent = currentLikes;
        logToScreen(`Like failed for post ${postId}`);
      }
    } catch (error) {
      logToScreen(`Error liking post ${postId}: ${error.message}`);
      likeCountElement.textContent = currentLikes;
    } finally {
      setTimeout(() => {
        likeCountElement.classList.remove('live-update');
      }, 1000);
    }
  }
  
  // React to a post (like or dislike)
  async function reactToPost(postId, reaction) {
    try {
      const response = await fetch('/api/react', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ post_id: postId, reaction })
      });
  
      const result = await response.json();
      if (result.success) {
        logToScreen(`${reaction} successful for post ${postId}`);
        fetchFeed(); // Reload feed to show updated counts
      } else {
        logToScreen(`Failed to update reaction for post ${postId}`);
      }
    } catch (error) {
      logToScreen(`Error updating reaction for post ${postId}: ${error.message}`);
    }
  }
  
  // Initialize on page load
  document.addEventListener('DOMContentLoaded', () => {
    alert('DOM fully loaded, executing JavaScript...');
    logToScreen('DOM fully loaded and parsed.');
    fetchFeed(); // Load feed on page load
  });
  
  