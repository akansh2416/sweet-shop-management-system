import React from 'react';
import { Container,  Card, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home: React.FC = () => {
  const { user, isAdmin } = useAuth();

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} className="text-center">
          <h1 className="display-4 mb-4">Welcome to Sweet Shop 🍬</h1>
          <p className="lead mb-5">
            Manage your sweet inventory with our easy-to-use system. 
            Browse sweets, make purchases, and keep track of your stock.
          </p>
          
          <Card className="shadow mb-5">
            <Card.Body className="p-5">
              <Row>
                <Col md={4} className="mb-4 mb-md-0">
                  <div className="text-center">
                    <div className="display-1 mb-3">🍫</div>
                    <h4>Browse Sweets</h4>
                    <p>Explore our delicious collection of sweets</p>
                  </div>
                </Col>
                <Col md={4} className="mb-4 mb-md-0">
                  <div className="text-center">
                    <div className="display-1 mb-3">🛒</div>
                    <h4>Easy Purchases</h4>
                    <p>Simple and secure purchase system</p>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="text-center">
                    <div className="display-1 mb-3">📊</div>
                    <h4>Track Inventory</h4>
                    <p>Real-time stock management</p>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>

    
<div style={{ marginTop: '30px' }}>
  {user ? (
    <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
      <Link to="/sweets" className="btn btn-primary">
        Browse Sweets
      </Link>
      {isAdmin && (
        <Link to="/admin" className="btn btn-outline">
          Admin Panel
        </Link>
      )}
    </div>
  ) : (
    <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
      <Link to="/login" className="btn btn-primary">
        Login
      </Link>
      <Link to="/register" className="btn btn-outline">
        Register
      </Link>
    </div>
  )}
</div>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;