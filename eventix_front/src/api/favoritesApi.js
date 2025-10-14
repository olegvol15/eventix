import axiosClient from './axiosClients'

export const favoritesApi = {
  list: () => axiosClient.get('/user/favorites'),              
  add:  (eventId) => axiosClient.post(`/user/favorites/${eventId}`),
  remove: (eventId) => axiosClient.delete(`/user/favorites/${eventId}`),
}