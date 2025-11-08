import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Users, DollarSign, Star, Phone } from 'lucide-react';
import { format } from 'date-fns';
import { rideAPI, ratingAPI } from '../utils/api';
import { useWeb3 } from '../context/Web3Context';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const RideDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useWeb3();
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState({ stars: 5, comment: '' });
  const [ratingTarget, setRatingTarget] = useState(null);

  useEffect(() => {
    fetchRideDetails();
  }, [id]);

  const fetchRideDetails = async () => {
    try {
      const response = await rideAPI.getRideById(id);
      setRide(response.data.ride);
    } catch (error) {
      console.error('Error fetching ride:', error);
      toast.error('Failed to load ride details');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRide = async () => {
    setActionLoading(true);
    try {
      await rideAPI.joinRide(id);
      toast.success('Successfully joined the ride!');
      fetchRideDetails();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to join ride');
    } finally {
      setActionLoading(false);
    }
  };

  const handleLeaveRide = async () => {
    if (!window.confirm('Are you sure you want to leave this ride?')) return;
    setActionLoading(true);
    try {
      await rideAPI.leaveRide(id);
      toast.success('Left the ride');
      fetchRideDetails();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to leave ride');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelRide = async () => {
    if (!window.confirm('Are you sure you want to cancel this ride?')) return;
    setActionLoading(true);
    try {
      await rideAPI.cancelRide(id);
      toast.success('Ride cancelled');
      fetchRideDetails();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to cancel ride');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCompleteRide = async () => {
    setActionLoading(true);
    try {
      await rideAPI.completeRide(id);
      toast.success('Ride marked as completed!');
      fetchRideDetails();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to complete ride');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSubmitRating = async () => {
    try {
      await ratingAPI.submitRating({
        rateeId: ratingTarget.id,
        rideId: id,
        stars: rating.stars,
        comment: rating.comment
      });
      toast.success('Rating submitted successfully!');
      setShowRatingModal(false);
      setRating({ stars: 5, comment: '' });
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to submit rating');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading ride details..." />
      </div>
    );
  }

  if (!ride) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Ride not found</p>
      </div>
    );
  }

  const isDriver = ride.driver.id === user?.id;
  const isParticipant = ride.participants?.some(
    (p) => p.riderId === user?.id && p.status === 'joined'
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Status Badge */}
          <div className="flex justify-between items-start mb-6">
            <span
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                ride.status === 'active'
                  ? 'bg-green-100 text-green-800'
                  : ride.status === 'completed'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {ride.status.toUpperCase()}
            </span>
          </div>

          {/* Driver Info */}
          <div className="flex items-center space-x-4 mb-6 pb-6 border-b">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-primary-600 font-bold text-2xl">
                {ride.driver.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{ride.driver.username}</h2>
              <p className="text-gray-500">Driver</p>
              {(isDriver || isParticipant) && ride.driver.phoneNumber && (
                <div className="flex items-center space-x-1 text-sm text-gray-600 mt-1">
                  <Phone className="h-4 w-4" />
                  <span>{ride.driver.phoneNumber}</span>
                </div>
              )}
            </div>
          </div>

          {/* Route */}
          <div className="space-y-4 mb-6">
            <div className="flex items-start space-x-3">
              <MapPin className="h-6 w-6 text-green-500 mt-1" />
              <div>
                <p className="text-sm text-gray-500">From</p>
                <p className="text-lg font-semibold text-gray-900">{ride.startLocation}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <MapPin className="h-6 w-6 text-red-500 mt-1" />
              <div>
                <p className="text-sm text-gray-500">To</p>
                <p className="text-lg font-semibold text-gray-900">{ride.endLocation}</p>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-6 pb-6 border-b">
            <div className="flex items-center space-x-3">
              <Calendar className="h-6 w-6 text-primary-600" />
              <div>
                <p className="text-sm text-gray-500">Date & Time</p>
                <p className="font-medium">{format(new Date(ride.rideDateTime), 'PPp')}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Users className="h-6 w-6 text-primary-600" />
              <div>
                <p className="text-sm text-gray-500">Available Seats</p>
                <p className="font-medium">
                  {ride.availableSeats} / {ride.totalSeats}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <DollarSign className="h-6 w-6 text-green-600" />
              <div>
                <p className="text-sm text-gray-500">Price per Seat</p>
                <p className="font-medium">${ride.pricePerSeat || 0}</p>
              </div>
            </div>
          </div>

          {/* Participants */}
          {ride.participants && ride.participants.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Participants</h3>
              <div className="space-y-2">
                {ride.participants
                  .filter((p) => p.status === 'joined')
                  .map((participant) => (
                    <div
                      key={participant.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-primary-600 font-semibold">
                            {participant.rider.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="font-medium">{participant.rider.username}</span>
                      </div>
                      {ride.status === 'completed' && (
                        <button
                          onClick={() => {
                            setRatingTarget(participant.rider);
                            setShowRatingModal(true);
                          }}
                          className="flex items-center space-x-1 text-primary-600 hover:text-primary-700"
                        >
                          <Star className="h-4 w-4" />
                          <span className="text-sm">Rate</span>
                        </button>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            {!isDriver && !isParticipant && ride.status === 'active' && ride.availableSeats > 0 && (
              <button
                onClick={handleJoinRide}
                disabled={actionLoading}
                className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50"
              >
                Join Ride
              </button>
            )}

            {isParticipant && ride.status === 'active' && (
              <button
                onClick={handleLeaveRide}
                disabled={actionLoading}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
              >
                Leave Ride
              </button>
            )}

            {isDriver && ride.status === 'active' && (
              <>
                <button
                  onClick={handleCompleteRide}
                  disabled={actionLoading}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                >
                  Complete Ride
                </button>
                <button
                  onClick={handleCancelRide}
                  disabled={actionLoading}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                >
                  Cancel Ride
                </button>
              </>
            )}

            {ride.status === 'completed' && isDriver && (
              <button
                onClick={() => {
                  setRatingTarget(ride.driver);
                  setShowRatingModal(true);
                }}
                className="px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
              >
                Rate Participants
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Rate {ratingTarget?.username}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Rating</label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating({ ...rating, stars: star })}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`h-8 w-8 ${
                          star <= rating.stars ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Comment</label>
                <textarea
                  value={rating.comment}
                  onChange={(e) => setRating({ ...rating, comment: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  rows="3"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleSubmitRating}
                  className="flex-1 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  Submit
                </button>
                <button
                  onClick={() => setShowRatingModal(false)}
                  className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RideDetails;
