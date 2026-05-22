import { ClerkProvider, SignedIn, SignedOut, useAuth } from '@clerk/clerk-react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignInPage from './components/SignIn';
import SignUpPage from './components/SignUp';
import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage';
import TestAuth from './components/TestAuth';
import SarLoader from './components/SARLoader';
import SarFooter from './components/Footer';
//CLERK API KEY from .env
const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 'sk_test_ggldhj4h9NPmpo9mH7Xph0LfhpyyBg1KmZGhP0RgjU';

function AppContent() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return (
      <SarLoader></SarLoader>
    );
  }

  return (
    <div className="w-screen h-full m-0 p-0 box-border bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <Router>
        <Routes>
          <Route 
            path="/sign-in/*" 
            element={
              <SignedOut>
                <SignInPage />
              </SignedOut>
            } 
          />
          <Route 
            path="/sign-up/*" 
            element={
              <SignedOut>
                <SignUpPage />
              </SignedOut>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <>
                <SignedIn>
                  <Dashboard />
                </SignedIn>
                <SignedOut>
                  <Navigate to="/sign-in" replace />
                </SignedOut>
              </>
            } 
          />
          <Route 
            path="/test" 
            element={<TestAuth />} 
          />
          <Route 
            path="/" 
            element={
              isSignedIn ? <Navigate to="/dashboard" replace /> : <LandingPage />
            } 
          />
        </Routes>
      </Router>
      <SarFooter></SarFooter>
    </div>
  );
}

function App() {
  return (
    <div className="m-0 p-0 box-border w-full h-full">
      <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
        <AppContent />
      </ClerkProvider>
    </div>
  );
}

export default App;
