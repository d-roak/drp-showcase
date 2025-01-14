import { useState, useEffect } from "react";
import { formatPeerId } from "../utils/formatting";
import type { DRPNode } from "@ts-drp/node";

export default function Header(props: { node: DRPNode }) {
	const [peers, setPeers] = useState<string[]>([]);
	const [peerId, setPeerId] = useState<string>("");
	const [bootstraps, setBootstraps] = useState<string[]>(
		props.node.networkNode.getBootstrapNodes(),
	);
	useEffect(() => {
		const interval = setInterval(() => {
			setPeers(props.node.networkNode.getAllPeers());
		}, 1000);
		return () => clearInterval(interval);
	}, [props.node.networkNode]);

	const removeBootstrap = async (node: string) => {
		try {
			const newBootstraps = bootstraps.filter((n) => n !== node);
			setBootstraps(newBootstraps);
			await props.node.restart({
				bootstrap_peers: newBootstraps,
			});
			console.log("newBootstraps", newBootstraps);
		} catch (e) {
			console.error(e);
		}
	};

	const handleConnect = async () => {
		if (!peerId) {
			return;
		}
		await props.node.networkNode.connect(peerId);
		setPeerId("");
	};

	return (
		<header className="mx-auto w-fit max-w-[60%] mt-10">
			<h1>DRP Showcase</h1>
			<div className="mb-10">
				<div className="flex gap-2 items-center">
					<p>Your peer id is: {formatPeerId(props.node.networkNode.peerId)}</p>
					<button
						className="py-1"
						type="button"
						onClick={() => {
							navigator.clipboard.writeText(props.node.networkNode.peerId);
						}}
					>
						Copy
					</button>
				</div>
				<div className="flex gap-2 items-center">
					<p className="overflow-hidden whitespace-nowrap">
						Your Multiaddr:{" "}
						{props.node.networkNode.getMultiaddrs()
							? props.node.networkNode.getMultiaddrs()![0]
							: ""}
					</p>
					<button
						className="py-1"
						type="button"
						onClick={() => {
							navigator.clipboard.writeText(
								props.node.networkNode.getMultiaddrs()![0],
							);
						}}
					>
						Copy
					</button>
				</div>
				<p>
					Your bootstraps:{" "}
					{bootstraps.map((node, index) => (
						<span key={node}>
							{formatPeerId(
								node.split("/").pop() ? node.split("/").pop()! : "",
							)}
							<button
								className="px-2 py-1 bg-red-700 ml-2 text-white"
								onClick={() => {
									removeBootstrap(node);
								}}
								type="button"
							>
								Del
							</button>
							{index < bootstraps.length - 1 && ", "}
						</span>
					))}
				</p>
				<p>
					Your connections:{" "}
					{peers.map((peer, index) => (
						<span key={index}>
							{formatPeerId(peer)}
							{index < props.node.networkNode.getAllPeers().length - 1 && ", "}
						</span>
					))}
				</p>
				<div className="flex gap-2 items-center">
					<p>Connect to new peer:</p>
					<input
						className="border-2 dark:border-gray-500 border-gray-700 rounded-md p-1"
						placeholder="Peer ID"
						value={peerId}
						onChange={(e) => {
							setPeerId(e.target.value);
						}}
					/>
					<button className="py-1" type="button" onClick={handleConnect}>
						Connect
					</button>
				</div>
			</div>
		</header>
	);
}
