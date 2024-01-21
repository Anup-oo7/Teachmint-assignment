import React, { useEffect, useState } from 'react';
import {Link} from 'react-router-dom'
import './directory.css';

function Directory() {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);

  useEffect(() => {

/****************************************************-----------USER NAMES------------************ ********************************** */

    const fetchUserData = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching user data:', error.message);
      }
    };

/****************************************************-----------USER POST-COUNT------------************ ********************************** */

    const fetchUserPostData = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching post data:', error.message);
      }
    };

    fetchUserData();
    fetchUserPostData();
  }, []);

  // Function to count posts for each user
  const countUserPosts = (userId) => {
    return posts.filter(post => post.userId === userId).length;
  };

 

  return (
    <div className='mainContainer'>
      <div className='Container'>
          <h2>Directory</h2>
                {users.map(user => (
        <Link to={`/${user.id}`} className="card cards" key={user.id}>
            <div className="card-body" >
              <div key={user.id} className='cardsContent'>
                <div className='Name'>Name:   {user.name}</div>
                <div className='Posts'>Posts:  {countUserPosts(user.id)}</div>
              </div>
            </div>
        </Link>
              ))}
        
      </div>
    </div>
  );
}

export default Directory;
