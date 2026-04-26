import { Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute, PublicLayout } from './components/layout/AppLayout.jsx'
import { ToastViewport } from './components/ui/index.jsx'
import BookDetailsPage from './pages/BookDetailsPage.jsx'
import BooksPage from './pages/BooksPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import ManualReaderPage from './pages/ManualReaderPage.jsx'
import MeetingRoomPage from './pages/MeetingRoomPage.jsx'
import PlatformPage from './pages/PlatformPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import RequestsPage from './pages/RequestsPage.jsx'
import TndArchitecturePage from './pages/TndArchitecturePage.jsx'

function App() {
  return (
    <>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/books" element={<BooksPage />} />
          <Route path="/plateforme" element={<PlatformPage />} />
          <Route path="/architecture-tnd" element={<TndArchitecturePage />} />
          <Route path="/books/:bookId/read" element={<ManualReaderPage />} />
          <Route path="/books/:bookId" element={<BookDetailsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/requests"
            element={
              <ProtectedRoute>
                <RequestsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/meeting-room/:requestId"
            element={
              <ProtectedRoute>
                <MeetingRoomPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/:roleName"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
      <ToastViewport />
    </>
  )
}

export default App
