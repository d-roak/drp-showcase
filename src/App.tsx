import { DRPNode } from "@ts-drp/node";
import { formatPeerId } from "./utils/formatting";
import { useEffect, useState } from "react";

function App(props: { node: DRPNode }) {
	const [peers, setPeers] = useState<string[]>([]);
	useEffect(() => {
		const interval = setInterval(() => {
			setPeers(props.node.networkNode.getAllPeers());
		}, 1000);
		return () => clearInterval(interval);
	}, [props.node.networkNode]);

	return (
		<div className="w-screen text-center">
			<h1>DRP Showcase</h1>
			<div>
				<p>Your peer id is: {formatPeerId(props.node.networkNode.peerId)}</p>
				<p>
					Your connections:{" "}
					{peers.map((peer, index) => (
						<span key={index}>
							{formatPeerId(peer)}
							{index < props.node.networkNode.getAllPeers().length - 1 && ", "}
						</span>
					))}
				</p>
			</div>
		</div>
	);
}

export default App;
