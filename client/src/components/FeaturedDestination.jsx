import React from 'react';
import HotelCard from './HotelCard';
import Title from './Title';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../conext/AppContext';

const FeaturedDestination = () => {
    const {rooms,navigate} = useAppContext();
    
  return rooms.length >0 && (
    <div className='flex flex-col items-center px-6 md:px-16 lg:px-24 bg-slate-50 py-20'>

        <Title title='Điểm Đến Nổi Bật' subTitle='Khám Phá Bộ Sưu Tập Các Bất Động Sản Xuất Sắc Trên Toàn Thế Giới, Cung Cấp Sự Sang Trọng Vô Song Và Những Trải Nghiệm Không Thể Quên'>

        </Title>

      <div className='flex flex-wrap items-center justify-center gap-6 mt-20'>
        {rooms.slice(0, 4).map((room, index) => (
          <HotelCard key={room._id} room={room} index={index} />
        ))}
      </div>
      <button onClick={()=>{navigate('./rooms'); scrollTo(0,0)}}
        className='my-16 px-4 py-2 text-sm font-medium border border-gray-300 rounded 
        bg-white hover:bg-gray-50 transition-all cursor-pointer'>
            Xem tất cả điểm đến
      </button>
    </div>
  );
};

export default FeaturedDestination;
