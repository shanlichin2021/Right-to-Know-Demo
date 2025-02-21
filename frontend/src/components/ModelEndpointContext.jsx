import React, { createContext, useState } from "react";

export const ModelEndpointContext = createContext();

export const ModelEndpointProvider = ({ children }) => {
  const [endpoints] = useState([
    {
      id: 1,
      name: "llava:latest",
      url: "https://cot6930-ollama-serve.kub.hpc.fau.edu/api/generate",
      model: "llava:latest",
    },

    {
      id: 2,
      name: "phi4:latest",
      url: "https://cot6930-ollama-serve.kub.hpc.fau.edu/api/generate",
      model: "phi4:latest",
    },

    {
      id: 3,
      name: "codestral:latest",
      url: "https://cot6930-ollama-serve.kub.hpc.fau.edu/api/generate",
      model: "codestral:latest",
    },
  ]);
  const [selectedEndpointId, setSelectedEndpointId] = useState(1);

  const selectedEndpoint = endpoints.find((ep) => ep.id === selectedEndpointId);

  const selectEndpoint = (id) => {
    setSelectedEndpointId(id);
  };

  return (
    <ModelEndpointContext.Provider
      value={{
        endpoints,
        selectedEndpoint,
        selectEndpoint,
      }}
    >
      {children}
    </ModelEndpointContext.Provider>
  );
};
