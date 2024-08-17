import React, { useState, useEffect, useContext } from 'react';
import Post from './CreatedPosts.js';
import "./Home.css";
import { UserContexts } from '../Context/UserContext.mjs';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [usernameacc, setUsernameac] = useState({});
  const { userInfo: info } = useContext(UserContexts);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("http://localhost:5000/getposts");
        const udata = await fetch("http://localhost:5000/profile", {
          credentials: "include",
        });

        const data = await response.json();
        setPosts(data);
      
        const data2 = await udata.json();
        console.log(udata)
        // setUsernameac(data2);

      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  // Use another useEffect to observe when usernameacc updates
  useEffect(() => {
    if (posts) {
      posts.map(item => {
        console.log(item.author.username)
      })
    }
  }, [posts]);

  if (!info) return "Login to see the blogs";

  return (
    <div className='header-home'>
      {posts.length > 0 && posts.map((item, index) => (
        <Post
          key={item._id || index}
          title={item.title}
          summary={item.summary}
          image={item.cover}
          id={item._id}
          content={item.content}
          author={item.author?.username}
          createdAt={item.createdAt}
        />
      ))}
    </div>
  );
};

export default Home;
