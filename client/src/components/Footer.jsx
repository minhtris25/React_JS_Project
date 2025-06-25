import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
     <div className= 'bg-[#F6F9FC] text-gray-500/80 pt-8 px-6 md:px-16 lg:px-24 xl:px-32'>
            <div className='flex flex-wrap justify-between gap-12 md:gap-6'>
                <div className='max-w-80'>
                    <img src={assets.logo} alt="logo" className='mb-4 h-8 md:h-9 invert opacity-80' />
                    <p className='text-sm'>
                        Lorem Ipsum chỉ là văn bản giả dùng trong ngành in ấn và sắp chữ. Lorem Ipsum đã là tiêu chuẩn của ngành này từ những năm 1500.
                    </p>
                    <div className='flex items-center gap-3 mt-4'>
                        <img src={assets.instagramIcon} alt="instagram" className='wp-6'/>
                        <img src={assets.facebookIcon} alt="facebook" className='wp-6'/>
                        <img src={assets.twitterIcon} alt="twitter" className='wp-6'/>
                        <img src={assets.linkendinIcon} alt="linkendin" className='wp-6'/>
                    </div>
                </div>

                <div>
                    <p className='font-playfair text-lg text-gray-800'>CÔNG TY</p>
                    <ul className='mt-3 flex flex-col gap-2 text-sm'>
                        <li><a href="#">Về Chúng Tôi</a></li>
                        <li><a href="#">Tuyển Dụng</a></li>
                        <li><a href="#">Báo Chí</a></li>
                        <li><a href="#">Blog</a></li>
                        <li><a href="#">Đối Tác</a></li>
                    </ul>
                </div>

                <div>
                    <p className='font-playfair text-lg text-gray-800'>HỖ TRỢ</p>
                    <ul className='mt-3 flex flex-col gap-2 text-sm'>
                        <li><a href="#">Trung Tâm Trợ Giúp</a></li>
                        <li><a href="#">Thông Tin An Toàn</a></li>
                        <li><a href="#">Tùy Chọn Hủy</a></li>
                        <li><a href="#">Liên Hệ</a></li>
                        <li><a href="#">Tiếp Cận</a></li>
                    </ul>
                </div>

                <div className='max-w-80'>
                    <p className= 'font-playfair text-lg text-gray-800'>NHẬN THÔNG TIN MỚI</p>
                    <p className='mt-3 text-sm'>
                        Đăng ký nhận bản tin để nhận cảm hứng và ưu đãi đặc biệt.
                    </p>
                    <div className='flex items-center mt-4'>
                        <input type="text" className='bg-white rounded-l border border-gray-300 h-9 px-3 outline-none' placeholder='Email của bạn' />
                        <button className='flex items-center justify-center bg-black h-9 w-9 aspect-square rounded-r'>
                            <img src={assets.arrowIcon} alt="mũi tên"
                            className='w-3.5 invert' />
                            
                        </button>
                    </div>
                </div>
            </div>
            <hr className='border-gray-300 mt-8' />
            <div className='flex flex-col md:flex-row gap-2 items-center justify-between py-5'>
                <p>© {new Date().getFullYear()} GreatStack. Đã đăng ký bản quyền.</p>
                <ul className='flex items-center gap-4'>
                    <li><a href="#">Bảo Mật</a></li>
                    <li><a href="#">Điều Khoản</a></li>
                    <li><a href="#">Sơ Đồ Trang</a></li>
                </ul>
            </div>
        </div>
  )
}

export default Footer
