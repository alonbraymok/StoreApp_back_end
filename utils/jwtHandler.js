const jwt = require('jwt-simple')
const jwtSecret = 'xxx'
const userEncoder = (username, password) => jwt.encode({username, password}, jwtSecret)
const userDecoder = (jwtToken) => {
    try {
        return jwt.decode(jwtToken, jwtSecret)
    }
    catch (err) {
        return null
    }
}

module.exports = {
    userDecoder,
    userEncoder
}