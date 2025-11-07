import { NavLink, Route, Routes, Navigate, useLocation } from 'react-router-dom'
import EventsPage from './pages/EventsPage.jsx'
import RegistrationsPage from './pages/RegistrationsPage.jsx'
import MembersPage from './pages/MembersPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import AnnouncementsPage from './pages/AnnouncementsPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import { store } from './store.js'
import TopBar from './ui/TopBar.jsx'
import FooterBar from './ui/FooterBar.jsx'

function RequireAuth({ children }) {
	const location = useLocation()
	const auth = store.getAuth()
	if (!auth) {
		return <Navigate to="/login" replace state={{ from: location }} />
	}
	return children
}

export default function App() {
	const auth = store.getAuth()
	return (
        <div className="page">
            <TopBar auth={auth} onLogout={() => { store.logout(); window.location.href = '/login' }} />

            <main className="container">
				<Routes>
					<Route path="/" element={<Navigate to={auth ? '/announcements' : '/login'} replace />} />
					<Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
					<Route path="/announcements" element={<RequireAuth><AnnouncementsPage /></RequireAuth>} />
					<Route path="/events" element={<RequireAuth><EventsPage /></RequireAuth>} />
					<Route path="/registrations" element={<RequireAuth><RegistrationsPage /></RequireAuth>} />
					<Route path="/members" element={<RequireAuth><MembersPage /></RequireAuth>} />
				</Routes>
			</main>
            <FooterBar />
		</div>
	)
}


