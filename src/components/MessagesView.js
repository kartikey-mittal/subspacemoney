import React, { useEffect, useRef } from 'react';
import { useSubscription, gql } from '@apollo/client';

const GET_MESSAGES = gql`
  subscription GetMessages($chat_id: uuid!) {
    messages(where: { chat_id: { _eq: $chat_id } }, order_by: { created_at: asc }) {
      id
      content
      sender
      created_at
    }
  }
`;

const BOT_TYPING_SUBSCRIPTION = gql`
  subscription BotTyping($chat_id: uuid!) {
    messages(where: { chat_id: { _eq: $chat_id }, sender: { _eq: "bot" }, content: { _eq: "typing..." } }) {
      id
    }
  }
`;

const MessagesView = ({ chatId, theme }) => {
  const { data, loading, error } = useSubscription(GET_MESSAGES, {
    variables: { chat_id: chatId },
  });
  const { data: typingData } = useSubscription(BOT_TYPING_SUBSCRIPTION, {
    variables: { chat_id: chatId },
    skip: !chatId,
  });

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [data]);

  const themes = {
    dark: {
      text: '#D4D4D4',
      userBubble: '#4dabf7',
      botBubble: 'rgba(255, 255, 255, 0.05)',
      error: '#ff6b6b',
    },
    light: {
      text: '#1a1a2e',
      userBubble: '#007bff',
      botBubble: '#e9ecef',
      error: '#dc3545',
    }
  };

  const currentTheme = themes[theme];
  const botIsTyping = typingData?.messages.length > 0;

  return (
    <div style={{
      flexGrow: 1,
      overflowY: 'auto',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '15px'
    }}>
      {loading && <p style={{ flexGrow: 1, textAlign: 'center', color: currentTheme.textSecondary, padding: '20px' }}>Loading messages...</p>}
      {error && <p style={{ flexGrow: 1, textAlign: 'center', color: currentTheme.error, padding: '20px' }}>Error: {error.message}</p>}
      
      {data?.messages.map((msg) => (
        <div
          key={msg.id}
          style={{
            display: 'flex',
            justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
            animation: 'slideIn 0.5s ease-out'
          }}
        >
          <div
            style={{
              maxWidth: '70%',
              padding: '12px 20px',
              borderRadius: '20px',
              backgroundColor: msg.sender === 'user' ? currentTheme.userBubble : currentTheme.botBubble,
              color: msg.sender === 'user' ? '#fff' : currentTheme.text,
              border: `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
              boxShadow: `0 4px 6px ${theme === 'dark' ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.1)'}`,
              animation: 'popIn 0.3s ease-out',
            }}
          >
            {msg.content}
          </div>
        </div>
      ))}
      
      {botIsTyping && (
        <div style={{ display: 'flex', justifyContent: 'flex-start', animation: 'slideIn 0.5s ease-out' }}>
          <div style={{
            maxWidth: '70%',
            padding: '12px 20px',
            borderRadius: '20px',
            backgroundColor: currentTheme.botBubble,
            border: `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
            boxShadow: `0 4px 6px ${theme === 'dark' ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.1)'}`,
            fontStyle: 'italic',
            color: currentTheme.text,
            display: 'flex',
            alignItems: 'center',
          }}>
            <span>Bot is typing</span>
            <span className="typing-dot" style={{marginLeft: '8px'}}></span>
            <span className="typing-dot"></span>
            <span className="typing-dot"></span>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes popIn {
          0% { transform: scale(0.9); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .typing-dot {
          width: 8px;
          height: 8px;
          background-color: ${currentTheme.text};
          border-radius: 50%;
          margin-left: 5px;
          animation: bounce 1.4s infinite ease-in-out both;
        }
        .typing-dot:nth-child(2) {
          animation-delay: -0.32s;
        }
        .typing-dot:nth-child(3) {
          animation-delay: -0.16s;
        }
        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0);
          }
          40% {
            transform: scale(1);
          }
        }
      `}</style>
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessagesView;