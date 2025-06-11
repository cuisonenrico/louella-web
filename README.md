<a href="https://demo-nextjs-with-supabase.vercel.app/">
  <img alt="Next.js and Supabase Starter Kit - the fastest way to build apps with Next.js and Supabase" src="https://demo-nextjs-with-supabase.vercel.app/opengraph-image.png">
  <h1 align="center">Next.js and Supabase Starter Kit</h1>
</a>

<p align="center">
 The fastest way to build apps with Next.js and Supabase
</p>

<p align="center">
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#demo"><strong>Demo</strong></a> ·
  <a href="#deploy-to-vercel"><strong>Deploy to Vercel</strong></a> ·
  <a href="#clone-and-run-locally"><strong>Clone and run locally</strong></a> ·
  <a href="#feedback-and-issues"><strong>Feedback and issues</strong></a>
  <a href="#more-supabase-examples"><strong>More Examples</strong></a>
</p>
<br/>

## Features

- Works across the entire [Next.js](https://nextjs.org) stack
  - App Router
  - Pages Router
  - Middleware
  - Client
  - Server
  - It just works!
- supabase-ssr. A package to configure Supabase Auth to use cookies
- Password-based authentication block installed via the [Supabase UI Library](https://supabase.com/ui/docs/nextjs/password-based-auth)
- Styling with [Tailwind CSS](https://tailwindcss.com)
- Components with [shadcn/ui](https://ui.shadcn.com/)
- Optional deployment with [Supabase Vercel Integration and Vercel deploy](#deploy-your-own)
  - Environment variables automatically assigned to Vercel project

## Demo

You can view a fully working demo at [demo-nextjs-with-supabase.vercel.app](https://demo-nextjs-with-supabase.vercel.app/).

## Deploy to Vercel

Vercel deployment will guide you through creating a Supabase account and project.

After installation of the Supabase integration, all relevant environment variables will be assigned to the project so the deployment is fully functioning.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fnext.js%2Ftree%2Fcanary%2Fexamples%2Fwith-supabase&project-name=nextjs-with-supabase&repository-name=nextjs-with-supabase&demo-title=nextjs-with-supabase&demo-description=This+starter+configures+Supabase+Auth+to+use+cookies%2C+making+the+user%27s+session+available+throughout+the+entire+Next.js+app+-+Client+Components%2C+Server+Components%2C+Route+Handlers%2C+Server+Actions+and+Middleware.&demo-url=https%3A%2F%2Fdemo-nextjs-with-supabase.vercel.app%2F&external-id=https%3A%2F%2Fgithub.com%2Fvercel%2Fnext.js%2Ftree%2Fcanary%2Fexamples%2Fwith-supabase&demo-image=https%3A%2F%2Fdemo-nextjs-with-supabase.vercel.app%2Fopengraph-image.png)

The above will also clone the Starter kit to your GitHub, you can clone that locally and develop locally.

If you wish to just develop locally and not deploy to Vercel, [follow the steps below](#clone-and-run-locally).

## Clone and run locally

1. You'll first need a Supabase project which can be made [via the Supabase dashboard](https://database.new)

2. Create a Next.js app using the Supabase Starter template npx command

   ```bash
   npx create-next-app --example with-supabase with-supabase-app
   ```

   ```bash
   yarn create next-app --example with-supabase with-supabase-app
   ```

   ```bash
   pnpm create next-app --example with-supabase with-supabase-app
   ```

3. Use `cd` to change into the app's directory

   ```bash
   cd with-supabase-app
   ```

4. Rename `.env.example` to `.env.local` and update the following:

   ```
   NEXT_PUBLIC_SUPABASE_URL=[INSERT SUPABASE PROJECT URL]
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[INSERT SUPABASE PROJECT API ANON KEY]
   ```

   Both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` can be found in [your Supabase project's API settings](https://supabase.com/dashboard/project/_?showConnect=true)

5. You can now run the Next.js local development server:

   ```bash
   npm run dev
   ```

   The starter kit should now be running on [localhost:3000](http://localhost:3000/).

6. This template comes with the default shadcn/ui style initialized. If you instead want other ui.shadcn styles, delete `components.json` and [re-install shadcn/ui](https://ui.shadcn.com/docs/installation/next)

> Check out [the docs for Local Development](https://supabase.com/docs/guides/getting-started/local-development) to also run Supabase locally.

## Feedback and issues

Please file feedback and issues over on the [Supabase GitHub org](https://github.com/supabase/supabase/issues/new/choose).

## More Supabase examples

- [Next.js Subscription Payments Starter](https://github.com/vercel/nextjs-subscription-payments)
- [Cookie-based Auth and the Next.js 13 App Router (free course)](https://youtube.com/playlist?list=PL5S4mPUpp4OtMhpnp93EFSo42iQ40XjbF)
- [Supabase Auth and the Next.js App Router](https://github.com/supabase/supabase/tree/master/examples/auth/nextjs)

# Louella Bakery - Payroll & Inventory Management System

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14.0-black?style=flat-square&logo=next.js" alt="Next.js">
  <img src="https://img.shields.io/badge/Supabase-3.0-green?style=flat-square&logo=supabase" alt="Supabase">
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind-3.0-cyan?style=flat-square&logo=tailwindcss" alt="Tailwind CSS">
</p>

A comprehensive web application for managing payroll and inventory operations at Louella Bakery. Built with Next.js 14 and Supabase for real-time data management and secure authentication.

## 🌟 Features

### 📊 Payroll Management

- **Excel File Processing**: Upload and process payroll Excel files automatically
- **Payroll Period Tracking**: Organize payroll by periods (2025, 2024, 2023, 2022)
- **Employee Records**: Comprehensive employee payroll history with filtering
- **Payroll Analytics**: Visual charts showing payroll expenses over time
- **Multi-Branch Support**: Handle payroll for different bakery branches

### 📈 Dashboard & Analytics

- **Payroll Expenses Overview**: Interactive charts displaying yearly payroll trends
- **Employee Search & Filter**: Search by employee, branch, and time period
- **Data Export**: Export payroll data for reporting purposes
- **Real-time Updates**: Live data synchronization across all users

### 🔐 Authentication & Security

- **Supabase Auth**: Secure user authentication with session management
- **Role-based Access**: Protected routes and user permissions
- **Session Persistence**: Maintains user sessions across browser refreshes

### 🎨 Modern UI/UX

- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Orange Theme**: Custom branding with `#F28C28` as the primary color
- **Sidebar Navigation**: Intuitive navigation between Dashboard, Inventory, Analytics, and Payroll
- **shadcn/ui Components**: Beautiful, accessible UI components

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) with App Router
- **Database**: [Supabase](https://supabase.com/) PostgreSQL with real-time subscriptions
- **Authentication**: Supabase Auth with cookie-based sessions
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom color scheme
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **File Processing**: XLSX for Excel file parsing
- **TypeScript**: Full type safety throughout the application

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase project ([Create one here](https://database.new))

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd louella-web
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**

   Rename `.env.example` to `.env.local` and update with your Supabase credentials:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

   Get these values from your [Supabase project settings](https://supabase.com/dashboard/project/_?showConnect=true).

4. **Set up the database**

   Create the following tables in your Supabase project:

   - `PayrollPeriod` - Stores payroll periods and date ranges
   - `PayrollEntry` - Stores individual employee payroll records
   - Create a storage bucket named `payroll-files` for file uploads

5. **Run the development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
louella-web/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Main dashboard
│   └── payroll/           # Payroll management pages
├── components/            # Reusable UI components
├── lib/                   # Utility functions and types
│   ├── payroll/          # Payroll processing logic
│   └── types/            # TypeScript type definitions
├── utils/
│   └── supabase/         # Supabase client configurations
│       ├── client.ts     # Browser client
│       ├── server.ts     # Server client
│       └── middleware.ts # Auth middleware
└── tailwind.config.ts    # Tailwind configuration
```

## 🔧 Key Features Implementation

### Supabase Integration

The application uses Supabase for:

- **Authentication**: Cookie-based auth with middleware protection
- **Database**: PostgreSQL for storing payroll and employee data
- **Storage**: File uploads for Excel payroll files
- **Real-time**: Live updates across all connected clients

### Payroll Processing

- **Excel File Upload**: Process `.xlsx` files containing payroll data
- **Data Validation**: Automatic validation and error handling
- **Branch Detection**: Intelligent branch name extraction from files
- **Period Management**: Bi-monthly payroll period calculation

### Security Features

- **Protected Routes**: Middleware-based route protection
- **Session Management**: Automatic session refresh and validation
- **Data Validation**: Server-side validation for all data operations

## 🎨 Customization

The application uses a custom orange theme (`#F28C28`) throughout. You can modify the color scheme in [`tailwind.config.ts`](tailwind.config.ts):

```typescript
primary: {
  DEFAULT: '#F28C28',  // Main orange color
  foreground: '#FFFFFF'
}
```

## 📊 Database Schema

### PayrollPeriod

- `id`: Primary key
- `payroll_start`: Start date of payroll period
- `payroll_end`: End date of payroll period
- `branch`: Branch name
- `file_name`: Original Excel file name

### PayrollEntry

- `id`: Primary key
- `payroll_period_id`: Foreign key to PayrollPeriod
- `employee`: Employee name
- `days_worked`, `monthly_rate`, `basic_rate`: Payroll calculations
- `gross_pay`, `net_salary`: Final amounts
- Various deduction fields (SSS, PhilHealth, Pag-IBIG, etc.)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary to Louella Bakery.

## 🆘 Support

For support and questions, please contact the development team or create an issue in the repository.

---

Built with ❤️ for Louella Bakery using Next.js and Supabase.
