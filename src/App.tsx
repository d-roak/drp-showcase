import { DRPNode } from "@ts-drp/node";
import { formatPeerId } from "./utils/formatting";

function App(props: { node: DRPNode }) {
	return (
		<div className="w-screen text-center">
			<h1>DRP Showcase</h1>
			<div>
				<p>Your peer id is: {formatPeerId(props.node.networkNode.peerId)}</p>
				<p>
					Your connections:{" "}
					{props.node.networkNode.getAllPeers().map((peer, index) => (
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
