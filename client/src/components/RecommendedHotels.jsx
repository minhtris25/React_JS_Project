import React, { useState, useEffect } from 'react';
import HotelCard from './HotelCard';
import Title from './Title';
import { useAppContext } from '../conext/AppContext';

const RecommendedHotels = () => {
    const { rooms, searchedCities } = useAppContext();
    const [recommended, setRecommended] = useState([]);

    useEffect(() => {
        if (searchedCities.length > 0) {
            const filteredHotels = rooms.filter(room => searchedCities.includes(room.hotel.city));
            setRecommended(filteredHotels);
        } else {
            setRecommended([]);
        }
    }, [rooms, searchedCities]);

    if (recommended.length === 0) return null;

    return (
        <div className='flex flex-col items-center px-6 md:px-16 lg:px-24 bg-slate-50 py-20'>
            <Title
                title='Khách Sạn Được Đề Xuất'
                subTitle='Khám phá bộ sưu tập được chúng tôi tuyển chọn kỹ lưỡng về các bất động sản đặc biệt trên khắp thế giới, mang đến sự sang trọng vô song và những trải nghiệm khó quên'
            />
            <div className='flex flex-wrap items-center justify-center gap-6 mt-20'>
                {recommended.slice(0, 4).map((room, index) => (
                    <HotelCard key={room._id} room={room} index={index} />
                ))}
            </div>
        </div>
    );
};

export default RecommendedHotels;