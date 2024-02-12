import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser';

const app = express();

const allowedOrigins = ['http://localhost:5173']

app.use(express.json())
app.use(cors({
    // origin: `${process.env.CLIENT_URL}`,
    // origin:allowedOrigins,
    origin: '*',
    credentials: true,
  }));
app.use(express.urlencoded({extended: true}));
app.use(cookieParser())

// import routes
import userRouter from './routes/user.routes.js';

// route declaration
app.use('/api/v1/users', userRouter)


export default app;