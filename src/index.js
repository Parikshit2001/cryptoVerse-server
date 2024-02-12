import dotenv from 'dotenv'
import connectToDB from './db/dbConnect.js';
import app from './app.js'

// environment variable initialise
dotenv.config({
    path: './.env'
})

// connect to DB
const port = process.env.PORT || 3000;
connectToDB()
    .then(() => {
        app.listen(port, () => {
            console.log(`Server listening on port ${port}`)
        })
    })
    .catch((error) => console.error("Error connecting to DB: ", error))
