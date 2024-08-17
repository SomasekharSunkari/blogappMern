import React, { useContext, useEffect, useState } from 'react';
import "./Postpage.css";
import { formatISO9075 } from 'date-fns';
import { Link, useParams } from 'react-router-dom';
import { UserContexts } from '../Context/UserContext.mjs';

const Postpage = () => {
  const { id } = useParams();
  const [postInfo, setPostInfo] = useState();
  const { userInfo } = useContext(UserContexts);

  useEffect(() => {
    try {
      fetch(`http://localhost:5000/post/${id}`, {
        credentials: "include",
      })
        .then(response => response.json())
        .then(postInfos => setPostInfo(postInfos))
        .catch(err => {
          console.error("Error fetching post data:", err);
        });
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }, [id]);

  if (!postInfo) return "";

  return (
    <div className='postpage-image'>
      <div>
        <h1>{postInfo.title}</h1>

        <time className='time'>{formatISO9075(new Date(postInfo.createdAt))}</time>
        <div className='username'>
          by @{postInfo.author.username}
        </div>
        {userInfo && userInfo.id === postInfo.author._id && (
          <div className='edit-btn-con'>
            <Link to={`/edit/${postInfo._id}`} className='edit-btn'>Edit this post</Link>
          </div>
        )}
        <img src={`http://localhost:5000/${postInfo.cover}`} alt={postInfo.title} />
      </div>
      <div className='conten'>
        <div dangerouslySetInnerHTML={{ __html: postInfo.content }} />
      </div>
    </div>
  );
};

export default Postpage;
