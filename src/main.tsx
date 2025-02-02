//import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { DRPNode } from "@ts-drp/node";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";

// DRPNode initialization
const node = new DRPNode();
await node.start();

const root = document.getElementById("root") as HTMLElement;
createRoot(root).render(
	<BrowserRouter>
		<App node={node} />
	</BrowserRouter>,
);
