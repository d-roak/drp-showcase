import type { DRPNode } from "@ts-drp/node";
import type { DRPObject } from "@ts-drp/object";
import { useCallback, useEffect, useRef, useState } from "react";
import { GridDRP } from "../../drps/grid";
import heading from "../../assets/grid/heading.svg";
import table from "../../assets/grid/table.svg";
import button from "../../assets/grid/button.svg";
import left from "../../assets/grid/left.svg";
import middle from "../../assets/grid/middle.svg";
import right from "../../assets/grid/right.svg";
import mandu from "../../assets/grid/mandu.svg";
import input from "../../assets/grid/input.svg";
import copy from "../../assets/grid/copy.svg";
import trash from "../../assets/grid/trash.svg";
import heart from "../../assets/grid/heart.svg";
import { GridGame } from "../../grid";
import { Player } from "../../grid/Player";
import { getColorForPeerId } from "../../utils/color";
import { CELL_SIZE } from "../../grid/Map";
import { formatPeerId } from "../../utils/formatting";

const directionMap: Record<string, string> = {
	ArrowUp: "U",
	ArrowDown: "D",
	ArrowLeft: "L",
	ArrowRight: "R",
	w: "U",
	s: "D",
	a: "L",
	d: "R",
};

let gridGame: GridGame | null = null;

