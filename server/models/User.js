import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js'; // tùy đường dẫn cấu hình sequelize của bạn

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  role: {
    type: DataTypes.ENUM('admin', 'user'),
    defaultValue: 'user',
  },
  recentSearchedCities: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

export default User;
