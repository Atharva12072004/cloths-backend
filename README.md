# ReWear - Community Clothing Exchange Platform

A full-stack web application that enables users to exchange unused clothing through direct swaps or a point-based redemption system. Built with React, TypeScript, Node.js, and Express.

## 🌟 Features

### User Features
- **User Authentication**: Email/password signup and login with JWT tokens
- **Landing Page**: Platform introduction with featured items carousel
- **Browse Items**: Search and filter clothing items by category, size, and condition
- **Item Details**: View full item information with image gallery
- **Add Items**: Upload images and list new items for exchange
- **Dashboard**: Manage profile, view listed items, and track swap requests
- **Swap System**: Request swaps using points or direct item exchange

### Admin Features
- **Item Moderation**: Approve or reject item listings
- **Admin Panel**: Overview of platform statistics and pending items
- **Content Management**: Remove inappropriate items

### Technical Features
- **File Upload**: Image upload with validation and storage
- **Real-time Updates**: Live data synchronization
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Type Safety**: Full TypeScript implementation
- **Error Handling**: Comprehensive error handling with user feedback

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd rewear-clothing-exchange
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Start the development servers**
   ```bash
   npm run dev
   ```

This will start both the frontend (port 3000) and backend (port 5000) servers concurrently.

### Manual Setup

If you prefer to set up frontend and backend separately:

#### Backend Setup
```bash
cd backend
npm install
npm run dev
```

#### Frontend Setup
```bash
npm install
npm run dev:frontend
```

## 📁 Project Structure

```
project-main/
├── src/                    # Frontend source code
│   ├── components/         # React components
│   │   ├── auth/          # Authentication components
│   │   ├── LandingPage.tsx
│   │   ├── BrowseItems.tsx
│   │   ├── ItemDetail.tsx
│   │   ├── Dashboard.tsx
│   │   ├── AddItem.tsx
│   │   └── AdminPanel.tsx
│   ├── context/           # React context providers
│   ├── services/          # API services
│   ├── types/             # TypeScript type definitions
│   └── data/              # Mock data (for development)
├── backend/               # Backend source code
│   ├── server.js          # Main Express server
│   ├── package.json       # Backend dependencies
│   └── uploads/           # File upload directory
├── package.json           # Frontend dependencies
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Items
- `GET /api/items` - Get all items (with filters)
- `GET /api/items/:id` - Get specific item
- `POST /api/items` - Create new item (with image upload)
- `PUT /api/items/:id` - Update item
- `DELETE /api/items/:id` - Delete item

### Swaps
- `GET /api/swaps` - Get user's swap requests
- `POST /api/swaps` - Create swap request
- `PUT /api/swaps/:id` - Update swap status

### Admin
- `GET /api/admin/items` - Get pending items
- `PUT /api/admin/items/:id/approve` - Approve item
- `DELETE /api/admin/items/:id` - Delete item
- `GET /api/admin/stats` - Get platform statistics

## 🎨 UI Components

The application uses a modern, responsive design with:
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **React Hot Toast** for notifications
- **React Dropzone** for file uploads

## 🔐 Authentication

The application uses JWT tokens for authentication:
- Tokens are stored in localStorage
- Automatic token refresh on API calls
- Protected routes for authenticated users
- Admin role-based access control

## 📸 File Upload

- Supports multiple image uploads (up to 5 images per item)
- File size limit: 5MB per image
- Image format validation
- Automatic file naming with timestamps

## 🗄️ Data Storage

Currently uses in-memory storage for development. For production, consider:
- **Database**: PostgreSQL, MongoDB, or MySQL
- **File Storage**: AWS S3, Cloudinary, or similar
- **Caching**: Redis for session management

## 🚀 Deployment

### Frontend Deployment
```bash
npm run build
```

### Backend Deployment
```bash
cd backend
npm start
```

### Environment Variables

Create a `.env` file in the backend directory:
```env
PORT=5000
JWT_SECRET=your-secret-key-here
NODE_ENV=production
```

## 👥 Default Admin Account

For testing purposes, a default admin account is created:
- It will showing on Sign in and sigu up page

## 🧪 Testing

The application includes comprehensive error handling and validation:
- Form validation on both frontend and backend
- API error handling with user-friendly messages
- Loading states for better UX
- Input sanitization and validation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support or questions, please open an issue in the repository.

---

**ReWear** - Making fashion sustainable, one swap at a time! 🌱👕 
