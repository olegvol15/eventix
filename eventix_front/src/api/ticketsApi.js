import axiosClient from "./axiosClients"

export function reserveTickets(payload) {
  return axiosClient.post('/tickets/reserve', payload)
}

export function confirmTickets(payload) {
  return axiosClient.post('/tickets/confirm', payload)
}

export function getAvailability(eventId) {
  return axiosClient.get(`/events/${eventId}/availability`)
}

export async function confirmMany(reservations) {
  const results = []
  for (const r of reservations) {
    try {
      const res = await confirmTickets({ reservationId: r.reservationId, paymentToken: 'demo-ok' })
      results.push({ ok: true, res })
    } catch (e) {
      results.push({ ok: false, error: e })
    }
  }
  return results
}
