import React from "react";
import { useNavigate, Link } from "react-router-dom";

const Banner = () => {
  const navigate = useNavigate();

  return (
    <section className="max-w-screen-xl mx-auto px-4 py-10">
      {/* Logo */}
      <Link to="/" className="flex items-center mb-10">
        <span className="text-2xl font-extrabold bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text">
          StyleWithAi
        </span>
      </Link>

      {/* Top Section with 3 Images */}
      <div className="grid grid-cols-3 gap-4 items-center">
        {/* Left Image */}
        <a href="#" className="rounded-lg overflow-hidden shadow-lg transform transition-transform hover:scale-105">
          <img src="/images/Fashion1.png" alt="Fashion 1" className="w-full h-full object-cover" loading="lazy" />
        </a>

        {/* Center Flash Sale Content */}
        <div className="text-center space-y-4">
          <a href="#" className="flex justify-center transform transition-transform hover:scale-105">
            <img src="/images/Fashion3.png" alt="Fashion Models" className="rounded-lg shadow-md" loading="lazy" />
          </a>
          <h1 className="text-5xl font-bold">Flash</h1>
          <h1 className="text-gray-300 font-bold text-9xl">SALE</h1>
          <p className="text-gray-500 uppercase tracking-wide">New Arrivals</p>
          <button
            className="bg-black text-white px-6 py-3 rounded-full shadow-md hover:bg-gray-800 transition"
            onClick={() => navigate("/login")}
          >
            GET IT NOW
          </button>
          <a href="#" className="flex justify-center transform transition-transform hover:scale-105">
            <img src="/images/Fashion22.jpg" alt="Smiling Girls" className="rounded-lg shadow-md" loading="lazy" />
          </a>
        </div>

        {/* Right Image */}
        <a href="#" className="rounded-lg overflow-hidden shadow-lg transform transition-transform hover:scale-105">
          <img src="/images/kendall.png" alt="Fashion 2" className="w-full h-full object-cover" loading="lazy" />
        </a>
      </div>

      {/* Bottom Section with 5 Images */}
      <div className="max-w-screen-2xl mx-auto container px-4 py-28">
        <div className="flex items-center justify-around flex-wrap gap-4 py-5">
          <a href="#" className="flex justify-center items-center transform transition-transform hover:scale-105">
            <img src="/images/channel.png" alt="Channel" className="h-6 object-contain" loading="lazy" />
          </a>
          <a href="#" className="flex justify-center items-center transform transition-transform hover:scale-105">
            <img src="/images/louisvitton.png" alt="Louis Vuitton" className="h-6 object-contain" loading="lazy" />
          </a>
          <a href="#" className="flex justify-center items-center transform transition-transform hover:scale-105">
            <img src="/images/prada.png" alt="Prada" className="h-6 object-contain" loading="lazy" />
          </a>
          <a href="#" className="flex justify-center items-center transform transition-transform hover:scale-105">
            <img src="/images/calvin.png" alt="Calvin Klein" className="h-20 object-contain" loading="lazy" />
          </a>
          <a href="#" className="flex justify-center items-center transform transition-transform hover:scale-105">
            <img src="/images/denim.png" alt="Denim" className="h-24 object-contain" loading="lazy" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Banner;