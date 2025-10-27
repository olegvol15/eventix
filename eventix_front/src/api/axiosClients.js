import axios from 'axios'

const axiosClient = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000
})

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})


axiosClient.interceptors.response.use(
  (res) => res.data,      
  (err) => Promise.reject(err)
)

export default axiosClient