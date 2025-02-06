// ModelEndpointContext.js
import React, { createContext, useState } from "react";

export const ModelEndpointContext = createContext();

export const ModelEndpointProvider = ({ children }) => {
  const [endpoints, setEndpoints] = useState([
    {
      id: 1,
      name: "Llama 3.2 (Default)",
      url: "https://cot6930-ollama-serve.kub.hpc.fau.edu/api/generate",
    },
  ]);
  const [selectedEndpointId, setSelectedEndpointId] = useState(1);

  const selectedEndpoint = endpoints.find((ep) => ep.id === selectedEndpointId);

  const addEndpoint = (name, url) => {
    const newEndpoint = {
      id: Date.now(), // simple unique id
      name,
      url,
    };
    setEndpoints([...endpoints, newEndpoint]);
  };

  const removeEndpoint = (id) => {
    setEndpoints(endpoints.filter((ep) => ep.id !== id));
    if (selectedEndpointId === id && endpoints.length > 1) {
      setSelectedEndpointId(endpoints[0].id);
    }
  };

  const renameEndpoint = (id, newName) => {
    setEndpoints(
      endpoints.map((ep) => (ep.id === id ? { ...ep, name: newName } : ep))
    );
  };

  const selectEndpoint = (id) => {
    setSelectedEndpointId(id);
  };

  return (
    <ModelEndpointContext.Provider
      value={{
        endpoints,
        selectedEndpoint,
        addEndpoint,
        removeEndpoint,
        renameEndpoint,
        selectEndpoint,
      }}
    >
      {children}
    </ModelEndpointContext.Provider>
  );
};
