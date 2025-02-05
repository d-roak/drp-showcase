import type { DRPNode } from "@ts-drp/node";
import { Route, Routes, useLocation } from "react-router-dom";
import Grid from "./components/Grid";
import Header from "./components/Header";
import Home from "./components/Home";

function App(props: { node: DRPNode }) {
	const location = useLocation();

	return (
		<>
			{location.pathname !== "/grid-drp" && <Header node={props.node} />}
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/grid-drp" element={<Grid node={props.node} />} />
			</Routes>
		</>
	);
}

export default App;
