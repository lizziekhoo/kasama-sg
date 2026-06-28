import { lazy, Suspense, useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './lib/supabase'
import { SessionProvider } from './lib/session'
import './i18n'

import AuthPage from './pages/AuthPage'
import AppLayout from './components/AppLayout'
import HomePage from './pages/HomePage'

// Lazy-load the feature pages so Leaflet (and the rest) only come down the
// wire when you actually open that screen — keeps the first paint light for
// people on slow connections or basic phones.
const ContactsPage     = lazy(() => import('./pages/ContactsPage'))
const RightsPage       = lazy(() => import('./pages/RightsPage'))
const RightsDetailPage = lazy(() => import('./pages/RightsDetailPage'))
const MapPage          = lazy(() => import('./pages/MapPage'))
const PlaceDetailPage  = lazy(() => import('./pages/PlaceDetailPage'))
const SalaryPage       = lazy(() => import('./pages/SalaryPage'))
const PhrasebookPage   = lazy(() => import('./pages/PhrasebookPage'))
const MePage           = lazy(() => import('./pages/MePage'))

export default function App() {
  const [session, setSession] = useState(undefined) // undefined = still loading

  useEffect(() => {
    // Let's see if someone's already signed in
    supabase.auth.getSession()
      .then(({ data: { session } }) => setSession(session))
      .catch(() => setSession(null)) // Supabase unreachable? Don't freeze — fall through to the auth page instead of hanging on "Just a sec…"
    // Keep an ear out for sign in/out changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    // Cleanup when we're done
    return () => subscription.unsubscribe()
  }, [])

  // Still figuring out who's here
  if (session === undefined) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#faf8f2',
        fontFamily: "'DM Sans', sans-serif",
        color: '#1a6b4a',
        fontSize: '15px'
      }}>
        Just a sec...
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingScreen />}>
      <Routes>
        {/* Not signed in? You get the auth page. */}
        <Route
          path="/auth"
          element={session ? <Navigate to="/" replace /> : <AuthPage />}
        />

        {/* Everything else lives behind the shared app shell. */}
        <Route
          element={session
            ? <SessionProvider value={session}><AppLayout /></SessionProvider>
            : <Navigate to="/auth" replace />}
        >
          <Route path="/" element={<HomePage />} />
          <Route path="/help" element={<ContactsPage />} />
          <Route path="/rights" element={<RightsPage />} />
          <Route path="/rights/:slug" element={<RightsDetailPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/place/:id" element={<PlaceDetailPage />} />
          <Route path="/salary" element={<SalaryPage />} />
          <Route path="/phrasebook" element={<PhrasebookPage />} />
          <Route path="/me" element={<MePage />} />
        </Route>

        {/* Anything weird just goes home. */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

// Shown for the brief moment a lazy route is loading.
function LoadingScreen() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#faf8f2',
      fontFamily: "'DM Sans', sans-serif",
      color: '#1a6b4a',
      fontSize: '15px',
    }}>
      Just a sec...
    </div>
  )
}
