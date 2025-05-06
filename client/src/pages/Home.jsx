import React, { useEffect, useState } from 'react';
import './Home.css';

function Home() {
  const [posts, setPosts] = useState([]);
  const [wyxing, setWyxing] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/posts')
      .then(res => res.json())
      .then(data => setPosts(data));

    const interval = setInterval(() => {
      fetch('http://localhost:5000/api/users/notifications', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
        .then(res => res.json())
        .then(data => setNotifications(data));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const toggleWyx = () => {
    fetch(`http://localhost:5000/api/users/wyx`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ active: !wyxing }),
    });
    setWyxing(!wyxing);
  };

  return (
    <div className="home">
      <h1 className="title">Wyx - With your Friends</h1>
      <button onClick={toggleWyx} className="wyx-button">
        {wyxing ? 'Wyx beenden' : 'Jetzt Wyxen!'}
      </button>

      <div className="notifications">
        <h2>Benachrichtigungen</h2>
        {notifications.map((note, index) => (
          <p key={index}>{note}</p>
        ))}
      </div>

      {posts.map(post => (
        <div key={post._id} className="post">
          <p><strong>{post.author.username}</strong>: {post.content}</p>
          {post.link && <a href={post.link} target="_blank" rel="noreferrer">Zum Link</a>}
          <p>Likes: {post.likes.length}</p>
        </div>
      ))}
    </div>
  );
}

export default Home;