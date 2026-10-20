import React, { createContext, useContext, useState } from "react";

const EstimationContext = createContext<any>(null);

export const EstimationProvider = ({ children }: { children: React.ReactNode }) => {
    // debugger
  const [estimation, setEstimation] = useState(null);
  // console.log("EstimationContext1", estimation);
  return (
    <EstimationContext.Provider value={{ estimation, setEstimation }}>
      {children}
    </EstimationContext.Provider>
  );
};

export const useEstimation = () => useContext(EstimationContext);
