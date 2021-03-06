import React, { Component } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { GoogleLogin } from 'react-google-login'
import { ReactComponent as LogoRight } from '../assets/img/logos/auth-right-logo.svg'
import { ReactComponent as LogoLeft } from '../assets/img/logos/auth-left-logo.svg'
import { onLogin, onSignup } from '../store/actions/app.actions.js'
import { ReactComponent as LoginSignupLogo } from '../assets/img/logos/login-signup-logo.svg'
import home_logo from '../assets/img/buildApp_logo.png'
import heroImgUrl from '../assets/img/hero.png'


export class _LoginSignup extends Component {

    state = {
        userInfo: {
            fullname: '',
            username: '',
            password: '',
            userType: '',
            phone: '',
            email: '',
            imgUrl: '',
            field: '',
        },
        credentials: {
            username: '',
            password: ''
        },
        pageMode: null
    }

    componentDidMount() {
        const { loggedinUser } = this.props
        const pageMode = this.props.location.pathname === '/login' ? 'login' : 'signup'
        this.setState({ pageMode })
    }

    componentDidUpdate() {
        const { loggedInUser } = this.props
        const { pageMode } = this.state
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
        if (values.field && values.userType !== 'constructor') {
            errors.field = '?????? ???? ?????????????? ?????????????? ????????'
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

    render() {
        const { pageMode, credentials, userInfo } = this.state
        const { loginErr , loggedInUser } = this.props
        if (!pageMode) return ''
        return (<section className="login-signup-container">
            
            {pageMode === 'login' && <div className="login-signup flex column">
            <Link to="/" className="clean-link"><div className="logo flex align-center justify-center">
                <h1>BuildApp</h1>
            </div>
            </Link>
                <h3>?????????? ??????????????????</h3>
                <Formik initialValues={credentials} onSubmit={this.onSubmit} >
                    <Form className="flex column login-form">
                        <Field type="username" placeholder="???? ??????????" name="username" autoFocus className="login-input"/>
                        <ErrorMessage name="username" component="div" />
                        <Field type="password" placeholder="??????????" name="password" className="login-input" />
                        <ErrorMessage name="password" component="div" />
                        {loginErr && <p>{loginErr}</p>}
                        <button type="submit" className="primary-btn login-signup-btn" >??????????</button>
                    </Form>
                </Formik>  
            </div>}
        
            {pageMode === 'signup' &&
                <div className="login-signup flex column ">
                    <Link to="/users" className="clean-link"><div className="logo flex align-center justify-center">
                <h1>BuildApp</h1>
            </div>
            </Link>
                    <h3>???????? ?????????? ??????</h3>
                    <Formik initialValues={userInfo} validateOnChange={false} validateOnBlur={false} validate={this.validate} onSubmit={this.onSubmit}>
                        <Form className="flex column">
                            <Field type="fullname" placeholder="???? ??????" name="fullname" autoFocus />
                            <ErrorMessage name="fullname" component="p" />
                            <Field type="email" placeholder="?????????? ????????????" name="email" autoFocus />
                            <ErrorMessage name="email" component="p" />
                            <Field type="phone" placeholder="???????? ????????????" name="phone" />
                            <ErrorMessage name="phone" component="p" />
                            <Field type="username" placeholder="???? ??????????" name="username" />
                            <ErrorMessage name="username" component="p" />
                            <Field type="password" placeholder="??????????" name="password" />
                            <ErrorMessage name="password" component="p" />



                            <Field name="userType" as="select" placeholder="?????? ?????? ??????????"
                                //component="select"
                                value = {this.value}
                                className = "LoginSelectBar"
                            >
                                <option defaultValue disabled>?????? ?????????? ????????????</option>
                                <option value = "admin">???????? ??????????</option>
                                <option value = "manager">???????? ????????????</option>
                                <option value = "client">????????</option>
                                <option value = "constructor">????????</option>
                                
                            </Field>
                      
                            <Field name="field" as="select" placeholder="Select field of constructor"
                                //component="select"
                                value = {this.value}
                                className = "LoginSelectBar field"
                            >
                                <option defaultValue disabled>?????? ???????? ?????????? </option>
                                <option value = "????????">????????</option>
                                <option value = "??????????????????">??????????????????</option>
                                <option value = "??????????">??????????</option>
                                <option value = "??????????">??????????</option>
                                
                            </Field>
                            <ErrorMessage name="field" component="p" />

                            <button type="submit" className="primary-btn login-signup-btn">???????? ??????????</button>
                        </Form>
                    </Formik>
                </div>}
            {/* <div className="left-logo"> */}
                {/* <LogoLeft /> */}
                {/* <img src="../assets/images/leftLogo.jpg" alt="img suppose to be here"/> */}
            {/* </div> */}
            {/* <div className="right-logo"> */}
                {/* <LogoRight /> */}
            {/* </div>  */}
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


