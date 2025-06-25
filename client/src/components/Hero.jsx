import React from 'react';
import { assets, cities } from '../assets/assets';
import { useState } from 'react';
import { useAppContext } from '../conext/AppContext';

const Hero = () => {
  const { navigate, getToken, axios, setSearchedCities } = useAppContext();
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  const onSearch = async (e) => {
    e.preventDefault();

    // Kiểm tra ngày Check out phải lớn hơn Check in
    if (checkIn && checkOut && new Date(checkOut) <= new Date(checkIn)) {
      alert("Ngày Check out phải lớn hơn ngày Check in!");
      return;
    }

    navigate(`/rooms?destination=${destination}`);

    // Gọi API lưu thành phố đã tìm kiếm
    await axios.post(
      '/api/user/store-recent-search',
      { recentSearchedCity: destination },
      { headers: { Authorization: `Bearer ${await getToken()}` } }
    );

    // Cập nhật danh sách thành phố đã tìm kiếm (tối đa 3)
    setSearchedCities((prevSearchedCities) => {
      const updatedSearchedCities = [...prevSearchedCities, destination];
      if (updatedSearchedCities.length > 3) updatedSearchedCities.shift();
      return updatedSearchedCities;
    });
  };

  return (
    <div className='flex flex-col items-start justify-center px-6 md:px-16 lg:px-24 xl:px-32 text-white bg-[url("/src/assets/heroImage.png")] bg-no-repeat bg-cover bg-center h-screen'>
      <p className='bg-[#49B9FF]/50 px-3.5 py-1 rounded-full mt-20'>Trải nghiệm khách sạn đỉnh cao</p>
      <h1 className='font-playfair text-2xl md:text-5xl md:text-[56px] md:leading-[56px] font-bold md:font-extrabold max-w-xl mt-4'>Khám Phá Điểm Đến Hoàn Hảo Của Bạn</h1>
      <p>Sự sang trọng và thoải mái vô song đang chờ đón bạn tại các khách sạn và khu nghỉ dưỡng độc quyền nhất thế giới. Hãy bắt đầu hành trình của bạn ngay hôm nay.</p>

      <form onSubmit={onSearch} className='bg-white text-gray-500 rounded-lg px-6 py-4 mt-8 flex flex-col md:flex-row max-md:items-start gap-4 max-md:mx-auto'>

        <div>
          <div className='flex items-center gap-2'>
            <img src={assets.calenderIcon} alt="" className='h-4'/>
            <label htmlFor="destinationInput">Điểm đến</label>
          </div>
          <input onChange={e => setDestination(e.target.value)} value={destination} list='destinations' id="destinationInput" type="text" className="rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none" placeholder="Type here" required />
          <datalist id='destinations'>
            {cities.map((city, index) => (
              <option value={city} key={index} />
            ))}
          </datalist>
        </div>

        <div>
          <div className='flex items-center gap-2'>
            <img src={assets.calenderIcon} alt="" className='h-4'/>
            <label htmlFor="checkIn">trả phòng</label>
          </div>
          <input
            id="checkIn"
            type="date"
             min={new Date().toISOString().split('T')[0]}
            onChange={(e) => setCheckIn(e.target.value)}
            className="rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none"
          />
        </div>

        <div>
          <div className='flex items-center gap-2'>
            <svg className="w-4 h-4 text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 10h16M8 14h8m-4-7V4M7 7V4m10 3V4M5 20h14a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Z" />
            </svg>
            <label htmlFor="checkOut">Trả phòng</label>
          </div>
          <input
            id="checkOut"
            type="date"
            min={checkIn} // Ngày Check out không thể nhỏ hơn Check in
            onChange={(e) => setCheckOut(e.target.value)}
            className="rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none"
          />
        </div>

        <div className='flex md:flex-col max-md:gap-2 max-md:items-center'>
          <label htmlFor="guests">Số Lượng</label>
          <input min={1} max={4} id="guests" type="number" className="rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none max-w-16" placeholder="0" />
        </div>

        <button className='flex items-center justify-center gap-1 rounded-md bg-black py-3 px-4 text-white my-auto cursor-pointer max-md:w-full max-md:py-1'>
          <img src={assets.searchIcon} alt="searchIcon" className='h-7'/>
          <span>Tìm Kiếm</span>
        </button>
      </form>
    </div>
  );
};

export default Hero;