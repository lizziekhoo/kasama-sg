import { createContext, useContext } from 'react'

// Lets any logged-in page grab the current session/user without us threading
// props through every route. App.jsx sets the value once at the top.
const SessionContext = createContext(null)

export const SessionProvider = SessionContext.Provider

export function useSession() {
  return useContext(SessionContext)
}
