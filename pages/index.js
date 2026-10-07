import Head from "next/head";

import { Example } from "../components";
import content from "../data/content.js";

export default function Home() {
  const { title, text } = content.home;

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <main>
        <h1>{title}</h1>
        <p>{text}</p>
        {content.examples.map((example) => (
          <Example key={example.title} {...example} />
        ))}
      </main>
    </>
  );
}
