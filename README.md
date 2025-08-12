# نغز (Naghz) - پلتفرم آموزش مهارت‌های نرم

> **نغز, پلتفرم جامع آموزش مهارت‌های نرم، توسعه فردی و یادگیری مهارت‌های ضروری برای موفقیت در زندگی و کار**

A comprehensive platform for teaching soft skills, personal development, and essential life skills for success in life and work.

## 🌟 Features - ویژگی‌ها

### **Core Learning Features**
- **مهارت‌های نرم (Soft Skills)**: Time management, teamwork, problem-solving, communication
- **توسعه فردی (Personal Development)**: Self-improvement and growth-focused content
- **تمرین روزانه (Daily Practice)**: Simple, effective exercises for transformation
- **یادگیری عملی (Practical Learning)**: Hands-on approach to skill development

### **User Experience**
- **Responsive Design**: Mobile-first approach with beautiful UI/UX
- **Progressive Web App (PWA)**: Installable app with offline capabilities

### **Technical Features**
- **User Authentication**: Secure sign-up/sign-in system
- **Dashboard Management**: User progress tracking and course management
- **SEO Optimized**: Comprehensive metadata for search engines

## 🚀 Technology Stack

### **Frontend**
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Smooth animations and transitions

### **State Management**
- **Redux Toolkit**: Predictable state management
- **React Redux**: React bindings for Redux

### **Authentication & Backend**
- **Supabase**: Backend-as-a-Service with real-time database

### **Development Tools**
- **ESLint**: Code quality and consistency
- **PostCSS**: CSS processing
- **Vercel Analytics**: Performance monitoring

## 📁 Project Structure

```
naghz-mvp-main/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── auth/              # Authentication pages
│   │   │   ├── sign-in/       # Sign in page
│   │   │   └── sign-up/       # Sign up page
│   │   ├── dashboard/         # User dashboard
│   │   │   ├── profile/       # User profile
│   │   │   ├── my-curses/     # User courses
│   │   │   └── account-info/  # Account settings
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/            # Reusable components
│   │   ├── Header.tsx         # Navigation header
│   │   └── SideBar.tsx        # Dashboard sidebar
│   ├── config/                # Configuration files
│   │   └── supabase.ts        # Supabase client
│   ├── contexts/              # React contexts
│   ├── providers/             # App providers
│   │   ├── authProvider.tsx   # Authentication context
│   │   └── ReduxProvider.tsx  # Redux store provider
│   ├── routes/                # Route definitions
│   │   └── routes.ts          # Application routes
│   └── store/                 # Redux store
│       ├── hooks.ts           # Redux hooks
│       ├── slices/            # Redux slices
│       │   └── authSlice.ts   # Authentication state
│       └── store.ts           # Store configuration
├── public/                    # Static assets
│   ├── Naghz-logo.jpg        # Application logo
│   ├── manifest.json          # PWA manifest
│   ├── robots.txt             # SEO robots file
│   ├── sitemap.xml           # SEO sitemap
│   └── videos/                # Landing page videos
└── package.json               # Dependencies and scripts
```

## 🛠️ Installation & Setup

### **Prerequisites**
- Node.js 18+ 
- npm, yarn, or pnpm
- Git

### **1. Clone the Repository**
```bash
git clone https://github.com/DavoodAkrami/naghz-mvp-main
cd naghz-mvp-main
```

### **2. Install Dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
```

### **3. Environment Configuration**
Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Application Configuration
NEXT_PUBLIC_APP_URL=https://thenaghz.ir
NEXT_PUBLIC_APP_NAME=نغز
```

### **4. Run Development Server**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🎯 Key Pages & Features

### **Landing Page (`/`)**
- Hero section with engaging video content
- Soft skills introduction
- Call-to-action for user registration
- Responsive design for all devices

### **Authentication (`/auth/*`)**
- **Sign Up**: Multi-step registration process
- **Sign In**: Secure login with validation
- Form validation and error handling
- Responsive design with animations

### **Dashboard (`/dashboard`)**
- **Profile Management**: User information and settings
- **Course Management**: Track enrolled courses
- **Account Settings**: Security and preferences
- **Progress Tracking**: Learning achievements

## 🔧 Development Commands

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

## 🚀 Deployment

### **Vercel (Recommended)**
```bash
npm run build
vercel --prod
```

## 📱 Progressive Web App (PWA)

The application includes PWA features:
- **Installable**: Add to home screen
- **App-like Experience**: Native app feel

## 🤝 Contributing

We welcome contributions! Please read our contributing guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### **Development Guidelines**
- Follow TypeScript best practices
- Use meaningful commit messages
- Test thoroughly before submitting
- Follow the existing code style







## 📞 Support & Contact

- **Website**: [https://thenaghz.ir](https://thenaghz.ir)
- **Email**: thenaghz.io@gmail.com


---

**نغز** - آموزش مهارت‌های نرم برای موفقیت در زندگی و کار

