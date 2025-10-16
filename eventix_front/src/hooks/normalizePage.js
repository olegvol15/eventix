export default function normalizePage(res) {
  const data = res?.data ?? res

  if (data && Array.isArray(data.content)) return data

  if (Array.isArray(data)) {
    return {
      content: data,
      totalPages: 1,
      totalElements: data.length,
      number: 0,
      size: data.length,
    }
  }
  return { content: [], totalPages: 1, totalElements: 0, number: 0, size: 0 }
}