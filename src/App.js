import React from 'react';
import EmergencyView from './pages/EmergencyView';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import OTPPage from './pages/OTPPage';
import Dashboard from './pages/Dashboard';
import AllergiesPage from './pages/AllergiesPage';
import MedicinesPage from './pages/MedicinesPage';
import SurgeriesPage from './pages/SurgeriesPage';
import UploadReport from './pages/UploadReport';
import ProfilePage from './pages/ProfilePage';
import VerifyGoogle from './pages/VerifyGoogle';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/otp" element={<OTPPage />} />
        <Route path="/verify-google" element={<VerifyGoogle />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/allergies" element={<AllergiesPage />} />
        <Route path="/medicines" element={<MedicinesPage />} />
        <Route path="/surgeries" element={<SurgeriesPage />} />
        <Route path="/upload" element={<UploadReport />} />
        <Route path="/emergency/:userId" element={<EmergencyView />} /> 
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </Router>
  );
}

export default App;