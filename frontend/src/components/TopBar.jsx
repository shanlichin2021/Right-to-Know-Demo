import React, { useContext } from "react";
import { Link } from "react-router-dom";
import {
  RiArticleLine,
  RiAiGenerate,
  RiInformation2Fill,
  RiHome9Line,
} from "react-icons/ri";
import { ModelEndpointContext } from "./ModelEndpointContext";

const TopBar = () => {
  const { endpoints, selectedEndpoint, selectEndpoint } =
    useContext(ModelEndpointContext);

  return (
    <div className="fixed top-0 left-0 w-full h-13 flex items-center border-b border-[#2a2a2a] bg-darker text-gray-400 px-6 shadow-lg z-50 bg-[#181818]">
      <div className="flex space-x-6">
        <Link to="/" className="hover:text-white transition" title="Home">
          <RiHome9Line size={24} />
        </Link>
        <Link to="/form" className="hover:text-white transition" title="Form">
          <RiArticleLine size={24} />
        </Link>
        <Link to="/chat" className="hover:text-white transition" title="Chat">
          <RiAiGenerate size={24} />
        </Link>
        <Link to="/about" className="hover:text-white transition" title="About">
          <RiInformation2Fill size={24} />
        </Link>
      </div>

      {/* Endpoint Selector */}
      <div className="ml-auto">
        <select
          value={selectedEndpoint ? selectedEndpoint.id : ""}
          onChange={(e) => selectEndpoint(Number(e.target.value))}
          className="ml-2 bg-[#0f0f0f] text-white p-2 rounded"
        >
          {endpoints.map((ep) => (
            <option key={ep.id} value={ep.id}>
              {ep.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default TopBar;
