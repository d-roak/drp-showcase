import { useState, useEffect } from "react";
import { formatPeerId } from "../utils/formatting";
import type { DRPNode } from "@ts-drp/node";
import { Ban, Copy, IdCard } from "lucide-react";

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
		<header className="flex flex-col mx-auto w-fit max-w-[60%] mt-4 mb-10 h-[25vh] max-h-[25vh] overflow-hidden">
			<div className="flex items-center gap-4">
				<h1 className="text-4xl uppercase">DRP Showcase</h1>
				<div className="text-xl flex gap-2 items-center">
					<IdCard /> {formatPeerId(props.node.networkNode.peerId)}
				</div>
				<button
					className="p-0 bg-transparent"
					type="button"
					onClick={() => {
						navigator.clipboard.writeText(props.node.networkNode.peerId);
					}}
				>
					<Copy />
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
					<Copy />
				</button>
			</div>
			<div className="flex grow justify-between min-w-[50vw] overflow-auto">
				<div>
					<h3 className="text-xl">Your bootstraps</h3>
					{bootstraps.map((node) => (
						<div key={node} className="flex items-center justify-between">
							<p>
								{formatPeerId(
									node.split("/").pop() ? node.split("/").pop()! : "",
								)}
							</p>
							<button
								className="p-0 bg-transparent text-white"
								onClick={() => {
									removeBootstrap(node);
								}}
								type="button"
							>
								<Ban className="text-gray-500" size={18} />
							</button>
						</div>
					))}
				</div>
				<div
					className="h-full max-h-full overflow-auto"
					style={{
						scrollbarWidth: "none",
					}}
				>
					<h3 className="text-xl sticky top-0 bg-[#242425]">
						Your connections
					</h3>
					{peers.map((peer) =>
						bootstraps.some((multiaddr) => {
							return multiaddr.includes(peer);
						}) ? null : (
							<div key={peer} className="flex items-center justify-between">
								<p>{formatPeerId(peer)}</p>
								<button
									className="p-0 bg-transparent text-white"
									onClick={() => {
										props.node.networkNode.disconnect(peer);
									}}
									type="button"
								>
									<Ban className="text-gray-500" size={18} />
								</button>
							</div>
						),
					)}
				</div>
				<div className="flex flex-col gap-2">
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
