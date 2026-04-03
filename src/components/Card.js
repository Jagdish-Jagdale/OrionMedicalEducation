import React from 'react';

const Card = ({ title, description, icon, color = "bg-primary" }) => {
  return (
    <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
      <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center text-white mb-4 group-hover:rotate-6 transition-transform`}>
        {icon}
      </div>
      <h3 className="font-bold text-secondary text-lg">{title}</h3>
      <p className="text-slate-500 text-sm mt-1 leading-relaxed">{description}</p>
    </div>
  );
};

export default Card;
