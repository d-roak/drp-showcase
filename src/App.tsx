import { DRPNode } from "@ts-drp/node";
import Header from "./components/Header";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Grid from "./components/Grid";
import Home from "./components/Home";

function App(props: { node: DRPNode }) {
	const router = createBrowserRouter([
		{
			path: "/",
			element: <Home />,
		},
		{
			path: "/grid-drp",
			element: <Grid node={props.node} />,
		},
	]);

	return (
		<>
			<Header node={props.node} />
			<RouterProvider router={router} />
		</>
	);
}

export default App;
