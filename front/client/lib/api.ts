import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://localhost:3333',
})

export function setAuthToken(token: string) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

export function removeAuthToken() {
  delete api.defaults.headers.common['Authorization']
}