import axiosClient from './axiosClients'

export const adminEventsApi = {
  list: (params) => axiosClient.get('/admin/events', { params }),
  get: (id) => axiosClient.get(`/admin/events/${id}`),
  create: (body) => axiosClient.post('/admin/events', body),
  update: (id, body) => axiosClient.put(`/admin/events/${id}`, body),
  remove: (id) => axiosClient.delete(`/admin/events/${id}`),

  generateTickets: (eventId, packs) =>
    axiosClient.post(`/admin/events/${eventId}/tickets`, packs),
}

export const adminPlacesApi = {
  list: (params) => axiosClient.get('/admin/places', { params }),
  get: (id) => axiosClient.get(`/admin/places/${id}`),
  create: (body) => axiosClient.post('/admin/places', body),
  update: (id, body) => axiosClient.put(`/admin/places/${id}`, body),
  remove: (id) => axiosClient.delete(`/admin/places/${id}`),
}