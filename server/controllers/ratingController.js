const { Rating, User, Ride } = require('../models');

// Submit a rating
exports.submitRating = async (req, res) => {
  try {
    const { rateeId, rideId, stars, comment, blockchainTxHash } = req.body;

    if (!rateeId || !rideId || stars === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (stars < 0 || stars > 5) {
      return res.status(400).json({ error: 'Stars must be between 0 and 5' });
    }

    if (rateeId === req.user.id) {
      return res.status(400).json({ error: 'Cannot rate yourself' });
    }

    // Check if already rated
    const existingRating = await Rating.findOne({
      where: {
        raterId: req.user.id,
        rateeId,
        rideId
      }
    });

    if (existingRating) {
      return res.status(400).json({ error: 'Already rated this user for this ride' });
    }

    const rating = await Rating.create({
      raterId: req.user.id,
      rateeId,
      rideId,
      stars,
      comment,
      blockchainTxHash
    });

    res.status(201).json({
      message: 'Rating submitted successfully',
      rating
    });
  } catch (error) {
    console.error('Submit rating error:', error);
    res.status(500).json({ error: 'Failed to submit rating' });
  }
};

// Get user's ratings
exports.getUserRatings = async (req, res) => {
  try {
    const { userId } = req.params;

    const ratingsReceived = await Rating.findAll({
      where: { rateeId: userId },
      include: [
        {
          model: User,
          as: 'rater',
          attributes: ['id', 'username', 'profilePicture']
        },
        {
          model: Ride,
          as: 'ride',
          attributes: ['id', 'startLocation', 'endLocation', 'rideDateTime']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Calculate average rating
    const totalStars = ratingsReceived.reduce((sum, rating) => sum + rating.stars, 0);
    const averageRating = ratingsReceived.length > 0 ? totalStars / ratingsReceived.length : 0;

    res.json({
      ratingsReceived,
      statistics: {
        totalRatings: ratingsReceived.length,
        averageRating: averageRating.toFixed(2)
      }
    });
  } catch (error) {
    console.error('Get user ratings error:', error);
    res.status(500).json({ error: 'Failed to fetch ratings' });
  }
};

// Check if user can rate another user for a specific ride
exports.canRate = async (req, res) => {
  try {
    const { rateeId, rideId } = req.query;

    if (!rateeId || !rideId) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const existingRating = await Rating.findOne({
      where: {
        raterId: req.user.id,
        rateeId,
        rideId
      }
    });

    res.json({
      canRate: !existingRating,
      alreadyRated: !!existingRating
    });
  } catch (error) {
    console.error('Can rate check error:', error);
    res.status(500).json({ error: 'Failed to check rating status' });
  }
};