export default function Grid({ node }: { node: DRPNode }) {
	const peerId = node.networkNode.peerId;
	const [gridId, setGridId] = useState<string>("");
	const [grid, setGrid] = useState<GridDRP | null>(null);
	const [gridIdInput, setGridIdInput] = useState<string>("");
	const [peerMaInput, setPeerMaInput] = useState<string>("");
	const [bootstraps, setBootstraps] = useState<string[]>(
		node.networkNode.getBootstrapNodes(),
	);
	const [peers, setPeers] = useState<string[]>([]);
	const [ma, setMa] = useState<string>("");
	const gridCanvas = useRef<HTMLCanvasElement>(null);
	const [_, setPositions] = useState<Map<string, { x: number; y: number }>>(
		new Map(),
	);

	const query_reactCallback = useCallback(
		(peerId: string, position: { x: number; y: number }) => {
			setPositions((prev) => {
				const updatedPositions = new Map(prev);
				updatedPositions.set(peerId, position);
				return updatedPositions;
			});
		},
		[],
	);

	const createGrid = useCallback(
		async (gridId?: string): Promise<DRPObject> => {
			const drpObject = await node.createObject(
				new GridDRP(query_reactCallback),
				gridId,
				undefined,
				true,
			);
			return drpObject;
		},
		[query_reactCallback, node],
	);

	const movementHandler = useCallback(
		(event: KeyboardEvent) => {
			if (!grid || !gridGame) return;

			const direction = directionMap[event.key];
			if (!direction) return;

			const center = gridGame?.center;
			const pos = grid.positions.get(peerId) || { x: 0, y: 0 };
			const change = grid.getDirectionValue(direction);
			const newPos = {
				x: center.x + (pos.x + change.x) * CELL_SIZE,
				y: center.y + (pos.y + change.y) * CELL_SIZE,
			};

			if (!gridGame.isValidPosition(newPos)) return;

			grid.moveUser(peerId, direction);
		},
		[grid, peerId],
	);

	// Set up subscription when grid ID changes
	useEffect(() => {
		if (!gridId) return;

		let isActive = true; // Flag to prevent updates after cleanup
		setPositions(new Map());

		const setupGrid = async () => {
			let gridObject = node.objectStore.get(gridId);
			if (!gridObject) {
				gridObject = await createGrid(gridId);
			}

			if (!isActive) return;

			const drp = gridObject.drp as GridDRP;
			drp.addUser(peerId);
			setGrid(drp);
		};

		setupGrid().catch(console.error);

		return () => {
			isActive = false;
			node.unsubscribeObject(gridId, true);
			setGrid(null);
		};
	}, [gridId, createGrid, peerId, node, gridGame]);

	useEffect(() => {
		addEventListener("keydown", movementHandler);
		return () => {
			removeEventListener("keydown", movementHandler);
		};
	});

	useEffect(() => {
		if (gridCanvas.current == null) return;
		gridGame = new GridGame(gridCanvas.current, 4000, 4000);
	}, [gridCanvas]);

	useEffect(() => {
		if (gridGame == null || grid == null) return;
		const center = gridGame?.center;
		gridGame.players =
			Array.from(grid.positions.entries()).map((pos) => {
				return new Player(
					center.x + pos[1].x * CELL_SIZE,
					center.y + pos[1].y * CELL_SIZE,
					getColorForPeerId(pos[0]),
				);
			}) || [];

		gridGame.camera.setPlayer(gridGame.players[0], 500, 500);
		gridGame.camera.update();
		gridGame.draw();
	}, [grid, gridGame, grid?.positions.entries()]);

	useEffect(() => {
		const id = setInterval(() => {
			setMa(node.networkNode?.getMultiaddrs()?.[0] || "");
			setPeers(node.networkNode.getAllPeers());
		});

		return () => {
			clearInterval(id);
		};
	}, [node]);

	const removeBootstrap = async (id: string) => {
		try {
			const newBootstraps = bootstraps.filter((n) => n !== id);
			setBootstraps(newBootstraps);
			await node.restart({
				network_config: {
					bootstrap_peers: newBootstraps,
				},
			});
			console.log("newBootstraps", newBootstraps);
		} catch (e) {
			console.error(e);
		}
	};

	return (
		<div className="relative min-h-screen max-h-screen flex flex-col h-screen bg-gradient-to-t from-[#383838] to-[50%] to-[#C3C5C3] pt-4">
			<div className="px-20 py-8 flex-grow flex flex-col">
				<div className="relative flex w-full h-full border-4 border-[#2B2B2B] rounded-xl bg-[#FFF9D7]">
					<img
						src={heading}
						alt="heading"
						className="absolute w-[300px] lg:w-fit -top-6 lg:-top-10 left-1/2 -translate-x-1/2 z-10"
					/>
					<div className="absolute flex gap-10 top-14 z-20 w-full px-10">
						<div className="flex">
							<img src={left} alt="left" className="" />
							<div
								className="min-h-0 w-full flex items-center justify-center font-['Pixel'] px-2 gap-2"
								style={{
									backgroundImage: `url("${middle}")`,
									backgroundSize: "100% 100%",
								}}
							>
								<img
									src={mandu}
									alt="mandu"
									className="w-6 aspect-square mb-2"
								/>
								<p className="mb-2">
									{node.networkNode.peerId.slice(0, 4)}...
									{node.networkNode.peerId.slice(-4)}
								</p>
								<button
									className=""
									onClick={() => {
										navigator.clipboard.writeText(ma);
									}}
									type="button"
								>
									<img src={copy} alt="copy" className="w-6 aspect-square" />
								</button>
							</div>
							<img src={right} alt="right" className="" />
						</div>
						<div className="flex flex-grow">
							<img src={left} alt="left" className="" />
							<div
								className="min-h-0 w-full flex items-center justify-between font-['Pixel'] px-2"
								style={{
									backgroundImage: `url("${middle}")`,
									backgroundSize: "100% 100%",
								}}
							>
								<p className="mb-2">
									Your Multiaddrs: {ma.slice(0, 16)}...{ma.slice(-16)}
								</p>
								<button
									className="mb-1"
									onClick={() => {
										navigator.clipboard.writeText(ma);
									}}
									type="button"
								>
									<img src={copy} alt="copy" className="w-6 aspect-square" />
								</button>
							</div>
							<img src={right} alt="right" className="" />
						</div>
						<div className="flex">
							<img src={left} alt="left" className="" />
							<div
								className="min-h-0 w-full flex items-center justify-center font-['Pixel'] px-2"
								style={{
									backgroundImage: `url("${middle}")`,
									backgroundSize: "100% 100%",
								}}
							>
								<img src={heart} alt="heart" className="mb-1 w-[130px]" />
							</div>
							<img src={right} alt="right" />
						</div>
					</div>
					<canvas
						ref={gridCanvas}
						className="absolute top-0 w-full h-full rounded-3xl"
					/>
				</div>
			</div>
			<div className="absolute top-60 left-5 rounded-xl bg-[#FFFDF1] border-4 border-black">
				<div className="flex justify-end gap-2 border-b-4 border-black p-2">
					<div className="w-3 aspect-square rounded-full bg-[#719F52]" />
					<div className="w-3 aspect-square rounded-full bg-[#FFE100]" />
					<div className="w-3 aspect-square rounded-full bg-[#E44B4B]" />
				</div>
				<div className="flex flex-col font-['Pixel'] p-4 gap-4">
					<div className="relative p-2 border-t-2 border-r-2 rounded-r-sm rounded-b-none border-black min-w-[250px]">
						<h3 className="absolute -top-4 left-0 z-10 bg-[#FFFDF1] text-nowrap">
							Your bootstraps
						</h3>
						<div className="flex flex-col gap-2 mt-4">
							{bootstraps.map((node) => {
								const peerId = node.split("/").pop()
									? node.split("/").pop()
									: "";
								return (
									<div key={node} className="flex items-end gap-2">
										<p className="text-nowrap font-['Pixel'] grow">
											{formatPeerId(peerId ?? "")}
										</p>
										<button
											type="button"
											onClick={() => {
												removeBootstrap(node);
											}}
										>
											<img
												src={trash}
												alt="trash"
												className="w-4 aspect-square"
											/>
										</button>
									</div>
								);
							})}
						</div>
					</div>
					<div className="relative p-2 border-t-2 border-r-2 rounded-l-sm rounded-b-none border-black min-w-[250px]">
						<h3 className="absolute -top-4 left-0 z-10 bg-[#FFFDF1] text-nowrap">
							Your connections
						</h3>
						<div
							className="flex flex-col gap-2 mt-4 max-h-[300px] overflow-scroll"
							style={{
								scrollbarWidth: "none",
							}}
						>
							{peers.map((peer) =>
								bootstraps.some((multiaddr) => {
									return multiaddr.includes(peer);
								}) ? null : (
									<div key={peer} className="flex items-center justify-between">
										<p>{formatPeerId(peer)}</p>
										<button
											className="p-0 bg-transparent text-white"
											onClick={async () => {
												await node.networkNode.disconnect(peer);
											}}
											type="button"
										>
											<img
												src={trash}
												alt="trash"
												className="w-4 aspect-square"
											/>
										</button>
									</div>
								),
							)}
						</div>
					</div>
				</div>
			</div>
			<div className="absolute right-10 top-1/2 border-4 rounded-xl border-black bg-[#FFFDF1]">
				<div className="flex justify-end gap-2 p-2">
					<div className="w-3 aspect-square rounded-full bg-[#719F52]" />
					<div className="w-3 aspect-square rounded-full bg-[#FFE100]" />
					<div className="w-3 aspect-square rounded-full bg-[#E44B4B]" />
				</div>
				<div
					className="p-4 mx-10 mb-4"
					style={{
						backgroundImage: `url("${input}")`,
						backgroundSize: "100% 100%",
						backgroundRepeat: "no-repeat",
					}}
				>
					<input
						placeholder="Peer multiaddrs"
						className="bg-transparent focus:outline-none font-['Pixel'] w-[180px]"
						onChange={(e) => {
							setPeerMaInput(e.target.value);
						}}
						value={peerMaInput}
					/>
				</div>
				<div
					className="p-4 min-h-[60px] w-fit flex mx-auto mb-4"
					style={{
						backgroundImage: `url("${button}")`,
						backgroundSize: "100% 100%",
						backgroundRepeat: "no-repeat",
						// aspectRatio: "16/9",
						cursor: "pointer",
					}}
					onClick={async () => {
						if (peerMaInput === "") return;
						await node.networkNode.connect(peerMaInput);
						setPeerMaInput("");
					}}
				>
					<p className="z-10 text-center text-[12px] text-nowrap font-['Pixel'] px-2 mb-6">
						Connect
					</p>
				</div>
			</div>
			<div
				className="relative min-w-full min-h-[150px] flex justify-center items-end pb-4"
				style={{
					backgroundImage: `url("${table}")`,
					backgroundSize: "100% 100%",
					backgroundRepeat: "no-repeat",
				}}
			>
				<div
					className="absolute top-7 left-80 p-4 min-h-[60px] min-w-fit flex"
					style={{
						backgroundImage: `url("${button}")`,
						backgroundSize: "100% 100%",
						backgroundRepeat: "no-repeat",
						// aspectRatio: "16/9",
						cursor: "pointer",
					}}
					onClick={async () => {
						const grid = await createGrid();
						setGridId(grid.id);
					}}
				>
					<p className="z-10 text-center text-[12px] text-nowrap font-['Pixel'] px-2 mb-6">
						Create Grid
					</p>
				</div>
				<div
					className="absolute top-7 right-80 p-4 min-h-[60px] min-w-fit flex"
					style={{
						backgroundImage: `url("${button}")`,
						backgroundSize: "100% 100%",
						backgroundRepeat: "no-repeat",
						// aspectRatio: "16/9",
						cursor: "pointer",
					}}
					onClick={async () => {
						navigator.clipboard.writeText(gridId);
					}}
				>
					<p className="z-10 text-center text-[12px] text-nowrap font-['Pixel'] px-2 mb-6">
						Copy Grid ID
					</p>
				</div>
				<div className="absolute top-0 flex gap-4 items-center">
					<div
						className="p-4"
						style={{
							backgroundImage: `url("${input}")`,
							backgroundSize: "100% 100%",
							backgroundRepeat: "no-repeat",
						}}
					>
						<input
							placeholder="Grid ID"
							className="bg-transparent focus:outline-none font-['Pixel']"
							onChange={(e) => {
								setGridIdInput(e.target.value);
							}}
							value={gridIdInput}
						/>
					</div>
					<div
						className="p-4 min-h-[60px] min-w-fit flex"
						style={{
							backgroundImage: `url("${button}")`,
							backgroundSize: "100% 100%",
							backgroundRepeat: "no-repeat",
							// aspectRatio: "16/9",
							cursor: "pointer",
						}}
						onClick={async () => {
							setGridId(gridIdInput);
							setGridIdInput("");
						}}
					>
						<p className="z-10 text-center text-[12px] text-nowrap font-['Pixel'] px-2 mb-6">
							Join Grid
						</p>
					</div>
				</div>
				<p className="font-['Pixel'] text-black text-center mb-3 text-xl">
					Your Grid ID: {gridId.slice(0, 8)} ... {gridId.slice(-8)}
				</p>
			</div>
		</div>
	);
}
