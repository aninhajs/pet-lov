import React, { useState, useEffect } from "react";
// CSS para animação das patinhas
const pawAnimationStyle = `
@keyframes pawUp {
  0% { transform: translateY(40px) scale(0.7); opacity: 0; }
  40% { opacity: 1; }
  100% { transform: translateY(-10px) scale(1); opacity: 1; }
}
.paw-anim {
  display: inline-block;
  font-size: 5rem;
  margin: 0 1.1rem;
  animation: pawUp 2.4s cubic-bezier(.4,0,.2,1) infinite alternate;
  color: #b8860b;
  filter: drop-shadow(0 2px 7px #b8860b88);
}
.paw-anim-right {
  animation-delay: 0.8s;
}
`;
import { Link } from "react-router-dom";
import Footer from "../../components/Footer";
import { PetServices } from "../../services/PetServices";

const GOOGLE_FORM_URL = "https://forms.gle/Vs2Arsu5bwi5h3wA9";

const optimizeImageUrl = (url, width = 400, height = 300) => {
  if (!url) return null;
  if (url.includes("placeholder.com")) {
    return url.replace(/\d+x\d+/, `${width}x${height}`);
  }
  return url;
};

const Home = () => {
  // ...existing code...
};

export default Home;
