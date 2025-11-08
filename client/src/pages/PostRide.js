import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Plus } from 'lucide-react';
import { rideAPI } from '../utils/api';
import toast from 'react-hot-toast';

const RIDE_TAGS = [
  'Office Commute',
  'Airport Drop',
  'College Ride',
  'Weekend Trip',
  'Shopping',
  'Event',
  'Daily',
  'One-time'
];

const PostRide = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    startLocation: '',
    endLocation: '',
    rideDateTime: '',
    totalSeats: 1,
    pricePerSeat: 0,
    tags: [],
    notes: '',
    vehicleMake: '',
    vehicleModel: '',
    vehicleColor: '',
    vehiclePlate: ''
  });

  const handleTagToggle = (tag) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create ride directly in backend database (no blockchain)
      const rideData = {
        startLocation: formData.startLocation,
        endLocation: formData.endLocation,
        rideDateTime: formData.rideDateTime,
        totalSeats: formData.totalSeats,
        pricePerSeat: formData.pricePerSeat,
        tags: formData.tags,
        notes: formData.notes,
        vehicleInfo: {
          make: formData.vehicleMake,
          model: formData.vehicleModel,
          color: formData.vehicleColor,
          plate: formData.vehiclePlate
        }
      };

      await rideAPI.createRide(rideData);
      toast.success('Ride posted successfully!');
      navigate('/my-rides');
    } catch (error) {
      console.error('Error posting ride:', error);
      toast.error(error.response?.data?.error || 'Failed to post ride');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-3 mb-8">
          <Car className="h-8 w-8 text-primary-600" />
          <h1 className="text-3xl font-bold text-gray-900">Post a Ride</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
          {/* Route Information */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Route Information</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Location *
                </label>
                <input
                  type="text"
                  value={formData.startLocation}
                  onChange={(e) =>
                    setFormData({ ...formData, startLocation: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Location *
                </label>
                <input
                  type="text"
                  value={formData.endLocation}
                  onChange={(e) =>
                    setFormData({ ...formData, endLocation: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date & Time *
                </label>
                <input
                  type="datetime-local"
                  value={formData.rideDateTime}
                  onChange={(e) =>
                    setFormData({ ...formData, rideDateTime: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  required
                  min={new Date().toISOString().slice(0, 16)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Seats *
                </label>
                <input
                  type="number"
                  value={formData.totalSeats}
                  onChange={(e) =>
                    setFormData({ ...formData, totalSeats: parseInt(e.target.value) })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  required
                  min="1"
                  max="10"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price per Seat ($)
                </label>
                <input
                  type="number"
                  value={formData.pricePerSeat}
                  onChange={(e) =>
                    setFormData({ ...formData, pricePerSeat: parseFloat(e.target.value) })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ride Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {RIDE_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagToggle(tag)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    formData.tags.includes(tag)
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Vehicle Information */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Vehicle Information</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Make
                </label>
                <input
                  type="text"
                  value={formData.vehicleMake}
                  onChange={(e) =>
                    setFormData({ ...formData, vehicleMake: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., Toyota"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Model
                </label>
                <input
                  type="text"
                  value={formData.vehicleModel}
                  onChange={(e) =>
                    setFormData({ ...formData, vehicleModel: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., Camry"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color
                </label>
                <input
                  type="text"
                  value={formData.vehicleColor}
                  onChange={(e) =>
                    setFormData({ ...formData, vehicleColor: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., Blue"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  License Plate
                </label>
                <input
                  type="text"
                  value={formData.vehiclePlate}
                  onChange={(e) =>
                    setFormData({ ...formData, vehiclePlate: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., ABC123"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              rows="4"
              placeholder="Any additional information for riders..."
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="h-5 w-5" />
            <span>{loading ? 'Posting Ride...' : 'Post Ride'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostRide;
