import React from 'react'
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Protectedroute from './components/Protectedroute.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Check from './pages/Check.jsx'
import Setting from './pages/Setting.jsx'
import UserProfile from './pages/Userprofile.jsx'
import AddProject from './pages/AddProject.jsx'
import Projects from './pages/Projects.jsx'
import MyProjectPage from './pages/MyProjectPage.jsx'
import ProjectDetailsModal from './components/ProjectDetailsModal.jsx'
import { Provider } from 'react-redux'
import store from './store/Store.js'
import VerifyEmail from './pages/VerifyEmail.jsx'
import CompleteProfile from './pages/CompleteProfile.jsx'
const App = () => {
  return (
    <div>
      <Provider store={store}>
        <AuthProvider>

          <Router>
            <Routes>
              <Route path='/signup' element={<Signup />} />
              <Route path='/login' element={<Login />} />

              <Route path='/dashboard' element={<Protectedroute><Dashboard /></Protectedroute>} />
              <Route path='/setting' element={<Protectedroute><Setting /></Protectedroute>} />
              <Route path='/profile' element={<Protectedroute><UserProfile /></Protectedroute>} />
              <Route path='/add-project' element={<Protectedroute><AddProject /></Protectedroute>} />
              <Route path='/your-project' element={<Protectedroute><Projects /></Protectedroute>} />
              <Route path='/projects/:projectId' element={<Protectedroute><MyProjectPage /></Protectedroute>} />
              <Route path='/complete-profile' element={<CompleteProfile/>}/>
              <Route path='verify-email' element={<VerifyEmail/>}/>

            </Routes>
          </Router>
        </AuthProvider>
      </Provider>

    </div>
  )
}

export default App
