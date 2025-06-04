const socket = io('https://nighthub-backend.onrender.com', {
  transports: ['websocket'],
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000
});

// DOM elements
const chatLog = document.getElementById('chat-log');
const chatInput = document.getElementById('chat-input');
const sendIcon = document.getElementById('send-icon');
const gifIcon = document.getElementById('gif-icon');
const endChatBtn = document.getElementById('end-chat');
const reportUserBtn = document.getElementById('report-user');
const cancelDisconnectBtn = document.getElementById('cancel-disconnect');
const typingIndicator = document.getElementById('typing-indicator');
const countdownSpan = document.getElementById('countdown');
const countdownTimer = document.getElementById('countdown-timer');
const messageSound = document.getElementById('message-sound');
const safeModeToggle = document.getElementById('safe-mode');
const safeModeLabel = document.querySelector('#safe-mode-toggle label');
const helpIcon = document.getElementById('help-icon');
const connectionIndicator = document.getElementById('connection-indicator');
const tagsModal = document.getElementById('tags-modal');
const contactModal = document.getElementById('contact-modal');
const adminModal = document.getElementById('admin-modal');
const ageModal = document.getElementById('age-modal');
const giphyModal = document.getElementById('giphy-modal');
const modalOverlay = document.getElementById('modal-overlay');
const tagsForm = document.getElementById('tags-form');
const contactForm = document.getElementById('contact-form');
const tagsInput = document.getElementById('tags-input');
const submitTags = document.getElementById('submit-tags');
const closeTags = document.getElementById('close-tags');
const contactName = document.getElementById('contact-name');
const contactEmail = document.getElementById('contact-email');
const contactMessage = document.getElementById('contact-message');
const submitContact = document.getElementById('submit-contact');
const closeContact = document.getElementById('close-contact');
const closeAdmin = document.getElementById('close-admin');
const confirmAge = document.getElementById('confirm-age');
const cancelAge = document.getElementById('cancel-age');
const giphySearch = document.getElementById('giphy-search');
const giphyResults = document.getElementById('giphy-results');
const closeGiphy = document.getElementById('close-giphy');
const userTableBody = document.getElementById('user-table-body');
const chatTableBody = document.getElementById('chat-table-body');
const adminChatLog = document.getElementById('admin-chat-log');
const onlineUsers = document.getElementById('online-users');
const activeChats = document.getElementById('active-chats');
const messagesSent = document.getElementById('messages-sent');
const reportsFiled = document.getElementById('reports-filed');
const trendingTags = document.getElementById('trending-tags');

// State
let isTyping = false;
let typingTimeout = null;
let currentObservedPairId = null;
let ageConfirmed = false;
const GIPHY_API_KEY = 'QSNw09um5JwDRXN38T1kSqwrz1DNV1hh';

// FingerprintJS
Fingerprint2.get(components => {
  const values = components.map(component => component.value);
  const fingerprint = Fingerprint2.x64hash128(values.join(''), 31);
  socket.emit('device_fingerprint', fingerprint);
});

// Sanitize input
function sanitizeInput(input) {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
}

// Fetch trending tags
function fetchTrendingTags() {
  socket.emit('get_trending_tags');
}

// Render trending tags
socket.on('trending_tags', (tags) => {
  trendingTags.innerHTML = '';
  tags.forEach(tag => {
    const tagBtn = document.createElement('div');
    tagBtn.className = 'trending-tag';
    tagBtn.textContent = tag;
    tagBtn.addEventListener('click', () => {
      const currentTags = tagsInput.value.split(',').map(t => t.trim()).filter(t => t);
      if (!currentTags.includes(tag)) {
        tagsInput.value = [...currentTags, tag].join(', ');
      }
    });
    trendingTags.appendChild(tagBtn);
  });
});

