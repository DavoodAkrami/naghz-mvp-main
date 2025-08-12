import { Metadata } from 'next';


const baseMetadata = {
  metadataBase: new URL('https://thenaghz.ir'), 
  keywords: [
    "مهارت‌های نرم", "توسعه فردی", "آموزش آنلاین", "مهارت‌های زندگی", "مهارت", "مدیریت زمان", "حل مسئله", 
    "soft skills", "personal development", "online learning", "life skills",
    "leadership", "communication", "teamwork", "problem solving"
  ],
  authors: [{ name: "نغز", url: "https://thenaghz.ir" }],
  creator: "نغز",
  publisher: "نغز",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large' as const,
      'max-snippet': -1,
    },
  },
  verification: {
    google: "google-site-verification=TEb2wqUiuhi7RpjhdtVFATebdifTCHbT37JIznjdNgY", 
  },
  alternates: {
    canonical: "https://thenaghz.ir",
    languages: {
      'fa-IR': "https://thenaghz.ir/",
      'en-US': "https://thenaghz.ir",
    },
  },
  icons: {
    icon: [
      {
        url: "/Naghz-logo.jpg",
        sizes: "any",
        type: "image/jpeg",
      },
    ],
    shortcut: "/Naghz-logo.jpg",
    apple: "/Naghz-logo.jpg",
  },
  category: "education",
  classification: "educational",
  other: {
    "msapplication-TileColor": "#000000",
    "theme-color": "#000000",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "نغز",
  },
};


