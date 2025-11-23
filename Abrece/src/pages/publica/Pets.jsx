import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PetServices } from "../../services/PetServices";

const optimizeImageUrl = (url, width = 400, height = 300) => {
  if (!url) return null;
  if (url.includes("placeholder.com")) {
    return url.replace(/\d+x\d+/, `${width}x${height}`);
  }
  return url;
};

const Pets = () => {
  // ...existing code...
};

export default Pets;
