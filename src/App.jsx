import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Signup from './pages/common/Signup'
import Login from './pages/common/Login'
import Dashboard from './pages/common/Dashboard'


function App() {
  
  return (
    <>
      <BrowserRouter>

        <Routes>
          <Route path={'/'} element={<Signup/>} />
          <Route path={'/login'} element={<Login/>} />
          <Route path={'/signup'} element={<Signup/>} />

          <Route path={'/dashboard'} element={<Dashboard/>} >
           
          </Route>
          

        </Routes>

      </BrowserRouter>
      

    </>
  )
}

export default App
