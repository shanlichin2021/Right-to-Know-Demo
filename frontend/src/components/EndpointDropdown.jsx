import React, { useState, useContext, useEffect, useRef } from "react";
import { ModelEndpointContext } from "./ModelEndpointContext";
import { FiChevronDown, FiSearch } from "react-icons/fi";

const EndpointDropdown = () => {
  const { endpoints, selectedEndpoint, selectEndpoint } =
    useContext(ModelEndpointContext);
  const [isOpen, setIsOpen] = useState(false);
  const [filterText, setFilterText] = useState("");
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredEndpoints = endpoints.filter(
    (ep) =>
      ep.name.toLowerCase().includes(filterText.toLowerCase()) ||
      ep.model.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center bg-[#0f0f0f] text-white px-3 py-2 rounded focus:outline-none"
      >
        <span>
          {selectedEndpoint ? selectedEndpoint.name : "Select Endpoint"}
        </span>
        <FiChevronDown className="ml-2" />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-[#181818] border border-[#2a2a2a] rounded shadow-lg z-50">
          <div className="p-2 border-b border-[#2a2a2a]">
            <div className="flex items-center bg-[#0f0f0f] rounded">
              <FiSearch className="ml-2 text-gray-400" />
              <input
                type="text"
                placeholder="Filter models..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                className="w-full p-2 bg-transparent text-white focus:outline-none"
              />
            </div>
          </div>
          <ul className="max-h-60 overflow-y-auto">
            {filteredEndpoints.map((ep) => (
              <li
                key={ep.id}
                onClick={() => {
                  selectEndpoint(ep.id);
                  setIsOpen(false);
                  setFilterText("");
                }}
                className="p-2 cursor-pointer hover:bg-[#5c5e49]"
              >
                {ep.name}
              </li>
            ))}
            {filteredEndpoints.length === 0 && (
              <li className="p-2 text-gray-400">No models found.</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default EndpointDropdown;
