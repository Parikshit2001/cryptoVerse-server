import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser';

const app = express();

const allowedOrigins = ['http://localhost:5173', 'https://crypto-verse-client.vercel.app', '*']

app.use(express.json())
app.use(cors({
    origin:allowedOrigins,
    credentials: true,
  }));
app.use(express.urlencoded({extended: true}));
app.use(cookieParser())

app.post('/', (req, res) => {
  const {email, username, password} = req.body;
  console.log(req.body);
    
  const options = {
      httpOnly: true,
      secure: true,
      sameSite: 'None'
  }

  return res
      .status(200)
      .cookie('accessToken', 'accessToken', options)
      .cookie('refreshToken', 'refreshToken', options)
      .json({
        message: "Okay"
      })
})

// import routes
import userRouter from './routes/user.routes.js';

// route declaration
app.use('/api/v1/users', userRouter)


export default app;