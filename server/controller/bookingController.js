import transporter from "../config/nodemailer.js";
import Booking from "../models/Booking.js";
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";

//Function to Check Availability of Room
const checkAvailability = async ({ checkInDate, checkOutDate, room})=>{
    try {
        const bookings = await Booking.find({
            room,
            checkInDate: {$lte: checkOutDate},
            checkOutDate: {$gte: checkInDate},
        });
        const isAvailable = bookings.length === 0;
        return isAvailable;
    } catch (error) {
        console.error(error.message);
    }
}

// API to check availability of room
//POST api/bookings/check-availability
export const checkAvailabilityAPI = async (req, res) =>{
    try {
        const { room, checkInDate, checkOutDate } = req.body;
        const isAvailable = await checkAvailability({ checkInDate, checkOutDate, room});
        res.json({ success: true, isAvailable })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

//API to create a new booking
// POST /api/bookings/book

export const createBooking = async (req, res)=>{
    try {
        const {room, checkInDate, checkOutDate, guests } = req.body;
        const user = req.user._id;

        //Before Booking Check Availability
        const isAvailable = await checkAvailability({
            checkInDate,
            checkOutDate,
            room
        });

        if(!isAvailable){
            return res.json({success: false, message: "Room is not available"})
        }
        const roomData = await Room.findById(room).populate("hotel");
        let totalPrice = roomData.pricePerNight;

        //Calculate totalPrice based on nights
        const checkIn = new Date(checkInDate)
        const checkOut = new Date (checkOutDate)
        const timeDiff = checkOut.getTime() - checkIn.getTime();
        const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));

        totalPrice *= nights;
        const booking = await Booking.create({
            user,
            room,
            hotel: roomData.hotel._id,
            guests: +guests,
            checkInDate,
            checkOutDate,
            totalPrice,
        })

        const mailOptions = {
    from: process.env.SENDER_EMAIL,
    to: req.user.email,
    subject: 'Thông tin đặt phòng khách sạn', // Tiếng Việt hóa
    html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2d3748;">Chi tiết đặt phòng của bạn</h2>
            <p>Xin chào <strong>${req.user.username}</strong>,</p>
            <p>Cảm ơn bạn đã đặt phòng! Dưới đây là thông tin chi tiết:</p>
            
            <ul style="list-style: none; padding: 0;">
                <li style="margin-bottom: 10px;">
                    <strong>Mã đặt phòng:</strong> ${booking._id}
                </li>
                <li style="margin-bottom: 10px;">
                    <strong>Tên khách sạn:</strong> ${roomData.hotel.name}
                </li>
                <li style="margin-bottom: 10px;">
                    <strong>Địa chỉ:</strong> ${roomData.hotel.address}
                </li>
                <li style="margin-bottom: 10px;">
                    <strong>Ngày nhận phòng:</strong> ${new Date(booking.checkInDate).toLocaleDateString()}
                </li>
                <li style="margin-bottom: 10px;">
                    <strong>Ngày trả phòng:</strong> ${new Date(booking.checkOutDate).toLocaleDateString()}
                </li>
                <li style="margin-bottom: 10px;">
                    <strong>Tổng thanh toán:</strong> ${process.env.CURRENCY || '$'}${booking.totalPrice}
                </li>
                <li style="margin-bottom: 10px;">
                    <strong>Số đêm:</strong> ${nights} đêm
                </li>
            </ul>
            
            <p style="margin-top: 20px;">Chúng tôi rất mong được đón tiếp bạn!</p>
            <p>Nếu bạn cần thay đổi thông tin đặt phòng, vui lòng liên hệ với chúng tôi.</p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                <p style="font-size: 12px; color: #718096;">
                    Đây là email tự động, vui lòng không trả lời.
                </p>
            </div>
        </div>
    `
};

try {
    await transporter.sendMail(mailOptions);
    console.log('Email thông báo đã được gửi thành công');
} catch (error) {
    console.error('Lỗi khi gửi email:', error);
    // Không throw error ở đây để không ảnh hưởng đến flow chính
}

        res.json({ success: true, message: "Booking create successfully"})
    } catch (error) {
        console.log(error);
         res.json({ success: false, message: "Failed to create booking"})
    }
}

//API to get all bookings for a user
// GET /api/bookings/user
export const getUserBookings = async (req, res) =>{
    try {
        const user = req.user._id;
        const bookings = await Booking.find({user}).populate("room hotel").sort({createdAt: -1})
        res.json({success: true, bookings})
    } catch (error) {
        res.json({ success: false, message: "Failed to fetch bookings"});
    }
}

export const getHotelBookings = async (req, res) =>{
    try {
        const hotel = await Hotel.findOne({owner: req.auth.userId});
    if(!hotel){
        return res.json({ success: false, message: "No Hotel found"});
    }
    const bookings = await Booking.find({hotel: hotel._id}).populate("room hotel user").sort( {createdAt: -1});
    //Total Bookings
    const totalBookings = bookings.length;
    //Total Revenue
    const totalRevenue = bookings.reduce((acc, booking)=>acc + booking.totalPrice,0 )
    res.json({success: true, dashboardData: {totalBookings, totalRevenue, bookings}})
    } catch (error) {
        res.json({success: false, message: "false to fetch bookings"})
    }
}