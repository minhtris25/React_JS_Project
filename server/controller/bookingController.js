import transporter from "../config/nodemailer.js";
import Booking from "../models/Booking.js";
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import stripe from 'stripe';

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
        <div>
            <h2>Chi tiết đặt phòng của bạn</h2>
            <p>Xin chào <strong>${req.user.username}</strong>,</p>
            <p>Cảm ơn bạn đã đặt phòng! Dưới đây là thông tin chi tiết:</p>
            
            <ul>
                <li><strong>Mã đặt phòng:</strong> ${booking._id}</li>
                <li><strong>Tên khách sạn:</strong> ${roomData.hotel.name}</li>
                <li><strong>Địa chỉ:</strong> ${roomData.hotel.address}</li>
                <li><strong>Ngày nhận phòng:</strong> ${booking.checkInDate.toDateString()}</li>
                <li><strong>Tổng thanh toán:</strong> ${process.env.CURRENCY || '$'}${booking.totalPrice} /đêm</li>
            </ul>
            
            <p>Chúng tôi rất mong được đón tiếp bạn!</p>
            <p>Nếu bạn cần thay đổi thông tin đặt phòng, vui lòng liên hệ với chúng tôi.</p>
            
            <div>
                <p>
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

export const stripePayment = async (req, res)=>{
    try {
        const { bookingId } = req.body;

        const booking = await Booking.findById(bookingId);
        const roomData = await Room.findById(booking.room).populate('hotel');
        const totalPrice = booking.totalPrice;
        const{ origin } = req.headers;

        const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY)

        const line_items = [
            {
                price_data:{
                    currency : "usd",
                    product_data : {
                        name: roomData.hotel.name,
                    },
                    unit_amount: totalPrice * 100
                },
                quantity: 1,
            }
        ]
        // Create Checkout session
        const session = await stripeInstance.checkout.sessions.create({
            line_items,
            mode: "payment",
            success_url :`${origin}/loader/my-bookings`,
            cancel_url: `${origin}/my-bookings`,
            metadata:{
                bookingId,
            }
        })
        res.json({success:true , url : session.url})

    }
    catch(error){
        res.json({success:false , message:`Payment Failed: ${error.message}`})
    }
} 

// DELETE /api/bookings/:id
export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    await booking.deleteOne();
    res.json({ success: true, message: "Booking deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};