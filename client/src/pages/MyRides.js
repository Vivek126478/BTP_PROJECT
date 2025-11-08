import React, { useState, useEffect } from 'react';
import { rideAPI } from '../utils/api';
import RideCard from '../components/RideCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Car, Users } from 'lucide-react';
import toast from 'react-hot-toast';

const MyRides = () => {
  const [activeTab, setActiveTab] = useState('driver');
  const [driverRides, setDriverRides] = useState([]);
  const [riderRides, setRiderRides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyRides();
  }, []);

  const fetchMyRides = async () => {
    try {
      setLoading(true);
      const response = await rideAPI.getUserRides('all');
      setDriverRides(response.data.driverRides);
      setRiderRides(response.data.riderRides);
    } catch (error) {
      console.error('Error fetching rides:', error);
      toast.error('Failed to fetch your rides');
    } finally {
      setLoading(false);
    }
  };

  const currentRides = activeTab === 'driver' ? driverRides : riderRides;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Rides</h1>

        {/* Tabs */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('driver')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition ${
              activeTab === 'driver'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Car className="h-5 w-5" />
            <span>As Driver ({driverRides.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('rider')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition ${
              activeTab === 'rider'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Users className="h-5 w-5" />
            <span>As Rider ({riderRides.length})</span>
          </button>
        </div>

        {/* Rides List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" text="Loading your rides..." />
          </div>
        ) : currentRides.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentRides.map((ride) => (
              <RideCard key={ride.id} ride={ride} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500 text-lg">No rides found</p>
            <p className="text-gray-400 mt-2">
              {activeTab === 'driver'
                ? 'You haven\'t posted any rides yet'
                : 'You haven\'t joined any rides yet'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRides;
