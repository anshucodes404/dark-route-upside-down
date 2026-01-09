"use client"
import { createContext, ReactNode, useContext } from "react";

export interface ApiContextType {
    api: string
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export const useApi = (): ApiContextType => {
    const context = useContext(ApiContext);
    if (!context) {
        throw new Error("useApi must be used within an ApiProvider");
    }
    return context;
}

export const ApiProvider = ({children}: {children: ReactNode}) => {
    const apiContextValue: ApiContextType = {
        api: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
    };

    return (
        <ApiContext.Provider value={apiContextValue}>
            {children}
        </ApiContext.Provider>
    );
}