import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { DRPNode } from "@ts-drp/node";
import App from "./App.tsx";

// DRPNode initialization
const node = new DRPNode();
await node.start();

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<App node={node} />
	</StrictMode>,
);
