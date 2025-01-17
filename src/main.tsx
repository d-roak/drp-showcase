//import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { DRPNode } from "@ts-drp/node";
import App from "./App.tsx";

// DRPNode initialization
const node = new DRPNode();
await node.start();

const root = document.getElementById("root") as HTMLElement;
createRoot(root).render(<App node={node} />);
