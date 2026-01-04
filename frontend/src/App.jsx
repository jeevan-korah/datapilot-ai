import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Routes, Route } from "react-router-dom";
import Login from './components/Login-signup'
import Admin from './pages/Admin'
import Employee from './pages/Employee'
import AddEmployee from './pages/Addemployee';
function App() {

  return (
    <>
    <Routes>
      <Route index element={<Login/>}/>
      <Route path="/" element={<Login />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/employee" element={<Employee />} />
      <Route path="/add-employee" element={<AddEmployee />} />

    </Routes>
      
    </>
  )
}

export default App
