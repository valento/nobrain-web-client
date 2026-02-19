import { User } from './broker'

const TOKEN_KEY = 'auth_token'
const USER_KEY = 'auth_user'

export const storage = {

  getToken: (): string | null => localStorage.getItem(TOKEN_KEY),

  setToken: (token: string) => localStorage.setItem(TOKEN_KEY, token),

  getUser: (): User | null => {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  },

  setUser: (user: User) => localStorage.setItem(USER_KEY, JSON.stringify(user)),
  
  clear: () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  }
}