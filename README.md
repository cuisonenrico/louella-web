<div align="center">
    <img src="https://github.com/user-attachments/assets/b80c2ac1-8739-487a-89aa-e84291ae9893" alt="Louella Icon" width="100"  style="vertical-align: middle; margin-right: 10px;">
    <h1 align="center">
      Louella Bakery - Payroll & Inventory Management System
    </h1>
</div>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14.0-black?style=flat-square&logo=next.js" alt="Next.js">
  <img src="https://img.shields.io/badge/Supabase-3.0-green?style=flat-square&logo=supabase" alt="Supabase">
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind-3.0-cyan?style=flat-square&logo=tailwindcss" alt="Tailwind CSS">
</p>

A comprehensive web application for managing payroll, inventory, employee records, and expense operations at Louella Bakery. Built with Next.js 14 and Supabase for real-time data management and secure authentication.

## 🌟 Features

### 📊 Payroll Management

- **Excel File Processing**: Upload and process payroll Excel files automatically
- **Payroll Period Tracking**: Organize payroll by periods (2025, 2024, 2023, 2022)
- **Employee Records**: Comprehensive employee payroll history with filtering
- **Payroll Analytics**: Visual charts showing payroll expenses over time
- **Multi-Branch Support**: Handle payroll for different bakery branches

