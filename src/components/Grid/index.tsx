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
import { GridGame } from "../../grid";
import { Player } from "../../grid/Player";
import { getColorForPeerId } from "../../utils/color";
import { CELL_SIZE } from "../../grid/Map";
import { User } from "lucide-react";

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
			if (!grid) return;

			const direction = directionMap[event.key];
			if (!direction) return;

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
		});

		return () => {
			clearInterval(id);
		};
	}, [node]);

	return (
		<div className="min-h-screen max-h-screen flex flex-col h-screen bg-gradient-to-t from-[#383838] to-[#C3C5C3] pt-4">
			<div className="px-20 py-8 flex-grow flex flex-col">
				<div className="relative flex w-full h-full border-4 border-[#2B2B2B] rounded-3xl bg-[#FFF9D7]">
					<img
						src={heading}
						alt="heading"
						className="absolute w-[300px] lg:w-fit -top-6 lg:-top-10 left-1/2 -translate-x-1/2 z-10"
					/>
					<div className="absolute flex gap-10 top-14 z-20 w-full px-10">
						<div className="flex">
							<img src={left} alt="left" className="" />
							<div
								className="min-h-0 w-full flex items-center justify-center font-['Pixel'] px-2"
								style={{
									backgroundImage: `url("${middle}")`,
									backgroundSize: "100% 100%",
								}}
							>
								<User size={24} />
								<p className="mb-2">
									{node.networkNode.peerId.slice(0, 4)}...
									{node.networkNode.peerId.slice(-4)}
								</p>
							</div>
							<img src={right} alt="right" className="" />
						</div>
						<div className="flex flex-grow">
							<img src={left} alt="left" className="" />
							<div
								className="min-h-0 w-full flex items-center justify-center font-['Pixel'] px-2"
								style={{
									backgroundImage: `url("${middle}")`,
									backgroundSize: "100% 100%",
								}}
							>
								<p className="mb-2">
									Your Multiaddrs: {ma.slice(0, 16)}...{ma.slice(-16)}
								</p>
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
								<User size={24} />
								<p className="mb-2">
									{node.networkNode.peerId.slice(0, 4)}...
									{node.networkNode.peerId.slice(-4)}
								</p>
							</div>
							<img src={right} alt="right" className="" />
						</div>
					</div>
					<canvas
						ref={gridCanvas}
						className="absolute top-0 w-full h-full rounded-3xl"
					/>
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
					className="absolute top-1/2 -translate-y-1/2 left-40 p-4 min-h-[60px] min-w-fit flex"
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
					className="absolute top-1/2 -translate-y-1/2 right-40 p-4 min-h-[60px] min-w-fit flex"
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
						Join Grid
					</p>
				</div>
				<p className="font-['Pixel'] text-black text-center">
					Your Grid ID: {gridId.slice(0, 8)} ... {gridId.slice(-8)}
				</p>
			</div>
			{/* <GridMenu
				gridId={gridId}
				setCurrentGridId={setGridId}
				createGrid={createGrid}
			/> */}
			{/*<div className="flex flex-col items-center grow w-full">
				<GridLayout>
					{(dimensions) => (
						<>
							<GridBackground
								centerX={dimensions.centerX}
								centerY={dimensions.centerY}
								clientWidth={dimensions.clientWidth}
								clientHeight={dimensions.clientHeight}
							/>
							<GridPlayers
								centerX={dimensions.centerX}
								centerY={dimensions.centerY}
								positions={Array.from(positions.entries())}
							/>
						</>
					)}
				</GridLayout>
			</div> */}
		</div>
	);
}
