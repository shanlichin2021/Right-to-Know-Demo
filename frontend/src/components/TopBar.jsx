import React from "react";
import { Link } from "react-router-dom";
import { RiPagesFill, RiAiGenerate, RiInformation2Fill } from "react-icons/ri";

const TopBar = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-16 flex items-center bg-darker text-gray-400 px-6 shadow-lg z-50">
      <div className="flex space-x-6">
        <Link to="/" className="hover:text-white transition" title="Chat">
          <RiAiGenerate size={24} />
        </Link>
        <Link to="/form" className="hover:text-white transition" title="Form">
          <RiPagesFill size={24} />
        </Link>
        <Link to="/about" className="hover:text-white transition" title="About">
          <RiInformation2Fill size={24} />
        </Link>
      </div>
    </div>
  );
};

export default TopBar;
