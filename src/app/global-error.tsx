'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="fa" dir="rtl">
      <body>
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg-color)] p-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
              خطای سیستمی
            </h2>
            <p className="text-[var(--text-secondary)] mb-6">
              خطای جدی‌ای رخ داده است. لطفاً صفحه را بارگذاری مجدد کنید.
            </p>
            <button
              onClick={reset}
              className="button-primary rounded-lg px-6 py-3"
            >
              بارگذاری مجدد
            </button>
          </div>
        </div>
      </body>
    </html>
  )
} 