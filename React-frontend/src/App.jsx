import './App.css'
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';
import AppLayout from './layout/AppLayout'
import HomePage from './pages/HomePage'
import AlbumsPage from './pages/AlbumsPage'
import ArtistsPage from './pages/ArtistsPage'
import SingleAlbumPage from './pages/SingleAlbumPage'
import SingleArtistPage from './pages/SingleArtistPage'
import CreateAlbumPage from './pages/CreateAlbumPage';
import CreateArtistPage from './pages/CreateArtistPage';
import EditAlbumPage from './pages/EditAlbumPage';
import EditArtistPage from './pages/EditArtistPage';
import GenresPage from './pages/GenresPage'
import CreateGenrePage from './pages/CreateGenre';
import AuthenticationPage from './pages/AuthenticationPage';
import ProtectedRoute from './components/security/ProtecteddRoute';

function App() {

  return (

    <>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>

            <Route path='/' element={<AuthenticationPage />}></Route>
            <Route path='/home' element={<HomePage />}></Route>
            <Route path='/albums' element={<AlbumsPage />}></Route>
            <Route path='/artists' element={<ArtistsPage />}></Route>
            <Route path='/albums/:id' element={<SingleAlbumPage />}></Route>
            <Route path='/artists/:id' element={<SingleArtistPage />}></Route>

            <Route path='/albums/create' element={
              <ProtectedRoute requiredRole="ADMIN">
                <CreateAlbumPage />
              </ProtectedRoute>
            }
            />
            <Route path='/artists/create' element={
              <ProtectedRoute requiredRole="ADMIN">
                <CreateArtistPage />
              </ProtectedRoute>
            }
            />
            <Route path='/genres' element={
              <ProtectedRoute requiredRole="ADMIN">
                <GenresPage />
              </ProtectedRoute>
            }
            />
            <Route path='/genres/create' element={
              <ProtectedRoute requiredRole="ADMIN">
                <CreateGenrePage />
              </ProtectedRoute>
            }
            />
            <Route path='/albums/edit/:id' element={
              <ProtectedRoute requiredRole="ADMIN">
                <EditAlbumPage />
              </ProtectedRoute>
            }
            />
            <Route path='/artists/edit/:id' element={
              <ProtectedRoute requiredRole="ADMIN">
                <EditArtistPage />
              </ProtectedRoute>
            }
            />

          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App


