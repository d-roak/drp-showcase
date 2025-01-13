import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { DRPNode } from "@ts-drp/node";
import App from "./App.tsx";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import Header from "./Header.tsx";
import GridDRPPage from "./GridDRP.tsx";

// DRPNode initialization
const node = new DRPNode();
await node.start();

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <main className="h-screen max-h-screen flex flex-col">
                <Header node={node} />
                <Outlet />
            </main>
        ),
        children: [
            {
                path: "",
                element: <App />,
            },
            {
                path: "/grid-drp",
                element: <GridDRPPage node={node} />,
            },
        ],
    },
]);

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>
);
