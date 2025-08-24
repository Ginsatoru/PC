import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import connectDB from '../config/db.js';

// Get the directory path for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from the backend root directory
dotenv.config({ path: join(__dirname, '..', '.env') });

const users = [
  {
    name: 'Admin User',
    email: 'admin@pcpartshop.com',
    password: 'admin123',
    role: 'admin',
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'customer123',
    role: 'customer',
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'customer123',
    role: 'customer',
  },
];

const products = [
  {
    name: 'AMD Ryzen 9 7900X',
    category: 'CPU',
    brand: 'AMD',
    model: 'Ryzen 9 7900X',
    price: 429.99,
    stock: 50,
    description: 'High-performance 12-core, 24-thread processor with 4.7 GHz boost clock for gaming and content creation.',
    specifications: new Map([
      ['Cores', '12'],
      ['Threads', '24'],
      ['Base Clock', '4.7 GHz'],
      ['Boost Clock', '5.6 GHz'],
      ['Socket', 'AM5'],
      ['TDP', '170W']
    ]),
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400',
    featured: true,
  },
  {
    name: 'NVIDIA GeForce RTX 4080',
    category: 'GPU',
    brand: 'NVIDIA',
    model: 'RTX 4080',
    price: 1199.99,
    stock: 25,
    description: 'Ultra-high-performance graphics card with ray tracing and DLSS 3 for 4K gaming.',
    specifications: new Map([
      ['Memory', '16GB GDDR6X'],
      ['Memory Bus', '256-bit'],
      ['CUDA Cores', '9728'],
      ['Base Clock', '2205 MHz'],
      ['Boost Clock', '2505 MHz'],
      ['TDP', '320W']
    ]),
    image: 'https://images.unsplash.com/photo-1587588354456-ae376af71a25?w=400',
    featured: true,
  },
  {
    name: 'Corsair Vengeance LPX 32GB DDR4',
    category: 'RAM',
    brand: 'Corsair',
    model: 'Vengeance LPX',
    price: 139.99,
    stock: 100,
    description: 'High-performance DDR4 memory kit with 3200MHz speed and low-profile design.',
    specifications: new Map([
      ['Capacity', '32GB (2x16GB)'],
      ['Speed', 'DDR4-3200'],
      ['Timings', 'CL16-18-18-36'],
      ['Voltage', '1.35V'],
      ['Form Factor', 'DIMM'],
      ['Color', 'Black']
    ]),
    image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400',
    featured: true,
  },
  {
    name: 'Samsung 980 PRO 2TB NVMe SSD',
    category: 'SSD',
    brand: 'Samsung',
    model: '980 PRO',
    price: 199.99,
    stock: 75,
    description: 'High-speed NVMe SSD with PCIe 4.0 interface for fast boot times and file transfers.',
    specifications: new Map([
      ['Capacity', '2TB'],
      ['Interface', 'PCIe 4.0 x4, NVMe 1.3c'],
      ['Form Factor', 'M.2 2280'],
      ['Sequential Read', '7,000 MB/s'],
      ['Sequential Write', '6,900 MB/s'],
      ['Endurance', '1200 TBW']
    ]),
    image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400',
    featured: false,
  },
  {
    name: 'ASUS ROG Strix B650-E Gaming',
    category: 'Motherboard',
    brand: 'ASUS',
    model: 'ROG Strix B650-E',
    price: 289.99,
    stock: 40,
    description: 'Premium AM5 motherboard with Wi-Fi 6E, DDR5 support, and RGB lighting.',
    specifications: new Map([
      ['Socket', 'AM5'],
      ['Chipset', 'AMD B650'],
      ['Memory', 'DDR5 up to 6400MHz'],
      ['Expansion Slots', 'PCIe 5.0 x16, PCIe 4.0 x16'],
      ['Storage', 'M.2 slots x4'],
      ['Network', 'Wi-Fi 6E, 2.5Gb Ethernet']
    ]),
    image: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400',
    featured: false,
  },
  {
    name: 'Corsair RM850x 850W PSU',
    category: 'PSU',
    brand: 'Corsair',
    model: 'RM850x',
    price: 139.99,
    stock: 60,
    description: 'Fully modular 80 PLUS Gold certified power supply with quiet operation.',
    specifications: new Map([
      ['Wattage', '850W'],
      ['Efficiency', '80 PLUS Gold'],
      ['Modular', 'Fully Modular'],
      ['Fan Size', '135mm'],
      ['Connectors', 'ATX24, CPU8, PCIe8 x6'],
      ['Warranty', '10 Years']
    ]),
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400',
    featured: false,
  },
  {
    name: 'NZXT H7 Elite',
    category: 'Case',
    brand: 'NZXT',
    model: 'H7 Elite',
    price: 199.99,
    stock: 30,
    description: 'Premium mid-tower case with tempered glass panel and RGB lighting.',
    specifications: new Map([
      ['Form Factor', 'Mid Tower'],
      ['Motherboard Support', 'E-ATX, ATX, mATX, Mini-ITX'],
      ['Front I/O', 'USB 3.2 Gen2 Type-C, USB 3.2 Gen1 Type-A x2'],
      ['Drive Bays', '2.5" x6, 3.5" x4'],
      ['Fans Included', '140mm x3'],
      ['Radiator Support', '360mm front, 280mm top']
    ]),
    image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=400',
    featured: false,
  },
  {
    name: 'Noctua NH-D15',
    category: 'Cooling',
    brand: 'Noctua',
    model: 'NH-D15',
    price: 99.99,
    stock: 45,
    description: 'Premium dual-tower CPU cooler with excellent cooling performance and low noise.',
    specifications: new Map([
      ['Type', 'Dual Tower Air Cooler'],
      ['Socket Support', 'AM5, AM4, LGA1700, LGA1200'],
      ['Fans', 'NF-A15 PWM x2'],
      ['Height', '165mm'],
      ['TDP Rating', '220W+'],
      ['Warranty', '6 Years']
    ]),
    image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400',
    featured: false,
  },
];

const importData = async () => {
  try {
    console.log('MONGO_URI:', process.env.MONGO_URI); // Debug log
    
    await connectDB();

    // Clear existing data
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    // Insert users
    const createdUsers = await User.insertMany(users);
    console.log('Users imported successfully');

    // Insert products
    const createdProducts = await Product.insertMany(products);
    console.log('Products imported successfully');

    console.log('Data Imported Successfully!');
    console.log('Admin credentials: admin@pcpartshop.com / admin123');
    process.exit();
  } catch (error) {
    console.error(`Error importing data: ${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();

    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log('Data Destroyed Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error destroying data: ${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}