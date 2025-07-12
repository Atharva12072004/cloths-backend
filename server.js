import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs-extra';
import { v4 as uuidv4 } from 'uuid';
import { body, validationResult } from 'express-validator';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://rewearcloths.netlify.app'
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.static('public'));

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    fs.ensureDirSync(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// In-memory data storage (replace with database in production)
let users = [
  {
    id: '1',
    email: 'admin@rewear.com',
    password: bcrypt.hashSync('admin123', 10),
    name: 'Admin User',
    points: 1000,
    avatar: null,
    location: 'New York, NY',
    joinDate: '2024-01-01',
    swapCount: 0,
    isAdmin: true
  }
];

let clothingItems = [
  {
    id: '1',
    title: 'Vintage Denim Jacket',
    description: 'Classic blue denim jacket from the 90s. Perfectly worn-in with beautiful fading. Great for layering!',
    category: 'outerwear',
    type: 'Jacket',
    size: 'M',
    condition: 'good',
    tags: ['vintage', 'denim', 'casual', '90s'],
    images: ['https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=800'],
    uploaderId: '1',
    uploaderName: 'Admin User',
    uploaderAvatar: null,
    pointsValue: 75,
    isAvailable: true,
    isApproved: true,
    uploadDate: '2024-01-20',
    location: 'New York, NY'
  },
  {
    id: '2',
    title: 'Floral Summer Dress',
    description: 'Beautiful floral midi dress perfect for summer occasions. Lightweight and comfortable with a flattering fit.',
    category: 'dresses',
    type: 'Midi Dress',
    size: 'S',
    condition: 'excellent',
    tags: ['floral', 'summer', 'midi', 'feminine'],
    images: ['https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg?auto=compress&cs=tinysrgb&w=800'],
    uploaderId: '1',
    uploaderName: 'Admin User',
    uploaderAvatar: null,
    pointsValue: 90,
    isAvailable: true,
    isApproved: true,
    uploadDate: '2024-01-22',
    location: 'New York, NY'
  },
  {
    id: '3',
    title: 'Classic White Sneakers',
    description: 'Clean white leather sneakers. Minimal wear, perfect for everyday casual looks.',
    category: 'shoes',
    type: 'Sneakers',
    size: '8',
    condition: 'excellent',
    tags: ['white', 'sneakers', 'casual', 'leather'],
    images: ['https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=800'],
    uploaderId: '1',
    uploaderName: 'Admin User',
    uploaderAvatar: null,
    pointsValue: 60,
    isAvailable: true,
    isApproved: true,
    uploadDate: '2024-01-18',
    location: 'New York, NY'
  },
  {
    id: '4',
    title: 'Wool Blend Coat',
    description: 'Elegant wool blend coat in camel color. Perfect for fall and winter. Classic tailored fit.',
    category: 'outerwear',
    type: 'Coat',
    size: 'L',
    condition: 'good',
    tags: ['wool', 'coat', 'winter', 'elegant'],
    images: ['https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg?auto=compress&cs=tinysrgb&w=800'],
    uploaderId: '1',
    uploaderName: 'Admin User',
    uploaderAvatar: null,
    pointsValue: 120,
    isAvailable: true,
    isApproved: true,
    uploadDate: '2024-01-15',
    location: 'New York, NY'
  },
  {
    id: '5',
    title: 'High-Waisted Jeans',
    description: 'Dark wash high-waisted jeans with great stretch. Flattering fit for all body types.',
    category: 'bottoms',
    type: 'Jeans',
    size: '29',
    condition: 'good',
    tags: ['jeans', 'high-waisted', 'dark-wash', 'stretch'],
    images: ['https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=800'],
    uploaderId: '1',
    uploaderName: 'Admin User',
    uploaderAvatar: null,
    pointsValue: 65,
    isAvailable: true,
    isApproved: true,
    uploadDate: '2024-01-25',
    location: 'New York, NY'
  },
  {
    id: '6',
    title: 'Silk Scarf Collection',
    description: 'Set of 3 beautiful silk scarves in various patterns. Perfect for adding elegance to any outfit.',
    category: 'accessories',
    type: 'Scarf',
    size: 'One Size',
    condition: 'excellent',
    tags: ['silk', 'scarf', 'accessories', 'elegant'],
    images: ['https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=800'],
    uploaderId: '1',
    uploaderName: 'Admin User',
    uploaderAvatar: null,
    pointsValue: 45,
    isAvailable: true,
    isApproved: true,
    uploadDate: '2024-01-23',
    location: 'New York, NY'
  },
  {
    id: '7',
    title: 'Red Plaid Shirt',
    description: 'Trendy red plaid shirt, soft cotton, perfect for layering or wearing alone.',
    category: 'tops',
    type: 'Shirt',
    size: 'L',
    condition: 'good',
    tags: ['plaid', 'shirt', 'red', 'cotton'],
    images: ['https://images.pexels.com/photos/428340/pexels-photo-428340.jpeg?auto=compress&cs=tinysrgb&w=800'],
    uploaderId: '1',
    uploaderName: 'Admin User',
    uploaderAvatar: null,
    pointsValue: 55,
    isAvailable: true,
    isApproved: true,
    uploadDate: '2024-01-12',
    location: 'New York, NY'
  },
  {
    id: '8',
    title: 'Black Leather Boots',
    description: 'Sturdy black leather boots, lightly worn, great for winter.',
    category: 'shoes',
    type: 'Boots',
    size: '9',
    condition: 'good',
    tags: ['boots', 'leather', 'black', 'winter'],
    images: ['https://images.pexels.com/photos/267320/pexels-photo-267320.jpeg?auto=compress&cs=tinysrgb&w=800'],
    uploaderId: '1',
    uploaderName: 'Admin User',
    uploaderAvatar: null,
    pointsValue: 80,
    isAvailable: true,
    isApproved: true,
    uploadDate: '2024-01-14',
    location: 'New York, NY'
  },
  {
    id: '9',
    title: 'Striped Maxi Dress',
    description: 'Colorful striped maxi dress, flowy and comfortable for summer.',
    category: 'dresses',
    type: 'Maxi Dress',
    size: 'M',
    condition: 'excellent',
    tags: ['striped', 'dress', 'maxi', 'summer'],
    images: ['https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg?auto=compress&cs=tinysrgb&w=800'],
    uploaderId: '1',
    uploaderName: 'Admin User',
    uploaderAvatar: null,
    pointsValue: 85,
    isAvailable: true,
    isApproved: true,
    uploadDate: '2024-01-19',
    location: 'New York, NY'
  },
  {
    id: '10',
    title: 'Blue Hoodie',
    description: 'Comfy blue hoodie, perfect for casual wear or workouts.',
    category: 'tops',
    type: 'Hoodie',
    size: 'XL',
    condition: 'fair',
    tags: ['hoodie', 'blue', 'casual', 'workout'],
    images: ['https://images.pexels.com/photos/532220/pexels-photo-532220.jpeg?auto=compress&cs=tinysrgb&w=800'],
    uploaderId: '1',
    uploaderName: 'Admin User',
    uploaderAvatar: null,
    pointsValue: 40,
    isAvailable: true,
    isApproved: true,
    uploadDate: '2024-01-11',
    location: 'New York, NY'
  },
  {
    id: '11',
    title: 'Green Parka',
    description: 'Warm green parka with faux fur hood, ideal for cold weather.',
    category: 'outerwear',
    type: 'Parka',
    size: 'M',
    condition: 'good',
    tags: ['parka', 'green', 'winter', 'hood'],
    images: ['https://images.pexels.com/photos/1707828/pexels-photo-1707828.jpeg?auto=compress&cs=tinysrgb&w=800'],
    uploaderId: '1',
    uploaderName: 'Admin User',
    uploaderAvatar: null,
    pointsValue: 110,
    isAvailable: true,
    isApproved: true,
    uploadDate: '2024-01-13',
    location: 'New York, NY'
  },
  {
    id: '12',
    title: 'Yellow Raincoat',
    description: 'Bright yellow raincoat, waterproof and lightweight.',
    category: 'outerwear',
    type: 'Raincoat',
    size: 'S',
    condition: 'excellent',
    tags: ['raincoat', 'yellow', 'waterproof', 'lightweight'],
    images: ['https://images.pexels.com/photos/936075/pexels-photo-936075.jpeg?auto=compress&cs=tinysrgb&w=800'],
    uploaderId: '1',
    uploaderName: 'Admin User',
    uploaderAvatar: null,
    pointsValue: 95,
    isAvailable: true,
    isApproved: true,
    uploadDate: '2024-01-16',
    location: 'New York, NY'
  },
  {
    id: '13',
    title: 'Beige Chinos',
    description: 'Classic beige chinos, slim fit, great for work or casual.',
    category: 'bottoms',
    type: 'Chinos',
    size: '32',
    condition: 'good',
    tags: ['chinos', 'beige', 'slim-fit', 'classic'],
    images: ['https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg?auto=compress&cs=tinysrgb&w=800'],
    uploaderId: '1',
    uploaderName: 'Admin User',
    uploaderAvatar: null,
    pointsValue: 55,
    isAvailable: true,
    isApproved: true,
    uploadDate: '2024-01-17',
    location: 'New York, NY'
  },
  {
    id: '14',
    title: 'Purple Cardigan',
    description: 'Soft purple cardigan, cozy and stylish for chilly days.',
    category: 'tops',
    type: 'Cardigan',
    size: 'M',
    condition: 'excellent',
    tags: ['cardigan', 'purple', 'cozy', 'stylish'],
    images: ['https://images.pexels.com/photos/532220/pexels-photo-532220.jpeg?auto=compress&cs=tinysrgb&w=800'],
    uploaderId: '1',
    uploaderName: 'Admin User',
    uploaderAvatar: null,
    pointsValue: 70,
    isAvailable: true,
    isApproved: true,
    uploadDate: '2024-01-21',
    location: 'New York, NY'
  },
  {
    id: '15',
    title: 'Orange Beanie',
    description: 'Bright orange beanie, warm and stretchy, fits all sizes.',
    category: 'accessories',
    type: 'Beanie',
    size: 'One Size',
    condition: 'good',
    tags: ['beanie', 'orange', 'warm', 'stretchy'],
    images: ['https://images.pexels.com/photos/1707827/pexels-photo-1707827.jpeg?auto=compress&cs=tinysrgb&w=800'],
    uploaderId: '1',
    uploaderName: 'Admin User',
    uploaderAvatar: null,
    pointsValue: 25,
    isAvailable: true,
    isApproved: true,
    uploadDate: '2024-01-24',
    location: 'New York, NY'
  }
];

let swapRequests = [];

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

const isAdmin = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// Validation middleware
const validateRegistration = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('name').trim().isLength({ min: 2 }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

const validateItem = [
  body('title').trim().isLength({ min: 3, max: 100 }),
  body('description').trim().isLength({ min: 10, max: 500 }),
  body('category').isIn(['tops', 'bottoms', 'dresses', 'outerwear', 'shoes', 'accessories']),
  body('size').trim().notEmpty(),
  body('condition').isIn(['new', 'excellent', 'good', 'fair']),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'ReWear API is running' });
});

