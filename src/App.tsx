import { DRPNode } from "@ts-drp/node";
import Header from "./components/Header";
import {
	BrowserRouter,
	createBrowserRouter,
	Route,
	RouterProvider,
	Routes,
} from "react-router-dom";
import Grid from "./components/Grid";
import Home from "./components/Home";

function App(props: { node: DRPNode }) {
	return (
		<>
			<BrowserRouter>
				<Header node={props.node} />
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/grid-drp" element={<Grid node={props.node} />} />
				</Routes>
			</BrowserRouter>
		</>
	);
}

export default App;
