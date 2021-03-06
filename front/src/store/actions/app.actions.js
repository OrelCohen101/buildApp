import { userService } from '../../services/user.service.js'
import { constructorService } from '../../services/constructor.service.js'
import { socketService } from '../../services/socket.service.js'
import { boardService } from '../../services/board.service.js'
import { onSaveBoard } from './board.actions.js'

export function onGoogleLogin(tokenId) {
    return async dispatch => {
        try {
            const user = await userService.googleLogin(tokenId)
            dispatch({ type: 'SET_USER', user })
            socketService.emit('user-watch', user._id)
        } catch (err) {
            console.log('UserActions: err in login', err)
        }
    }
}

export function onLogin(credentials = { username: 'guest', password: 'guest' }) {
    return async dispatch => {
        try {
            const user = await userService.login(credentials)
            dispatch({ type: 'SET_USER', user })
            socketService.emit('user-watch', user._id)
        } catch (err) {
            console.log('UserActions: err in login', err)
        }
    }
}

export function onSignup(userInfo) {
    return async dispatch => {
        try {
            const user = await userService.signup(userInfo)
            dispatch({ type: 'ADD_USER', user })
        } catch (err) {
            console.log('UserActions: err in signup', err)
        }
    }
}
export function onAddConstructor(constructorInfo) {
    return async dispatch => {
        try {
            const cons = await constructorService.addConstructor(constructorInfo)
            dispatch({ type: 'ADD_CONS', cons })
        } catch (err) {
            console.log('UserActions: err in add cons', err)
        }
    }
}

export function onLogout(user) {
    return async dispatch => {
        try {
            socketService.emit('user endSession', user._id)
            await userService.logout(user)
            dispatch({ type: 'SET_USER', user: null })
        } catch (err) {
            console.log('UserActions: err in logout', err)
        }
    }
}

export function openPopover(popoverName, elPos, props ) {
    return dispatch => {
        const action = {
            type: 'SET_POPOVER',
            popoverName,
            elPos,
            props
        }
        dispatch(action)
    }
}

export function closePopover(popoverType=null , user , board) {
    return dispatch => {
        const action = {
            type: 'CLOSE_POPOVER',
        }
        dispatch(action)
    }
}

export function updateOnlineUsers(onlineUsers) {
    return async dispatch => {
        try {
            dispatch({ type: 'SET_ONLINE_USERS', onlineUsers })
        } catch (err) {
            console.log('UserActions: err in login', err)
        }
    }
}
