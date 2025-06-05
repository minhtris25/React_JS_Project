import React from 'react'
import RoomDetails from './pages/RoomDetails'
const App = () => {
  return (
    <div>
      {!isOwnerpath && <Navbar />}
      <div className='min-h-[70vh]'>
        <Routes>
          <Route path='/rooms/:id' element={<RoomDetails/>} />
        </Routes>
      </div>
    </div>
  )
}

export default App