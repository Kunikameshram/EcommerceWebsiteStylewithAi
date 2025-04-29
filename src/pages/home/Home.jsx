import React from "react";
import Banner from "./Banner";
import Follow from "../follow/Follow";
import Reviews from "../reviews/Reviews";


const Home = () => {
  const isAuthenticated = !!localStorage.getItem('token'); // assume token is stored on login

  return (
    <div>
      <Banner />
      <Reviews />
      <Follow />
    </div>
  );
};

export default Home;
