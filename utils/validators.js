const { ApolloError } = require('apollo-server-express');
module.exports.validateRegisterInput = ({ firstName, lastName, email, password, confirmPassword }) => {
    if (firstName.trim() === '' || lastName.trim() === '' || email.trim() === '' || password == '' || confirmPassword == '') {
        throw new ApolloError("Empty fields not allowed", 'EMPTY_FIELDS');
    }

    if (password != confirmPassword) {
        throw new ApolloError("Passwords dont match.", 'PASSWORDS_DONT_MATCH');
    }

    const emailRegEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
    if (!email.match(emailRegEx)) {
        throw new ApolloError("Not a valid email format", 'INVALID_EMAIL');
    }

    return true;
};

module.exports.validateLoginInput = ({ email, password}) => {
    if (email.trim() === '' || password == '' ) {
        throw new ApolloError("Empty fields not allowed", 'EMPTY_FIELDS');
    }
    return true;
};