// Render admin dashboard
function renderAdminDashboard(data) {
  onlineUsers.textContent = data.onlineUsers;
  activeChats.textContent = data.activeChats;
  messagesSent.textContent = data.messagesSent;
  reportsFiled.textContent = data.reportsFiled;

  userTableBody.innerHTML = '';
  data.users.forEach(user => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${sanitizeInput(user.userId)}</td>
      <td>${sanitizeInput(user.socketId)}</td>
      <td>${user.reports}</td>
      <td>${user.isBanned ? `Banned (${user.banDuration === Infinity ? 'Permanent' : `${Math.ceil((user.banEnd - Date.now()) / 60000)} min`})` : 'Not Banned'}</td>
      <td>
        <button class="ban-button" data-userid="${sanitizeInput(user.userId)}" ${user.isBanned ? 'disabled' : ''}>Ban</button>
        <button class="unban-button" data-userid="${sanitizeInput(user.userId)}" ${!user.isBanned ? 'disabled' : ''}>Unban</button>
      </td>
    `;
    userTableBody.appendChild(row);
  });

  chatTableBody.innerHTML = '';
  data.chats.forEach(chat => {
    const row = document.createElement('tr');
    row.className = chat.reports >= 5 ? 'flagged' : '';
    row.innerHTML = `
      <td>${sanitizeInput(chat.pairId)}</td>
      <td>${sanitizeInput(chat.userIds.join(', '))}</td>
      <td>${chat.reports}</td>
      <td>
        <button class="observe-button" data-pairid="${sanitizeInput(chat.pairId)}">Observe</button>
      </td>
    `;
    chatTableBody.appendChild(row);
  });

  document.querySelectorAll('.ban-button').forEach(btn => {
    btn.addEventListener('click', () => {
      const userId = btn.dataset.userid;
      Fingerprint2.get(components => {
        const values = components.map(component => component.value);
        const fingerprint = Fingerprint2.x64hash128(values.join(''), 31);
        socket.emit('admin_ban', { userId, duration: 30 * 60 * 1000, fingerprint });
      });
    });
  });
  document.querySelectorAll('.unban-button').forEach(btn => {
    btn.addEventListener('click', () => {
      const userId = btn.dataset.userid;
      Fingerprint2.get(components => {
        const values = components.map(component => component.value);
        const fingerprint = Fingerprint2.x64hash128(values.join(''), 31);
        socket.emit('admin_unban', { userId, fingerprint });
      });
    });
  });
  document.querySelectorAll('.observe-button').forEach(btn => {
    btn.addEventListener('click', () => {
      const pairId = btn.dataset.pairid;
      if (currentObservedPairId) {
        socket.emit('admin_leave_chat', { pairId: currentObservedPairId });
      }
      socket.emit('admin_observe_chat', { pairId });
      currentObservedPairId = pairId;
      adminChatLog.innerHTML = `<p>Observing chat ${sanitizeInput(pairId)}...</p>`;
    });
  });
}

// Update Safe Mode label
function updateSafeModeLabel() {
  safeModeLabel.textContent = safeModeToggle.checked ? 'Safe Mode' : 'NSFW Mode';
}
safeModeToggle.addEventListener('change', () => {
  if (!safeModeToggle.checked && !ageConfirmed) {
    ageModal.style.display = 'block';
    modalOverlay.style.display = 'block';
    safeModeToggle.checked = true;
    return;
  }
  socket.emit('toggle_safe_mode', { safeMode: safeModeToggle.checked, ageConfirmed });
  updateSafeModeLabel();
});
updateSafeModeLabel();

// Giphy search
let giphyTimeout;
giphySearch.addEventListener('input', () => {
  clearTimeout(giphyTimeout);
  giphyTimeout = setTimeout(async () => {
    const query = giphySearch.value.trim();
    if (query) {
      try {
        const response = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${encodeURIComponent(query)}&limit=12&rating=${safeModeToggle.checked ? 'g' : 'r'}`);
        const data = await response.json();
        giphyResults.innerHTML = '';
        data.data.forEach(gif => {
          const div = document.createElement('div');
          div.className = 'giphy-result';
          const img = document.createElement('img');
          img.src = gif.images.fixed_height_small.url;
          img.alt = gif.title;
          img.addEventListener('click', () => {
            socket.emit('message', img.src);
            const msgElement = document.createElement('div');
            msgElement.className = 'gif-message you';
            msgElement.innerHTML = `<img src="${img.src}" alt="${sanitizeInput(gif.title)}">`;
            chatLog.appendChild(msgElement);
            chatLog.scrollTop = chatLog.scrollHeight;
            giphyModal.style.display = 'none';
            modalOverlay.style.display = 'none';
            giphySearch.value = '';
          });
          div.appendChild(img);
          giphyResults.appendChild(div);
        });
      } catch (err) {
        console.error('Giphy API error:', err);
        chatLog.innerHTML += `<p style="color: #EF4444;">Error: Failed to load GIFs</p>`;
        chatLog.scrollTop = chatLog.scrollHeight;
      }
    }
  }, 500);
});

gifIcon.addEventListener('click', () => {
  giphyModal.style.display = 'block';
  modalOverlay.style.display = 'block';
  giphySearch.focus();
});

closeGiphy.addEventListener('click', () => {
  giphyModal.style.display = 'none';
  modalOverlay.style.display = 'none';
  giphySearch.value = '';
  giphyResults.innerHTML = '';
});

// Socket.IO event handlers
socket.on('connect', () => {
  console.log('Connected to backend, Socket ID:', socket.id);
  connectionIndicator.classList.add('connected');
  chatLog.innerHTML = '<p>Connected to server.</p>';
  fetchTrendingTags();
  tagsModal.style.display = 'block';
  modalOverlay.style.display = 'block';
  tagsInput.focus();
});

