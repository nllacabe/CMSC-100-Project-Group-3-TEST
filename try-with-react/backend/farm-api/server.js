import express from 'express';
import router from './router.js'

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

router(app);                    // calls the router
app.listen(3001, () => {
    console.log("Listen to port 3001");
})