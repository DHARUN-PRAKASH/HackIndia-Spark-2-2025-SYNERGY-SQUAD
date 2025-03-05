import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import CertificateApp from './pages/CertificateApp';
import SignIn from './pages/SignIn';

const App = () => {
  const isLoggedIn = sessionStorage.getItem('logged'); // Check if user is logged in
  const isAdmin = sessionStorage.getItem('admin') === 'true'; // Check if user is admin

  return (
    <BrowserRouter>
      <Routes>
        {/* Check if the user is logged in */}
        {isLoggedIn ? (
          isAdmin ? (
            // Routes for admin users
            <>
              <Route path="/" element={<CertificateApp />} />
              {/* Add more admin routes here */}
            </>
          ) : (
            // Routes for non-admin users
            <>
              {/* <Route path="/" element={<Table />} /> */}
              {/* Add more non-admin routes here */}
            </>
          )
        ) : (
          // Routes for users who are not logged in
          <>
            <Route path="/" element={<SignIn />} /> {/* Sign-in page for logged-out users */}
            <Route path="*" element={<Navigate to="/" />} /> {/* Redirect to sign-in page */}
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
