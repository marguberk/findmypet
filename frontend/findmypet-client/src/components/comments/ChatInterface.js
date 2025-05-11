import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import '../../assets/css/chat.css';

// Имитация хранилища сообщений в localStorage
const getStoredMessages = (chatId) => {
  const messages = localStorage.getItem(`petChatMessages_${chatId}`);
  return messages ? JSON.parse(messages) : [];
};

const saveMessages = (chatId, messages) => {
  localStorage.setItem(`petChatMessages_${chatId}`, JSON.stringify(messages));
};

const ChatInterface = ({ pet, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { currentUser, isAuthenticated } = useAuth();
  
  const chatId = `pet_${pet.id}_user_${currentUser?.id || 'guest'}`;
  
  // Загрузка истории сообщений при первом рендере
  useEffect(() => {
    if (isAuthenticated() && pet) {
      // Добавляем начальное сообщение, если чат пустой
      const storedMessages = getStoredMessages(chatId);
      
      if (storedMessages.length === 0) {
        const initialMessage = {
          id: 1,
          text: `This conversation is about: "${pet.title}"`,
          sender: 'system',
          timestamp: new Date().toISOString(),
          isSystem: true
        };
        
        setMessages([initialMessage]);
        saveMessages(chatId, [initialMessage]);
      } else {
        setMessages(storedMessages);
      }
    }
  }, [pet.id, chatId, isAuthenticated()]);
  
  // Автоматическая прокрутка вниз при появлении новых сообщений
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!inputMessage.trim()) return;
    if (!isAuthenticated()) return;
    
    setLoading(true);
    
    // Имитация задержки отправки
    setTimeout(() => {
      const newMessage = {
        id: Date.now(),
        text: inputMessage.trim(),
        sender: 'user',
        senderId: currentUser.id,
        senderName: currentUser.username || currentUser.email.split('@')[0],
        timestamp: new Date().toISOString()
      };
      
      const updatedMessages = [...messages, newMessage];
      
      // Сохраняем сообщения в localStorage
      saveMessages(chatId, updatedMessages);
      
      // Обновляем состояние
      setMessages(updatedMessages);
      setInputMessage('');
      setLoading(false);
      
      // Имитация ответа от владельца питомца через 1-3 секунды
      if (Math.random() > 0.6) {
        simulateReply(updatedMessages);
      }
    }, 500);
  };
  
  const simulateReply = (currentMessages) => {
    const replyDelay = 1000 + Math.random() * 2000;
    
    setTimeout(() => {
      const replyTexts = [
        "Thanks for your message! I'll get back to you soon.",
        "Hello! Yes, I'm still looking for my pet.",
        "Thank you for reaching out. I appreciate your help.",
        "Hi! Is there any additional information you can provide?",
        "Have you seen this pet recently?",
        "Could you share more details about where you spotted the pet?"
      ];
      
      const randomReply = replyTexts[Math.floor(Math.random() * replyTexts.length)];
      
      const reply = {
        id: Date.now(),
        text: randomReply,
        sender: 'owner',
        senderId: pet.user_id,
        senderName: 'Pet Owner',
        timestamp: new Date().toISOString()
      };
      
      const updatedMessages = [...currentMessages, reply];
      
      // Сохраняем сообщения в localStorage
      saveMessages(chatId, updatedMessages);
      
      // Обновляем состояние
      setMessages(updatedMessages);
    }, replyDelay);
  };
  
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  if (!isAuthenticated()) {
    return (
      <div className="chat-container bg-light rounded p-4 text-center">
        <h5 className="mb-4">Chat with Pet Owner</h5>
        <p>You need to be logged in to chat with the pet owner.</p>
        <div>
          <Link to="/login" className="btn btn-primary me-2">Log In</Link>
          <Link to="/register" className="btn btn-outline-primary">Register</Link>
        </div>
        <button 
          className="btn btn-secondary mt-3"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    );
  }
  
  return (
    <div className="chat-container bg-light rounded">
      <div className="chat-header bg-primary text-white p-3 rounded-top d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Chat about: {pet.title}</h5>
        <button 
          className="btn-close btn-close-white"
          onClick={onClose}
          aria-label="Close"
        ></button>
      </div>
      
      <div className="chat-messages p-3" style={{ height: '350px', overflowY: 'auto' }}>
        {messages.length === 0 ? (
          <div className="text-center text-muted my-5">
            <i className="bi bi-chat-dots fs-1 mb-3"></i>
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map(message => (
            <div 
              key={message.id} 
              className={`message mb-3 ${
                message.isSystem 
                  ? 'system-message text-center' 
                  : message.sender === 'user' 
                    ? 'user-message ms-auto' 
                    : 'other-message me-auto'
              }`}
              style={{ maxWidth: '80%' }}
            >
              {message.isSystem ? (
                <div className="system-message-content bg-light text-muted p-2 rounded">
                  <small>{message.text}</small>
                </div>
              ) : (
                <div className={`message-content p-3 rounded ${
                  message.sender === 'user' ? 'bg-primary text-white' : 'bg-white border'
                }`}>
                  {message.sender !== 'user' && !message.isSystem && (
                    <div className="sender-name mb-1">
                      <small className="fw-bold">{message.senderName}</small>
                    </div>
                  )}
                  <div className="message-text">{message.text}</div>
                  <div className="message-time mt-1 text-end">
                    <small className={message.sender === 'user' ? 'text-white-50' : 'text-muted'}>
                      {formatTime(message.timestamp)}
                    </small>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="chat-input p-3 border-top">
        <form onSubmit={handleSendMessage}>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Type your message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              disabled={loading}
            />
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading || !inputMessage.trim()}
            >
              {loading ? (
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              ) : (
                <i className="bi bi-send"></i>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface; 