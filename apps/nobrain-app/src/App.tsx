import { Route, Routes } from 'react-router-dom'
import './App.css'

import Landing from './pages/LandingPage'
// import ContentPage from './pages/ContentPage'
// import CreateContentPage from './pages/CreateContentPage'
import ContentWrapperPage from './pages/ContentWrapperPage'
import { AppPage } from './pages/AppPage'

function App() {
  return (
    <Routes>
      <Route path='/' element={<Landing />} />
      {/* <Route path='/:contentType/:category/:id' element={<ContentPage />} /> */}
      <Route path='/read/:content_id' element={<ContentWrapperPage initialMode='read' />} />
      <Route path='/create/:content_type' element={<ContentWrapperPage initialMode='edit' />} />
      <Route path='/repeat' element={''} />
      <Route path='/play/:app_name' element={<AppPage />} />
      <Route path='/play' element={''} />
    </Routes>
  )
}

export default App
