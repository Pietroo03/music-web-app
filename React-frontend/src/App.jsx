// Qui si definiscono gli URL dell'app e si associa ogni URL alla pagina React da mostrare.
// Le pagine amministrative sono avvolte da ProtectedRoute, che controlla il ruolo prima di renderizzarle.
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
import EditGenrePage from './pages/EditGenrePage';
import GenresPage from './pages/GenresPage'
import CreateGenrePage from './pages/CreateGenrePage';
import AuthenticationPage from './pages/AuthenticationPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import ResendVerificationPage from './pages/ResendVerificationPage';
import AccountDeletionPage from './pages/AccountDeletionPage';
import ProtectedRoute from './components/security/ProtecteddRoute';

function App() {

  return (

    <>
      <BrowserRouter>
        {/* AppLayout mantiene cornice e navigazione comuni mentre Outlet cambia pagina. */}
        <Routes>
          <Route element={<AppLayout />}>

            <Route path='/' element={<AuthenticationPage />}></Route>
            <Route path='/forgot-password' element={<ForgotPasswordPage />}></Route>
            <Route path='/reset-password' element={<ResetPasswordPage />}></Route>
            <Route path='/verify-email' element={<VerifyEmailPage />}></Route>
            <Route path='/resend-verification' element={<ResendVerificationPage />}></Route>
            <Route path='/account/delete' element={<AccountDeletionPage />}></Route>
            <Route path='/delete-account' element={<AccountDeletionPage />}></Route>
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
            <Route path='/genres/edit/:id' element={
              <ProtectedRoute requiredRole="ADMIN">
                <EditGenrePage />
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
