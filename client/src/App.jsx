import React from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import RoomDetails from './pages/RoomDetails'
import { useLocation } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
<<<<<<< HEAD
import MyBookings from './pages/MyBookings';
import AllRooms from './pages/AllRooms';
=======
import Footer from './components/Footer';
>>>>>>> e688824 (home)

const App = () => {
  const isOwnerPath = useLocation().pathname.includes('owner');

  return (
    <div>
      {!isOwnerPath && <Navbar />}
      <div className='min-h-[70vh]'>
              <Routes>
<<<<<<< HEAD
                <Route path='/rooms' element={<AllRooms/>} />
=======
                <Route path='/' element={<Home/>} />
>>>>>>> e688824 (home)
                <Route path='/rooms/:id' element={<RoomDetails/>} />
                <Route path='/my-bookings' element={<MyBookings/>} />
              </Routes>
            </div>
            <Footer />
    </div>
  );
};

export default App;