import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function OtpVerification() {
  const location = useLocation();
  const email = location.state?.email;
  
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { verifyOtp, resendOtp } = useContext(AuthContext);

  // Redirect to login if no email is provided
  if (!email) {
    navigate('/login');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!otp.trim()) {
      setError('Please enter the verification code');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const result = await verifyOtp(email, otp.trim());
      
      setSuccess('Account verified successfully! Redirecting...');
      
      // Navigate to the home page
      setTimeout(() => {
        navigate('/');
      }, 1500);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to verify OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setLoading(true);
      setError('');
      
      await resendOtp(email);
      
      setSuccess('A new verification code has been sent! Check the console for the OTP.');
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccess('');
      }, 5000);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend verification code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="otp-container">
      <div className="otp-form">
        <h2>Verify Your Account</h2>
        <p>We've generated a verification code for <strong>{email}</strong></p>
        
        <div className="alert alert-info">
          <strong>Note:</strong> Check the backend console to see your OTP code!
        </div>
        
        {success && <div className="alert alert-success">{success}</div>}
        {error && <div className="alert alert-danger">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="otp">Verification Code</label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6-digit code"
              maxLength="6"
              className="form-control"
              disabled={loading}
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? 'Verifying...' : 'Verify Account'}
          </button>
        </form>
        
        <div className="text-center mt-3">
          <button 
            onClick={handleResendOtp} 
            className="btn btn-link"
            disabled={loading}
          >
            Need a new code? Resend OTP
          </button>
        </div>
        
        <div className="text-center mt-3">
          <button 
            onClick={() => navigate('/login')} 
            className="btn btn-link"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default OtpVerification;