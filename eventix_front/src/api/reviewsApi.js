import axiosClient from './axiosClients'

export const reviewsApi = {
  list: (eventId, { page = 0, size = 5 } = {}) =>
    axiosClient.get(`/events/${eventId}/reviews`, { params: { page, size, sort: 'createdAt,desc' } }),

  summary: (eventId) =>
    axiosClient.get(`/events/${eventId}/reviews/summary`),

  create: (eventId, payload) =>
    axiosClient.post(`/events/${eventId}/reviews`, payload),

  remove: (eventId, reviewId) =>
    axiosClient.delete(`/events/${eventId}/reviews/${reviewId}`),
}
