const authService = require('./auth.service')
const userService = require('../user/user.service')
const logger = require('../../services/logger.service')
const { OAuth2Client } = require('google-auth-library')
const client = new OAuth2Client('640315421255-e4mv3dirnt2lbm4ati92b1euclri0j8d.apps.googleusercontent.com')

async function login(req, res) {
    const { username, password } = req.body
    try {
        const user = await authService.login(username, password)
        req.session.user = user
        res.json(user)
    } catch (err) {
        logger.error('Failed to Login ' + err)
        res.status(401).send({ err: 'Failed to Login' })
    }
}

async function signup(req, res) {
    try {
        const { username, password, fullname ,userType , phone , email , field} = req.body
        // Never log passwords
        logger.debug(fullname + ', ' + username + ', ' + field , "field of user")
        const account = await authService.signup(username, password, fullname , userType , phone , email , field)
        logger.debug(`auth.route - new account created: ` + JSON.stringify(account))
        // const user = await authService.login(username, password)
        // req.session.user = user
        res.json(userService.getByUsername(username))
    } catch (err) {
        logger.error('Failed to signup ' + err)
        res.status(500).send({ err: 'Failed to signup' })
    }
}

async function addcons(req, res) {
    try {
        const {fullname ,field , phone} = req.body
        // Never log passwords
        const constructor = await authService.addcons(fullname ,field , phone)
        logger.debug(`auth.route - new account created: ` + JSON.stringify(account))
        if (constructor) Promise.resolve(constructor ,'constructor has been added')
    } catch (err) {
        logger.error('Failed to signup ' + err)
        res.status(500).send({ err: 'Failed to signup' })
    }
}
async function logout(req, res) {
    try {
        const user = req.body
        await authService.logout(user)
        if (req.session) req.session.destroy()
        res.send({ msg: 'Logged out successfully' })
    } catch (err) {
        res.status(500).send({ err: 'Failed to logout' })
    }
}

async function googleLogin(req, res) {
    try {
        const { tokenId } = req.body
        const googleRes = await client.verifyIdToken({ idToken: tokenId, audience: '640315421255-e4mv3dirnt2lbm4ati92b1euclri0j8d.apps.googleusercontent.com' })
        const { email, name } = googleRes.payload
        const user = await userService.getByUsername(email)
        if (!user) {
            logger.debug(`BuildApp doesnt have user with this ` + email ` gmail address`)
        }
        const googleUser = await authService.login(email, tokenId)
        req.session.user = googleUser
        res.json(googleUser)

    } catch (err) {
        res.status(500).send({ err: 'Failed to login with google' })
    }
}

module.exports = {
    login,
    signup,
    addcons,
    logout,
    googleLogin,
}