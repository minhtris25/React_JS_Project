import React from 'react';
import Navbar from './components/Navbar';
import RoomDetails from './pages/RoomDetails'
import { useLocation } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import MyBookings from './pages/MyBookings';

const App = () => {
  const isOwnerPath = useLocation().pathname.includes('owner');

  return (
    <div>
      {!isOwnerPath && <Navbar />}
      <div className='min-h-[70vh]'>
              <Routes>
                <Route path='/rooms/:id' element={<RoomDetails/>} />
                <Route path='/my-bookings' element={<MyBookings/>} />
              </Routes>
            </div>
    </div>
  );
};

export default App;