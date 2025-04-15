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

function App() {

  return (

    <>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>

            <Route path='/' element={<HomePage />}></Route>
            <Route path='/albums' element={<AlbumsPage />}></Route>
            <Route path='/artists' element={<ArtistsPage />}></Route>
            <Route path='/albums/:id' element={<SingleAlbumPage />}></Route>
            <Route path='/artists/:id' element={<SingleArtistPage />}></Route>

            {/* <Route path='/albums/create' element={<CreateAlbumPage />}></Route>
            <Route path='/genres' element={<GenresPage />}></Route>
            <Route path='/artists/create' element={<CreateArtistPage />}></Route>
            <Route path='/genres/create' element={<CreateGenrePage />}></Route>
            <Route path='/albums/edit/:id' element={<EditAlbumPage />}></Route>
            <Route path='/artists/edit/:id' element={<EditArtistPage />}></Route> */}

          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App


