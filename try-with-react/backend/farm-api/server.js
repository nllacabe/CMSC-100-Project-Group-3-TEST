import express from 'express';
import router from './router.js'
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//middleware
app.use(bodyParser.json())
app.use(cors())

router(app);                    // calls the router
  // Start server
  const PORT = 3000
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });