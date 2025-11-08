import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { ratingAPI, authAPI } from '../utils/api';
import { User, Star, AlertTriangle, Edit2 } from 'lucide-react';
import { formatAddress } from '../utils/web3';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateUser } = useWeb3();
  const [ratings, setRatings] = useState([]);
  const [stats, setStats] = useState({ totalRatings: 0, averageRating: '0.00' });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phoneNumber: '',
    bio: ''
  });

  useEffect(() => {
    if (user) {
      fetchUserData();
      setFormData({
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber || '',
        bio: user.bio || ''
      });
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      const response = await ratingAPI.getUserRatings(user.id);
      setRatings(response.data.ratingsReceived);
      setStats(response.data.statistics);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await authAPI.updateProfile(formData);
      await updateUser();
      toast.success('Profile updated successfully!');
      setEditing(false);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update profile');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading profile..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
                <User className="h-10 w-10 text-primary-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{user?.username}</h1>
                <p className="text-gray-500">{formatAddress(user?.walletAddress)}</p>
                <p className="text-sm text-gray-600 mt-1">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={() => setEditing(!editing)}
              className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
            >
              <Edit2 className="h-4 w-4" />
              <span>{editing ? 'Cancel' : 'Edit Profile'}</span>
            </button>
          </div>

          {editing ? (
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  rows="3"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
              >
                Save Changes
              </button>
            </form>
          ) : (
            <div className="space-y-2">
              {user?.phoneNumber && (
                <p className="text-gray-700">
                  <span className="font-medium">Phone:</span> {user.phoneNumber}
                </p>
              )}
              {user?.bio && (
                <p className="text-gray-700">
                  <span className="font-medium">Bio:</span> {user.bio}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="flex justify-center mb-2">
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.averageRating}</p>
            <p className="text-gray-500">Average Rating</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="flex justify-center mb-2">
              <User className="h-8 w-8 text-primary-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.totalRatings}</p>
            <p className="text-gray-500">Total Ratings</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="flex justify-center mb-2">
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{user?.cancellationCount || 0}</p>
            <p className="text-gray-500">Cancellations</p>
          </div>
        </div>

        {/* Ratings */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Ratings Received</h2>
          {ratings.length > 0 ? (
            <div className="space-y-4">
              {ratings.map((rating) => (
                <div key={rating.id} className="border-b pb-4 last:border-b-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{rating.rater.username}</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < rating.stars ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(rating.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {rating.comment && <p className="text-gray-700">{rating.comment}</p>}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No ratings yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
