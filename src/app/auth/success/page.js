"use client"

import { useEffect } from "react";

function OAuthSuccess() {
    useEffect(() => {
        if (window.opener) {
            window.opener.postMessage("authenticated", window.location.origin);
        }
    }, [])

    return <div>Authentication successful. Closing...</div>
};

export default OAuthSuccess;

