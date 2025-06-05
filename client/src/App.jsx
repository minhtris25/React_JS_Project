import React from 'react';
import Navbar from './components/Navbar';
import RoomDetails from './pages/RoomDetails'
import { useLocation } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';

const App = () => {
  const isOwnerPath = useLocation().pathname.includes('owner');

  return (
    <div>
      {!isOwnerPath && <Navbar />}
      <div className='min-h-[70vh]'>
              <Routes>
                <Route path='/rooms/:id' element={<RoomDetails/>} />
              </Routes>
            </div>
    </div>
  );
};

export default App;