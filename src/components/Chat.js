import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import MessagesView from './MessagesView';
import MessageInput from './MessageInput';
import { useSignOut, useUserData } from '@nhost/react';
import Lottie from 'react-lottie';
import * as loadingAnimation from '../assets/loading.json';
import * as waitingAnimation from '../assets/loading.json'; // Make sure you have a waiting.json file

// Import icons from react-icons
import { AiOutlinePlus, AiOutlineLoading } from 'react-icons/ai';
import { BsSun, BsMoon } from 'react-icons/bs';
import { FiLogOut } from 'react-icons/fi';

const GET_CHATS = gql`
  query GetChats {
    chats(order_by: { created_at: desc }) {
      id
      created_at
    }
  }
`;

const CREATE_CHAT = gql`
  mutation CreateChat {
    insert_chats_one(object: {}) {
      id
    }
  }
`;

const Chat = () => {
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [theme, setTheme] = useState('dark');
  const { signOut } = useSignOut();
  const user = useUserData();

  const { loading, error, data, refetch } = useQuery(GET_CHATS);

  const [showFullPageLoader, setShowFullPageLoader] = useState(true);
  const [loadingStartTime, setLoadingStartTime] = useState(Date.now());
  const MIN_LOAD_DURATION = 2500; // 5 seconds

  useEffect(() => {
    if (!loading) {
      const elapsedTime = Date.now() - loadingStartTime;
      if (elapsedTime < MIN_LOAD_DURATION) {
        const remainingTime = MIN_LOAD_DURATION - elapsedTime;
        const timer = setTimeout(() => {
          setShowFullPageLoader(false);
        }, remainingTime);
        return () => clearTimeout(timer);
      } else {
        setShowFullPageLoader(false);
      }
    }
  }, [loading, loadingStartTime]);

  const [createChat, { loading: creatingChat }] = useMutation(CREATE_CHAT, {
    onCompleted: (data) => {
      setSelectedChatId(data.insert_chats_one.id);
      refetch();
    },
    onError: (err) => {
      console.error("Error creating chat:", err);
      alert("Could not create a new chat.");
    }
  });

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const themes = {
    dark: {
      bgPrimary: '#0C0C0D',
      bgSecondary: 'rgba(25, 25, 30, 0.7)',
      text: '#D4D4D4',
      textSecondary: '#8B8B8D',
      border: 'rgba(255, 255, 255, 0.1)',
      chatSelected: 'rgba(255, 255, 255, 0.1)',
      chatHover: 'rgba(255, 255, 255, 0.05)',
      buttonBg: '#4dabf7',
      inputBg: '#2C2C34',
      iconColor: '#9D9D9F'
    },
    light: {
      bgPrimary: '#EFEFEF',
      bgSecondary: 'rgba(255, 255, 255, 0.8)',
      text: '#333333',
      textSecondary: '#666666',
      border: 'rgba(0, 0, 0, 0.1)',
      chatSelected: '#E0E0E0',
      chatHover: '#F5F5F5',
      buttonBg: '#007bff',
      inputBg: '#ffffff',
      iconColor: '#777777'
    }
  };

  const currentTheme = themes[theme];

  const lottieOptions = {
    loop: true,
    autoplay: true,
    animationData: loadingAnimation.default,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  const waitingLottieOptions = {
    loop: true,
    autoplay: true,
    animationData: waitingAnimation.default,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  if (loading || showFullPageLoader) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw',
        backgroundColor: '#000000',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 9999,
      }}>
        <Lottie options={lottieOptions} height={200} width={200} />
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      width: '100vw',
      fontFamily: 'DM Sans, sans-serif',
      color: currentTheme.text,
      background: `linear-gradient(45deg, ${currentTheme.bgPrimary}, ${theme === 'dark' ? '#1b1b2f' : '#ffffff'})`,
      backgroundSize: '400% 400%',
      animation: 'gradientAnimation 15s ease infinite',
    }}>
      <style>{`
        @keyframes gradientAnimation {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      {/* Sidebar */}
      <div style={{
        width: '30%',
        minWidth: '280px',
        borderRight: `1px solid ${currentTheme.border}`,
        overflowY: 'auto',
        backgroundColor: currentTheme.bgSecondary,
        backdropFilter: 'blur(10px)',
        padding: '20px',
        boxShadow: '4px 0 10px rgba(0,0,0,0.3)',
        transition: 'all 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <div style={{ padding: '10px 0', borderBottom: `1px solid ${currentTheme.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', letterSpacing: '1px' }}>Chats</h2>
          <button
            onClick={() => createChat()}
            disabled={creatingChat}
            style={{
              width: '45px',
              height: '45px',
              borderRadius: '50%',
              border: 'none',
              backgroundColor: creatingChat ? currentTheme.chatHover : currentTheme.buttonBg,
              color: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              transition: 'background-color 0.3s ease, transform 0.2s ease',
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            {creatingChat ? <AiOutlineLoading className="spin" /> : <AiOutlinePlus />}
          </button>
        </div>
        
        <div style={{ flexGrow: 1, paddingBottom: '20px' }}>
          {data.chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setSelectedChatId(chat.id)}
              style={{
                padding: '15px',
                cursor: 'pointer',
                marginBottom: '10px',
                borderRadius: '10px',
                backgroundColor: selectedChatId === chat.id ? currentTheme.chatSelected : 'transparent',
                border: selectedChatId === chat.id ? `1px solid ${currentTheme.buttonBg}` : `1px solid transparent`,
                transition: 'all 0.3s ease',
                transform: selectedChatId === chat.id ? 'scale(1.02)' : 'scale(1)'
              }}
              onMouseOver={(e) => {
                if (selectedChatId !== chat.id) {
                  e.currentTarget.style.backgroundColor = currentTheme.chatHover;
                }
              }}
              onMouseOut={(e) => {
                if (selectedChatId !== chat.id) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <p style={{ margin: 0, }}>Chat from</p>
              <p style={{ margin: 0, fontSize: '0.8rem', color: currentTheme.textSecondary }}>{new Date(chat.created_at).toLocaleString()}</p>
            </div>
          ))}
        </div>

        {/* User Profile and Sign Out at the bottom */}
        <div style={{ padding: '15px 0', borderTop: `1px solid ${currentTheme.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#4dabf7', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#fff', fontSize: '1.2rem', fontWeight: 'bold' }}>
              {user?.displayName?.[0] || 'U'}
            </div>
            <div style={{ marginLeft: '10px' }}>
              <p style={{ margin: 0, fontWeight: 'bold', fontSize: '0.9rem' }}>{user?.displayName || 'User'}</p>
              <p style={{ margin: 0, fontSize: '0.8rem', color: currentTheme.textSecondary }}>Online</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={toggleTheme}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: currentTheme.bgPrimary,
                color: currentTheme.text,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background-color 0.3s ease',
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = currentTheme.chatHover}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = currentTheme.bgPrimary}
            >
              {theme === 'dark' ? <BsSun /> : <BsMoon />}
            </button>
            <button onClick={signOut} style={{ padding: '8px 12px', borderRadius: '20px', border: 'none', backgroundColor: '#e53e3e', color: '#fff', cursor: 'pointer', transition: 'background-color 0.3s', display: 'flex', alignItems: 'center', gap: '5px' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#c53030'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#e53e3e'}>
              <FiLogOut style={{ fontSize: '1.2rem' }} /> Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main Chat Window */}
      <div style={{
        width: '70%',
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: currentTheme.bgSecondary,
        backdropFilter: 'blur(5px)',
        borderRadius: '20px',
        margin: '20px',
        overflow: 'hidden',
        border: `1px solid ${currentTheme.border}`,
        boxShadow: `0 8px 32px 0 ${theme === 'dark' ? 'rgba(0, 0, 0, 0.37)' : 'rgba(0, 0, 0, 0.1)'}`,
      }}>
        {selectedChatId ? (
          <>
            <MessagesView chatId={selectedChatId} theme={theme} />
            <MessageInput chatId={selectedChatId} theme={theme} />
          </>
        ) : (
          <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: '#888' }}>
            <p style={{ fontSize: '1.2rem', animation: 'fadeIn 1s ease-in-out', marginBottom: '20px' }}>
              <span style={{ fontSize: '2rem' }}>👋</span> Select a chat or create a new one to start messaging.
            </p>
            <div style={{ width: '300px', height: '300px' }}>
              <Lottie options={waitingLottieOptions} />
            </div>
            <style>{`
              @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
              }
            `}</style>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;