socket.on('connect_error', (err) => {
  console.error('Connection error:', err.message);
  connectionIndicator.classList.remove('connected');
  chatLog.innerHTML += `<p style="color: #EF4444;">Error: Failed to connect to server - ${err.message}</p>`;
  chatLog.scrollTop = chatLog.scrollHeight;
});

socket.on('message', (msg) => {
  console.log('Received message:', msg);
  const isGif = msg.startsWith('https://media') && msg.includes('giphy.com');
  const msgElement = document.createElement(isGif ? 'div' : 'p');
  msgElement.className = isGif ? 'gif-message stranger' : 'stranger';
  msgElement.innerHTML = isGif ? `<img src="${msg}" alt="GIF">` : `<strong>Stranger:</strong> ${sanitizeInput(msg)}`;
  chatLog.appendChild(msgElement);
  messageSound.play().catch(err => console.error('Audio playback error:', err));
  chatLog.scrollTop = chatLog.scrollHeight;
});

socket.on('typing', (isTyping) => {
  typingIndicator.style.display = isTyping ? 'block' : 'none';
  chatLog.scrollTop = chatLog.scrollHeight;
});

socket.on('countdown', (seconds) => {
  countdownSpan.textContent = seconds;
  countdownTimer.style.display = 'block';
});

socket.on('countdown_cancelled', () => {
  countdownTimer.style.display = 'none';
  cancelDisconnectBtn.style.display = 'none';
  endChatBtn.style.display = 'inline-block';
  reportUserBtn.style.display = 'inline-block';
  chatInput.disabled = false;
  chatInput.focus();
});

socket.on('rejoin', () => {
  chatLog.innerHTML = '<p>Connecting to a new stranger...</p>';
  endChatBtn.style.display = 'inline-block';
  reportUserBtn.style.display = 'inline-block';
  chatInput.disabled = true;
  chatLog.scrollTop = chatLog.scrollHeight;
});

socket.on('paired', () => {
  chatLog.innerHTML += '<p>Connected to a stranger!</p>';
  safeModeToggle.checked = true;
  updateSafeModeLabel();
  endChatBtn.style.display = 'inline-block';
  reportUserBtn.style.display = 'inline-block';
  chatInput.disabled = false;
  chatInput.focus();
  chatLog.scrollTop = chatLog.scrollHeight;
});

socket.on('disconnected', () => {
  chatLog.innerHTML += '<p>Stranger disconnected.</p>';
  endChatBtn.style.display = 'none';
  reportUserBtn.style.display = 'none';
  cancelDisconnectBtn.style.display = 'none';
  countdownTimer.style.display = 'none';
  chatInput.disabled = true;
  typingIndicator.style.display = 'none';
  chatLog.scrollTop = chatLog.scrollHeight;
});

socket.on('error', (msg) => {
  chatLog.innerHTML += `<p style="color: #EF4444;">Error: ${msg}</p>`;
  chatLog.scrollTop = chatLog.scrollHeight;
  if (msg.includes('banned')) {
    endChatBtn.style.display = 'none';
    reportUserBtn.style.display = 'none';
    cancelDisconnectBtn.style.display = 'none';
    chatInput.disabled = true;
  }
});

socket.on('request_success', (msg) => {
  chatLog.innerHTML += `<p style="color: #22C55E;">${msg}</p>`;
  contactModal.style.display = 'none';
  modalOverlay.style.display = 'none';
  chatLog.scrollTop = chatLog.scrollHeight;
});

socket.on('admin_data', (data) => {
  renderAdminDashboard(data);
});

socket.on('admin_message', ({ pairId, userId, message }) => {
  if (pairId === currentObservedPairId) {
    const msgElement = document.createElement('p');
    msgElement.innerHTML = `<strong>User ${sanitizeInput(userId.slice(0, 8))}:</strong> ${sanitizeInput(message)}`;
    adminChatLog.appendChild(msgElement);
    adminChatLog.scrollTop = adminChatLog.scrollHeight;
  }
});

// DOM event listeners
window.addEventListener('load', () => {
  if (!socket.connected) {
    chatLog.innerHTML += `<p style="color: #EF4444;">Connecting to server...</p>`;
    chatLog.scrollTop = chatLog.scrollHeight;
  }
});

