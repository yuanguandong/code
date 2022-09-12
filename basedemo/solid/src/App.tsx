import { Component, createEffect, createSignal } from 'solid-js';

import logo from './logo.svg';
import styles from './App.module.css';
import confetti from 'https://cdn.skypack.dev/canvas-confetti';


const App: Component = () => {
  const [first, setFirst] = createSignal("JSON");
  const [last, setLast] = createSignal("Bourne");

  createEffect(() => console.log(`${first()} ${last()}`));


  return (
    <div class={styles.App}>
      <header class={styles.header}>
        <img src={logo} class={styles.logo} alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          class={styles.link}
          onClick={() => { confetti(); setLast('1111') }}
          rel="noopener noreferrer"
        >
          Learn Solid
        </a>
      </header>
    </div>
  );
};

export default App;
