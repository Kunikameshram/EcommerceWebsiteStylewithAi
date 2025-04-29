import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import axios from "axios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [activeIndex, setActiveIndex] = useState(1);

  useEffect(() => {
    axios
      .get("http://3.145.109.156:5001/api/products/reviews/five-star")
      .then((res) => setReviews(res.data))
      .catch((err) => console.error("Failed to fetch reviews", err));
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: "0",
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    beforeChange: (_, next) => setActiveIndex(next),
  };

  return (
    <div className="flex flex-col items-center justify-center w-screen bg-gray-100 px-4">
      <h2 className="text-5xl font-bold mt-24 mb-4 text-center">Customer Reviews</h2>
      <p className="text-gray-600 mb-6 text-center">
        Take a look at our happy customers and their testimonials.
      </p>

      <div className="w-full max-w-7xl">
        {reviews.length === 0 ? (
          <p className="text-center text-gray-500">No 5-star reviews available.</p>
        ) : (
          <Slider {...settings}>
            {reviews.map((review, index) => (
              <div key={review.id} className="px-8 transition-transform duration-300">
                <div
                  className={`bg-white p-6 rounded-lg shadow-lg text-center transition-all duration-300 h-full flex flex-col justify-center ${
                    index === activeIndex ? "scale-110" : "scale-60 opacity-75"
                  }`}
                >
                  <img
                    src={`https://randomuser.me/api/portraits/${review.username.length % 2 === 0 ? "women" : "men"}/${(review.id % 90) + 1}.jpg`}
                    alt={review.username}
                    className="mx-auto w-20 h-20 rounded-full mb-4 object-cover"
                  />
                  <p className="text-gray-800 italic">"{review.comment}"</p>
                  <div className="text-yellow-500 text-lg my-2">★★★★★</div>
                  <h3 className="text-lg font-semibold">{review.username}</h3>
                  <p className="text-sm text-gray-500">{review.product_name}</p>
                </div>
              </div>
            ))}
          </Slider>
        )}
      </div>
    </div>
  );
};

export default Reviews;

