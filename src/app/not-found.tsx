import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-color)] p-4" dir="rtl">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-[var(--text-primary)] mb-4">
          ۴۰۴
        </h2>
        <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
          صفحه مورد نظر یافت نشد
        </h3>
        <p className="text-[var(--text-secondary)] mb-6">
          صفحه‌ای که به دنبال آن هستید وجود ندارد یا حذف شده است.
        </p>
        <Link
          href="/"
          className="button-primary rounded-lg px-6 py-3 inline-block"
        >
          بازگشت به صفحه اصلی
        </Link>
      </div>
    </div>
  )
} 