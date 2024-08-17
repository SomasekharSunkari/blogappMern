import "./Editpost.css";
import React, { useState, useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import Editor from "../Editor.mjs";

const EditPost = () => {
    const { id } = useParams();
    const [title, setTitle] = useState("");
    const [summary, setSummary] = useState("");
    const [content, setContent] = useState("");
    const [files, setFiles] = useState(null);
    const [redirect, setRedirect] = useState(false);

    // Fetch the post data on component mount
    useEffect(() => {
        fetch('http://localhost:5000/post/' + id)
            .then(response => response.json())
            .then(postInfo => {
                setTitle(postInfo.title);
                setContent(postInfo.content);
                setSummary(postInfo.summary);
            })
            .catch(error => console.error('Error fetching post data:', error));
    }, [id]);

    // Update the post
    const updatePost = async (ev) => {
        ev.preventDefault();
        try {
            const data = new FormData();
            data.set('title', title);
            data.set('summary', summary);
            data.set('content', content);
            data.set('id', id);
            if (files && files[0]) { // Only set the file if it exists
                data.set('file', files[0]);
            }

            const response = await fetch(`http://localhost:5000/post/`, {
                method: "PUT",
                credentials: "include",
                body: data,
            });

            if (response.ok) {
                setRedirect(true);
            }
        } catch (e) {
            console.error("Error updating post:", e);
        }
    };

    if (redirect) {
        return <Navigate to={`/posts/` + id} />;
    }

    return (
        <form onSubmit={updatePost} className='form-top'>
            <input placeholder='Title' type='text' value={title} onChange={(ev) => setTitle(ev.target.value)} />
            <input placeholder='Summary' type='text' value={summary} onChange={(ev) => setSummary(ev.target.value)} />
            <input type='file' onChange={e => setFiles(e.target.files)} />
            <Editor value={content} onChange={setContent} />
            <button className="btn-update-edit">Update Post</button>
        </form>
    );
}

export default EditPost;
