import { io } from 'socket.io-client';

class NotificationService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  /**
   * Initialize Socket.IO connection
   */
  connect(token) {
    if (this.socket) {
      return this.socket;
    }

    let socketUrl = (typeof process !== 'undefined' && process.env && process.env.REACT_APP_SOCKET_URL) || 
      (typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.hostname}:5000` : 'http://localhost:5000');
    if (typeof window !== 'undefined' && socketUrl.includes('localhost') && window.location.hostname !== 'localhost') {
      socketUrl = socketUrl.replace('localhost', window.location.hostname);
    }
    
    this.socket = io(socketUrl, {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket.id);
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    return this.socket;
  }

  /**
   * Disconnect socket
   */
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.listeners.clear();
    }
  }

  /**
   * Join rooms
   */
  joinBusiness(businessId) {
    if (this.socket) {
      this.socket.emit('join:business', businessId);
    }
  }

  joinBranch(branchId) {
    if (this.socket) {
      this.socket.emit('join:branch', branchId);
    }
  }

  joinUser(userId) {
    if (this.socket) {
      this.socket.emit('join:user', userId);
    }
  }

  /**
   * Listen for notifications
   */
  onNotification(callback) {
    if (this.socket) {
      this.socket.on('notification', callback);
      this.listeners.set('notification', callback);
    }
  }

  /**
   * Listen for specific events
   */
  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
      this.listeners.set(event, callback);
    }
  }

  /**
   * Remove listener
   */
  off(event) {
    if (this.socket && this.listeners.has(event)) {
      const callback = this.listeners.get(event);
      this.socket.off(event, callback);
      this.listeners.delete(event);
    }
  }

  /**
   * Remove all listeners
   */
  removeAllListeners() {
    if (this.socket) {
      this.listeners.forEach((callback, event) => {
        this.socket.off(event, callback);
      });
      this.listeners.clear();
    }
  }
}

export default new NotificationService();
