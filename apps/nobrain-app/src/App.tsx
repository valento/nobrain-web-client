import { Route, Routes } from 'react-router-dom'
import './App.css'

import Landing from './pages/LandingPage'
// import ContentPage from './pages/ContentPage'
// import CreateContentPage from './pages/CreateContentPage'
import ContentWrapperPage from './pages/ContentWrapperPage'

function App() {
  return (
    <Routes>
      <Route path='/' element={<Landing />} />
      {/* <Route path='/:contentType/:category/:id' element={<ContentPage />} /> */}
      <Route path='/:contentType/:category/:id' element={<ContentWrapperPage mode='read' />} />
      <Route path='/create/:user_id' element={<ContentWrapperPage mode='edit' />} />
      <Route path='/play' element={''} />
    </Routes>
  )
}

export default App
