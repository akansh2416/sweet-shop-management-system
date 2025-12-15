import React, { useState, useEffect } from 'react';
import { sweetsAPI, inventoryAPI } from '../api';
import type { Sweet } from '../types';
import { useAuth } from '../contexts/AuthContext';

const AdminPanel: React.FC = () => {
  const { user } = useAuth();
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showRestockForm, setShowRestockForm] = useState(false);
  const [selectedSweet, setSelectedSweet] = useState<Sweet | null>(null);
  const [newSweet, setNewSweet] = useState({
    name: '',
    description: '',
    price: 0,
    stock: 0
  });
  const [restockQuantity, setRestockQuantity] = useState(10);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadSweets();
  }, []);

  const loadSweets = async () => {
    try {
      setLoading(true);
      const response = await sweetsAPI.getAll();
      setSweets(response.data);
    } catch (err: any) {
      setError('Failed to load sweets. Check backend.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSweet = async () => {
    try {
      if (!newSweet.name || newSweet.price <= 0) {
        setError('Name and price are required');
        return;
      }
      await sweetsAPI.create(newSweet);
      setSuccess(`Added "${newSweet.name}" successfully!`);
      setShowAddForm(false);
      setNewSweet({ name: '', description: '', price: 0, stock: 0 });
      await loadSweets();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to add sweet');
    }
  };

  const handleRestock = async () => {
    if (!selectedSweet) return;
    try {
      await inventoryAPI.restock(selectedSweet.id, restockQuantity);
      setSuccess(`Restocked "${selectedSweet.name}" with ${restockQuantity} units!`);
      setShowRestockForm(false);
      setSelectedSweet(null);
      setRestockQuantity(10);
      await loadSweets();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Restock failed');
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await sweetsAPI.delete(id);
      setSuccess(`Deleted "${name}" successfully!`);
      await loadSweets();
    } catch (err: any) {
      setError('Delete failed');
    }
  };

  const lowStockSweets = sweets.filter(sweet => sweet.stock < 10);

  if (loading) {
    return (
      <div className="container" style={{ padding: '40px', textAlign: 'center' }}>
        <p>Loading admin data...</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '20px' }}>
      <h1 style={{ marginBottom: '20px' }}>Admin Dashboard 👑</h1>
      
      <div style={{
        background: '#d1ecf1',
        color: '#0c5460',
        padding: '15px',
        borderRadius: '5px',
        marginBottom: '20px',
        border: '1px solid #bee5eb'
      }}>
        Welcome, <strong>{user?.name}</strong>! You have <strong>administrator</strong> privileges.
      </div>

      {/* Messages */}
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
            onClick={() => setError('')}
            style={{ float: 'right', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>
      )}
      
      {success && (
        <div style={{
          background: '#d4edda',
          color: '#155724',
          padding: '10px 15px',
          borderRadius: '5px',
          marginBottom: '20px'
        }}>
          ✅ {success}
          <button 
            onClick={() => setSuccess('')}
            style={{ float: 'right', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Stats & Actions */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '15px', 
        marginBottom: '30px' 
      }}>
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', textAlign: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
          <h3>{sweets.length}</h3>
          <p>Total Sweets</p>
        </div>
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', textAlign: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: lowStockSweets.length > 0 ? '#dc3545' : '#28a745' }}>
            {lowStockSweets.length}
          </h3>
          <p>Low Stock</p>
        </div>
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', textAlign: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
          <h3>${sweets.reduce((sum, s) => sum + s.price * s.stock, 0).toFixed(2)}</h3>
          <p>Inventory Value</p>
        </div>
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', textAlign: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
          <button 
            className="btn btn-success"
            onClick={() => setShowAddForm(true)}
            style={{ width: '100%' }}
          >
            + Add Sweet
          </button>
        </div>
      </div>

      {/* Low Stock Warning */}
      {lowStockSweets.length > 0 && (
        <div style={{
          background: '#fff3cd',
          color: '#856404',
          padding: '15px',
          borderRadius: '5px',
          marginBottom: '20px',
          border: '1px solid #ffeaa7'
        }}>
          <h4>⚠️ Low Stock Alert</h4>
          <ul style={{ marginBottom: '10px' }}>
            {lowStockSweets.map(sweet => (
              <li key={sweet.id} style={{ marginBottom: '5px' }}>
                {sweet.name}: <strong>{sweet.stock} units</strong>
                <button 
                  className="btn btn-outline"
                  onClick={() => {
                    setSelectedSweet(sweet);
                    setShowRestockForm(true);
                  }}
                  style={{ marginLeft: '10px', padding: '2px 10px', fontSize: '0.9em' }}
                >
                  Restock
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Sweets Table */}
      <div style={{ background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <div style={{ background: '#333', color: 'white', padding: '15px' }}>
          <h3 style={{ margin: 0 }}>Manage Sweets ({sweets.length})</h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8f9fa' }}>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>ID</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Name</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Description</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Price</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Stock</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sweets.map(sweet => (
                <tr key={sweet.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px' }}>{sweet.id}</td>
                  <td style={{ padding: '12px' }}>{sweet.name}</td>
                  <td style={{ padding: '12px', color: '#666' }}>{sweet.description || '-'}</td>
                  <td style={{ padding: '12px' }}>${sweet.price.toFixed(2)}</td>
                  <td style={{ 
                    padding: '12px', 
                    color: sweet.stock < 10 ? '#dc3545' : '#28a745',
                    fontWeight: sweet.stock < 10 ? 'bold' : 'normal'
                  }}>
                    {sweet.stock} units
                  </td>
                  <td style={{ padding: '12px' }}>
                    <button 
                      className="btn btn-outline"
                      onClick={() => {
                        setSelectedSweet(sweet);
                        setShowRestockForm(true);
                      }}
                      style={{ marginRight: '10px', padding: '5px 10px' }}
                    >
                      Restock
                    </button>
                    <button 
                      className="btn"
                      onClick={() => handleDelete(sweet.id, sweet.name)}
                      style={{ 
                        background: '#dc3545', 
                        color: 'white', 
                        border: 'none',
                        padding: '5px 10px',
                        cursor: 'pointer'
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Sweet Modal */}
      {showAddForm && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '8px',
            width: '90%',
            maxWidth: '500px'
          }}>
            <h3>Add New Sweet</h3>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Name *</label>
              <input
                type="text"
                value={newSweet.name}
                onChange={(e) => setNewSweet({...newSweet, name: e.target.value})}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                placeholder="Chocolate Bar"
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Description</label>
              <textarea
                value={newSweet.description}
                onChange={(e) => setNewSweet({...newSweet, description: e.target.value})}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', minHeight: '60px' }}
                placeholder="Delicious milk chocolate"
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Price ($) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={newSweet.price}
                onChange={(e) => setNewSweet({...newSweet, price: parseFloat(e.target.value) || 0})}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Initial Stock *</label>
              <input
                type="number"
                min="0"
                value={newSweet.stock}
                onChange={(e) => setNewSweet({...newSweet, stock: parseInt(e.target.value) || 0})}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button 
                className="btn btn-outline"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleAddSweet}
              >
                Add Sweet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Restock Modal */}
      {showRestockForm && selectedSweet && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '8px',
            width: '90%',
            maxWidth: '400px'
          }}>
            <h3>Restock {selectedSweet.name}</h3>
            <p>Current stock: <strong>{selectedSweet.stock} units</strong></p>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Add Quantity</label>
              <input
                type="number"
                min="1"
                value={restockQuantity}
                onChange={(e) => setRestockQuantity(parseInt(e.target.value) || 1)}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button 
                className="btn btn-outline"
                onClick={() => {
                  setShowRestockForm(false);
                  setSelectedSweet(null);
                }}
              >
                Cancel
              </button>
              <button 
                className="btn btn-success"
                onClick={handleRestock}
              >
                Restock
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;