import { useState, useEffect, useCallback } from 'react'
import { adminReviewsApi } from '../../api/adminApi'
import normalizePage from '../../hooks/normalizePage'
import '../../styles/adminReviews.css'

export default function AdminReviews() {
  const [reviews, setReviews] = useState(null)
  const [page, setPage] = useState(0)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [processingId, setProcessingId] = useState(null)

  const SIZE = 10
  const SORT = 'createdAt,desc'

  const loadReviews = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      const res = await adminReviewsApi.list({ 
        page, 
        size: SIZE, 
        q: query, 
        status, 
        sort: SORT 
      })
      setReviews(normalizePage(res))
    } catch (e) {
      console.error('Failed to load reviews:', e)
      setError('Failed to load reviews. Please try again.')
      setReviews(normalizePage([]))
    } finally {
      setLoading(false)
    }
  }, [page, query, status])

  useEffect(() => {
    loadReviews()
  }, [loadReviews])

  const handleApplyFilters = () => {
    setPage(0)
    loadReviews()
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleApplyFilters()
    }
  }

  const handleStatusChange = (newStatus) => {
    setPage(0)
    setStatus(newStatus)
  }

  const handleApprove = async (reviewId) => {
    setProcessingId(reviewId)
    try {
      await adminReviewsApi.approve(reviewId)
      await loadReviews()
    } catch (e) {
      console.error('Failed to approve review:', e)
      setError('Failed to approve review. Please try again.')
    } finally {
      setProcessingId(null)
    }
  }

  const handleReject = async (reviewId) => {
    setProcessingId(reviewId)
    try {
      await adminReviewsApi.reject(reviewId)
      await loadReviews()
    } catch (e) {
      console.error('Failed to reject review:', e)
      setError('Failed to reject review. Please try again.')
    } finally {
      setProcessingId(null)
    }
  }

  const handleDelete = async (reviewId, reviewText) => {
    const confirmText = reviewText.length > 50 
      ? `${reviewText.substring(0, 50)}...` 
      : reviewText
    
    if (!window.confirm(`Are you sure you want to delete this review?\n\n"${confirmText}"`)) {
      return
    }

    setProcessingId(reviewId)
    try {
      await adminReviewsApi.remove(reviewId)
      await loadReviews()
    } catch (e) {
      console.error('Failed to delete review:', e)
      setError('Failed to delete review. Please try again.')
    } finally {
      setProcessingId(null)
    }
  }

  const getStatusClass = (reviewStatus) => {
    switch (reviewStatus) {
      case 'APPROVED':
        return 'admin-reviews-table-status--approved'
      case 'REJECTED':
        return 'admin-reviews-table-status--rejected'
      case 'PENDING':
        return 'admin-reviews-table-status--pending'
      default:
        return ''
    }
  }

  if (loading && !reviews) {
    return (
      <div className="admin-reviews">
        <div className="card admin-reviews-loading">Loading reviews...</div>
      </div>
    )
  }

  const rows = reviews?.content ?? []
  const totalPages = reviews?.totalPages ?? 1

  return (
    <div className="admin-reviews">
      <div className="card">
        <div className="admin-reviews-header">
          <h2 className="admin-reviews-title">Reviews</h2>
          <div className="admin-reviews-filters">
            <input 
              className="input admin-reviews-search" 
              placeholder="Search in comments..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)} 
              onKeyDown={handleKeyPress}
            />
            <select 
              className="select admin-reviews-status-select" 
              value={status} 
              onChange={(e) => handleStatusChange(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
            <button 
              className="admin-reviews-apply-btn" 
              onClick={handleApplyFilters}
            >
              Apply Filters
            </button>
          </div>
        </div>

        {error && (
          <div className="admin-reviews-error" role="alert">
            {error}
          </div>
        )}

        <table className="admin-reviews-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Event</th>
              <th>User</th>
              <th>Rating</th>
              <th>Comment</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={8} className="admin-reviews-table-empty">
                  {query || status 
                    ? 'No reviews match your filters. Try adjusting your search.'
                    : 'No reviews found.'}
                </td>
              </tr>
            ) : (
              rows.map(r => (
                <tr key={r.id}>
                  <td data-label="ID" className="admin-reviews-table-id">
                    {r.id}
                  </td>
                  <td data-label="Event">
                    <div className="admin-reviews-table-event">
                      {r.eventName}
                    </div>
                    <div className="admin-reviews-table-event-id">
                      #{r.eventId}
                    </div>
                  </td>
                  <td data-label="User">
                    <div className="admin-reviews-table-user">
                      {r.userEmail}
                    </div>
                    <div className="admin-reviews-table-user-id">
                      #{r.userId}
                    </div>
                  </td>
                  <td data-label="Rating" className="admin-reviews-table-rating">
                    {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                  </td>
                  <td 
                    data-label="Comment" 
                    className="admin-reviews-table-comment"
                    title={r.comment}
                  >
                    {r.comment}
                  </td>
                  <td data-label="Status">
                    <span className={`admin-reviews-table-status ${getStatusClass(r.status)}`}>
                      {r.status}
                    </span>
                  </td>
                  <td data-label="Created" className="admin-reviews-table-date">
                    {new Date(r.createdAt).toLocaleString()}
                  </td>
                  <td data-label="Actions">
                    <div className="admin-reviews-actions">
                      {r.status !== 'APPROVED' && (
                        <button 
                          className="admin-reviews-approve-btn" 
                          onClick={() => handleApprove(r.id)}
                          disabled={processingId === r.id}
                        >
                          {processingId === r.id ? 'Processing...' : 'Approve'}
                        </button>
                      )}
                      {r.status !== 'REJECTED' && (
                        <button 
                          className="admin-reviews-reject-btn" 
                          onClick={() => handleReject(r.id)}
                          disabled={processingId === r.id}
                        >
                          {processingId === r.id ? 'Processing...' : 'Reject'}
                        </button>
                      )}
                      <button 
                        className="admin-reviews-delete-btn" 
                        onClick={() => handleDelete(r.id, r.comment)}
                        disabled={processingId === r.id}
                      >
                        {processingId === r.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="admin-reviews-pagination">
            <button 
              className="admin-reviews-pagination-btn" 
              disabled={page === 0} 
              onClick={() => setPage(p => p - 1)}
              aria-label="Previous page"
            >
              ← Previous
            </button>
            <div className="admin-reviews-pagination-info">
              Page {page + 1} of {totalPages}
            </div>
            <button 
              className="admin-reviews-pagination-btn" 
              disabled={page + 1 >= totalPages} 
              onClick={() => setPage(p => p + 1)}
              aria-label="Next page"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}