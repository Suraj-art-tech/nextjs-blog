"use client"

import { useEffect } from "react";

function OAuthSuccess() {
    useEffect(() => {
        if (window.opener) {
            window.opener.postMessage("authenticated", window.location.origin);
            window.close();
        }
    }, [])

    return <main>Authentication successful. Closing...</main>
};

export default OAuthSuccess;

