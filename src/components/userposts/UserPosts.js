import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./userPosts.css";
import { Link } from "react-router-dom";
import PostPopup from "./PostPopup";

function UserDetail() {
  const [userPosts, setUserPosts] = useState([]);
  const [userdetails, setuserDetails] = useState("");
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [time, setTime] = useState("");
  const [intervalId, setIntervalId] = useState(null);
  const { id } = useParams();
  const [showPopup, setShowPopup] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [second, setSecond] = useState("00");
  const [minute, setMinute] = useState("00");
  const [hour, setHour] = useState("00");
  const [isActive, setIsActive] = useState(true);
  const [counter, setCounter] = useState(0);
  const [selectedCountryTime, setSelectedCountryTime] = useState("");

  useEffect(() => {
    let intervalId;

    if (isActive) {
      intervalId = setInterval(() => {
        const secondCounter = counter % 60;
        const minuteCounter = Math.floor(counter / 60);
        const hourCounter = Math.floor(minuteCounter / 60);

        const computedSecond =
          String(secondCounter).length === 1
            ? `0${secondCounter}`
            : secondCounter;
        const computedMinute =
          String(minuteCounter % 60).length === 1
            ? `0${minuteCounter % 60}`
            : minuteCounter % 60;
        const computedHour =
          String(hourCounter).length === 1 ? `0${hourCounter}` : hourCounter;

        setSecond(computedSecond);
        setMinute(computedMinute);
        setHour(computedHour);

        setCounter((counter) => counter + 1);
        setTime(`${computedHour}:${computedMinute}:${computedSecond}`);
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [isActive, counter]);

  useEffect(
    (country) => {
      startInterval(country);
      fetchCountries();
      fetchUserDetails();
      fetchUserPosts();
    },
    [id]
  );

  // const fetchTimeZoneByIP = async () => {
  //   try {
  //     // Fetch user's IP address
  //     const ipResponse = await fetch("https://api64.ipify.org?format=json");
  //     const ipData = await ipResponse.json();
  //     const userIP = ipData.ip;

  //     // Fetch timezone based on user's IP when landing on page and no country selected
  //     const response = await fetch(`http://worldtimeapi.org/api/ip/${userIP}`);

  //     if (!response.ok) {
  //       throw new Error(`HTTP error! Status: ${response.status}`);
  //     }

  //     const data = await response.json();
  //     const regex = /T(\d{2}:\d{2}:\d{2})/;
  //     const match = data.datetime.match(regex);
  //     const extractedTime = match ? match[1] : "";

  //     settimeZoneByIp(extractedTime);
  //   } catch (error) {
  //     console.error("Error fetching time by IP:", error.message);
  //   }
  // };

  //////////////////////////////////////////-------COUNTRIES LIST--------/////////////////

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

      setSelectedCountryTime(extractedTime);
      // console.log(time)
    } catch (error) {
      console.error("Error fetching countries:", error.message);
    }
  };

  //////////////////////////////////////////-------USER dETAILS--------///////////////////
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

      setuserDetails(data);
    } catch (error) {
      console.error("Error fetching user details:", error.message);
    }
  };

  //////////////////////////////////////////-------USER POSTS--------/////////////////////
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

      setUserPosts(data);
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
    const id = setInterval(() => {
      fetchTimeZone(country);
    }, 1000);

    setIntervalId(id);
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

            <span className="clock">
              {selectedCountry
                ? selectedCountryTime
                : `${hour}:${minute}:${second}`}
            </span>
            <div className="buttons">
              <button onClick={() => setIsActive(!isActive)} className="pause">
                {isActive ? "Pause" : "Resume"}
              </button>
            </div>
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
