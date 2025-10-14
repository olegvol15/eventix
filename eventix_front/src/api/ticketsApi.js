import axiosClient from "./axiosClients"

export function reserveTickets(payload) {
  return axiosClient.post('/tickets/reserve', payload)
}

export function confirmTickets(payload) {
  return axiosClient.post('/tickets/confirm', payload)
}
