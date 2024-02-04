const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('../utils/jwt');
const { SECRET } = require('../config/config');

exports.register = async (userData) => {
    const existingUser = User.findOne({ email: userData.email });

    if (existingUser) {
        throw new Error('Email exists');
    }

    if (userData.password != userData.rePassword) {
        throw new Error('Passwords must match');
    }

    const hash = await bcrypt.hash(userData.password, 12);
    const user = await User.create({ email: userData.email, password: hash });

    const payload = {
        _id: user._id,
        email: user.email
    };

    const token = await jwt.sign(payload, SECRET, { expiresIn: '2h' });

    return token;
};

exports.login = async (userData) => {
    const user = await User.findOne({ email: userData.email });

    if (!user) {
        throw new Error('Email or password don\'t match');
    }

    const isValid = await bcrypt.compare(userData.password, user.password);

    if (!isValid) {
        throw new Error('Email or password don\'t match');
    }

    const payload = {
        _id: user._id,
        email: user.email
    };

    const token = await jwt.sign(payload, SECRET, { expiresIn: '2h' });

    return token;
};

exports.getUserWithMovies = (userId) => User.findById(userId).populate('movies');