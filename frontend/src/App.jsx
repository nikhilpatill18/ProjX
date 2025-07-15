import React from 'react'
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Protectedroute from './components/Protectedroute.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
const App = () => {
  return (
    <div>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path='/signup' element={<Signup />} />
            <Route path='/login' element={<Login />} />
            <Route path='/dashboard' element={<Protectedroute><Dashboard /></Protectedroute>} />
          </Routes>
        </Router>
      </AuthProvider>

    </div>
  )
}

export default App
