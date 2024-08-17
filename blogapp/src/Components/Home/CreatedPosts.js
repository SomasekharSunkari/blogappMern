import React from 'react';
import "./CreatedPosts.css"; // Import the CSS file
import { Link } from 'react-router-dom';
import { formatISO9075 } from "date-fns"

const CreatedPosts = ({ id, title, summary, image, content, createdAt, author }) => {
  return (
    <div className='posts-create'>
      <img src={"http://localhost:5000/" + image} alt={title} />
      <div className='post-content'>
            <Link to={`/posts/${id}`}>{title}</Link>
            <div className='about'>
              <a className='author'>@{author}</a>
              <time>{formatISO9075(new Date(createdAt))}</time>
            </div>
            <p>{summary}</p>
            <div dangerouslySetInnerHTML={{ __html:content }}/>
      </div>
    </div>
  );
};

export default CreatedPosts;
