"use client";

import Image from "next/image";
import styles from "./page.module.css";
import { useCallback, useEffect, useRef, useState } from "react";

export default function Home() {
  const oAuthRef = useRef(null);
  const [data, setData] = useState([]);


  const onClick = () => {
    const { authenticationToken } = data;
    const authUrl = `http://vtexid.vtex.com.br/api/vtexid/pub/authentication/oauth/redirect?authenticationToken=${authenticationToken}&providerName=Google`;
    oAuthRef.current = window.open(authUrl, "popupWindow", "width=600,height=400,scrollbars=yes,resizable=yes");
  };

  const initiateSession = useCallback(() => {
    fetch("/api/init-vtex-session")
      .then((j) => j.json())
      .then((res) => setData(res));
  }, []);

  useEffect(() => {
    initiateSession();
    const messageListener = (event) => {
      if (event.origin !== window.location.origin) return;

      if (event.data === "authenticated") {
        oAuthRef.current.close();
        window.location.href = "/";
      }
    };

    window.addEventListener("message", messageListener);

    // Cleanup event listener when the component unmounts
    return () => {
      window.removeEventListener("message", messageListener);
    };
  }, [initiateSession, oAuthRef.current]);

  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <p>
          Get started by editing&nbsp;
          <code className={styles.code}>src/app/page.js</code>
        </p>
        <div>
          <a
            href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            By{" "}
            <Image
              src="/vercel.svg"
              alt="Vercel Logo"
              className={styles.vercelLogo}
              width={100}
              height={24}
              priority
            />
          </a>
        </div>
      </div>

      <div>
        <button
          onClick={onClick}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          Sign in with Google
        </button>
      </div>

      <div className={styles.grid}>
        <a
          href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Docs <span>-&gt;</span>
          </h2>
          <p>Find in-depth information about Next.js features and API.</p>
        </a>

        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Learn <span>-&gt;</span>
          </h2>
          <p>Learn about Next.js in an interactive course with&nbsp;quizzes!</p>
        </a>

        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Templates <span>-&gt;</span>
          </h2>
          <p>Explore the Next.js 13 playground.</p>
        </a>

        <a
          href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Deploy <span>-&gt;</span>
          </h2>
          <p>
            Instantly deploy your Next.js site to a shareable URL with Vercel.
          </p>
        </a>
      </div>
    </main>
  );
}
