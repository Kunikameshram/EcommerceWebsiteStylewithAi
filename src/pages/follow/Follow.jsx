import React from "react";

const images = [
  { src: "/images/green1.png", link: "https://www.instagram.com/example1", color: "outline-green-500" },
  { src: "/images/orange1.png", link: "https://www.instagram.com/example2", color: "outline-orange-500" },
  { src: "/images/pink1.png", link: "https://www.instagram.com/example3", color: "outline-pink-500" },
  { src: "/images/white1.png", link: "https://www.instagram.com/example4", color: "outline-gray-500" },
  { src: "/images/yellow1.png", link: "https://www.instagram.com/example5", color: "outline-yellow-500" },
  
];

const Follow = () => {
  return (
    <div className="flex flex-col items-center bg-gray-100 p-24">
      <h2 className="text-5xl font-semibold text-gray-800 mb-4">
        Follow Us On Instagram
      </h2>

      <div className="flex gap-2 mt-16">
        {images.map((item, index) => (
          <a
            key={index}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`relative w-full h-64 overflow-hidden rounded-md transition-transform duration-300 hover:outline-4 hover:shadow-lg ${
              item.color
            } ${index % 2 === 0 ? "scale-95" : "scale-125"}`}
          >
            <img
              src={item.src}
              alt={`Instagram image ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </a>
        ))}
      </div>
    </div>
  );
};

export default Follow;
