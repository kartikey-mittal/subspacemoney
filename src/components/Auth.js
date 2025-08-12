import React, { useState, useEffect } from 'react';
import { useSignInEmailPassword, useSignUpEmailPassword } from '@nhost/react';
import Lottie from 'react-lottie';
import { FaSignInAlt, FaUserPlus, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaGithub } from 'react-icons/fa'; // FaGithub को इंपोर्ट किया गया है
import * as animationData from '../assets/loading.json';

const Typewriter = ({ messages }) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [speed, setSpeed] = useState(60);

  useEffect(() => {
    const handleType = () => {
      const fullText = messages[currentMessageIndex];
      if (isDeleting) {
        setText(fullText.substring(0, text.length - 1));
        setSpeed(40);
      } else {
        setText(fullText.substring(0, text.length + 1));
        setSpeed(60);
      }

      if (!isDeleting && text === fullText) {
        setTimeout(() => setIsDeleting(true), 800);
      } else if (isDeleting && text === '') {
        setIsDeleting(false);
        setCurrentMessageIndex((currentMessageIndex + 1) % messages.length);
      }
    };

    const timer = setTimeout(handleType, speed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, speed, messages, currentMessageIndex]);

  return (
    <span
      style={{
        fontFamily: 'Fira Code, monospace',
        color: '#FFF8DC',
        fontSize: '1rem',
        cursor: 'default',
        userSelect: 'none'
      }}
    >
      {text}
    </span>
  );
};

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { signUpEmailPassword, isLoading: signUpLoading, isSuccess, isError: signUpError, error: signUpErrorData } = useSignUpEmailPassword();
  const { signInEmailPassword, isLoading: signInLoading, isError: signInError, error: signInErrorData } = useSignInEmailPassword();

  const isLoading = signUpLoading || signInLoading;
  const isError = signUpError || signInError;
  const error = signUpErrorData || signInErrorData;

  const handleSignUp = async (e) => {
    e.preventDefault();
    await signUpEmailPassword(email, password);
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    await signInEmailPassword(email, password);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };


  const handleGithubRepoClick = () => {
    window.open('https://github.com/kartikey-mittal/subspacemoney', '_blank');
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData.default,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  const typewriterMessages = [
    "await chatbot.getResponse()",
    "n8n workflow triggered...",
    "Webhook received: Processing data...",
    "POST → Hasura GraphQL mutation running...",
    "Automation complete ✅"
  ];


  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      width: '100vw',
      fontFamily: 'DM Sans, sans-serif',
      background: 'linear-gradient(45deg, #0A0A0A, #15151A, #0A0A0A, #15151A)',
      backgroundSize: '400% 400%',
      animation: 'gradientAnimation 15s ease infinite',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#E0E0E0',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;700&display=swap');
        @keyframes gradientAnimation {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      {/* Left side with Lottie animation */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
      }}>
        <Lottie options={defaultOptions} height={400} width={400} />
      </div>

      {/* Right side with Auth Form */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}>
        <div style={{
          width: '100%',
          maxWidth: '400px',
          padding: '40px',
          borderRadius: '15px',
          backgroundColor: 'rgba(25, 25, 30, 0.7)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          animation: 'fadeIn 1s ease-out',
          fontFamily: 'DM Sans, sans-serif',
        }}>
          <h2 style={{
            textAlign: 'center',
            marginBottom: '0.5rem',
            fontSize: '2.5rem',
            color: '#D4D4D4',
            letterSpacing: '0.125rem',
            fontFamily: 'DM Sans, sans-serif',
            cursor: 'default',
            userSelect: 'none'
          }}>
            Chatbot
          </h2>

          <div style={{ textAlign: 'center', height: '24px', marginBottom: '20px' }}>
            <Typewriter messages={typewriterMessages} />
          </div>
          <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: 'calc(100% - 80px)', // आइकन और पैडिंग के लिए चौड़ाई समायोजित की गई
                  padding: '12px 40px 12px 40px', // आइकन के लिए बाएं पैडिंग
                  borderRadius: '8px',
                  border: '1px solid #4a4a4a',
                  backgroundColor: '#2C2C34',
                  color: '#E0E0E0',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.3s ease',
                  fontFamily: 'DM Sans, sans-serif',
                }}
              />
              <FaEnvelope style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#8B8B8D' }} />
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: 'calc(100% - 80px)',
                  padding: '12px 40px 12px 40px',
                  borderRadius: '8px',
                  border: '1px solid #4a4a4a',
                  backgroundColor: '#2C2C34',
                  color: '#E0E0E0',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.3s ease',
                  fontFamily: 'DM Sans, sans-serif',
                }}
              />
              <FaLock style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#8B8B8D' }} />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#8B8B8D',
                  cursor: 'pointer',
                  fontSize: '1rem',
                }}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {isError && <p style={{ color: '#FF6B6B', textAlign: 'center', fontSize: '0.9rem', fontFamily: 'DM Sans, sans-serif' }}>{error?.message}</p>}
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '10px' }}>
              <button
                onClick={handleSignIn}
                disabled={isLoading}
                style={{
                  flex: 1,
                  padding: '12px 25px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: isLoading ? '#4a4a4a' : '#4dabf7',
                  color: '#fff',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  transition: 'background-color 0.3s ease, transform 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontFamily: 'DM Sans, sans-serif',
                }}
                onMouseOver={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.transform = 'scale(1.03)';
                  }
                }}
                onMouseOut={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.transform = 'scale(1)';
                  }
                }}
              >
                {isLoading ? '...' : <FaSignInAlt />} Sign In
              </button>
              <button
                onClick={handleSignUp}
                disabled={isLoading}
                style={{
                  flex: 1,
                  padding: '12px 25px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: isLoading ? '#4a4a4a' : '#2F2F37',
                  color: '#D4D4D4',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  transition: 'background-color 0.3s ease, transform 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontFamily: 'DM Sans, sans-serif',
                }}
                onMouseOver={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.transform = 'scale(1.03)';
                    e.currentTarget.style.backgroundColor = '#4a4a4a';
                  }
                }}
                onMouseOut={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.backgroundColor = '#2F2F37';
                  }
                }}
              >
                {isLoading ? '...' : <FaUserPlus />} Sign Up
              </button>
            </div>
            {/* GitHub Repository Button */}
            <button
              onClick={handleGithubRepoClick}
              style={{
                width: '100%',
                padding: '12px 25px',
                borderRadius: '8px',
                border: '1px solid #8B8B8D',
                backgroundColor: 'transparent',
                color: '#8B8B8D',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '1rem',
                marginTop: '15px',
                transition: 'background-color 0.3s ease, color 0.3s ease, transform 0.2s ease, border-color 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontFamily: 'DM Sans, sans-serif',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'scale(1.02)';
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.color = '#D4D4D4';
                e.currentTarget.style.borderColor = '#D4D4D4';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#8B8B8D';
                e.currentTarget.style.borderColor = '#8B8B8D';
              }}
            >
              <FaGithub style={{ fontSize: '1.2rem' }} /> See Repository
            </button>
          </form>
          {isSuccess && <p style={{ color: '#4dabf7', textAlign: 'center', fontSize: '0.9rem', marginTop: '15px', fontFamily: 'DM Sans, sans-serif' }}>Please check your email to verify your account.</p>}
        </div>
      </div>
    </div>
  );
};

export default Auth;