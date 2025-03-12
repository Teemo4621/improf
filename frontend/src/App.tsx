import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import NotFound from './pages/NotFound'
import Login from './pages/Login'
import Create from './pages/Create'
import WebFont from 'webfontloader';
import { useEffect } from 'react'
import MainLayout from './components/MainLayout'
import Profile from './pages/Profile'
import Edit from './pages/Edit'
import Callback from './pages/DiscordCallback'
import '@ant-design/v5-patch-for-react-19';

function App() {
  useEffect(() => {
    WebFont.load({
      google: {
        families: ['IBM Plex Sans Thai'],
      },
    });
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
        <Route path='/login' element={<MainLayout><Login /></MainLayout>} />
        <Route path='/create' element={<MainLayout><Create /></MainLayout>} />
        <Route path='/profile/:username' element={<MainLayout><Profile /></MainLayout>} />
        <Route path='/edit' element={<MainLayout><Edit /></MainLayout>} />
        <Route path='/auth/discord/callback' element={<MainLayout><Callback /></MainLayout>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
