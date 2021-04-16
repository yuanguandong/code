import React, { useState, useTransition, Suspense } from "react";

const SUSPENSE_CONFIG = { timeoutMs: 2000 };

export default function App() {
  return <></>
  const [resource, setResource] = useState(1);
  const [startTransition, isPending] = useTransition(SUSPENSE_CONFIG);
  return (
    <>
      <button
        disabled={isPending}
        onClick={() => {
          startTransition(() => {
            setResource(2);
          });
        }}
      >
        Next
      </button>
      {isPending ? " 加载中..." : null}
      <Suspense fallback={"loading……"}>{resource}</Suspense>
    </>
  );
}
