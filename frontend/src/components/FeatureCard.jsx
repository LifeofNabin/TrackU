// src/components/FeatureCard.jsx
import React from "react";

const FeatureCard = ({ title, description, icon }) => (
  <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition text-center">
    <div className="text-4xl mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default FeatureCard;
