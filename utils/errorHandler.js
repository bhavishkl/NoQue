import { toast } from 'react-toastify'

export function handleApiError(res, error, customMessage = 'An unexpected error occurred') {
  console.error('API Error:', error)
  
  if (error.code === 'PGRST301') {
    return res.status(404).json({ error: 'Resource not found' })
  }
  
  if (error.code === 'PGRST204') {
    return res.status(403).json({ error: 'Insufficient privileges' })
  }
  
  // Add more specific error codes as needed
  
  return res.status(500).json({ error: customMessage })
}

export function handleClientError(error, customMessage = 'An unexpected error occurred') {
  console.error('Client Error:', error)
  toast.error(customMessage)
}