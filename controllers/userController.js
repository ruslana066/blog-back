import { validationResult } from 'express-validator';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';


export const login = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).json(
                { message: 'Пользователь не найден' }
            )
        }

        const isValidPassword = await bcrypt.compare(req.body.password, user._doc.passwordHash);

        if (!isValidPassword) {
            return res.status(403).json(
                { message: 'Неверный логин или пароль' }
            )
        }

        const token = jwt.sign({
            _id: user._id
        }, 'secret123', {expiresIn: '30d'});


        const { passwordHash, ...userData } = user._doc
        res.json({...userData, token})

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Ошибка авторизации'
        })
    }
}

export const register = async (req, res) => {
    try {
        const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
    }

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const doc = new User({
        email: req.body.email,
        fullName: req.body.fullName,
        avatarUrl: req.body.avatarUrl,
        passwordHash: hash
    });

    const user = await doc.save();

    const token = jwt.sign({
        _id: user._id
    }, 'secret123', {expiresIn: '30d'});

    const { passwordHash, ...userData } = user._doc

    // res.json({...user, token})
    res.json({...userData, token})
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Ошибка регистрации'
        })
    }
}

export const profile = async (req, res) => {
    try {
        const user = await User.findById(req.userId);

        if (!user) {
            res.status(404).json({
                message: 'Пользователь не найден'
            })
        }
        const { passwordHash, ...userData } = user._doc

        res.json({...userData})
    } catch (err) {
        res.status(403).json({
            message: 'Нет доступа',
          });
    }
}