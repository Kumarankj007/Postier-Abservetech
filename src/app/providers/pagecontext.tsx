"use client";
import { createContext, useContext } from 'react';
const defaultValue: any = { i18: {}};
const PageContext = createContext(defaultValue);

export const usePageContext = () => {
    return useContext(PageContext)
}

export default PageContext;
