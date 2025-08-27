import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import EmailVerify from './pages/EmailVerify'
import ResetPassword from './pages/ResetPassword'
import Layout from './components/Layout'
import Navbar from './components/Navbar'
import { ToastContainer } from 'react-toastify'
import NotFound from './pages/NotFound'
import Dashboard from './pages/Dashboard'

const App = () => {
  return (
    <div>
      <ToastContainer />

      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />

        <Route
          path="/*"
          element={
            <Layout>
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/email-verify" element={<EmailVerify />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </div>
  )
}

export default App
