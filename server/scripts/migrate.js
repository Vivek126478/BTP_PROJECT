const { sequelize } = require('../models');

async function migrate() {
  try {
    console.log('Starting database migration...\n');

    // Test connection
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.\n');

    // Sync all models
    console.log('Syncing database models...');
    await sequelize.sync({ force: false, alter: true });
    console.log('✅ All models synchronized successfully.\n');

    console.log('Database migration completed successfully! 🎉\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrate();
