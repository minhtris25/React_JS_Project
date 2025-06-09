// GET /api/user
export const getUserData = async (req, res) => {
    try {
        const role = req.user.role;
        const recentSearchedCities = req.user.recentSearchedCities;

        res.json({
            success: true,
            data: {
                role,
                recentSearchedCities
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// POST /api/user/recent-search
export const storeRecentSearchedCities = async (req, res) => {
    try {
        const { recentSearchedCity } = req.body;
        const user = req.user; // Không cần `await` vì `req.user` đã có sẵn từ middleware

        if (!recentSearchedCity) {
            return res.status(400).json({ success: false, message: "City is required" });
        }

        // Thêm thành phố mới, tối đa 3 phần tử
        if (user.recentSearchedCities.length < 3) {
            user.recentSearchedCities.push(recentSearchedCity);
        } else {
            user.recentSearchedCities.shift(); // Xoá phần tử cũ nhất
            user.recentSearchedCities.push(recentSearchedCity);
        }

        await user.save();
        res.json({ success: true, message: "City added" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
