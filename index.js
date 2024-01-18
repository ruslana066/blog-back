
import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import fs from 'fs'
import cors from 'cors'

import { loginValidation, postCreateValidation, registerValidator } from './validations/validationd.js';
import checkAuth from './utils/checkAuth.js';
import * as UserController from './controllers/userController.js';
import * as PostController from './controllers/postController.js';


mongoose
    .connect('mongodb+srv://admin:admin123456@cluster0.p8rz2fw.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => console.log('DB ok'))
    .catch(err => console.log('DB not OK', err));

const app = express()
app.use(express.json())
app.use(cors())
app.use('/uploads', express.static('uploads'))


const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        if (!fs.existsSync('uploads')) {
            fs.mkdirSync('uploads');
        }
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});



app.get('/', (req, res) => {
    res.send("Welcome")
})

const upload = multer({ storage });



app.post('/auth/login', (req, res) => {
    console.log(req.body);

    const token = jwt.sign(
        {
            email: req.body.email,
            fullName: 'Петя Дудочкин'
        },
        'hash333',
    );
    res.json({
        success: true,
        token
    })
});


app.post('/auth/login', loginValidation, UserController.login);
app.post('/auth/register', registerValidator, UserController.register);
app.post('/posts', checkAuth, postCreateValidation, PostController.create);

app.get('/auth/profile', checkAuth, UserController.profile);
app.get('/posts', PostController.getAll);
app.get('/tags', PostController.getLastTags);
app.get('/posts/:id', PostController.getOne);

app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', checkAuth, PostController.update);


app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`
    })
})


app.listen(process.env.PORT || '4444', (err) => {
    if (err) {
        return console.log(err)
    }
    console.log('Server is ok')
});






