const User = require('../models/User');
const { ApolloError } = require('apollo-server-errors');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { MY_SECRET_KEY } = require('../config/jwt');

module.exports.loginHandler = async (args) => {
    const {email, password} = args;
    const user = await User.findOne({ email });
    if (!user) throw new ApolloError("No user with this email " + email, 'EMAIL_NOT_FOUND');


    const isMatch = await bcrypt.compareSync(password, user.password);
    if (!isMatch) throw new ApolloError("Wrong password for " + email, 'INCORRECT_PASSWORD');

    const token = jwt.sign(
        {
            user_id: user._id,
            email
        },
        MY_SECRET_KEY,
        {
            expiresIn: "12h"
        }
    );
    return token;
}