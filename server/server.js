import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";

const app = express();
const port = process.env.PORT || 4000;

connectDB();

const allowedOrigins = [
    'http://localhost:5173',
    'https://batauthsys.netlify.app/'
];

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin(origin, callback) {
      // allow tools like Postman (no origin) and whitelisted sites
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('CORS policy: Origin not allowed'));
    },
    credentials: true
}));

//API Endpoints
app.get('/', (req,res)=> res.send('API Working!'));
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

app.listen(port, ()=> console.log(`server started on port: ${port}`));