import type { DRPNode } from "@ts-drp/node";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Grid from "./components/Grid";
import Header from "./components/Header";
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
