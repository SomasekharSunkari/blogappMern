import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import "./Register.css"
const Register = () => {
    const [username,setusername] = useState("");
    const [password,setPassword] = useState("")
    const handlesbmit = async(ev) => {
        ev.preventDefault();        console.log("Registration Form Submitted")
      const result = await  fetch("http://localhost:5000/register",{
            method:"POST",
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({username,password})
        })

        if(result.ok === false){
            alert("Registration failed !")
        }
        else{
            alert("Registration Succesfull")
        }
        // console.log(result)
    }
    return (

        <>
            <h1 className='loginh1'>Register</h1>
            <form onSubmit={handlesbmit} className='form'>
                <input placeholder='username' type='text'     onChange={(e)=>setusername(e.target.value)}/>
                <input placeholder='password' type='password' onChange={(e)=>setPassword(e.target.value)} />
                <button>Register</button>
                <p>Already have an account ? <Link to={"/login"}>Login Here</Link></p>

            </form>
        </>
    )
}

export default Register
