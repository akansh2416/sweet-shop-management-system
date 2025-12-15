import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { sweetsAPI, inventoryAPI } from '../api';
import type { Sweet } from '../types';
import { useAuth } from '../contexts/AuthContext';

const SweetsList: React.FC = () => {
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [purchaseLoading, setPurchaseLoading] = useState<number | null>(null);
  const [purchaseSuccess, setPurchaseSuccess] = useState<string | null>(null);
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    loadSweets();
  }, []);

  const loadSweets = async () => {
    try {
      setLoading(true);
      const response = await sweetsAPI.getAll();
      setSweets(response.data);
      setError('');
    } catch (err: any) {
      setError('Failed to load sweets. Please check backend connection.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (sweetId: number, sweetName: string) => {
    try {
      setPurchaseLoading(sweetId);
      setPurchaseSuccess(null);
      await inventoryAPI.purchase(sweetId, 1);
      setPurchaseSuccess(`Purchased "${sweetName}" successfully!`);
      await loadSweets(); // Refresh list
    } catch (err: any) {
      setError(err.response?.data?.error || 'Purchase failed. Check stock or login.');
    } finally {
      setPurchaseLoading(null);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Client-side search for simplicity
  };

  const filteredSweets = sweets.filter(sweet =>
    sweet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sweet.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="container" style={{ padding: '40px', textAlign: 'center' }}>
        <p>Loading sweets...</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>Our Sweet Collection 🍬</h1>
        {isAdmin && (
          <Link to="/admin" className="btn btn-primary">
            Go to Admin Panel
          </Link>
        )}
      </div>
      
      {/* Messages */}
      {purchaseSuccess && (
        <div style={{
          background: '#d4edda',
          color: '#155724',
          padding: '10px 15px',
          borderRadius: '5px',
          marginBottom: '20px',
          border: '1px solid #c3e6cb'
        }}>
          ✅ {purchaseSuccess}
          <button 
            onClick={() => setPurchaseSuccess(null)}
            style={{ float: 'right', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>
      )}
      
      {error && (
        <div style={{
          background: '#f8d7da',
          color: '#721c24',
          padding: '10px 15px',
          borderRadius: '5px',
          marginBottom: '20px'
        }}>
          ⚠️ {error}
          <button 
            onClick={loadSweets}
            style={{
              marginLeft: '10px',
              background: 'transparent',
              border: '1px solid #721c24',
              color: '#721c24',
              padding: '3px 10px',
              borderRadius: '3px',
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </div>
      )}

      {/* Search Bar */}
      <form onSubmit={handleSearch} style={{ marginBottom: '30px' }}>
        <input
          type="text"
          placeholder="Search sweets by name or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            fontSize: '16px',
            border: '1px solid #ddd',
            borderRadius: '5px'
          }}
        />
        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <button type="submit" className="btn btn-primary">
            Search
          </button>
          <button 
            type="button" 
            className="btn btn-outline"
            onClick={() => { setSearchTerm(''); loadSweets(); }}
          >
            Clear
          </button>
        </div>
      </form>

      {/* Sweets Grid */}
      {filteredSweets.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', background: 'white', borderRadius: '8px' }}>
          <p>No sweets found {searchTerm ? 'matching your search' : 'in inventory'}.</p>
          {searchTerm && (
            <button 
              className="btn btn-outline"
              onClick={() => setSearchTerm('')}
            >
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: '20px' 
        }}>
          {filteredSweets.map((sweet) => (
            <div 
              key={sweet.id} 
              style={{
                background: 'white',
                borderRadius: '8px',
                padding: '20px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <h3 style={{ marginBottom: '10px' }}>{sweet.name}</h3>
              <p style={{ color: '#666', flexGrow: 1, marginBottom: '15px' }}>
                {sweet.description || 'No description available'}
              </p>
              
              <div style={{ marginBottom: '15px' }}>
                <p><strong>Price:</strong> ${sweet.price.toFixed(2)}</p>
                <p style={{ color: sweet.stock < 10 ? '#dc3545' : '#28a745' }}>
                  <strong>Stock:</strong> {sweet.stock} units
                  {sweet.stock < 10 && <span style={{ marginLeft: '10px', fontSize: '0.9em' }}>(Low Stock!)</span>}
                </p>
              </div>
              
              <button
                className={sweet.stock > 0 ? "btn btn-primary" : "btn"}
                disabled={sweet.stock === 0 || purchaseLoading === sweet.id}
                onClick={() => handlePurchase(sweet.id, sweet.name)}
                style={{
                  width: '100%',
                  opacity: sweet.stock === 0 ? 0.5 : 1,
                  cursor: sweet.stock === 0 ? 'not-allowed' : 'pointer'
                }}
              >
                {purchaseLoading === sweet.id ? 'Processing...' : 
                 sweet.stock > 0 ? 'Purchase' : 'Out of Stock'}
              </button>
              
              <div style={{ marginTop: '10px', fontSize: '0.8em', color: '#999' }}>
                Added: {new Date(sweet.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SweetsList;