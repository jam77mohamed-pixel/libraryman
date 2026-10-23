# Athenaeum — Modern Library Management System

A production-grade, responsive, and modern Library Management and Circulation OS developed with **React.js (Vite)**, **Tailwind CSS**, **Context API**, and **DummyJSON API**.

---

## 🌟 Overview & Key Highlights

- **Aesthetic**: Modern, clean design inspired by Linear and Tailwind UI with a Plus Jakarta Sans typography hierarchy, subtle border cards, status badges, interactive charts, and accessible modal drawers.
- **State Architecture**: Clean separation of concerns with React Context API (`AuthContext` & `LibraryContext`), custom services (`bookService`, `memberService`), and safe LocalStorage synchronization.
- **Third-Party API Integration**: Live network communication with **DummyJSON** (`/products`, `/users`, `/products/add`, `/users/add`) via Axios with interceptors, visible directly in the browser's Network tab.
- **Robust Error & Loading UX**: Skeleton loaders, error banners with retry triggers, empty states with clear calls-to-action, and color-coded React Toastify notifications.

---

## 🚀 Live Demo & Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or pnpm

### Quick Start
```bash
# Navigate to the project root
cd libraryman

# Install dependencies (if not already installed)
npm install

# Run the development server
npm run dev

# Build for production
npm run build
```

The application will be accessible at `http://localhost:5173/`.

---

## 🔐 Demo Credentials (One-Click Fill Available)

| Role | Email | Password |
|---|---|---|
| **Head Librarian (Admin)** | `admin@library.com` | `password123` |
| **Assistant Librarian** | `librarian@library.com` | `password123` |

*Note: You can also click the quick demo credentials buttons on the login screen, or register a new staff account with instant validation.*

---

## 📦 Implemented Modules & Features

### Module 1: Authentication
- **Login / Register / Forgot Password UI**: Complete authentication workflow.
- **Form Validation**: Powered by `react-hook-form` with regex email validation and password requirements.
- **Password Show/Hide**: Accessible eye toggle for all password inputs.
- **Protected Routes**: Custom route guard preventing unauthorized access.
- **Local Storage Persistence**: Session and user accounts persist across browser sessions.

### Module 2: Dashboard
- **Real-Time KPIs**: Total Books, Total Members, Books Issued, Books Available, Overdue Books, Total Categories, and Fine Collected.
- **Quick Action Cards**: Single-click access to Issue Book, Add Book, Enroll Member, and Collect Fine.
- **Live Activity Feed**: Real-time log of borrowing, returns, member enrollments, and fine collections.
- **Visual Analytics**: Interactive monthly issue/return chart and category distribution bars.
- **Overdue Spotlight**: Actionable list of books exceeding due dates.

### Module 3: Book Management
- **Third-Party API Integration**: Real Axios requests to DummyJSON (`/products`) transformed into rich library books.
- **CRUD Operations**: Catalog new books, edit existing details, and delete with safety checks.
- **Dual Display Modes**: Toggle between **Grid View** and **Table View**.
- **Search, Filter & Sort**: Search by title, author, ISBN; filter by category, author, and stock availability; sort by title, year, or copy count.
- **Detailed Book View**: Dedicated page (`/books/:id`) displaying full metadata, borrower history, and quick issue button.
- **Pagination & Skeletons**: Smooth pagination with customizable items per page.

### Module 4: Member Management
- **Cardholder CRUD**: Add, edit, remove, and inspect member profiles (`/members/:id`).
- **Fields**: Full Name, Email, Mobile Number, Address, Membership ID (`LIB-YYYY-XXXX`), Membership Date, Status (Active/Suspended), Avatar.
- **Search & Filter**: Search by name, email, or card ID; filter by Active/Suspended.
- **Profile Page**: Comprehensive member view with current active loans, return history, and outstanding fines.

### Module 5: Circulation (Issue / Return)
- **Borrowing Workflow**: Member selection, available book selector (filtered by stock > 0), issue date, and customizable return due date with presets (+7d, +14d, +30d).
- **Duplicate Prevention**: Automated safeguard blocking duplicate active issues of the same title to a member.
- **Inventory Updates**: Dynamic decrement and increment of physical copy availability.
- **Return Processing**: Real-time overdue penalty assessment upon book return.

### Module 6: Fine Calculation & Ledger
- **Automated Fine Assessment**: Calculated dynamically based on overdue days ($1.00/day).
- **Settlement Methods**: Cash, Credit/Debit Card, UPI / Online, and Authorized Waiver.
- **Filter & Search**: Filter by Unpaid, Paid, or Waived; search by borrower or book.
- **Audit Ledger**: Comprehensive audit trail of penalty collections.

### Module 7: Search & Categories
- **Global Search**: Multi-entity instant search querying books, authors, ISBNs, members, and active loans with dedicated entity tabs.
- **Category Taxonomy**: Add, edit, and safely delete categories with color-coded classification tags and book counts.

### Module 8: Analytics & Reports
- **Executive Metrics**: Total Books, Issued Books, Returned Books, Active Members, Overdue Books.
- **Interactive SVG Charts**: 12-month circulation trend chart and category distribution visualization.
- **Export & Print**: One-click **CSV export** and printable executive summary.

---

## 🛠️ Tech Stack Architecture

```
React 19 + Vite 8
├── Styling: Tailwind CSS v4 + Plus Jakarta Sans Font
├── Routing: React Router v7 (BrowserRouter, ProtectedRoute, Nested Outlets)
├── State Management: React Context API (AuthContext, LibraryContext)
├── Networking: Axios with central interceptors + DummyJSON API
├── Forms: React Hook Form (Validation, Error states, Reset)
├── Notifications: React Toastify (Themed toasts)
├── Icons: Lucide React
└── Persistence: LocalStorage (Safe JSON serialization wrapper)
```

---

## 📂 Project Structure

```
src/
├── api/
│   └── axiosClient.js          # Axios client with DummyJSON baseURL & interceptors
├── components/
│   ├── common/                 # Reusable UI library (Button, Input, Select, Badge, Modal, etc.)
│   ├── layout/                 # MainLayout, Sidebar, Header, ProtectedRoute
│   └── reports/                # SVG Charts (CategoryChart, MonthlyTrendChart)
├── context/
│   ├── AuthContext.jsx         # Authentication & session state
│   └── LibraryContext.jsx      # Books, members, circulation, fines, and activities
├── data/
│   └── initialData.js          # Seed categories, books, members, issues, and fines
├── pages/
│   ├── auth/                   # Login, Register, ForgotPassword
│   ├── books/                  # BookList, BookDetails, BookFormModal
│   ├── categories/             # CategoryManagement
│   ├── circulation/            # IssueReturn, IssueBookModal
│   ├── dashboard/              # Dashboard
│   ├── fines/                  # FineManagement, PayFineModal
│   ├── members/                # MemberList, MemberDetails, MemberFormModal
│   ├── reports/                # Reports & CSV export
│   ├── search/                 # GlobalSearch
│   └── NotFound.jsx            # 404 Error page
├── services/
│   ├── bookService.js          # DummyJSON /products integration & persistence
│   └── memberService.js        # DummyJSON /users integration & persistence
├── utils/
│   ├── formatters.js           # Date, currency, ISBN, and fine calculators
│   └── storage.js              # Safe LocalStorage wrapper
├── App.jsx                     # Router config & ToastContainer
├── index.css                   # Tailwind v4 import & custom styling
└── main.jsx                    # React root entry
```

---

Developed with care for Athenaeum Library Management System.
