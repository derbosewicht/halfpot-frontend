'use client';

import { useState, useEffect } from 'react';
import { Button } from "./ui/button";  // Adjusted import path to match new folder structure
import { ScrollArea } from "./ui/scroll-area"; // Adjusted import path


export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [winners, setWinners] = useState([]);
  const [token, setToken] = useState('');

  useEffect(() => {
    // Get the token from localStorage
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);

    if (storedToken) {
      fetchAdminData(storedToken);
    }
  }, []);

  const fetchAdminData = async (token) => {
    try {
      const usersResponse = await fetch('http://localhost:5000/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const usersData = await usersResponse.json();
      setUsers(usersData);

      const purchasesResponse = await fetch('http://localhost:5000/admin/purchases', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const purchasesData = await purchasesResponse.json();
      setPurchases(purchasesData);

      const winnersResponse = await fetch('http://localhost:5000/leaderboard', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const winnersData = await winnersResponse.json();
      setWinners(winnersData);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    }
  };

  const handlePickWinner = async () => {
    try {
      const response = await fetch('http://localhost:5000/pick-winner', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        throw new Error('Failed to pick monthly winner');
      }

      const data = await response.json();
      console.log('Monthly winner picked:', data);
      fetchAdminData(token); // Refresh winners list
    } catch (error) {
      console.error('Error picking monthly winner:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5000/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      console.log('User deleted successfully');
      fetchAdminData(token); // Refresh users list
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      const response = await fetch(`http://localhost:5000/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole })
      });

      if (!response.ok) {
        throw new Error('Failed to update user role');
      }

      console.log('User role updated successfully');
      fetchAdminData(token); // Refresh users list
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-4xl font-bold mb-4">Admin Dashboard</h1>
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Users</h2>
        <ScrollArea className="h-64 border border-green-500 p-2">
          {users.map((user, index) => (
            <div key={index} className="flex items-center justify-between mb-2">
              <p>{user.email} - Role: {user.role}</p>
              <div className="flex space-x-2">
                <Button 
                  className="bg-red-500 text-white hover:bg-red-600"
                  onClick={() => handleDeleteUser(user._id)}
                >
                  Delete
                </Button>
                <select
                  value={user.role}
                  onChange={(e) => handleUpdateUserRole(user._id, e.target.value)}
                  className="bg-black text-green-500 border border-green-500"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
          ))}
        </ScrollArea>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Purchases</h2>
        <ScrollArea className="h-64 border border-green-500 p-2">
          {purchases.map((purchase, index) => (
            <p key={index} className="mb-2">
              {purchase.username} - Amount: ${purchase.potAmount}
            </p>
          ))}
        </ScrollArea>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Monthly Winners</h2>
        <ScrollArea className="h-64 border border-green-500 p-2">
          {winners.map((winner, index) => (
            <p key={index} className="mb-2">
              {winner.username} - Month: {winner.month} - Amount: ${winner.amount}
            </p>
          ))}
        </ScrollArea>
        <Button 
          className="mt-4 bg-green-500 text-black hover:bg-green-600"
          onClick={handlePickWinner}
        >
          Pick Monthly Winner
        </Button>
      </section>
    </div>
  );
}