export const homeMetadata: Metadata = {
  ...baseMetadata,
  title: "نغز | آموزش مهارت‌های نرم و توسعه فردی",
  description: "نغز, پلتفرم جامع آموزش مهارت‌های نرم، توسعه فردی و یادگیری مهارت‌های ضروری برای موفقیت در زندگی و کار. تجربه یادگیری متفاوت با تمرین‌های ساده و اثرگذار.",
  keywords: [
    ...baseMetadata.keywords,
    "مدیریت زمان", "کار تیمی", "حل مسئله", "ارتباط موثر",
    "time management", "teamwork", "problem solving", "effective communication",
    "تمرین روزانه", "توسعه مهارت", "یادگیری عملی"
  ],
  openGraph: {
    type: "website",
    locale: "fa_IR",
    alternateLocale: "en_US",
    url: "https://thenaghz.ir",
    siteName: "نغز",
    title: "نغز | آموزش مهارت‌های نرم و توسعه فردی",
    description: "نغز, پلتفرم جامع آموزش مهارت‌های نرم، توسعه فردی و یادگیری مهارت‌های ضروری برای موفقیت در زندگی و کار",
    images: [
      {
        url: "/Naghz-logo.jpg",
        width: 1200,
        height: 630,
        alt: "لوگوی نغز - آموزش مهارت‌های نرم",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "نغز | آموزش مهارت‌های نرم و توسعه فردی",
    description: "نغز، پلتفرم جامع آموزش مهارت‌های نرم، توسعه فردی و یادگیری مهارت‌های ضروری برای موفقیت در زندگی و کار",
    images: ["/Naghz-logo.jpg"],
    creator: "@naghz_official",
    site: "@naghz_official",
  },
};


export const dashboardMetadata: Metadata = {
  ...baseMetadata,
  title: "داشبورد | نغز",
  description: "مدیریت دوره‌ها، پروفایل و پیشرفت یادگیری در پلتفرم نغز. پیگیری مهارت‌های آموخته شده و ادامه مسیر توسعه فردی.",
  keywords: [
    ...baseMetadata.keywords,
    "داشبورد کاربری", "مدیریت دوره", "پروفایل کاربری", "پیگیری پیشرفت",
    "user dashboard", "course management", "user profile", "progress tracking"
  ],
  openGraph: {
    type: "website",
    locale: "fa_IR",
    alternateLocale: "en_US",
    url: "https://thenaghz.ir/dashboard",
    siteName: "نغز",
    title: "داشبورد | نغز",
    description: "مدیریت دوره‌ها، پروفایل و پیشرفت یادگیری در پلتفرم نغز",
    images: [
      {
        url: "/Naghz-logo.jpg",
        width: 1200,
        height: 630,
        alt: "داشبورد نغز - مدیریت دوره‌ها",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "داشبورد | نغز",
    description: "مدیریت دوره‌ها، پروفایل و پیشرفت یادگیری در پلتفرم نغز",
    images: ["/Naghz-logo.jpg"],
    creator: "@naghz_official",
    site: "@naghz_official",
  },
};



export const signInMetadata: Metadata = {
  ...baseMetadata,
  title: "ورود | نغز",
  description: "ورود به حساب کاربری نغز و دسترسی به دوره‌های آموزشی مهارت‌های نرم.",
  keywords: [
    ...baseMetadata.keywords,
    "ورود", "لاگین", "حساب کاربری", "دسترسی به دوره",
    "sign in", "login", "user account", "course access"
  ],
  openGraph: {
    type: "website",
    locale: "fa_IR",
    alternateLocale: "en_US",
    url: "https://thenaghz.ir/auth/sign-in",
    siteName: "نغز",
    title: "ورود | نغز",
    description: "ورود به حساب کاربری نغز و دسترسی به دوره‌های آموزشی",
    images: [
      {
        url: "/Naghz-logo.jpg",
        width: 1200,
        height: 630,
        alt: "صفحه ورود - نغز",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ورود | نغز",
    description: "ورود به حساب کاربری نغز و دسترسی به دوره‌های آموزشی",
    images: ["/Naghz-logo.jpg"],
    creator: "@naghz_official",
    site: "@naghz_official",
  },
};


export const signUpMetadata: Metadata = {
  ...baseMetadata,
  title: "ثبت‌نام | نغز",
  description: "ثبت‌نام در نغز و شروع یادگیری مهارت‌های نرم و توسعه فردی. پیوستن به جامعه یادگیرندگان نغز.",
  keywords: [
    ...baseMetadata.keywords,
    "ثبت‌نام", "عضویت", "شروع یادگیری", "جامعه یادگیرندگان",
    "sign up", "registration", "start learning", "learning community"
  ],
  openGraph: {
    type: "website",
    locale: "fa_IR",
    alternateLocale: "en_US",
    url: "https://thenaghz.ir/auth/sign-up",
    siteName: "نغز",
    title: "ثبت‌نام | نغز",
    description: "ثبت‌نام در نغز و شروع یادگیری مهارت‌های نرم",
    images: [
      {
        url: "/Naghz-logo.jpg",
        width: 1200,
        height: 630,
        alt: "صفحه ثبت‌نام - نغز",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ثبت‌نام | نغز",
    description: "ثبت‌نام در نغز و شروع یادگیری مهارت‌های نرم",
    images: ["/Naghz-logo.jpg"],
    creator: "@naghz_official",
    site: "@naghz_official",
  },
};

// Profile metadata
export const profileMetadata: Metadata = {
  ...baseMetadata,
  title: "پروفایل | نغز",
  description: "مدیریت پروفایل کاربری، تنظیمات حساب و مشاهده پیشرفت در پلتفرم نغز.",
  keywords: [
    ...baseMetadata.keywords,
    "پروفایل کاربری", "تنظیمات حساب", "مدیریت اطلاعات شخصی", "پیشرفت یادگیری",
    "user profile", "account settings", "personal information", "learning progress"
  ],
  openGraph: {
    type: "website",
    locale: "fa_IR",
    alternateLocale: "en_US",
    url: "https://thenaghz.ir/dashboard/profile",
    siteName: "نغز",
    title: "پروفایل | نغز",
    description: "مدیریت پروفایل کاربری و تنظیمات حساب در نغز",
    images: [
      {
        url: "/Naghz-logo.jpg",
        width: 1200,
        height: 630,
        alt: "پروفایل کاربری - نغز",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "پروفایل | نغز",
    description: "مدیریت پروفایل کاربری و تنظیمات حساب در نغز",
    images: ["/Naghz-logo.jpg"],
    creator: "@naghz_official",
    site: "@naghz_official",
  },
};

// My Courses metadata
export const myCoursesMetadata: Metadata = {
  ...baseMetadata,
  title: "دوره‌های من | نغز",
  description: "مشاهده و مدیریت دوره‌های ثبت‌نام شده در نغز. ادامه یادگیری مهارت‌های نرم و توسعه فردی.",
  keywords: [
    ...baseMetadata.keywords,
    "دوره‌های من", "دوره‌های ثبت‌نام شده", "ادامه یادگیری", "مهارت‌های آموخته شده",
    "my courses", "enrolled courses", "continue learning", "learned skills"
  ],
  openGraph: {
    type: "website",
    locale: "fa_IR",
    alternateLocale: "en_US",
    url: "https://thenaghz.ir/dashboard/my-curses",
    siteName: "نغز",
    title: "دوره‌های من | نغز",
    description: "مشاهده و مدیریت دوره‌های ثبت‌نام شده در نغز",
    images: [
      {
        url: "/Naghz-logo.jpg",
        width: 1200,
        height: 630,
        alt: "دوره‌های من - نغز",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "دوره‌های من | نغز",
    description: "مشاهده و مدیریت دوره‌های ثبت‌نام شده در نغز",
    images: ["/Naghz-logo.jpg"],
    creator: "@naghz_official",
    site: "@naghz_official",
  },
};

// Account Info metadata
export const accountInfoMetadata: Metadata = {
  ...baseMetadata,
  title: "اطلاعات حساب | نغز",
  description: "مدیریت اطلاعات حساب کاربری، تنظیمات امنیتی و جزئیات اشتراک در نغز.",
  keywords: [
    ...baseMetadata.keywords,
    "اطلاعات حساب", "تنظیمات امنیتی", "جزئیات اشتراک", "مدیریت حساب",
    "account information", "security settings", "subscription details", "account management"
  ],
  openGraph: {
    type: "website",
    locale: "fa_IR",
    alternateLocale: "en_US",
    url: "https://thenaghz.ir/dashboard/account-info",
    siteName: "نغز",
    title: "اطلاعات حساب | نغز",
    description: "مدیریت اطلاعات حساب کاربری و تنظیمات امنیتی",
    images: [
      {
        url: "/Naghz-logo.jpg",
        width: 1200,
        height: 630,
        alt: "اطلاعات حساب - نغز",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "اطلاعات حساب | نغز",
    description: "مدیریت اطلاعات حساب کاربری و تنظیمات امنیتی",
    images: ["/Naghz-logo.jpg"],
    creator: "@naghz_official",
    site: "@naghz_official",
  },
};

