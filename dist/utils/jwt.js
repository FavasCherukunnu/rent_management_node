import jwt from 'jsonwebtoken';
export const generateAccessTokenAdmin = function ({ id }) {
    return jwt.sign({ id: id }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    });
};
export const verifyAccessTokenAdmin = function (token) {
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        return decoded;
    }
    catch (error) {
        return null;
    }
};
