import { lazy, Suspense, useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import AppLayout from './components/AppLayout'
import AuthPage from './pages/AuthPage'
import HomePage from './pages/HomePage'
import { SessionProvider } from './lib/session'
import { supabase } from './lib/supabase'
import './i18n'

const ContactsPage = lazy(() => import('./pages/ContactsPage'))
const RightsPage = lazy(() => import('./pages/RightsPage'))
const RightsDetailPage = lazy(() => import('./pages/RightsDetailPage'))
const MapPage = lazy(() => import('./pages/MapPage'))
const PlaceDetailPage = lazy(() => import('./pages/PlaceDetailPage'))
const SalaryPage = lazy(() => import('./pages/SalaryPage'))
const PhrasebookPage = lazy(() => import('./pages/PhrasebookPage'))
const MePage = lazy(() => import('./pages/MePage'))

const OrganizationsPage = lazy(
  () => import('./pages/OrganizationsPage')
)

const CreateOrganizationPage = lazy(
  () => import('./pages/CreateOrganizationPage')
)

const OrganizationDetailPage = lazy(
  () => import('./pages/OrganizationDetailPage')
)

function LoadingScreen() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#faf8f2',
        color: '#1a6b4a',
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '15px',
      }}
    >
      Just a sec...
    </div>
  )
}

export default function App() {
  const [session, setSession] = useState(undefined)

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data }) => {
        setSession(data.session)
      })
      .catch(() => {
        setSession(null)
      })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  if (session === undefined) {
    return <LoadingScreen />
  }

  const protectedLayout = session ? (
    <SessionProvider value={session}>
      <AppLayout />
    </SessionProvider>
  ) : (
    <Navigate to="/auth" replace />
  )

  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route
            path="/auth"
            element={
              session ? <Navigate to="/" replace /> : <AuthPage />
            }
          />

          <Route element={protectedLayout}>
            <Route path="/" element={<HomePage />} />
            <Route path="/help" element={<ContactsPage />} />
            <Route path="/rights" element={<RightsPage />} />
            <Route
              path="/rights/:slug"
              element={<RightsDetailPage />}
            />
            <Route path="/map" element={<MapPage />} />
            <Route
              path="/place/:id"
              element={<PlaceDetailPage />}
            />

            <Route
              path="/organizations"
              element={<OrganizationsPage />}
            />
            <Route
              path="/orgs/new"
              element={<CreateOrganizationPage />}
            />
            <Route
              path="/org/:id"
              element={<OrganizationDetailPage />}
            />

            <Route path="/salary" element={<SalaryPage />} />
            <Route
              path="/phrasebook"
              element={<PhrasebookPage />}
            />
            <Route path="/me" element={<MePage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
