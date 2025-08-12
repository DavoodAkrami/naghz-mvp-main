'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-color)] p-4" dir="rtl">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
          مشکلی پیش آمده است
        </h2>
        <p className="text-[var(--text-secondary)] mb-6">
          متأسفانه خطایی رخ داده است. لطفاً دوباره تلاش کنید.
        </p>
        <button
          onClick={reset}
          className="button-primary rounded-lg px-6 py-3"
        >
          تلاش مجدد
        </button>
      </div>
    </div>
  )
} 