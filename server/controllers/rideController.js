const { Ride, RideParticipant, User } = require('../models');
const { Op } = require('sequelize');

// Create a new ride
exports.createRide = async (req, res) => {
  try {
    const {
      blockchainRideId,
      startLocation,
      endLocation,
      startLatitude,
      startLongitude,
      endLatitude,
      endLongitude,
      rideDateTime,
      totalSeats,
      pricePerSeat,
      tags,
      vehicleInfo,
      notes
    } = req.body;

    const ride = await Ride.create({
      blockchainRideId,
      driverId: req.user.id,
      startLocation,
      endLocation,
      startLatitude,
      startLongitude,
      endLatitude,
      endLongitude,
      rideDateTime,
      availableSeats: totalSeats,
      totalSeats,
      pricePerSeat: pricePerSeat || 0,
      tags: tags || [],
      vehicleInfo,
      notes,
      status: 'active'
    });

    res.status(201).json({
      message: 'Ride created successfully',
      ride
    });
  } catch (error) {
    console.error('Create ride error:', error);
    res.status(500).json({ error: 'Failed to create ride' });
  }
};

// Get all active rides with filters
exports.searchRides = async (req, res) => {
  try {
    const {
      startLocation,
      endLocation,
      date,
      minSeats,
      tags,
      maxPrice,
      page = 1,
      limit = 20
    } = req.query;

    const where = { status: 'active' };

    if (startLocation) {
      where.startLocation = { [Op.like]: `%${startLocation}%` };
    }

    if (endLocation) {
      where.endLocation = { [Op.like]: `%${endLocation}%` };
    }

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      where.rideDateTime = {
        [Op.between]: [startOfDay, endOfDay]
      };
    }

    if (minSeats) {
      where.availableSeats = { [Op.gte]: parseInt(minSeats) };
    }

    if (maxPrice) {
      where.pricePerSeat = { [Op.lte]: parseFloat(maxPrice) };
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows: rides } = await Ride.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'driver',
          attributes: ['id', 'username', 'profilePicture', 'walletAddress']
        },
        {
          model: RideParticipant,
          as: 'participants',
          where: { status: 'joined' },
          required: false,
          include: [
            {
              model: User,
              as: 'rider',
              attributes: ['id', 'username', 'profilePicture']
            }
          ]
        }
      ],
      order: [['rideDateTime', 'ASC']],
      limit: parseInt(limit),
      offset
    });

    // Filter by tags if provided
    let filteredRides = rides;
    if (tags) {
      const tagArray = tags.split(',').map(t => t.trim().toLowerCase());
      filteredRides = rides.filter(ride => {
        if (!ride.tags || ride.tags.length === 0) return false;
        return ride.tags.some(tag => tagArray.includes(tag.toLowerCase()));
      });
    }

    res.json({
      rides: filteredRides,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Search rides error:', error);
    res.status(500).json({ error: 'Failed to search rides' });
  }
};

// Get ride by ID
exports.getRideById = async (req, res) => {
  try {
    const { id } = req.params;

    const ride = await Ride.findByPk(id, {
      include: [
        {
          model: User,
          as: 'driver',
          attributes: ['id', 'username', 'email', 'phoneNumber', 'profilePicture', 'walletAddress']
        },
        {
          model: RideParticipant,
          as: 'participants',
          include: [
            {
              model: User,
              as: 'rider',
              attributes: ['id', 'username', 'profilePicture', 'phoneNumber']
            }
          ]
        }
      ]
    });

    if (!ride) {
      return res.status(404).json({ error: 'Ride not found' });
    }

    res.json({ ride });
  } catch (error) {
    console.error('Get ride error:', error);
    res.status(500).json({ error: 'Failed to fetch ride' });
  }
};

// Join a ride
exports.joinRide = async (req, res) => {
  try {
    const { id } = req.params;

    const ride = await Ride.findByPk(id);

    if (!ride) {
      return res.status(404).json({ error: 'Ride not found' });
    }

    if (ride.status !== 'active') {
      return res.status(400).json({ error: 'Ride is not active' });
    }

    if (ride.driverId === req.user.id) {
      return res.status(400).json({ error: 'Cannot join your own ride' });
    }

    if (ride.availableSeats <= 0) {
      return res.status(400).json({ error: 'No seats available' });
    }

    // Check if already joined
    const existingParticipant = await RideParticipant.findOne({
      where: {
        rideId: id,
        riderId: req.user.id,
        status: 'joined'
      }
    });

    if (existingParticipant) {
      return res.status(400).json({ error: 'Already joined this ride' });
    }

    // Create participant and update available seats
    await RideParticipant.create({
      rideId: id,
      riderId: req.user.id,
      status: 'joined'
    });

    await ride.update({
      availableSeats: ride.availableSeats - 1
    });

    res.json({
      message: 'Successfully joined the ride',
      ride
    });
  } catch (error) {
    console.error('Join ride error:', error);
    res.status(500).json({ error: 'Failed to join ride' });
  }
};

