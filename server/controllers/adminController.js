const { User, Ride, RideParticipant, Complaint, SOSAlert, Rating } = require('../models');
const { Op } = require('sequelize');

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, status } = req.query;

    const where = {};

    if (search) {
      where[Op.or] = [
        { username: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { walletAddress: { [Op.like]: `%${search}%` } }
      ];
    }

    if (status === 'banned') {
      where.isBanned = true;
    } else if (status === 'active') {
      where.isBanned = false;
      where.isActive = true;
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows: users } = await User.findAndCountAll({
      where,
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      limit: parseInt(limit),
      offset,
      order: [['createdAt', 'DESC']]
    });

    // Get additional stats for each user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const ridesAsDriver = await Ride.count({ where: { driverId: user.id } });
        const ridesAsRider = await RideParticipant.count({ where: { riderId: user.id } });
        const ratingsCount = await Rating.count({ where: { rateeId: user.id } });
        const complaintsCount = await Complaint.count({ where: { accusedId: user.id } });

        return {
          ...user.toJSON(),
          stats: {
            ridesAsDriver,
            ridesAsRider,
            ratingsCount,
            complaintsCount
          }
        };
      })
    );

    res.json({
      users: usersWithStats,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Get all rides
exports.getAllRides = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;

    const where = {};
    if (status) {
      where.status = status;
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows: rides } = await Ride.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'driver',
          attributes: ['id', 'username', 'email', 'walletAddress']
        },
        {
          model: RideParticipant,
          as: 'participants',
          include: [
            {
              model: User,
              as: 'rider',
              attributes: ['id', 'username']
            }
          ]
        }
      ],
      limit: parseInt(limit),
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      rides,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get all rides error:', error);
    res.status(500).json({ error: 'Failed to fetch rides' });
  }
};

// Ban/Unban user
exports.toggleUserBan = async (req, res) => {
  try {
    const { userId } = req.params;
    const { reason } = req.body;

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(403).json({ error: 'Cannot ban admin users' });
    }

    await user.update({
      isBanned: !user.isBanned
    });

    res.json({
      message: user.isBanned ? 'User banned successfully' : 'User unbanned successfully',
      user: {
        id: user.id,
        username: user.username,
        isBanned: user.isBanned
      }
    });
  } catch (error) {
    console.error('Toggle user ban error:', error);
    res.status(500).json({ error: 'Failed to update user status' });
  }
};

// Get dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const activeUsers = await User.count({ where: { isActive: true, isBanned: false } });
    const bannedUsers = await User.count({ where: { isBanned: true } });

    const totalRides = await Ride.count();
    const activeRides = await Ride.count({ where: { status: 'active' } });
    const completedRides = await Ride.count({ where: { status: 'completed' } });
    const cancelledRides = await Ride.count({ where: { status: 'cancelled' } });

    const totalComplaints = await Complaint.count();
    const pendingComplaints = await Complaint.count({ where: { status: 'pending' } });
    const resolvedComplaints = await Complaint.count({ where: { status: 'resolved' } });

    const totalSOSAlerts = await SOSAlert.count();
    const activeSOSAlerts = await SOSAlert.count({ where: { status: 'active' } });

    const totalRatings = await Rating.count();

    res.json({
      users: {
        total: totalUsers,
        active: activeUsers,
        banned: bannedUsers
      },
      rides: {
        total: totalRides,
        active: activeRides,
        completed: completedRides,
        cancelled: cancelledRides
      },
      complaints: {
        total: totalComplaints,
        pending: pendingComplaints,
        resolved: resolvedComplaints
      },
      sos: {
        total: totalSOSAlerts,
        active: activeSOSAlerts
      },
      ratings: {
        total: totalRatings
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
  }
};
