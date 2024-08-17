import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { UserModel } from "./models/User.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import { fileURLToPath } from 'url';
import path from 'path';
import cookieParser from 'cookie-parser';
import { PostModel } from './models/Post.js';
import fs from 'fs';

// Set up multer for file uploads
const uploadMiddleware = multer({ dest: 'uploads/' });

const app = express();
const secre = "3432423432234243dsfsdf";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log(__dirname)
// Middleware to serve static files from the "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from this origin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed methods
  credentials: true // Allow cookies to be sent
}));

app.use(express.json());
app.use(cookieParser());

// Connect to MongoDB
const mongoURI = "mongodb+srv://ragu:dND0eYR7AsokP59F@cluster0.uy19k9u.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

// Register route
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const userDoc = await UserModel.create({ username, password: hashedPassword });
    res.status(201).json(userDoc);
  } catch (e) {
    console.error("Error occurred while creating user:", e);
    res.status(500).json({ error: 'Error occurred while creating user' });
  }
});

// Login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const userDoc = await UserModel.findOne({ username });

    if (!userDoc) {
      return res.status(404).json({ error: 'User not found' });
    }

    const passOK = bcrypt.compareSync(password, userDoc.password);

    if (!passOK) {
      return res.status(401).json({ error: 'Invalid Password' });
    }

    jwt.sign(
      { username, id: userDoc._id },
      process.env.JWT_SECRET || secre,
      {},
      (err, token) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to generate token' });
        }
        res.cookie("token", token, { httpOnly: true }).json({
          id: userDoc._id,
          username
        });
      }
    );
  } catch (e) {
    console.error("Error occurred during login:", e);
    res.status(500).json({ error: 'Error occurred during login' });
  }
});

// Profile route
app.get("/profile", (req, res) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  jwt.verify(token, secre, {}, (err, info) => {
    if (err) {
      return res.status(403).json({ error: 'Failed to authenticate token' });
    }
    res.json(info); // Send the decoded token information as JSON response
  });
});

// Logout route
app.post("/logout", (req, res) => {
  res.cookie('token', '', { httpOnly: true }).json("ok");
});


app.put('/post', uploadMiddleware.single('file'), async (req, res) => {
  let newPath = null;
  if (req.file) {
    const { originalname, path } = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    newPath = path + '.' + ext;
    fs.renameSync(path, newPath);
  }

  const { token } = req.cookies;
  jwt.verify(token, secre, {}, async (err, info) => {
    if (err) throw err;
    const { id, title, summary, content } = req.body;
    const postDoc = await PostModel.findById(id);
    console.log(postDoc)
    const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
    if (!isAuthor) {
      return res.status(400).json('you are not the author');
    }
    await postDoc.updateOne({
      title,
      summary,
      content,
      cover: newPath ? newPath : postDoc.cover,
    });

    res.json(postDoc);
  });

});
// Create post route
app.post("/posts", uploadMiddleware.single("file"), async (req, res) => {
  const { originalname, path } = req.file;
  const parts = originalname.split(".");
  const ext = parts[parts.length - 1];
  const newPath = path + "." + ext;
  fs.renameSync(path, newPath);
  // console.log(req)
  const { token } = req.cookies;
  jwt.verify(token, secre, {}, async (err, info) => {
    if (err) throw err;
    const { title, summary, content } = req.body;
    const postDoc = await PostModel.create({
      title,
      summary,
      content,
      cover: newPath,
      author: info.id,
    });
    res.json(postDoc);
  });
});

// Get post by ID
app.get("/post/:id", async (req, res) => {
  const { id } = req.params;
  const post = await PostModel.findById(id).populate('author', ['username']);
  res.json(post);
});

// Get all posts
app.get("/getposts", async (req, res) => {
  const posts = await PostModel.find({}).populate('author', ['username'])
    .sort({ createdAt: -1 })
    .limit(20);
  // console.log(posts)
  res.json(posts);
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start server
app.listen(5000, () => {
  console.log('API Server is running on port 5000');
});
