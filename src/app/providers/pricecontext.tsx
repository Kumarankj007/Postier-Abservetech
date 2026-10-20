import React, { createContext, useContext, useState } from "react";

const PriceContext = createContext<any>(null);

export const PriceProvider = ({ children }: { children: React.ReactNode }) => {
  const [price, setprice] = useState(0.06);
  return (
    <PriceContext.Provider value={{ price, setprice }}>
      {children}
    </PriceContext.Provider>
  );
};

export const usePrice = () => useContext(PriceContext);