submitTags.addEventListener('click', () => {
  const tags = tagsInput.value.split(',').map(t => sanitizeInput(t.trim())).filter(t => t);
  if (tags.includes('ekandmc')) {
    socket.emit('admin_login', { key: 'ekandmc' });
    tagsModal.style.display = 'none';
    modalOverlay.style.display = 'block';
    adminModal.style.display = 'block';
    tagsInput.value = '';
    return;
  }
  if (tags.length === 0) {
    chatLog.innerHTML += `<p style="color: #EF4444;">Error: At least one tag is required.</p>`;
    chatLog.scrollTop = chatLog.scrollHeight;
    return;
  }
  socket.emit('join', tags);
  tagsModal.style.display = 'none';
  modalOverlay.style.display = 'none';
  chatInput.disabled = false;
  chatLog.innerHTML = '<p>Connecting...</p>';
  chatLog.scrollTop = chatLog.scrollHeight;
});

closeTags.addEventListener('click', () => {
  tagsModal.style.display = 'none';
  modalOverlay.style.display = 'none';
  window.location.href = 'index.html';
});

endChatBtn.addEventListener('click', () => {
  socket.emit('leave');
  endChatBtn.style.display = 'none';
  reportUserBtn.style.display = 'none';
  cancelDisconnectBtn.style.display = 'inline-block';
  countdownTimer.style.display = 'block';
  chatInput.disabled = true;
});

cancelDisconnectBtn.addEventListener('click', () => {
  socket.emit('cancel_disconnect');
});

reportUserBtn.addEventListener('click', () => {
  Fingerprint2.get(components => {
    const values = components.map(component => component.value);
    const fingerprint = Fingerprint2.x64hash128(values.join(''), 31);
    socket.emit('report', { timestamp: new Date().toISOString(), fingerprint });
  });
  const reportMsg = document.createElement('p');
  reportMsg.textContent = 'User reported to moderators.';
  chatLog.appendChild(reportMsg);
  chatLog.scrollTop = chatLog.scrollHeight;
});

helpIcon.addEventListener('click', () => {
  contactModal.style.display = 'block';
  modalOverlay.style.display = 'block';
  contactMessage.focus();
});

closeContact.addEventListener('click', () => {
  contactModal.style.display = 'none';
  modalOverlay.style.display = 'none';
});

closeAdmin.addEventListener('click', () => {
  if (currentObservedPairId) {
    socket.emit('admin_leave_chat', { pairId: currentObservedPairId });
    currentObservedPairId = null;
  }
  adminModal.style.display = 'none';
  modalOverlay.style.display = 'none';
});

confirmAge.addEventListener('click', () => {
  ageConfirmed = true;
  safeModeToggle.checked = false;
  socket.emit('toggle_safe_mode', { safeMode: false, ageConfirmed: true });
  updateSafeModeLabel();
  ageModal.style.display = 'none';
  modalOverlay.style.display = 'none';
});

cancelAge.addEventListener('click', () => {
  safeModeToggle.checked = true;
  ageModal.style.display = 'none';
  modalOverlay.style.display = 'none';
  updateSafeModeLabel();
});

modalOverlay.addEventListener('click', () => {
  tagsModal.style.display = 'none';
  contactModal.style.display = 'none';
  adminModal.style.display = 'none';
  ageModal.style.display = 'none';
  giphyModal.style.display = 'none';
  if (currentObservedPairId) {
    socket.emit('admin_leave_chat', { pairId: currentObservedPairId });
    currentObservedPairId = null;
  }
  modalOverlay.style.display = 'none';
  giphySearch.value = '';
  giphyResults.innerHTML = '';
});

submitContact.addEventListener('click', () => {
  const request = {
    name: sanitizeInput(contactName.value.trim()),
    email: sanitizeInput(contactEmail.value.trim()),
    message: sanitizeInput(contactMessage.value.trim())
  };
  if (!request.message) {
    chatLog.innerHTML += `<p style="color: #EF4444;">Error: Message is required.</p>`;
    chatLog.scrollTop = chatLog.scrollHeight;
    return;
  }
  socket.emit('submit_request', request);
  contactName.value = '';
  contactEmail.value = '';
  contactMessage.value = '';
});

chatInput.addEventListener('input', () => {
  if (chatInput.value.trim() && !isTyping) {
    isTyping = true;
    socket.emit('typing', true);
  } else if (!chatInput.value.trim() && isTyping) {
    isTyping = false;
    socket.emit('typing', false);
  }
  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => {
    if (isTyping) {
      isTyping = false;
      socket.emit('typing', false);
    }
  }, 2000);
});

function sendMessage() {
  if (chatInput.value.trim()) {
    const msg = sanitizeInput(chatInput.value);
    socket.emit('message', msg);
    const msgElement = document.createElement('p');
    msgElement.className = 'you';
    msgElement.innerHTML = `<strong>You:</strong> ${msg}`;
    chatLog.appendChild(msgElement);
    chatInput.value = '';
    isTyping = false;
    socket.emit('typing', false);
    chatLog.scrollTop = chatLog.scrollHeight;
  }
}

chatInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

sendIcon.addEventListener('click', sendMessage);
