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
// TODO: We still need to create these, keep placeholders
// import SweetsList from './pages/SweetsList';
// import AdminPanel from './pages/AdminPanel';

// Placeholders for pages we haven't built yet
const SweetsListPlaceholder = () => (
  <Container className="py-5 text-center">
    <h2>Sweets List</h2>
    <p>Coming soon... (You need to be logged in to see this)</p>
  </Container>
);

const AdminPanelPlaceholder = () => (
  <Container className="py-5 text-center">
    <h2>Admin Panel</h2>
    <p>Coming soon... (Admin only)</p>
  </Container>
);

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
                  <SweetsListPlaceholder />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute adminOnly>
                  <AdminPanelPlaceholder />
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