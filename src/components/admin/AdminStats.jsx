'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export default function AdminStats() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalMessages: 0,
    activeUsers: 0,
    messagesByDay: [],
    usersByDay: []
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/admin/stats', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Erreur:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      {/* Statistiques générales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Utilisateurs totaux</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.totalUsers}</p>
        </div>
        <div className="bg-green-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Messages totaux</h3>
          <p className="text-3xl font-bold text-green-600">{stats.totalMessages}</p>
        </div>
        <div className="bg-purple-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Utilisateurs actifs</h3>
          <p className="text-3xl font-bold text-purple-600">{stats.activeUsers}</p>
        </div>
      </div>

      {/* Graphiques */}
      <div className="space-y-8">
        <div>
          <h3 className="text-xl font-semibold mb-4">Messages par jour</h3>
          <div className="w-full overflow-x-auto">
            <LineChart width={800} height={300} data={stats.messagesByDay}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#3B82F6" name="Messages" />
            </LineChart>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Nouveaux utilisateurs par jour</h3>
          <div className="w-full overflow-x-auto">
            <LineChart width={800} height={300} data={stats.usersByDay}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#10B981" name="Utilisateurs" />
            </LineChart>
          </div>
        </div>
      </div>
    </div>
  );
} 