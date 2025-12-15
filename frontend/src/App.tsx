import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoutes';
// Import the real pages we have created
import Home from './pages/Home'; 
import Login from './pages/Login';
import Register from './pages/Register';
import SweetsList from './pages/SweetsList';
import AdminPanel from './pages/AdminPanel';





function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Container fluid className="px-0">
          <Routes>
            {/* Use the real Home page */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/sweets" 
              element={
                <ProtectedRoute>
                  <SweetsList />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute adminOnly>
                  <AdminPanel/>
                </ProtectedRoute>
              } 
            />
          </Routes>
        </Container>
      </AuthProvider>
    </Router>
  );
}

export default App;