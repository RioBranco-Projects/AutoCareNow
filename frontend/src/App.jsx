import {Routes, Route} from 'react-router-dom'
import LoginPage from './ui/pages/Login/LoginPage.jsx'
import RegisterPage from './ui/pages/Register/RegisterPage.jsx'
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  )
}

