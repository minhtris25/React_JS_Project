import User from "../models/User.js";

// Middleware to check if user is authenticated
export const protect = async (req, res, next) => {
  try {
    console.log('req.auth:', req.auth); // Log để debug
    const { userId } = req.auth || {};
    if (!userId) {
      return res.status(401).json({ success: false, message: "Không được xác thực" });
    }
    const user = await User.findById(userId);
    console.log('User from DB:', user); // Log để debug
    if (!user) {
      return res.status(404).json({ success: false, message: "Không tìm thấy người dùng trong database" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error('Lỗi trong middleware protect:', error);
    return res.status(500).json({ success: false, message: "Lỗi server: " + error.message });
  }
};