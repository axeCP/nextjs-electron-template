import styles from "./Example.module.scss";

// Example component. Copy this folder to make a new one:
//   components/Name/Name.js, Name.module.scss and index.js
export default function Example({ title, text, extraClass }) {
  return (
    <section
      className={[styles.component, extraClass].filter(Boolean).join(" ")}
    >
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.text}>{text}</p>
    </section>
  );
}
