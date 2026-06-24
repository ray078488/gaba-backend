import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import connectDB from './config/db.js';
import User from './models/userModel.js';
import Product from './models/productModel.js';
import Order from './models/orderModel.js';

dotenv.config();

connectDB();

const seedUsers = [
  {
    name: 'Royal Admin',
    email: 'admin@royal.com',
    password: 'admin123', // Will be hashed automatically by userModel pre-save hook
    isAdmin: true,
  },
  {
    name: 'Royal Customer',
    email: 'customer@royal.com',
    password: 'customer123', // Will be hashed automatically by userModel pre-save hook
    isAdmin: false,
  },
];

const seedProducts = [
  {
    name: 'Imperial Navy Two-Piece Suit',
    images: [
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1593030103066-0093718efeb9?q=80&w=600&auto=format&fit=crop'
    ],
    description: 'Crafted from ultra-fine Super 150s virgin wool. Features an elegant imperial navy shade, premium hand-stitched detailing, full interior canvas backing, a modern slim silhouette, and dual rear vents. Designed for absolute royalty.',
    price: 1299.00,
    category: 'Suits & Blazers',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Navy', 'Onyx'],
    stock: 12,
    rating: 4.8,
    numReviews: 24,
    reviews: [
      {
        name: 'Alexander Sterling',
        rating: 5,
        comment: 'Exquisite tailoring! Fits incredibly well and the texture of the virgin wool feels extremely luxurious.',
        user: new mongoose.Types.ObjectId(), // Will be reassigned
      }
    ],
  },
  {
    name: 'Royal Monogram Silk Tuxedo Shirt',
    images: [
      'https://images.unsplash.com/photo-1620012253295-c05518e993be?q=80&w=600&auto=format&fit=crop'
    ],
    description: 'Woven from 100% natural Mulberry silk. Offers a fluid-draped, exceptionally soft finish, concealed button placket, double-barrel French cuffs, and subtle tone-on-tone royal monogram embroidery on the cuffs.',
    price: 349.00,
    category: 'Shirts',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Champagne', 'Onyx'],
    stock: 25,
    rating: 4.9,
    numReviews: 18,
    reviews: [],
  },
  {
    name: 'Monarch Crimson Velvet Blazer',
    images: [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600&auto=format&fit=crop'
    ],
    description: 'Turn heads at any grand gala. Features premium Italian cotton-velvet fabric, peak satin lapels, structural padded shoulders, rich gold silk interior lining, and dual flap waist pockets.',
    price: 899.00,
    category: 'Suits & Blazers',
    sizes: ['M', 'L', 'XL'],
    colors: ['Crimson', 'Emerald'],
    stock: 8,
    rating: 4.7,
    numReviews: 15,
    reviews: [],
  },
  {
    name: 'Gilded Crown Gold Cufflinks',
    images: [
      'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=600&auto=format&fit=crop'
    ],
    description: 'Hand-polished in 18-karat yellow gold vermeil. Elegant sovereign crown crest engravings set inside a dark onyx enamel circular frame. Secure toggle closures. The signature accessory of the Royal house.',
    price: 189.00,
    category: 'Accessories',
    sizes: ['One Size'],
    colors: ['Gold'],
    stock: 45,
    rating: 5.0,
    numReviews: 31,
    reviews: [],
  },
  {
    name: 'Sovereign Emerald Silk Evening Gown',
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600&auto=format&fit=crop'
    ],
    description: 'A masterpiece of elegant design. Crafted from rich emerald silk satin, featuring a refined mock neckline, draped bias-cut silhouette, subtle back thigh slit, and invisible rear zip closure. Exudes timeless glamour.',
    price: 1499.00,
    category: 'Dresses',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Emerald', 'Ruby'],
    stock: 6,
    rating: 4.9,
    numReviews: 29,
    reviews: [],
  },
  {
    name: 'Majestic Cachet Double-Breasted Wool Overcoat',
    images: [
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=600&auto=format&fit=crop'
    ],
    description: 'Ultimate insulation without compromising on style. Premium heavy-weight cashmere and wool blend. Structured double-breasted collar with peak lapels, complete with tortoiseshell buttons and waist belts.',
    price: 1099.00,
    category: 'Outerwear',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Camel', 'Onyx'],
    stock: 14,
    rating: 4.6,
    numReviews: 20,
    reviews: [],
  },
  {
    name: 'Royal Crest Gold Buckle Belt',
    images: [
      'https://images.unsplash.com/photo-1624222247344-550fb8ecf7db?q=80&w=600&auto=format&fit=crop'
    ],
    description: 'Crafted from premium full-grain Italian calfskin leather. Reversible finish (navy on one side, black on the other). Heavy brass buckle plated in polished 18k gold showcasing the signature Royal crest monogram.',
    price: 149.00,
    category: 'Accessories',
    sizes: ['32', '34', '36', '38'],
    colors: ['Navy', 'Onyx'],
    stock: 30,
    rating: 4.5,
    numReviews: 12,
    reviews: [],
  },
  {
    name: 'Duchess Pearl & Diamond Necklace',
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop'
    ],
    description: 'Stunning AAA-grade freshwater cultured pearls, individually hand-knotted on silk thread. Completed with an ornate clasp crafted from 14-karat white gold encrusted with fine pave diamonds.',
    price: 599.00,
    category: 'Accessories',
    sizes: ['One Size'],
    colors: ['Pearl'],
    stock: 15,
    rating: 4.9,
    numReviews: 40,
    reviews: [],
  }
];

const importData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    // Import Users
    const createdUsers = await User.insertMany(seedUsers);
    const adminUser = createdUsers[0]._id;

    // Map reviews to adminUser
    const updatedProducts = seedProducts.map((p) => {
      const mappedReviews = p.reviews.map((r) => ({ ...r, user: adminUser }));
      return { ...p, reviews: mappedReviews };
    });

    // Import Products
    await Product.insertMany(updatedProducts);

    console.log('--- Royal Database Seeded Successfully! ---');
    process.exit(0);
  } catch (error) {
    console.error(`Error seeding database: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log('--- Royal Database Cleared! ---');
    process.exit(0);
  } catch (error) {
    console.error(`Error clearing database: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
