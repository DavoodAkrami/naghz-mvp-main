export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-color)]" dir="rtl">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[var(--primary-color2)] mx-auto mb-4"></div>
        <p className="text-[var(--text-secondary)] text-lg">
          در حال بارگذاری...
        </p>
      </div>
    </div>
  )
} 