import React, { Component } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { GoogleLogin } from 'react-google-login'
import { ReactComponent as LogoRight } from '../assets/img/logos/auth-right-logo.svg'
import { ReactComponent as LogoLeft } from '../assets/img/logos/auth-left-logo.svg'
import { onLogin, onSignup } from '../store/actions/app.actions.js'
import { ReactComponent as LoginSignupLogo } from '../assets/img/logos/login-signup-logo.svg'
// import InputLabel from '@mui/material/InputLabel';
// import MenuItem from '@mui/material/MenuItem';
// import Select, { SelectChangeEvent } from '@mui/material/Select';


export class _LoginSignup extends Component {

    state = {
        userInfo: {
            fullname: '',
            username: '',
            password: '',
            userType: '',
            phone: '',
            email: '',
            imgUrl: ''
        },
        credentials: {
            username: '',
            password: ''
        },
        pageMode: null
    }

    componentDidMount() {
        const { loggedinUser } = this.props
        console.log(loggedinUser , "logggggged")
        // if (loggedinUser && !newsignup) this.props.history.push('/workspace')
        // loggedinUser ? pageMode = '/login' : pageMode = '/signup'
        console.log("path " , this.props.location.pathname )
        const pageMode = this.props.location.pathname === '/login' ? 'login' : 'signup'
        // console.log(loggedinUser , "loggedinUser")
        // const pageMode =  loggedinUser ? 'signup' : 'login'
        this.setState({ pageMode })
    }

    componentDidUpdate() {
        const { loggedInUser } = this.props
        const { pageMode } = this.state
        console.log('pageMoode' , pageMode)
        console.log(loggedInUser ,"logg")
        // if ( loggedInUser) this.props.history.push('/workspace')
    }

    validate = (values) => {
        const errors = {}
        if (!values.username) {
            errors.username = 'Required'
        } else if (values.username.length < 6) {
            errors.username = 'Please use at least 6 characters'
        }
        if (!values.password) {
            errors.password = 'Required'
        } else if (values.password.length < 4) {
            errors.password = 'Password too short'
        }
        if (!values.fullname) {
            errors.fullname = 'Required'
        } else if (values.fullname.length < 4) {
            errors.fullname = 'Please use at least 4 characters'
        }
        if (!values.email) {
            errors.email = 'Required'
        } else if (!(values.email).includes('@')){
            errors.email = 'Invalid email address'
        }
        if (!values.phone) {
            errors.phone = 'Required'
        } else if (values.phone.length < 8 || values.phone.length > 12 ) {
            errors.phone = 'Invalid phone number use 8-12 number'
        }
        return errors
    }

    onSubmit = (values) => {
        const { pageMode } = this.state
        const { onLogin, onSignup } = this.props
        if(pageMode === 'login') {
            onLogin(values)
            this.componentDidUpdate()
            this.props.history.push('/workspace')
        } else{
            onSignup(values)
            this.props.history.push('/workspace')
        }
    }

    onSuccessGoogle = (res) => {
        const { tokenId } = res
        const { onGoogleLogin } = this.props
        onGoogleLogin(tokenId)
    }

    onFailureGoogle = (res) => {
        console.log('Login with google failed', res)
    }


    render() {
        const { pageMode, credentials, userInfo } = this.state
        const { loginErr , loggedInUser } = this.props
        if (!pageMode) return ''
        return (<section className="login-signup-container">
            <Link to="/" className="clean-link"><div className="logo flex align-center justify-center">
                <LoginSignupLogo />
                <h1>BuildApp</h1>
            </div>
            </Link>
            {pageMode === 'login' && <div className="login-signup flex column">
                <h3>Log in to BuildApp</h3>
                <Formik initialValues={credentials} onSubmit={this.onSubmit} >
                    <Form className="flex column">
                        <Field type="username" placeholder="Enter username" name="username" autoFocus />
                        <ErrorMessage name="username" component="div" />
                        <Field type="password" placeholder="Enter password" name="password" />
                        <ErrorMessage name="password" component="div" />
                        {loginErr && <p>{loginErr}</p>}
                        <button type="submit" className="primary-btn login-signup-btn">Log in</button>
                    </Form>
                </Formik>
                {/* <GoogleLogin
                    className="google-login-btn flex align-center justify-center"
                    clientId='640315421255-e4mv3dirnt2lbm4ati92b1euclri0j8d.apps.googleusercontent.com'
                    buttonText='Continue with Google'
                    onSuccess={this.onSuccessGoogle}
                    onFailure={this.onFailureGoogle}
                    cookiePolicy={'single_host_origin'}
                /> */}    
            </div>}
        
            {pageMode === 'signup' &&
                <div className="login-signup flex column ">
                    <h3>Sign up for your account</h3>
                    <Formik initialValues={userInfo} validateOnChange={false} validateOnBlur={false} validate={this.validate} onSubmit={this.onSubmit}>
                        <Form className="flex column">
                            <Field type="fullname" placeholder="Enter fullname" name="fullname" autoFocus />
                            <ErrorMessage name="fullname" component="p" />
                            <Field type="email" placeholder="Enter Email address" name="email" autoFocus />
                            <ErrorMessage name="email" component="p" />
                            <Field type="phone" placeholder="Enter phone number" name="phone" />
                            <ErrorMessage name="phone" component="p" />
                            <Field type="username" placeholder="Enter username" name="username" />
                            <ErrorMessage name="username" component="p" />
                            <Field type="password" placeholder="Enter password" name="password" />
                            <ErrorMessage name="password" component="p" />



                            <Field name="userType" as="select" placeholder="Select type of user"
                                //component="select"
                                value = {this.value}
                                className = "LoginSelectBar"
                            >
                                <option defaultValue disabled>Select type of user </option>
                                <option value = "admin">admin</option>
                                <option value = "manager">manager</option>
                                <option value = "client">client</option>
                                
                                
                                
                            </Field>

                            <button type="submit" className="primary-btn login-signup-btn">Sign up</button>
                        </Form>
                    </Formik>
                    <hr />
                    <Link to="/login">Already have an account ? Log In</Link>
                </div>}
            <div className="left-logo">
                <LogoLeft />
            </div>
            <div className="right-logo">
                <LogoRight />
            </div>
        </section>
        )
    }
}

function mapStateToProps(state) {
    return {
        loggedInUser: state.appModule.loggedInUser,
        loginErr: state.appModule.loginErr
    }
}


const mapDispatchToProps = {
    onLogin,
    onSignup,
}

export const LoginSignup = connect(mapStateToProps, mapDispatchToProps)(_LoginSignup)