// Authentication routes
app.post('/api/auth/register', validateRegistration, async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: uuidv4(),
      email,
      password: hashedPassword,
      name,
      points: 100, // Starting points
      avatar: null,
      location: '',
      joinDate: new Date().toISOString().split('T')[0],
      swapCount: 0,
      isAdmin: false
    };

    users.push(newUser);

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, isAdmin: newUser.isAdmin },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json({
      message: 'User registered successfully',
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = users.find(user => user.email === email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, isAdmin: user.isAdmin },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { password: _, ...userWithoutPassword } = user;
    res.json({
      message: 'Login successful',
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// User routes
app.get('/api/user/profile', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  const { password, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

app.put('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const { name, location, avatar } = req.body;
    const userIndex = users.findIndex(u => u.id === req.user.id);
    
    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found' });
    }

    users[userIndex] = {
      ...users[userIndex],
      name: name || users[userIndex].name,
      location: location || users[userIndex].location,
      avatar: avatar || users[userIndex].avatar
    };

    const { password, ...userWithoutPassword } = users[userIndex];
    res.json({ message: 'Profile updated successfully', user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Clothing items routes
app.get('/api/items', (req, res) => {
  const { category, search, approved } = req.query;
  let filteredItems = clothingItems;

  if (category) {
    filteredItems = filteredItems.filter(item => item.category === category);
  }

  if (search) {
    filteredItems = filteredItems.filter(item =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
    );
  }

  if (approved !== undefined) {
    filteredItems = filteredItems.filter(item => item.isApproved === (approved === 'true'));
  }

  res.json(filteredItems);
});

app.get('/api/items/:id', (req, res) => {
  const item = clothingItems.find(item => item.id === req.params.id);
  if (!item) {
    return res.status(404).json({ message: 'Item not found' });
  }
  res.json(item);
});

app.post('/api/items', authenticateToken, upload.array('images', 5), validateItem, async (req, res) => {
  try {
    const { title, description, category, type, size, condition, tags, pointsValue } = req.body;
    const user = users.find(u => u.id === req.user.id);

    const imageUrls = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

    const newItem = {
      id: uuidv4(),
      title,
      description,
      category,
      type,
      size,
      condition,
      tags: tags ? JSON.parse(tags) : [],
      images: imageUrls,
      uploaderId: req.user.id,
      uploaderName: user.name,
      uploaderAvatar: user.avatar,
      pointsValue: parseInt(pointsValue) || 50,
      isAvailable: true,
      isApproved: false, // Requires admin approval
      uploadDate: new Date().toISOString().split('T')[0],
      location: user.location
    };

    clothingItems.push(newItem);
    res.status(201).json({ message: 'Item created successfully', item: newItem });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.put('/api/items/:id', authenticateToken, async (req, res) => {
  try {
    const { isAvailable } = req.body;
    const itemIndex = clothingItems.findIndex(item => item.id === req.params.id);
    
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Only allow item owner or admin to update
    if (clothingItems[itemIndex].uploaderId !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    clothingItems[itemIndex] = {
      ...clothingItems[itemIndex],
      isAvailable: isAvailable !== undefined ? isAvailable : clothingItems[itemIndex].isAvailable
    };

    res.json({ message: 'Item updated successfully', item: clothingItems[itemIndex] });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.delete('/api/items/:id', authenticateToken, async (req, res) => {
  try {
    const itemIndex = clothingItems.findIndex(item => item.id === req.params.id);
    
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Only allow item owner or admin to delete
    if (clothingItems[itemIndex].uploaderId !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Delete associated images
    const item = clothingItems[itemIndex];
    item.images.forEach(imagePath => {
      const fullPath = path.join(__dirname, imagePath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    });

    clothingItems.splice(itemIndex, 1);
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Swap requests routes
app.get('/api/swaps', authenticateToken, (req, res) => {
  const userSwaps = swapRequests.filter(swap => 
    swap.requesterId === req.user.id || 
    clothingItems.find(item => item.id === swap.itemId)?.uploaderId === req.user.id
  );
  res.json(userSwaps);
});

app.post('/api/swaps', authenticateToken, async (req, res) => {
  try {
    const { itemId, offeredItemId, usePoints, pointsOffered, message } = req.body;
    const user = users.find(u => u.id === req.user.id);
    const item = clothingItems.find(item => item.id === itemId);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (!item.isAvailable) {
      return res.status(400).json({ message: 'Item is not available' });
    }

    if (item.uploaderId === req.user.id) {
      return res.status(400).json({ message: 'Cannot request your own item' });
    }

    if (usePoints && user.points < (pointsOffered || item.pointsValue)) {
      return res.status(400).json({ message: 'Insufficient points' });
    }

    const newSwapRequest = {
      id: uuidv4(),
      requesterId: req.user.id,
      requesterName: user.name,
      itemId,
      itemTitle: item.title,
      offeredItemId: offeredItemId || null,
      offeredItemTitle: offeredItemId ? clothingItems.find(i => i.id === offeredItemId)?.title : null,
      usePoints,
      pointsOffered: pointsOffered || item.pointsValue,
      status: 'pending',
      createdDate: new Date().toISOString().split('T')[0],
      message: message || ''
    };

    swapRequests.push(newSwapRequest);
    res.status(201).json({ message: 'Swap request created successfully', swap: newSwapRequest });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.put('/api/swaps/:id', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    const swapIndex = swapRequests.findIndex(swap => swap.id === req.params.id);
    
    if (swapIndex === -1) {
      return res.status(404).json({ message: 'Swap request not found' });
    }

    const swap = swapRequests[swapIndex];
    const item = clothingItems.find(item => item.id === swap.itemId);

    // Only allow item owner to accept/decline requests
    if (item.uploaderId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (status === 'accepted') {
      // Handle points transfer if using points
      if (swap.usePoints) {
        const requester = users.find(u => u.id === swap.requesterId);
        const owner = users.find(u => u.id === item.uploaderId);
        
        if (requester && owner) {
          requester.points -= swap.pointsOffered;
          owner.points += swap.pointsOffered;
          requester.swapCount += 1;
          owner.swapCount += 1;
        }
      }

      // Mark item as unavailable
      const itemIndex = clothingItems.findIndex(item => item.id === swap.itemId);
      if (itemIndex !== -1) {
        clothingItems[itemIndex].isAvailable = false;
      }

      // Mark offered item as unavailable if exists
      if (swap.offeredItemId) {
        const offeredItemIndex = clothingItems.findIndex(item => item.id === swap.offeredItemId);
        if (offeredItemIndex !== -1) {
          clothingItems[offeredItemIndex].isAvailable = false;
        }
      }
    }

    swapRequests[swapIndex].status = status;
    res.json({ message: 'Swap request updated successfully', swap: swapRequests[swapIndex] });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Admin routes
app.get('/api/admin/items', authenticateToken, isAdmin, (req, res) => {
  const pendingItems = clothingItems.filter(item => !item.isApproved);
  res.json(pendingItems);
});

app.put('/api/admin/items/:id/approve', authenticateToken, isAdmin, async (req, res) => {
  try {
    const itemIndex = clothingItems.findIndex(item => item.id === req.params.id);
    
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found' });
    }

    clothingItems[itemIndex].isApproved = true;
    res.json({ message: 'Item approved successfully', item: clothingItems[itemIndex] });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.delete('/api/admin/items/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const itemIndex = clothingItems.findIndex(item => item.id === req.params.id);
    
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Delete associated images
    const item = clothingItems[itemIndex];
    item.images.forEach(imagePath => {
      const fullPath = path.join(__dirname, imagePath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    });

    clothingItems.splice(itemIndex, 1);
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get('/api/admin/stats', authenticateToken, isAdmin, (req, res) => {
  const stats = {
    totalUsers: users.length,
    totalItems: clothingItems.length,
    pendingItems: clothingItems.filter(item => !item.isApproved).length,
    totalSwaps: swapRequests.length,
    completedSwaps: swapRequests.filter(swap => swap.status === 'completed').length
  };
  res.json(stats);
});

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Error handling middleware
app.use((error, req, res, next) => {
  console.error(error.stack);
  res.status(500).json({ message: 'Something went wrong!', error: error.message });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`ReWear server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
}); 
