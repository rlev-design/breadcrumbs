import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";

function App() {
  return (
    <main className="min-h-screen bg-[#f5f1e8] p-10">
      <h1 className="text-4xl font-semibold tracking-tight">
        Breadcrumbs
      </h1>

      <p className="mt-2 text-neutral-500">
        Pick up where you left off.
      </p>
    </main>
  );
}

export default App;