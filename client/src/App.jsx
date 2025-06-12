import React from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import RoomDetails from './pages/RoomDetails';
import { useLocation } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import MyBookings from './pages/MyBookings';
import AllRooms from './pages/AllRooms';
import Footer from './components/Footer';
import HotelReg from './components/HotelReg';
import Layout from './pages/hotelOwner/Layout';
import Dashboard from './pages/hotelOwner/Dashboard';
import ListRoom from './pages/hotelOwner/ListRoom';
import AddRoom from './pages/hotelOwner/AddRoom';
import {Toaster} from 'react-hot-toast'; 
import { useAppContext } from './conext/AppContext';
import Loader from './components/Loader';

const App = () => {
  const isOwnerPath = useLocation().pathname.includes('owner');
  const {showHotelReg} = useAppContext();

  return (
    <div>
      <Toaster />
      {!isOwnerPath && <Navbar />}
      {showHotelReg && <HotelReg />}
      <div className='min-h-[70vh]'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/rooms' element={<AllRooms />} />
          <Route path='/rooms/:id' element={<RoomDetails />} />
          <Route path='/my-bookings' element={<MyBookings />} />
          <Route path='/loader/:nextUrl' element={<Loader />} />

          <Route path='/owner' element={<Layout/>}>
              <Route index element={<Dashboard/>} />
              <Route path="add-room" element={<AddRoom/>} />
              <Route path="list-room" element={<ListRoom/>} />
          </Route>
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default App;
