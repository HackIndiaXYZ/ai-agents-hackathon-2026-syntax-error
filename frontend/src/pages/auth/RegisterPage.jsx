import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, CheckCircle, XCircle, Brain, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../../store/authStore';
import api from '../../services/api';

const passwordRules = [
  { label: 'At least 8 characters', test: (p) => p.length >= 8 },
  { label: 'One uppercase letter', test: (p) => /[A-Z]/.test(p) },
  { label: 'One lowercase letter', test: (p) => /[a-z]/.test(p) },
  { label: 'One number', test: (p) => /\d/.test(p) }
];

export default function RegisterPage() {
  const [step, setStep] = useState('register'); // register | verify
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });
  const [otp, setOtp] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [focusPass, setFocusPass] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const { register, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.password || !form.confirmPassword) {
      return toast.error('Please fill all fields');
    }
    if (form.password !== form.confirmPassword) return toast.error('Passwords do not match');
    if (!passwordRules.every(r => r.test(form.password))) return toast.error('Password does not meet requirements');
    
    const result = await register(form.fullName, form.email, form.password);
    if (result.success) {
      // Show OTP verification step
      setStep('verify');
      toast.success('Account created! Check your email for the OTP.');
    } else {
      toast.error(result.message);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) return toast.error('Enter the 6-digit OTP');
    setVerifying(true);
    try {
      await api.post('/auth/verify-otp', { email: form.email, otp, type: 'email_verify' });
      toast.success('Email verified! Welcome aboard 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP. Try again.');
    } finally { setVerifying(false); }
  };

  const handleSkipVerify = () => {
    toast('You can verify your email later from profile settings.', { icon: 'ℹ️' });
    navigate('/dashboard');
  };

  const passStrength = passwordRules.filter(r => r.test(form.password)).length;
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500'];
  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-dark-900 relative overflow-hidden">
      {/* Background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/8 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-purple/8 rounded-full blur-3xl" />
      
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-purple flex items-center justify-center shadow-lg shadow-primary-500/30">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-white">CareerIQ AI</span>
        </Link>

        {/* OTP Verification Step */}
        {step === 'verify' ? (
          <div className="glass-card p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-green to-teal-500 flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-1">Verify Your Email</h2>
              <p className="text-slate-400 text-sm">We sent a 6-digit OTP to <span className="text-primary-400 font-medium">{form.email}</span></p>
            </div>
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div>
                <label className="text-sm text-slate-400 mb-1.5 block">Enter OTP</label>
                <input
                  type="text"
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  className="input-field text-center text-2xl font-mono tracking-widest"
                  autoFocus
                />
              </div>
              <motion.button type="submit" disabled={verifying || otp.length !== 6}
                whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                className="btn-primary w-full flex items-center justify-center gap-2">
                {verifying ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><CheckCircle className="w-4 h-4" /> Verify Email</>}
              </motion.button>
              <button type="button" onClick={handleSkipVerify}
                className="w-full text-center text-sm text-slate-500 hover:text-slate-300 transition-colors py-2">
                Skip for now — verify later
              </button>
            </form>
          </div>
        ) : (
        <div className="glass-card p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-1">Create your account</h2>
            <p className="text-slate-400 text-sm">Start your AI-powered career journey</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="text-sm text-slate-400 mb-1.5 block">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input type="text" name="fullName" value={form.fullName} onChange={handleChange}
                  placeholder="John Doe" className="input-field pl-10" />
              </div>
            </div>
            
            {/* Email */}
            <div>
              <label className="text-sm text-slate-400 mb-1.5 block">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input type="email" name="email" value={form.email} onChange={handleChange}
                  placeholder="you@email.com" className="input-field pl-10" />
              </div>
            </div>
            
            {/* Password */}
            <div>
              <label className="text-sm text-slate-400 mb-1.5 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input type={showPass ? 'text' : 'password'} name="password" value={form.password}
                  onChange={handleChange} onFocus={() => setFocusPass(true)} onBlur={() => setFocusPass(false)}
                  placeholder="Create a strong password" className="input-field pl-10 pr-10" />
                <button type="button" onClick={() => setShowPass(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {(focusPass || form.password) && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-2">
                  <div className="flex gap-1 mb-2">
                    {[0,1,2,3].map(i => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i < passStrength ? strengthColors[passStrength - 1] : 'bg-white/10'}`} />
                    ))}
                  </div>
                  {form.password && (
                    <p className={`text-xs mb-2 ${passStrength >= 4 ? 'text-green-400' : passStrength >= 2 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {strengthLabels[passStrength - 1] || 'Very Weak'}
                    </p>
                  )}
                  <div className="space-y-1">
                    {passwordRules.map(rule => (
                      <div key={rule.label} className="flex items-center gap-2">
                        {rule.test(form.password) ? <CheckCircle className="w-3 h-3 text-green-400 flex-shrink-0" /> : <XCircle className="w-3 h-3 text-slate-600 flex-shrink-0" />}
                        <span className={`text-xs ${rule.test(form.password) ? 'text-green-400' : 'text-slate-500'}`}>{rule.label}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
            
            {/* Confirm Password */}
            <div>
              <label className="text-sm text-slate-400 mb-1.5 block">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input type={showConfirm ? 'text' : 'password'} name="confirmPassword" value={form.confirmPassword}
                  onChange={handleChange} placeholder="Repeat your password"
                  className={`input-field pl-10 pr-10 ${form.confirmPassword && (form.password !== form.confirmPassword ? 'border-red-500/50' : 'border-green-500/50')}`} />
                <button type="button" onClick={() => setShowConfirm(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {form.confirmPassword && form.password !== form.confirmPassword && (
                <p className="text-red-400 text-xs mt-1">Passwords do not match</p>
              )}
            </div>
            
            <motion.button type="submit" disabled={isLoading}
              whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
              className="btn-primary w-full flex items-center justify-center gap-2 mt-2">
              {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Create Account'}
            </motion.button>
          </form>
          
          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">Sign in</Link>
          </p>
        </div>
        )}
      </motion.div>
    </div>
  );
}
