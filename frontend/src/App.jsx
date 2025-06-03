import {Routes, Route} from 'react-router-dom'
import LoginPage from './ui/pages/Login/LoginPage.jsx'
import RegisterPage from './ui/pages/Register/RegisterPage.jsx'
import HomePage from './ui/pages/Home/HomePage.jsx'
import ServicePage from './ui/pages/Services/ServicesPage.jsx'
import AdminPage from './ui/pages/Admin/AdminPage.jsx'
export default function App() {
  return (
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/services" element={<ServicePage />} />
        <Route path="/admin" element={<AdminPage/>} />
      </Routes>
  )
}