![image](https://github.com/user-attachments/assets/950d7e40-4175-41a0-8a19-d9332d9a2c4e)

### 👥 Employee Management

- **Employee Database**: Complete employee information management system
- **Personal Information**: Store employee details including name, phone, address, and gender
- **Smart Search & Filter**: Search by name, phone number, or address with real-time filtering
- **Gender-based Filtering**: Filter employees by gender with debounced performance
- **CRUD Operations**: Add, edit, and delete employee records with instant feedback
- **Mobile-Responsive Interface**: Optimized for both desktop and mobile devices
- **Pagination Support**: Efficient data loading with customizable items per page
- **Real-time Updates**: Live synchronization across all connected clients

![image](https://github.com/user-attachments/assets/7e4e9a10-ea84-4f63-adcd-f962a82a640d)

### 🥖 Product Management

- **Product Inventory**: Comprehensive product catalog management
- **Baker Assignment**: Track which baker is responsible for each product
- **Product Details**: Store product names, descriptions, and baker information
- **Advanced Filtering**: Search by product name or filter by specific baker
- **Real-time CRUD Operations**: Add, edit, and delete products with instant updates
- **Baker-based Organization**: Filter products by baker for better workflow management
- **Mobile-Optimized Design**: Seamless experience across all devices
- **Inventory Tracking**: Keep track of bakery products and their assignments

![image](https://github.com/user-attachments/assets/ba557ca8-a0d1-4c41-9fa1-b1b02a74d88d)

### 💰 Other Expenses Management

- **Expense Tracking**: Record and manage miscellaneous business expenses
- **Real-time CRUD Operations**: Add, edit, and delete expenses with instant updates
- **Advanced Filtering**: Search by description, filter by branch, and date ranges
- **Mobile-Responsive Design**: Optimized for both desktop and mobile devices
- **Expense Statistics**: View total expenses, filtered counts, and pagination info
- **Multi-Branch Support**: Track expenses across different bakery locations
- **Currency Formatting**: Proper Philippine peso formatting for all amounts

![image](https://github.com/user-attachments/assets/f8170cff-c21e-49d4-ba6f-321d59d8116d)

### 📈 Dashboard & Analytics

- **Payroll Expenses Overview**: Interactive charts displaying yearly payroll trends
- **Employee Search & Filter**: Search by employee, branch, and time period
- **Expense Analytics**: Track and analyze other business expenses
- **Product Analytics**: Monitor product inventory and baker assignments
- **Data Export**: Export payroll data for reporting purposes
- **Real-time Updates**: Live data synchronization across all users

![image](https://github.com/user-attachments/assets/77c7911e-4eec-4333-b497-81720d02088a)

### 🔐 Authentication & Security

- **Supabase Auth**: Secure user authentication with session management
- **Role-based Access**: Protected routes and user permissions
- **Session Persistence**: Maintains user sessions across browser refreshes

### 🎨 Modern UI/UX

- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Orange Theme**: Custom branding with `#F28C28` as the primary color
- **Sidebar Navigation**: Intuitive navigation between Dashboard, Employees, Products, Analytics, Payroll, and Other Expenses
- **shadcn/ui Components**: Beautiful, accessible UI components
- **Loading States**: Smooth loading animations and debounced search
- **Toast Notifications**: User-friendly success and error messages

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) with App Router
- **Database**: [Supabase](https://supabase.com/) PostgreSQL with real-time subscriptions
- **Authentication**: Supabase Auth with cookie-based sessions
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom color scheme
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **File Processing**: XLSX for Excel file parsing
- **TypeScript**: Full type safety throughout the application
- **State Management**: React hooks with debounced inputs for optimal performance

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
   - `OtherExpenses` - Stores miscellaneous business expenses
   - `Employee` - Stores employee personal information and details
   - `Product` - Stores product information and baker assignments
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
│   │   ├── employee/      # Employee management
│   │   ├── products/      # Product management
│   │   └── other-expenses/ # Other expenses management
│   └── payroll/           # Payroll management pages
├── components/            # Reusable UI components
│   └── custom/
│       ├── employee/      # Employee management components
│       ├── product/       # Product management components
│       └── other-expenses/ # Expense management components
├── lib/                   # Utility functions and types
│   ├── payroll/          # Payroll processing logic
│   ├── services/         # API service layers
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
- **Database**: PostgreSQL for storing payroll, employee, product, and expense data
- **Storage**: File uploads for Excel payroll files
- **Real-time**: Live updates across all connected clients

### Payroll Processing

- **Excel File Upload**: Process `.xlsx` files containing payroll data
- **Data Validation**: Automatic validation and error handling
- **Branch Detection**: Intelligent branch name extraction from files
- **Period Management**: Bi-monthly payroll period calculation

### Employee Management

- **CRUD Operations**: Full create, read, update, delete functionality for employees
- **Smart Filtering**: Real-time search with debounced inputs for optimal performance
- **Gender Filtering**: Filter employees by gender categories
- **Mobile Optimization**: Separate mobile and desktop views for optimal UX
- **Data Validation**: Comprehensive validation for employee information

### Product Management

- **Inventory Control**: Complete product catalog with baker assignments
- **Baker-based Filtering**: Organize products by responsible baker
- **Real-time Updates**: Instant synchronization of product changes
- **Smart Search**: Search across product names and baker information
- **Mobile-responsive Design**: Optimized interface for all device sizes

### Other Expenses Management

- **CRUD Operations**: Full create, read, update, delete functionality for expenses
- **Smart Filtering**: Real-time search with debounced inputs for performance
- **Pagination**: Efficient data loading with customizable items per page
- **Mobile Optimization**: Separate mobile and desktop views for optimal UX
- **Loading States**: Smooth animations during data operations

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

### Employee

- `id`: Primary key (UUID)
- `first_name`: Employee's first name
- `last_name`: Employee's last name
- `phone_number`: Contact phone number
- `address`: Employee's address
- `gender`: Employee's gender
- `created_at`: Timestamp of record creation
- `updated_at`: Timestamp of last update

### Product

- `id`: Primary key (integer)
- `name`: Product name
- `baker`: Assigned baker for the product
- `description`: Product description (optional)
- `created_at`: Timestamp of record creation
- `updated_at`: Timestamp of last update

### OtherExpenses

- `id`: Primary key
- `date`: Date of expense
- `amount`: Expense amount (decimal)
- `description`: Description of the expense
- `branch`: Branch where expense occurred
- `created_at`: Timestamp of record creation
- `updated_at`: Timestamp of last update

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
