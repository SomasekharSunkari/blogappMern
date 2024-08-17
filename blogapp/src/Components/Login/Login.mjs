import React, { Fragment, useState, useContext } from 'react'
import "./Login.css"
import { Form, Link, Navigate } from 'react-router-dom'
import { UserContexts } from '../Context/UserContext.mjs';


const Login = () => {
    const [username, setusername] = useState('');
    const [password, setPassword] = useState("");
    const [redirect, setRedirect] = useState(false)
    const { setUserInfo } = useContext(UserContexts)
    const handlesbmit = async (ev) => {
        ev.preventDefault();
        const response = await fetch("http://localhost:5000/login", {
            "method": "POST",
            "headers": { "Content-Type": "application/json" },
            "body": JSON.stringify({ username, password }),
            "credentials": "include"
        })
        if (response.ok) {
            setusername("")
            setPassword("")
            response.json().then(userinfo => {
                setRedirect(true)
                setUserInfo(userinfo)
            })
            // setRedirect(true)
            // setUserInfo(response.username)
        }
        else {
            alert("Wrong Credentials !");
        }
    }
    if (redirect) {
        return <Navigate to={'/'} />
    }
    return (
        <Fragment>
            <h1 className='loginh1'>Login</h1>
            <form onSubmit={handlesbmit} className='form'>
                <input placeholder='username' type='text' onChange={(e) => { setusername(e.target.value) }} />
                <input placeholder='password' type='password' onChange={(e) => { setPassword(e.target.value) }} />
                <button>Login</button>
                <p>Don't have an account ? <Link to={"/register"}>Register Here</Link></p>

            </form>
        </Fragment>
    )
}

export default Login
