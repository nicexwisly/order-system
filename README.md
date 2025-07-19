# Order Management System

A production-ready web application for managing customer orders across Fish and Butchery departments, built with Next.js 14, React, Tailwind CSS, and Supabase.

## Features

- **Department Pages**: Dedicated pages for Fish and Butchery departments with order management
- **Admin Dashboard**: Full-featured dashboard for complete order management
- **Responsive Design**: Mobile-first design optimized for all devices
- **Legacy Browser Support**: Compatible with Android 6.0.1 and Chrome 70
- **Real-time Updates**: Live order status updates using Supabase
- **Modern UI**: Clean, minimal design with excellent UX

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel-ready

## Quick Start

### 1. Clone and Install

\`\`\`bash
git clone <repository-url>
cd order-management-system
npm install
\`\`\`

### 2. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. Copy `.env.example` to `.env.local` and add your Supabase credentials:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
\`\`\`

### 3. Set up Database

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the SQL script from `scripts/create-orders-table.sql`

### 4. Run the Application

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

\`\`\`
├── app/                    # Next.js 14 App Router
│   ├── admin/             # Admin dashboard
│   ├── fish/              # Fish department page
│   ├── butchery/          # Butchery department page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── lib/
│   └── supabase.ts        # Supabase client and database operations
├── scripts/
│   └── create-orders-table.sql  # Database schema
├── public/                # Static assets
└── Configuration files
\`\`\`

## Database Schema

The `orders` table includes:

- `id` (UUID, Primary Key)
- `customer_name` (VARCHAR, Required)
- `item_number` (VARCHAR, Required)
- `qty` (INTEGER, Required)
- `details` (TEXT, Optional)
- `day_pickup` (DATE, Required)
- `time_pickup` (TIME, Required)
- `department` (VARCHAR: 'Fish' or 'Butchery')
- `status` (VARCHAR: 'new', 'in process', 'complete')
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## Key Features

### Department Pages (/fish, /butchery)
- View orders filtered by department
- Large, accessible "Accept Order" and "Mark Complete" buttons
- Optimized for mobile devices and older browsers
- Simple, clean interface focused on core functionality

### Admin Dashboard (/admin)
- Complete CRUD operations for orders
- Advanced filtering and search capabilities
- Responsive data table
- Modern interface with full feature set

### Legacy Browser Compatibility
- ES5 transpilation for older JavaScript engines
- Native HTML5 date/time inputs with fallbacks
- CSS compatibility without modern features
- Large touch targets for mobile usability

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms

The application is a standard Next.js app and can be deployed to any platform supporting Node.js.

## Environment Variables

Required environment variables:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
\`\`\`

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Adding New Features

1. Database changes: Update the SQL schema in `scripts/`
2. API changes: Modify `lib/supabase.ts`
3. UI changes: Update components in `app/`
4. Styling: Use Tailwind classes or update `globals.css`

## Browser Support

- **Modern Browsers**: Full feature support
- **Legacy Browsers**: Android 6.0.1 with Chrome 70+
- **Mobile**: Optimized for touch interfaces
- **Accessibility**: WCAG 2.1 compliant

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
