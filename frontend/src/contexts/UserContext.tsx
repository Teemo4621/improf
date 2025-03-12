import { createContext, ReactNode, useContext, useState } from "react";

interface User {
    id?: string;
    username?: string;
    email?: string;
    discord_id?: string;
    profile_created?: boolean
}

interface UserContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
    addUser: (user: User) => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const addUser = (newUser: User) => {
        setUser(newUser);
    };

    return (
        <UserContext.Provider value={{ user, setUser, loading, setLoading, error, setError, addUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUserContext must be used within a UserProvider");
    }
    return context;
};