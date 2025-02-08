import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import {
  RiArticleLine,
  RiAiGenerate,
  RiInformation2Fill,
  RiEdit2Line,
  RiDeleteBinLine,
  RiAddCircleLine,
  RiHome9Line, // Import home icon
  RiAddLine, // Import add icon
} from "react-icons/ri";
import { ModelEndpointContext } from "./ModelEndpointContext";

const TopBar = () => {
  const {
    endpoints,
    selectedEndpoint,
    selectEndpoint,
    addEndpoint,
    removeEndpoint,
    renameEndpoint,
  } = useContext(ModelEndpointContext);
  const [isManaging, setIsManaging] = useState(false);
  const [newName, setNewName] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newModel, setNewModel] = useState("");
  const [renameId, setRenameId] = useState(null);
  const [renameValue, setRenameValue] = useState("");

  const handleAddEndpoint = (e) => {
    e.preventDefault();
    if (newName && newUrl && newModel) {
      addEndpoint(newName, newUrl, newModel);
      setNewName("");
      setNewUrl("");
      setNewModel("");
    }
  };

  const handleRenameKeyDown = (e, id) => {
    if (e.key === "Enter") {
      renameEndpoint(id, renameValue);
      setRenameId(null);
    }
  };

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

      {/* Endpoint Selector and Management UI */}
      <div className="ml-auto relative overflow-visible">
        <div className="flex items-center">
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
          <button
            onClick={() => setIsManaging(!isManaging)}
            className="ml-2 bg-[#0f0f0f] p-2 rounded text-white"
            title="Manage Endpoints"
          >
            <RiAddLine size={20} />
          </button>
        </div>

        {isManaging && (
          <div className="absolute right-0 mt-2 w-80 bg-[#181818] text-white p-4 rounded shadow-lg z-50">
            <h3 className="font-bold mb-2">Manage Endpoints</h3>
            <ul className="mb-4">
              {endpoints.map((ep) => (
                <li
                  key={ep.id}
                  className="flex items-center justify-between mb-2"
                >
                  {renameId === ep.id ? (
                    <>
                      <input
                        type="text"
                        value={renameValue}
                        onChange={(e) => setRenameValue(e.target.value)}
                        onKeyDown={(e) => handleRenameKeyDown(e, ep.id)}
                        className="border p-1 mr-2 flex-1"
                      />
                      <button
                        onClick={() => {
                          renameEndpoint(ep.id, renameValue);
                          setRenameId(null);
                        }}
                        className="text-green-600 mr-2"
                        title="Save Rename"
                      >
                        <RiEdit2Line size={20} />
                      </button>
                      <button
                        onClick={() => setRenameId(null)}
                        className="text-red-600"
                        title="Cancel Rename"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <span>{ep.name}</span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setRenameId(ep.id);
                            setRenameValue(ep.name);
                          }}
                          className="text-blue-600"
                          title="Rename"
                        >
                          <RiEdit2Line size={20} />
                        </button>
                        {ep.id !== 1 && (
                          <button
                            onClick={() => removeEndpoint(ep.id)}
                            className="text-red-600"
                            title="Remove"
                          >
                            <RiDeleteBinLine size={20} />
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
            <form onSubmit={handleAddEndpoint} className="flex flex-col">
              <input
                type="text"
                placeholder="Endpoint Name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="border opacity-50 rounded p-1 mb-2"
                required
              />
              <input
                type="text"
                placeholder="Endpoint URL"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                className="border opacity-50 rounded p-1 mb-2"
                required
              />
              <input
                type="text"
                placeholder="Model Name (e.g. dolphin-mistral:latest)"
                value={newModel}
                onChange={(e) => setNewModel(e.target.value)}
                className="border opacity-50 rounded p-1 mb-2"
                required
              />
              <button
                type="submit"
                className="bg-[#5c5e49] text-white py-1 rounded flex items-center justify-center"
                title="Add Endpoint"
              >
                <RiAddCircleLine size={24} className="mr-1" /> Add
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopBar;
