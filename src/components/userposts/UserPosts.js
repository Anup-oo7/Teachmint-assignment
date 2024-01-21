import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./userPosts.css";
import { Link } from "react-router-dom";
import PostPopup from './PostPopup'

function UserDetail() {
  const [userPosts, setUserPosts] = useState([]);
  const [userdetails, setuserDetails] = useState("");
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [timeZoneByIp, settimeZoneByIp] = useState()
  const [time, setTime] = useState('');
  const [intervalId, setIntervalId] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  // const [pauseTimestamp, setPauseTimestamp] = useState(null);
  // const [lastFetchedTime, setLastFetchedTime] = useState("");
  const { id } = useParams();
  const [showPopup, setShowPopup] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect((country) => {
    startInterval(country)
    fetchTimeZoneByIP()
    fetchCountries();
    fetchUserDetails();
    fetchUserPosts();
  }, [id]);


  //////////////////////////////////////////-------INITIAL TIME--------/////////////
  
  const fetchTimeZoneByIP = async () => {
    try {
      // Fetch user's IP address
      const ipResponse = await fetch('https://api64.ipify.org?format=json');
      const ipData = await ipResponse.json();
      const userIP = ipData.ip;
  
      // Fetch timezone based on user's IP
      const response = await fetch(`http://worldtimeapi.org/api/ip/${userIP}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      const regex = /T(\d{2}:\d{2}:\d{2})/;
      const match = data.datetime.match(regex);
      const extractedTime = match ? match[1] : "";
  
      settimeZoneByIp(extractedTime);
      // console.log(time)
    } catch (error) {
      console.error("Error fetching time by IP:", error.message);
    }
  };

  //////////////////////////////////////////-------COUNTRIES LIST--------/////////////

  const fetchCountries = async () => {
    try {
      const response = await fetch("http://worldtimeapi.org/api/timezone", {
        method: "Get",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setCountries(data);

      // console.log(selectedCountry)
    } catch (error) {
      console.error("Error fetching countries:", error.message);
    }
  };

  //////////////////////////////////////////-------COUNTRIES-TIMEZONE--------/////////////
  const fetchTimeZone = async (selectedCountry) => {
    try {
      const response = await fetch(
        `http://worldtimeapi.org/api/timezone/${selectedCountry}`,
        {
          method: "Get",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      const regex = /T(\d{2}:\d{2}:\d{2})/;
      const match = data.datetime.match(regex);
      const extractedTime = match ? match[1] : "";

      setTime(extractedTime);
      // console.log(time)
    } catch (error) {
      console.error("Error fetching countries:", error.message);
    }
  };

  //////////////////////////////////////////-------USER dETAILS--------/////////////
  const fetchUserDetails = async () => {
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/users/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      // console.log(data)
      setuserDetails(data);
       // Fetch the initial time when user details are fetched
    
      // console.log(userdetails)
    } catch (error) {
      console.error("Error fetching user details:", error.message);
    }
  };

   //////////////////////////////////////////-------USER POSTS--------/////////////
   const fetchUserPosts = async () => {
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts?userId=${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      // console.log(data)
      setUserPosts(data);
      // console.log(userPosts)
    } catch (error) {
      console.error("Error fetching user posts:", error.message);
    }
  };

 

 

  const handleCountryClick = (country) => {
    setSelectedCountry(country);
    fetchTimeZone(country);
    startInterval(country);
  };

  const startInterval = (country) => {
    console.log("called");
    let id
    if(time){
       id = setInterval(() => {
        fetchTimeZone(country);
      }, 1000);
    }else{
       id = setInterval(() => {
        fetchTimeZoneByIP(country);
      }, 1000);
    }
    

    setIntervalId(id);
  };

  const togglePause = () => {
    setIsPaused((prevPaused) => {
      if (!prevPaused) {
        
        clearInterval(intervalId); // Stop the interval if currently paused
      } else {
        startInterval(selectedCountry); // Start the interval if currently playing
      }
      return !prevPaused; // Toggle the paused state
    });
  };

  useEffect(() => {
    return () => {
      clearInterval(intervalId);
    };
  }, [intervalId]);


  const handlePostClick = (post) => {
    setSelectedPost(post);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="container">
      <div className="section">
      <div className="row">
        <div className="col-md-4 ">
          <div className="back">
            <Link to={"/"}>Back</Link>
          </div>
        </div>
        <div className="col-md-4"></div>
        <div className="col-md-4 text-right rightItems">
          <div className="dropdown">
            <button
              className="btn btn-secondary dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {selectedCountry || "Select country"}
            </button>
            <ul className="dropdown-menu">
              {countries.map((country, index) => (
                <li key={index} onClick={() => handleCountryClick(country)}>
                  <p className="dropdown-item">{country}</p>
                </li>
              ))}
            </ul>
          </div>

         <span className="clock">{time ? time :timeZoneByIp}</span>

          <button onClick={togglePause} className="pause">
            {isPaused ? "Resume" : "Pause"}
          </button>
        </div>
      </div>
    </div>
  

{/****************************************************-----------USER DETAILS------------************ ********************************** */}
      <div className="section sectionTwo">
        {userdetails && (
          <div className="card">
            <div className="card-body userDetails">
              <div className="basicDetails">
                <p>Name:{userdetails.name}</p>
                <p>
                  Username:{userdetails.username}|Catch phrase:
                  {userdetails.company.catchPhrase}
                </p>
              </div>
  
              <div className="otherDetails">
                <p>
                  Address:{" "}
                  {Object.entries(userdetails.address).map(([key, value]) => (
                    <span key={key}>
                      {key === "geo" ? (
                        <>
                          {key}: <br />
                          {Object.entries(value).map(([geoKey, geoValue]) => (
                            <span key={geoKey}>
                              {geoKey}: {geoValue} <br />
                            </span>
                          ))}
                        </>
                      ) : (
                        <>
                          {key}:{" "}
                          {typeof value === "object"
                            ? Object.values(value).join(", ")
                            : value}
                          <br />
                        </>
                      )}
                    </span>
                  ))}
                </p>
  
                <p>
                  Email:{userdetails.email}|Phone:{userdetails.phone}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
  
{/****************************************************-----------USER POSTS------------************ ********************************** */}

      <div className="section">
        <div className="row">
          {userPosts.map((post, index) => (
            <div key={post.id} className="col-md-4">
              <div className="card posts" onClick={() => handlePostClick(post)}>
                <div className="card-body">
                  <h3>{post.title}</h3>
                  <p>{post.body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        {showPopup && <PostPopup post={selectedPost} onClose={closePopup} />}
      </div>
    </div>
  );
  
}

export default UserDetail;
