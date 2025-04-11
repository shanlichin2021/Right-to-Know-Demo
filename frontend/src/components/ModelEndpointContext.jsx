import React, { createContext, useState } from "react";

export const ModelEndpointContext = createContext();

export const ModelEndpointProvider = ({ children }) => {
  const [endpoints] = useState([
    {
      id: 1,
      name: "microsoft/phi-4",
      url: "https://cot6930-ollama-serve.kub.hpc.fau.edu/api/generate",
      model: "microsoft/phi-4",
    },

    {
      id: 2,
      name: "Llama-3.2-11B-Vision-Instruct",
      url: "https://cot6930-ollama-serve.kub.hpc.fau.edu/api/generate",
      model: "Llama-3.2-11B-Vision-Instruct",
    },

    {
      id: 3,
      name: "gemini-2.0-flash",
      url: "https://cot6930-ollama-serve.kub.hpc.fau.edu/api/generate",
      model: "gemini-2.0-flash",
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
