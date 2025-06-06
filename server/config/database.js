import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('hotel_booking', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL connected');
  } catch (error) {
    console.error('Connection failed:', error);
  }
};

export default connectDB; // ← default export
export { sequelize };     // ← named export nếu cần dùng Sequelize instance
