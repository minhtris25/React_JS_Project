// Dashboard.jsx
import React, { useState, useEffect } from 'react'; // Đảm bảo import useEffect
import Title from '../../components/Title';
import { assets } from '../../assets/assets';
import { useAppContext } from '../../conext/AppContext';

const Dashboard = () => {
    const { currency, user, getToken, toast, axios } = useAppContext();

    const [dashboardData, setDashboardData] = useState({
        bookings: [],
        totalBookings: 0,
        totalRevenue: 0,
    });

    const fetchDashboardData = async () => {
        try {
            const token = await getToken(); // Lấy token trước
            if (!token) {
                console.log("No token available, skipping dashboard data fetch.");
                return;
            }

            const { data } = await axios.get('/api/bookings/hotel', // Sửa lại API endpoint cho phù hợp với bookingController
                { headers: { Authorization: `Bearer ${token}` } } // Sử dụng token đã lấy
            );
            if (data.success) {
                setDashboardData(data.dashboardData);
                console.log("Dashboard data fetched:", data.dashboardData); // Log để kiểm tra dữ liệu
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Error fetching dashboard data:", error); // Log lỗi chi tiết hơn
            toast.error(error.message || "Failed to fetch dashboard data");
        }
    };

    useEffect(() => {
        // Chỉ fetch data nếu người dùng đã đăng nhập (user object có sẵn)
        if (user) {
            fetchDashboardData();
        }
    }, [user, getToken]); // Thêm getToken vào dependency array vì nó là một hàm từ context

    return (
        <div>
            <Title
                align='left'
                font='outfit'
                title='Trang tổng quan'
                subTitle='Theo dõi danh sách phòng của bạn, theo dõi đặt phòng và phân tích doanh thu—tất cả tại một nơi. Luôn cập nhật thông tin chi tiết theo thời gian thực để đảm bảo hoạt động trơn tru.'
            />

            <div className='flex gap-4 my-8'>
                {/* ---- --- Total Bookings-- */}
                <div className='bg-primary/3 border border-primary/10 rounded flex p-4 pr-4'>
                    <img src={assets.totalBookingIcon} alt="" className='max-sm:hidden h-10'/>
                    <div className='flex flex-col sm:ml-4 font-medium'>
                        <p className='text-blue-500 text-lg'>Tổng số lượt đặt chỗ</p>
                        <p className='text-neutral-400 text-base'>{dashboardData.totalBookings}</p>
                    </div>
                </div>

                {/* ---- --- Total Revenue-- */}
                <div className='bg-primary/3 border border-primary/10 rounded flex p-4 pr-4'>
                    <img src={assets.totalRevenueIcon} alt="" className='max-sm:hidden h-10'/>
                    <div className='flex flex-col sm:ml-4 font-medium'>
                        <p className='text-blue-500 text-lg'>Tổng doanh thu</p>
                        <p className='text-neutral-400 text-base'>{currency} {dashboardData.totalRevenue}</p>
                    </div>
                </div>
            </div>

            {/* --- Recent Bookings --- */}
            <h2 className='text-xl text-blue-950/70 font-medium mb-5'>Đặt chỗ gần đây</h2>

            <div className='w-full max-w-3xl text-left border border-gray-300 rounded-lg max-h-80 overflow-y-scroll'>
                <table className='w-full'>
                    <thead className='bg-gray-50'>
                        <tr>
                            <th className='py-3 px-4 text-gray-800 font-medium'>Tên người dùng</th>
                            <th className='py-3 px-4 text-gray-800 font-medium max-sm:hidden'>Tên phòng</th>
                            <th className='py-3 px-4 text-gray-800 font-medium text-center'>Tổng số tiền</th>
                            <th className='py-3 px-4 text-gray-800 font-medium text-center'>Trạng thái thanh toán</th>
                        </tr>
                    </thead>

                    <tbody className='text-sm'>
                        {dashboardData.bookings.map((item, index) => (
                            <tr key={index}>
                                {/* Cột Tên người dùng */}
                                <td className='py-3 px-4 text-gray-700 border-t border-gray-300'>
                                    {/* Kiểm tra item.user có tồn tại và có các thuộc tính firstName, lastName */}
                                    {item.user ? `${item.user.firstName || ''} ${item.user.lastName || ''}`.trim() : 'N/A'}
                                </td>

                                {/* Cột Tên phòng (Room Name) */}
                                <td className='py-3 px-4 text-gray-700 border-t border-gray-300 max-sm:hidden'>
                                    {/* Kiểm tra item.room có tồn tại và có thuộc tính 'name' hoặc 'roomType' */}
                                    {item.room ? (item.room.name || item.room.roomType) : 'N/A'}
                                </td>

                                {/* Cột Tổng số tiền */}
                                <td className='py-3 px-4 text-gray-700 border-t border-gray-300 text-center'>
                                    {currency} {item.totalPrice}
                                </td>

                                {/* Cột Trạng thái thanh toán */}
                                <td className='py-3 px-4 border-t border-gray-300 text-center'>
                                    <button className={`py-1 px-3 text-xs rounded-full ${
                                        item.isPaid ? 'bg-green-200 text-green-600' : 'bg-amber-200 text-yellow-600'
                                    }`}>
                                        {item.isPaid ? 'Hoàn thành' : 'Chưa giải quyết'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {dashboardData.bookings.length === 0 && (
                            <tr>
                                <td colSpan="4" className="py-4 text-center text-gray-500 border-t border-gray-300">
                                    Chưa có đặt phòng nào.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Dashboard;