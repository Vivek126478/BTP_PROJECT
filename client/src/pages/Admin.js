import React, { useState, useEffect } from 'react';
import { adminAPI, complaintAPI } from '../utils/api';
import { Users, Car, AlertCircle, BarChart } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('stats');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [rides, setRides] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes, ridesRes, complaintsRes] = await Promise.all([
        adminAPI.getDashboardStats(),
        adminAPI.getAllUsers({ limit: 50 }),
        adminAPI.getAllRides({ limit: 50 }),
        complaintAPI.getAllComplaints()
      ]);

      setStats(statsRes.data);
      setUsers(usersRes.data.users);
      setRides(ridesRes.data.rides);
      setComplaints(complaintsRes.data.complaints);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleBanUser = async (userId, username) => {
    if (!window.confirm(`Are you sure you want to ban/unban ${username}?`)) return;

    try {
      await adminAPI.toggleUserBan(userId, {});
      toast.success('User status updated');
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  const handleUpdateComplaint = async (complaintId, status) => {
    try {
      await complaintAPI.updateComplaintStatus(complaintId, { status });
      toast.success('Complaint updated');
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to update complaint');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading admin panel..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

        {/* Tabs */}
        <div className="flex space-x-4 mb-8 overflow-x-auto">
          {['stats', 'users', 'rides', 'complaints'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-lg font-medium transition whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Stats Tab */}
        {activeTab === 'stats' && stats && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <Users className="h-8 w-8 text-primary-600" />
                <span className="text-sm text-gray-500">Users</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.users.total}</p>
              <p className="text-sm text-gray-500 mt-2">
                Active: {stats.users.active} | Banned: {stats.users.banned}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <Car className="h-8 w-8 text-green-600" />
                <span className="text-sm text-gray-500">Rides</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.rides.total}</p>
              <p className="text-sm text-gray-500 mt-2">
                Active: {stats.rides.active} | Completed: {stats.rides.completed}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <AlertCircle className="h-8 w-8 text-red-600" />
                <span className="text-sm text-gray-500">Complaints</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.complaints.total}</p>
              <p className="text-sm text-gray-500 mt-2">
                Pending: {stats.complaints.pending}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <BarChart className="h-8 w-8 text-yellow-600" />
                <span className="text-sm text-gray-500">Ratings</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.ratings.total}</p>
              <p className="text-sm text-gray-500 mt-2">Total ratings submitted</p>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Username
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Wallet
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{user.username}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.walletAddress.substring(0, 10)}...
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            user.isBanned
                              ? 'bg-red-100 text-red-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {user.isBanned ? 'Banned' : 'Active'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleBanUser(user.id, user.username)}
                          className={`px-3 py-1 text-sm rounded ${
                            user.isBanned
                              ? 'bg-green-600 text-white hover:bg-green-700'
                              : 'bg-red-600 text-white hover:bg-red-700'
                          }`}
                        >
                          {user.isBanned ? 'Unban' : 'Ban'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Rides Tab */}
        {activeTab === 'rides' && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Driver
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Route
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Seats
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {rides.map((ride) => (
                    <tr key={ride.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{ride.driver.username}</td>
                      <td className="px-6 py-4">
                        {ride.startLocation} → {ride.endLocation}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {new Date(ride.rideDateTime).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {ride.availableSeats}/{ride.totalSeats}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            ride.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : ride.status === 'completed'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {ride.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Complaints Tab */}
        {activeTab === 'complaints' && (
          <div className="space-y-4">
            {complaints.map((complaint) => (
              <div key={complaint.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="font-semibold text-gray-900">
                      {complaint.complainant.username} reported {complaint.accused.username}
                    </p>
                    <p className="text-sm text-gray-500">
                      Category: {complaint.category} | {new Date(complaint.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 text-sm rounded-full ${
                      complaint.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : complaint.status === 'resolved'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {complaint.status}
                  </span>
                </div>
                <p className="text-gray-700 mb-4">{complaint.description}</p>
                {complaint.status === 'pending' && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleUpdateComplaint(complaint.id, 'investigating')}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                    >
                      Investigate
                    </button>
                    <button
                      onClick={() => handleUpdateComplaint(complaint.id, 'resolved')}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                    >
                      Resolve
                    </button>
                    <button
                      onClick={() => handleUpdateComplaint(complaint.id, 'dismissed')}
                      className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm"
                    >
                      Dismiss
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
