import { Outlet } from 'react-router-dom'
import BottomNav from './BottomNav'

// The shell every logged-in page shares: a phone-width column of content with
// the bottom nav pinned underneath. Pages just render into the <Outlet/>.
export default function AppLayout() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#faf8f2',
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    }}>
      <main style={{ maxWidth: '480px', margin: '0 auto', padding: '20px 18px 108px' }}>
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
