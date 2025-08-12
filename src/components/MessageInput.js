import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
// Import the send icon from react-icons/ri
import { RiSendPlaneFill } from 'react-icons/ri';

const ADD_USER_MESSAGE = gql`
  mutation AddUserMessage($chat_id: uuid!, $content: String!) {
    insert_messages_one(object: { chat_id: $chat_id, content: $content, sender: "user" }) {
      id
    }
  }
`;

const TRIGGER_BOT_RESPONSE = gql`
  mutation TriggerBotResponse($chat_id: uuid!, $message: String!) {
    sendMessage(chat_id: $chat_id, message: $message) {
      reply
    }
  }
`;

const MessageInput = ({ chatId, theme }) => {
  const [message, setMessage] = useState('');
  const [addUserMessage] = useMutation(ADD_USER_MESSAGE);
  const [triggerBot, { loading: botIsTyping }] = useMutation(TRIGGER_BOT_RESPONSE, {
      onError: (err) => {
          console.error("Error triggering bot:", err);
          alert("The bot is not responding. Please try again later.");
      }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedMessage = message.trim();
    if (!trimmedMessage || botIsTyping) {
      return;
    }

    setMessage('');

    try {
      await addUserMessage({
        variables: {
          chat_id: chatId,
          content: trimmedMessage,
        },
      });

      await triggerBot({
        variables: {
          chat_id: chatId,
          message: trimmedMessage,
        },
      });

    } catch (error) {
      console.error('Error sending message:', error);
      setMessage(trimmedMessage);
    }
  };

  const themes = {
    dark: {
      bg: 'rgba(0, 0, 0, 0.3)',
      inputBg: '#2C2C34',
      inputText: '#e0e0e0',
      inputBorder: '#4a4a4a',
      buttonBg: '#4dabf7',
      buttonDisabled: '#4a4a4a',
    },
    light: {
      bg: 'rgba(255, 255, 255, 0.8)',
      inputBg: '#ffffff',
      inputText: '#1a1a2e',
      inputBorder: '#ccc',
      buttonBg: '#007bff',
      buttonDisabled: '#e6e6e6',
    }
  };

  const currentTheme = themes[theme];

  return (
    <div style={{
      padding: '20px',
      borderTop: `1px solid ${currentTheme.inputBorder}`,
      backgroundColor: currentTheme.bg,
      display: 'flex',
      alignItems: 'center',
    }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', width: '100%' }}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={botIsTyping ? "Bot is typing..." : "Type your message..."}
          disabled={botIsTyping}
          style={{
            flexGrow: 1,
            padding: '12px 20px',
            borderRadius: '25px',
            border: `1px solid ${currentTheme.inputBorder}`,
            backgroundColor: currentTheme.inputBg,
            color: currentTheme.inputText,
            marginRight: '15px',
            fontSize: '1rem',
            transition: 'all 0.3s ease',
            outline: 'none',
          }}
        />
        <button
          type="submit"
          disabled={!message.trim() || botIsTyping}
          style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            border: 'none',
            backgroundColor: botIsTyping || !message.trim() ? currentTheme.buttonDisabled : currentTheme.buttonBg,
            color: '#fff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.2rem',
            transition: 'background-color 0.3s ease, transform 0.2s ease',
          }}
          onMouseOver={(e) => {
            if (!e.currentTarget.disabled) {
              e.currentTarget.style.transform = 'scale(1.05)';
            }
          }}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <RiSendPlaneFill />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;