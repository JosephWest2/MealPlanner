import { createContext, useEffect, useState } from "react";

export const SessionContext = createContext({
    jwt: null as string | null,
    SetJwt: null as ((jwt: string) => void) | null,
})

export default function SessionProvider({ children }: any) {

    const [jwt, setJwt] = useState<any>(null);

    function SetJwt(jwt: string) {
        setJwt(jwt)
    }
    useEffect(() => {
        document.cookie = `session=${jwt}; expires=${new Date(Date.now() + 60 * 1000 * 10).toUTCString()}; path=/; SameSite=strict;`
    }, [jwt])

    return <SessionContext.Provider value={{ jwt: jwt, SetJwt: SetJwt }}>
        {children}
    </SessionContext.Provider >
}