// Leave a ride
exports.leaveRide = async (req, res) => {
  try {
    const { id } = req.params;

    const ride = await Ride.findByPk(id);

    if (!ride) {
      return res.status(404).json({ error: 'Ride not found' });
    }

    const participant = await RideParticipant.findOne({
      where: {
        rideId: id,
        riderId: req.user.id,
        status: 'joined'
      }
    });

    if (!participant) {
      return res.status(400).json({ error: 'Not a participant of this ride' });
    }

    // Update participant status and increase available seats
    await participant.update({
      status: 'left',
      leftAt: new Date()
    });

    await ride.update({
      availableSeats: ride.availableSeats + 1
    });

    // Increment cancellation count
    await req.user.increment('cancellationCount');

    res.json({
      message: 'Successfully left the ride',
      ride
    });
  } catch (error) {
    console.error('Leave ride error:', error);
    res.status(500).json({ error: 'Failed to leave ride' });
  }
};

// Cancel a ride (driver only)
exports.cancelRide = async (req, res) => {
  try {
    const { id } = req.params;

    const ride = await Ride.findByPk(id);

    if (!ride) {
      return res.status(404).json({ error: 'Ride not found' });
    }

    if (ride.driverId !== req.user.id) {
      return res.status(403).json({ error: 'Only the driver can cancel the ride' });
    }

    if (ride.status !== 'active') {
      return res.status(400).json({ error: 'Ride is not active' });
    }

    await ride.update({ status: 'cancelled' });

    // Increment driver's cancellation count
    await req.user.increment('cancellationCount');

    res.json({
      message: 'Ride cancelled successfully',
      ride
    });
  } catch (error) {
    console.error('Cancel ride error:', error);
    res.status(500).json({ error: 'Failed to cancel ride' });
  }
};

// Complete a ride (driver only)
exports.completeRide = async (req, res) => {
  try {
    const { id } = req.params;

    const ride = await Ride.findByPk(id);

    if (!ride) {
      return res.status(404).json({ error: 'Ride not found' });
    }

    if (ride.driverId !== req.user.id) {
      return res.status(403).json({ error: 'Only the driver can complete the ride' });
    }

    if (ride.status !== 'active') {
      return res.status(400).json({ error: 'Ride is not active' });
    }

    await ride.update({ status: 'completed' });

    // Update all active participants to completed
    await RideParticipant.update(
      { status: 'completed' },
      {
        where: {
          rideId: id,
          status: 'joined'
        }
      }
    );

    res.json({
      message: 'Ride completed successfully',
      ride
    });
  } catch (error) {
    console.error('Complete ride error:', error);
    res.status(500).json({ error: 'Failed to complete ride' });
  }
};

// Get user's rides (as driver or rider)
exports.getUserRides = async (req, res) => {
  try {
    const { type = 'all' } = req.query; // 'driver', 'rider', or 'all'

    let driverRides = [];
    let riderRides = [];

    if (type === 'driver' || type === 'all') {
      driverRides = await Ride.findAll({
        where: { driverId: req.user.id },
        include: [
          {
            model: RideParticipant,
            as: 'participants',
            include: [
              {
                model: User,
                as: 'rider',
                attributes: ['id', 'username', 'profilePicture']
              }
            ]
          }
        ],
        order: [['rideDateTime', 'DESC']]
      });
    }

    if (type === 'rider' || type === 'all') {
      const participations = await RideParticipant.findAll({
        where: { riderId: req.user.id },
        include: [
          {
            model: Ride,
            as: 'ride',
            include: [
              {
                model: User,
                as: 'driver',
                attributes: ['id', 'username', 'profilePicture']
              }
            ]
          }
        ],
        order: [['createdAt', 'DESC']]
      });

      riderRides = participations.map(p => p.ride);
    }

    res.json({
      driverRides,
      riderRides
    });
  } catch (error) {
    console.error('Get user rides error:', error);
    res.status(500).json({ error: 'Failed to fetch user rides' });
  }
};
