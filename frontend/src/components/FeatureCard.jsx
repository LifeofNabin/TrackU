// /src/components/FeatureCard.jsx
import React from 'react';
import { CheckCircle } from 'lucide-react';

const FeatureCard = ({ icon, title, description, features, gradientFrom, gradientTo }) => {
  return (
    <div className="group bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
      <div className="space-y-6">
        <div className={`w-16 h-16 bg-gradient-to-r ${gradientFrom} ${gradientTo} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">{title}</h3>
          <p className="text-gray-600 leading-relaxed">
            {description}
          </p>
        </div>
        <div className="space-y-2">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeatureCard;