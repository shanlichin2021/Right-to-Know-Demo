import React, { useContext } from "react";
import { Link } from "react-router-dom";
import {
  RiArticleLine,
  RiAiGenerate,
  RiInformation2Fill,
  RiHome9Line,
} from "react-icons/ri";
import EndpointDropdown from "./EndpointDropdown";

const TopBar = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-12 flex items-center border-b border-[#17264b] bg-[#030712] text-gray-400 px-6 shadow-lg z-50">
      <div className="flex space-x-6">
        <Link to="/" className="hover:text-white transition" title="Home">
          <RiHome9Line size={24} />
        </Link>
        <Link to="/form" className="hover:text-white transition" title="Form">
          <RiArticleLine size={24} />
        </Link>
        <Link to="/about" className="hover:text-white transition" title="About">
          <RiInformation2Fill size={24} />
        </Link>
      </div>

      {/* Replace the old select with the new EndpointDropdown */}
      <div className="ml-auto">
        <EndpointDropdown />
      </div>
    </div>
  );
};

export default TopBar;
