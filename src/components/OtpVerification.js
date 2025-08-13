// src/components/OtpVerification.js

import React, { useState } from 'react';
// !! YAHAN BADLAV HAI !!
import { useNhostClient } from '@nhost/react';
import { FaKey, FaSignInAlt } from 'react-icons/fa';

const OtpVerification = ({ email }) => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // !! YAHAN BADLAV HAI !!
  const nhost = useNhostClient();

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
        setError({ message: "OTP must be 6 digits."});
        return;
    }
    setIsLoading(true);
    setError(null);
    
    // !! YAHAN BADLAV HAI !!
    const { error: verifyError } = await nhost.auth.signInWithEmailOtp({ email, otp });
    setIsLoading(false);

    if (verifyError) {
      setError(verifyError);
    }
    // Agar koi error nahi hai, toh App.js ka logic user ko
    // automatically Chat page par redirect kar dega.
  };

  const containerStyle = { display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'linear-gradient(45deg, #0A0A0A, #15151A)', color: '#E0E0E0' };
  const formCardStyle = { width: '100%', maxWidth: '400px', padding: '40px', borderRadius: '15px', backgroundColor: 'rgba(25, 25, 30, 0.7)', backdropFilter: 'blur(10px)', boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)', border: '1px solid rgba(255, 255, 255, 0.1)', animation: 'fadeIn 1s ease-out' };
  const inputStyle = { width: '100%', padding: '12px 40px', boxSizing: 'border-box', borderRadius: '8px', border: '1px solid #4a4a4a', backgroundColor: '#2C2C34', color: '#E0E0E0', fontSize: '1rem', outline: 'none', letterSpacing: '0.5rem', textAlign: 'center' };

  return (
    <div style={containerStyle}>
        <style>{`@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
        <div style={formCardStyle}>
            <h2 style={{ textAlign: 'center' }}>Verify OTP</h2>
            <p style={{ textAlign: 'center', color: '#aaa' }}>
                An OTP has been sent to <br /> <strong>{email}</strong>
            </p>
            <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
                <div style={{ position: 'relative' }}>
                    <input 
                        type="tel" // "tel" is better for numeric input on mobile
                        placeholder="_ _ _ _ _ _" 
                        value={otp} 
                        onChange={(e) => setOtp(e.target.value)} 
                        required 
                        maxLength="6"
                        style={inputStyle} 
                    />
                    <FaKey style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#8B8B8D' }} />
                </div>
                {error && <p style={{ color: '#FF6B6B', textAlign: 'center', fontSize: '0.9rem' }}>{error.message}</p>}
                <button type="submit" disabled={isLoading} style={{ width: '100%', marginTop: '10px', padding: '12px 25px', borderRadius: '8px', border: 'none', backgroundColor: isLoading ? '#4a4a4a' : '#4dabf7', color: '#fff', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    {isLoading ? 'Verifying...' : <FaSignInAlt />} Verify & Sign In
                </button>
            </form>
        </div>
    </div>
  );
};
export default OtpVerification;
