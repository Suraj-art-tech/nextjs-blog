"use client";

import Image from "next/image";
import styles from "./page.module.css";
import { useEffect, useState } from "react";

export default function Home() {
  const [data, setData] = useState([]);

  const onClick = () => {
    const { authenticationToken } = data;
    console.log('Auth Token', authenticationToken);
    console.log('authenticationToken',authenticationToken)
    const openUrl = `http://vtexid.vtex.com.br/api/vtexid/pub/authentication/oauth/redirect?authenticationToken=${authenticationToken}&providerName=Google`;
    window.open(openUrl);
  };



  useEffect(() => {
    // fetch("/api/init-vtex-session")
    //   .then((j) => j.json())
    //   .then((res) => {
    //     console.log(res);
    //     setData(res);
    //   });

    fetch(
      `https://vtexid.vtex.com.br/api/vtexid/pub/authentication/start?appStart=true&scope=nagarropartnerind&accountName=nagarropartnerind&callbackUrl=${window.location.origin}&returnUrl=%2F`,
      {
        method: 'GET',
        headers: {
          'Host': `${window.location.host}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Ensures cookies are included
      }
    ).then((res)=>res.json()).then((r) => {
      console.log(r)
    })
  }, []);

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
