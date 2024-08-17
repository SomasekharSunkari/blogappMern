// components/Header.js
import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserContexts } from '../Context/UserContext.mjs';
import './Header.css';

const Header = () => {
  const { userInfo, setUserInfo } = useContext(UserContexts);

  useEffect(() => {
    fetch("http://localhost:5000/profile", {
      credentials: "include",
    })
      .then(response => {
      
           response.json().then(user=>{
            // console.log(user)
            setUserInfo(user)
            // console.log("In the Header Part !")
           });
        }
      )
      
      
  }, []);

  const logout = () => {
    fetch("http://localhost:5000/logout", {
      method: "POST",
      credentials: "include",
    })
      
    // console.log(userInfo)
        setUserInfo(null);
    // console.log(userInfo)
     
  };
  // console.log(userInfo)

  const username = userInfo?.username;

  return (
    <header className='header'>
      <Link to={"/"}>My Blog</Link>
      {username && (
        <div className='small'>
          <Link to="/create" className='post'>Create New Post</Link>
          <a onClick={logout}>Logout</a>
        </div>
      ) }
      { !username && (
        <div className='auth'>
          <Link to="/register">Register</Link>
          <Link to="/login">Login</Link>
        </div>
      )}
    </header>
  );
};

export default Header;
