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

export const adminReviewsApi = {
  list: (params) => axiosClient.get('/admin/reviews', {params}),
  approve: (id) => axiosClient.post(`/admin/reviews/${id}/approve`),
  reject: (id) => axiosClient.post(`/admin/reviews/${id}/reject`),
  remove: (id) => axiosClient.delete(`/admin/reviews/${id}`),
}

export const adminTicketsApi = {
  generate(eventId, {count, category}) {
    return axiosClient.post(`/admin/events/${eventId}/tickets/generate`, {count, category})
  }
}

