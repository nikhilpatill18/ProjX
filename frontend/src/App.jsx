import React from 'react'
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Protectedroute from './components/Protectedroute.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Check from './pages/Check.jsx'
import Setting from './pages/Setting.jsx'
import Userprofile from './pages/Userprofile.jsx'
import AddProject from './pages/AddProject.jsx'
import Projects from './pages/Projects.jsx'
const App = () => {
  return (
    <div>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path='/signup' element={<Signup />} />
            <Route path='/login' element={<Login />} />

            <Route path='/dashboard' element={<Protectedroute><Dashboard /></Protectedroute>} />
            <Route path='/setting' element={<Protectedroute><Setting /></Protectedroute>} />
            <Route path='/profile' element={<Protectedroute><Userprofile /></Protectedroute>} />
            <Route path='/add-project' element={<Protectedroute><AddProject /></Protectedroute>} />
            <Route path='/your-project' element={<Protectedroute><Projects /></Protectedroute>} />

          </Routes>
        </Router>
      </AuthProvider>

    </div>
  )
}

export default App
