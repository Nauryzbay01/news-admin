import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

const TOKEN_KEY = 'aina_access_token'
const USERNAME_KEY = 'aina_username'

function loadToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

function loadUsername(): string | null {
  try {
    return localStorage.getItem(USERNAME_KEY)
  } catch {
    return null
  }
}

interface AuthState {
  accessToken: string | null
  username: string | null
  isAuthenticated: boolean
}

const token = loadToken()
const username = loadUsername()

const initialState: AuthState = {
  accessToken: token,
  username: username ?? (token ? 'admin' : null),
  isAuthenticated: Boolean(token),
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (
      state,
      action: PayloadAction<{ accessToken: string; username: string }>,
    ) => {
      state.accessToken = action.payload.accessToken
      state.username = action.payload.username
      state.isAuthenticated = true
      try {
        localStorage.setItem(TOKEN_KEY, action.payload.accessToken)
        localStorage.setItem(USERNAME_KEY, action.payload.username)
      } catch {
        /* ignore */
      }
    },
    logout: (state) => {
      state.accessToken = null
      state.username = null
      state.isAuthenticated = false
      try {
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(USERNAME_KEY)
      } catch {
        /* ignore */
      }
    },
  },
})

export const { loginSuccess, logout } = authSlice.actions
export const authReducer = authSlice.reducer
