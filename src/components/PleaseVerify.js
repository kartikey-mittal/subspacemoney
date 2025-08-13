// src/components/PleaseVerify.js

import React from 'react';
import { useSignOut } from '@nhost/react';

const PleaseVerify = ({ email }) => {
  const { signOut } = useSignOut();

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#1a1a1a',
    color: '#fff',
    fontFamily: 'Arial, sans-serif',
    textAlign: 'center',
    padding: '20px'
  };

  const cardStyle = {
    padding: '40px',
    borderRadius: '10px',
    backgroundColor: '#2a2a2a',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.5)'
  };

  const buttonStyle = {
    marginTop: '20px',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#007bff',
    color: 'white',
    cursor: 'pointer'
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2>Email Verification Required</h2>
        <p>We've sent a verification link to:</p>
        <p><strong>{email}</strong></p>
        <p>Please check your inbox (and spam folder) and click the link to continue.</p>
        <button onClick={signOut} style={buttonStyle}>
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default PleaseVerify;