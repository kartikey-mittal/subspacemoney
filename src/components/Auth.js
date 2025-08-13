import React, { useState, useEffect, useRef } from 'react';
import { useSignInEmailPassword, useSignUpEmailPassword } from '@nhost/react';
import Lottie from 'react-lottie';
import { FaSignInAlt, FaUserPlus, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaGithub, FaImage, FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa'; // Added new icons
import * as animationData from '../assets/loading.json';

// --- Snapshot Modal Component ---
const SnapshotModal = ({ isOpen, onClose, snapshotUrls, isMobile }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef(0);

  useEffect(() => {
    // Reset index when modal is opened
    if (isOpen) {
      setCurrentIndex(0);
    }
    // Disable body scroll when modal is open
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
  }, [isOpen]);

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? snapshotUrls.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === snapshotUrls.length - 1 ? 0 : currentIndex + 1);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    if (touchStartX.current - touchEndX > 75) { // Swiped left
      goToNext();
    } else if (touchEndX - touchStartX.current > 75) { // Swiped right
      goToPrevious();
    }
  };

  if (!isOpen) return null;

  // Styles
  const modalOverlayStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 10000,
  };
  const modalContentStyle = {
    position: 'relative',
    backgroundColor: '#19191E',
    padding: isMobile ? '15px' : '20px',
    borderRadius: '15px',
    width: isMobile ? '90vw' : '70vw',
    maxWidth: '800px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    textAlign: 'center',
    animation: 'zoomIn 0.3s ease-out'
  };
  const imageStyle = {
    width: '100%',
    height: 'auto',
    maxHeight: isMobile ? '50vh' : '65vh',
    objectFit: 'contain',
    borderRadius: '8px',
    userSelect: 'none',
  };
  const navButtonStyle = {
    position: 'absolute', top: '50%', transform: 'translateY(-50%)',
    background: 'rgba(255, 255, 255, 0.1)', border: 'none',
    color: 'white', borderRadius: '50%', width: '40px', height: '40px',
    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '1.2rem',
  };
  const dotsContainerStyle = {
    marginTop: '15px',
    display: 'flex', justifyContent: 'center', gap: '10px'
  };
  const dotStyle = {
    width: '10px', height: '10px', borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)', cursor: 'pointer',
  };
  const activeDotStyle = { ...dotStyle, backgroundColor: '#4dabf7' };

  return (
    <div style={modalOverlayStyle} onClick={onClose}>
      <style>{`@keyframes zoomIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }`}</style>
      <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} style={{ position: 'absolute', top: isMobile ? '10px' : '15px', right: isMobile ? '10px' : '15px', background: 'none', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer' }}>
          <FaTimes />
        </button>
        <div onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
          <img src={snapshotUrls[currentIndex]} alt={`Snapshot ${currentIndex + 1}`} style={imageStyle} />
        </div>
        <button onClick={goToPrevious} style={{ ...navButtonStyle, left: '15px' }}><FaChevronLeft /></button>
        <button onClick={goToNext} style={{ ...navButtonStyle, right: '15px' }}><FaChevronRight /></button>
        <div style={dotsContainerStyle}>
          {snapshotUrls.map((_, index) => (
            <div key={index} style={index === currentIndex ? activeDotStyle : dotStyle} onClick={() => setCurrentIndex(index)}></div>
          ))}
        </div>
      </div>
    </div>
  );
};


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
        setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
      }
    };
    const timer = setTimeout(handleType, speed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, speed, messages, currentMessageIndex]);

  return (
    <span style={{ fontFamily: 'Fira Code, monospace', color: '#FFF8DC', fontSize: '1rem', cursor: 'default', userSelect: 'none' }}>
      {text}
    </span>
  );
};

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isAppLoading, setIsAppLoading] = useState(true);
  
  // State for Snapshot Modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { signUpEmailPassword, isLoading: signUpLoading, isSuccess, isError: signUpError, error: signUpErrorData } = useSignUpEmailPassword();
  const { signInEmailPassword, isLoading: signInLoading, isError: signInError, error: signInErrorData } = useSignInEmailPassword();

  useEffect(() => {
    const timer = setTimeout(() => setIsAppLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isLoading = signUpLoading || signInLoading;
  const isError = signUpError || signInError;
  const error = signUpErrorData || signInErrorData;

  const handleSignUp = async (e) => { e.preventDefault(); await signUpEmailPassword(email, password); };
  const handleSignIn = async (e) => { e.preventDefault(); await signInEmailPassword(email, password); };
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const handleGithubRepoClick = () => window.open('https://github.com/kartikey-mittal/subspacemoney', '_blank');

  const defaultOptions = { loop: true, autoplay: true, animationData: animationData.default, rendererSettings: { preserveAspectRatio: 'xMidYMid slice' } };
  const typewriterMessages = ["await chatbot.getResponse()", "n8n workflow triggered...", "Webhook received: Processing data...", "POST → Hasura GraphQL mutation running...", "Automation complete ✅"];
  
  // !! महत्वपूर्ण: अपने स्क्रीनशॉट के URL यहाँ डालें !!
  const snapshotUrls = [
    'https://i.ibb.co/1J9MKwGC/Screenshot-2025-08-13-142615.png',
    
    'https://i.ibb.co/8ncCNnJ0/Screenshot-2025-08-13-144809.png',
    'https://i.ibb.co/k2kZgrFY/Screenshot-2025-08-13-143117.png',
    'https://i.ibb.co/Lfpffnz/Screenshot-2025-08-13-142808.png'
  ];

  const mainContainerStyle = { display: 'flex', flexDirection: isMobile ? 'column' : 'row', height: '100vh', width: '100vw', fontFamily: 'DM Sans, sans-serif', background: 'linear-gradient(45deg, #0A0A0A, #15151A, #0A0A0A, #15151A)', backgroundSize: '400% 400%', animation: 'gradientAnimation 15s ease infinite', alignItems: 'center', justifyContent: 'center', color: '#E0E0E0' };
  const lottieContainerStyle = { display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', flex: isMobile ? 'none' : 1, height: isMobile ? '30vh' : '100%', width: isMobile ? '100%' : '50%', backgroundColor: isMobile ? 'transparent' : 'rgba(0, 0, 0, 0.3)' };
  const authContainerStyle = { flex: 1, display: 'flex', alignItems: isMobile ? 'flex-start' : 'center', justifyContent: 'center', padding: isMobile ? '0 20px 20px 20px' : '20px', width: isMobile ? '100%' : '50%', height: isMobile ? '70vh' : '100%' };
  const formCardStyle = { width: '100%', maxWidth: '400px', padding: isMobile ? '25px' : '40px', borderRadius: '15px', backgroundColor: 'rgba(25, 25, 30, 0.7)', backdropFilter: 'blur(10px)', boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)', border: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', flexDirection: 'column', gap: isMobile ? '15px' : '20px', animation: 'fadeIn 1s ease-out' };
  const inputStyle = { width: '100%', padding: '12px 40px', boxSizing: 'border-box', borderRadius: '8px', border: '1px solid #4a4a4a', backgroundColor: '#2C2C34', color: '#E0E0E0', fontSize: '1rem', outline: 'none', transition: 'border-color 0.3s ease' };
  const secondaryButtonStyle = { width: '100%', padding: '12px 25px', borderRadius: '8px', border: '1px solid #8B8B8D', backgroundColor: 'transparent', color: '#8B8B8D', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', marginTop: '10px', transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' };

  if (isAppLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100vw', backgroundColor: '#000000', position: 'fixed', top: 0, left: 0, zIndex: 9999 }}>
        <Lottie options={defaultOptions} height={200} width={200} />
      </div>
    );
  }

  return (
    <>
      <SnapshotModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} snapshotUrls={snapshotUrls} isMobile={isMobile} />
      <div style={mainContainerStyle}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;700&display=swap'); @keyframes gradientAnimation { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }`}</style>
        <div style={lottieContainerStyle}>
          <Lottie options={defaultOptions} height={isMobile ? 180 : 400} width={isMobile ? 180 : 400} />
        </div>
        <div style={authContainerStyle}>
          <div style={formCardStyle}>
            <h2 style={{ textAlign: 'center', marginBottom: '0.5rem', fontSize: '2.5rem', color: '#D4D4D4', letterSpacing: '0.125rem', userSelect: 'none' }}>Chatbot</h2>
            <div style={{ textAlign: 'center', height: '24px', marginBottom: '15px' }}><Typewriter messages={typewriterMessages} /></div>
            <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ position: 'relative' }}><input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyle} /><FaEnvelope style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#8B8B8D' }} /></div>
              <div style={{ position: 'relative' }}><input type={showPassword ? 'text' : 'password'} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required style={inputStyle} /><FaLock style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#8B8B8D' }} /><button type="button" onClick={togglePasswordVisibility} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#8B8B8D', cursor: 'pointer', fontSize: '1rem' }}>{showPassword ? <FaEyeSlash /> : <FaEye />}</button></div>
              {isError && <p style={{ color: '#FF6B6B', textAlign: 'center', fontSize: '0.9rem' }}>{error?.message}</p>}
              <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '10px' }}>
                <button onClick={handleSignIn} disabled={isLoading} style={{ flex: 1, padding: '12px 25px', borderRadius: '8px', border: 'none', backgroundColor: isLoading ? '#4a4a4a' : '#4dabf7', color: '#fff', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>{isLoading ? '...' : <FaSignInAlt />} Sign In</button>
                <button onClick={handleSignUp} disabled={isLoading} style={{ flex: 1, padding: '12px 25px', borderRadius: '8px', border: 'none', backgroundColor: isLoading ? '#4a4a4a' : '#2F2F37', color: '#D4D4D4', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>{isLoading ? '...' : <FaUserPlus />} Sign Up</button>
              </div>
              <button onClick={handleGithubRepoClick} style={secondaryButtonStyle}><FaGithub style={{ fontSize: '1.2rem' }} /> See Repository</button>
              {/* New Snapshot Button */}
              <button onClick={() => setIsModalOpen(true)} style={secondaryButtonStyle}><FaImage style={{ fontSize: '1.2rem' }} /> View Snapshots</button>
            </form>
            {isSuccess && <p style={{ color: '#4dabf7', textAlign: 'center', fontSize: '0.9rem', marginTop: '15px' }}>Please check your email to verify your account.</p>}
          </div>
        </div>
      </div>
    </>
  );
};

export default Auth;