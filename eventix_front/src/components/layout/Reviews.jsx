import { useEffect, useState, useCallback, useRef } from 'react'
import { reviewsApi } from '../../api/reviewsApi'
import { useAuth } from '../../context/AuthContext'
import Stars from '../ui/Stars'
import '../../styles/reviews.css'

export default function Reviews({ eventId }) {
  const { isAuthed, user } = useAuth()
  const [page, setPage] = useState(0)
  const [reviews, setReviews] = useState(null)
  const [summary, setSummary] = useState({ avg: 0, count: 0 })
  const [form, setForm] = useState({ rating: 5, comment: '' })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  
  const abortControllerRef = useRef(null)
  const successTimeoutRef = useRef(null)

  const loadReviews = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    
    abortControllerRef.current = new AbortController()
    setLoading(true)
    setError('')

    try {
      const [summaryData, listData] = await Promise.all([
        reviewsApi.summary(eventId),
        reviewsApi.list(eventId, { page, size: 5 })
      ])
      
      setSummary(summaryData)
      setReviews(listData)
    } catch (e) {
      if (e.name !== 'AbortError') {
        setError('Failed to load reviews. Please try again.')
        console.error('Error loading reviews:', e)
      }
    } finally {
      setLoading(false)
    }
  }, [eventId, page])

  useEffect(() => {
    loadReviews()
    
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current)
      }
    }
  }, [loadReviews])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const trimmedComment = form.comment.trim()
    if (!trimmedComment) {
      setError('Please write a comment')
      return
    }

    if (trimmedComment.length < 10) {
      setError('Comment must be at least 10 characters')
      return
    }

    setSubmitting(true)
    setError('')
    setSuccessMessage('')

    try {
      await reviewsApi.create(eventId, {
        rating: Number(form.rating),
        comment: trimmedComment
      })
      
      setForm({ rating: 5, comment: '' })
      setSuccessMessage('Review posted successfully!')
      
      successTimeoutRef.current = setTimeout(() => {
        setSuccessMessage('')
      }, 3000)
      
      if (page !== 0) {
        setPage(0)
      } else {
        loadReviews()
      }
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to post review. Please try again.')
      console.error('Error posting review:', e)
    } finally {
      setSubmitting(false)
    }
  }

  const handleRatingChange = (rating) => {
    setForm(f => ({ ...f, rating }))
  }

  const handleCommentChange = (e) => {
    setForm(f => ({ ...f, comment: e.target.value }))
    if (error) setError('')
  }

  const canDeleteReview = (review) => {
    return user && (review.authorId === user.id || user.roles?.includes('ADMIN'))
  }

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return
    }

    try {
      await reviewsApi.remove(eventId, reviewId)
      loadReviews()
    } catch (e) {
      setError('Failed to delete review')
      console.error('Error deleting review:', e)
    }
  }

  const hasReviews = reviews?.content && reviews.content.length > 0

  return (
    <section className="reviews-section">
      <div className="reviews-header">
        <h3 className="reviews-title">Reviews</h3>
        <div className="reviews-summary">
          <Stars value={summary.avg} />
          <strong className="reviews-summary-rating">{summary.avg.toFixed(1)}</strong>
          <span className="reviews-summary-count">
            ({summary.count} {summary.count === 1 ? 'review' : 'reviews'})
          </span>
        </div>
      </div>

      {isAuthed && (
        <form onSubmit={handleSubmit} className="review-form">
          <div className="form-group">
            <label htmlFor="rating-select" className="form-label">
              Your Rating
            </label>
            <Stars 
              value={form.rating} 
              interactive 
              onChange={handleRatingChange}
              size="large"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="comment-input" className="form-label">
              Your Review
            </label>
            <textarea
              id="comment-input"
              className="input review-textarea"
              placeholder="Share your experience with this event (minimum 10 characters)"
              value={form.comment}
              onChange={handleCommentChange}
              disabled={submitting}
              rows={3}
              aria-describedby={error ? 'review-error' : undefined}
            />
          </div>

          {error && (
            <div id="review-error" role="alert" className="message message--error">
              {error}
            </div>
          )}

          {successMessage && (
            <div role="status" className="message message--success">
              {successMessage}
            </div>
          )}

          <button 
            type="submit" 
            className="btn review-submit-btn" 
            disabled={submitting || !form.comment.trim()}
          >
            {submitting ? 'Posting...' : 'Post Review'}
          </button>
        </form>
      )}

      {!isAuthed && (
        <div className="message message--info">
          Please log in to leave a review
        </div>
      )}

      {loading ? (
        <div className="card reviews-loading">
          Loading reviews...
        </div>
      ) : error && !hasReviews ? (
        <div className="card message--error">
          {error}
        </div>
      ) : !hasReviews ? (
        <div className="card reviews-empty">
          No reviews yet. Be the first to review this event!
        </div>
      ) : (
        <>
          {reviews.content.map(review => (
            <div key={review.id} className="card review-card">
              <div className="review-header">
                <Stars value={review.rating} />
                <div className="review-date">
                  {new Date(review.createdAt).toLocaleString()}
                </div>
              </div>
              <div className="review-comment">
                {review.comment}
              </div>
              <div className="review-footer">
                <div className="review-author">
                  by {review.author}
                </div>
                {canDeleteReview(review) && (
                  <button
                    onClick={() => handleDeleteReview(review.id)}
                    className="btn review-delete-btn"
                    aria-label={`Delete review by ${review.author}`}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}

          {reviews.totalPages > 1 && (
            <div className="reviews-pagination">
              <button 
                className="btn reviews-pagination-btn" 
                disabled={page === 0} 
                onClick={() => setPage(p => p - 1)}
                aria-label="Previous page"
              >
                ← Previous
              </button>
              <div className="reviews-pagination-info">
                Page {page + 1} of {reviews.totalPages}
              </div>
              <button 
                className="btn reviews-pagination-btn" 
                disabled={page + 1 >= reviews.totalPages} 
                onClick={() => setPage(p => p + 1)}
                aria-label="Next page"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </section>
  )
}