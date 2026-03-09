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
      <Route path='/read/:content_id' element={<ContentWrapperPage initialMode='read' />} />
      <Route path='/create' element={<ContentWrapperPage initialMode='edit' />} />
      <Route path='/play' element={''} />
      <Route path='/repeat' element={''} />
    </Routes>
  )
}

export default App
