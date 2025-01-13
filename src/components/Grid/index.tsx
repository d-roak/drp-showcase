import type { DRPNode } from "@ts-drp/node";
import { useRef, useEffect, useState } from "react";
import { GridDRP } from "../../drps/grid";
import { getColorForPeerId } from "../../utils/color";

export default function Grid({ node }: { node: DRPNode }) {
	const [gridDRP, setGrid] = useState<GridDRP | null>(null);
	const [gridId, setGridId] = useState<string>("");

	const gridEl = useRef<HTMLDivElement>(null);
	const [xLines, setXLines] = useState<JSX.Element[]>([]);
	const [yLines, setYLines] = useState<JSX.Element[]>([]);

	console.log(gridEl);

	useEffect(() => {
		const gridWidth = gridEl.current?.clientWidth as number;
		const gridHeight = gridEl.current?.clientHeight as number;
		const centerX = Math.floor(gridWidth / 2);
		const centerY = Math.floor(gridHeight / 2);

		// Draw grid lines
		const numLinesX = Math.floor(gridWidth / 50);
		const numLinesY = Math.floor(gridHeight / 50);

		console.log(gridWidth, gridHeight);
		console.log(numLinesX, numLinesY);

		for (let i = -numLinesX; i <= numLinesX; i++) {
			setXLines((prev) => [
				...prev,
				<div
					key={`x-line-${i}`}
					className={`absolute left-[${centerX + i * 50}px] top-0 w-1 h-full bg-lightgray`}
				></div>,
			]);
		}

		for (let i = -numLinesY; i <= numLinesY; i++) {
			setYLines((prev) => [
				...prev,
				<div
					key={`y-line-${i}`}
					className={`absolute left-0 top-[${centerY + i * 50}px] w-full h-1 bg-lightgray`}
				></div>,
			]);
		}
	}, [gridEl]);

	useEffect(() => {
		const users = gridDRP?.getUsers();
		console.log(users);
		if (!users) return;
		for (const userColorString of users) {
			const [id, color] = userColorString.split(":");
			const position = gridDRP?.getUserPosition(userColorString);

			if (position) {
				const div = document.createElement("div");
				div.style.position = "absolute";
				div.style.left = `${centerX + position.x * 50 + 5}px`; // Center the circle
				div.style.top = `${centerY - position.y * 50 + 5}px`; // Center the circle
				if (id === node.networkNode.peerId) {
					div.style.width = `${40}px`;
					div.style.height = `${40}px`;
				} else {
					div.style.width = `${40}px`;
					div.style.height = `${40}px`;
				}
				div.style.backgroundColor = color;
				div.style.borderRadius = "50%";
				div.style.transition = "background-color 1s ease-in-out";
				div.style.animation = `glow-${id} 0.5s infinite alternate`;

				// Add black border for the current user's circle
				if (id === node.networkNode.peerId) {
					div.style.border = "3px solid black";
				}

				// Create dynamic keyframes for the glow effect
				const style = document.createElement("style");
				style.innerHTML = `
                @keyframes glow-${id} {
                    0% {
                        background-color: ${getColorForPeerId(color)};
                        background-opacity: 0.5;
                    }
                    100% {
                        background-color: ${getColorForPeerId(color)};
                        background-opacity: 1;
                    }
                }`;
				document.head.appendChild(style);

				element_grid.appendChild(div);
			}
		}
	}, [gridDRP, gridDRP?.getPositions(), node.networkNode.peerId]);

	useEffect(() => {
		gridDRP?.addUser(
			node.networkNode.peerId,
			getColorForPeerId(node.networkNode.peerId),
		);
	}, [gridDRP, node.networkNode.peerId]);

	useEffect(() => {
		addEventListener("keydown", (e) => {
			if (!gridDRP) return;
			switch (e.key) {
				case "ArrowUp":
					gridDRP.moveUser(node.networkNode.peerId, "U");
					break;
				case "ArrowDown":
					gridDRP.moveUser(node.networkNode.peerId, "D");
					break;
				case "ArrowLeft":
					gridDRP.moveUser(node.networkNode.peerId, "L");
					break;
				case "ArrowRight":
					gridDRP.moveUser(node.networkNode.peerId, "R");
					break;
			}
		});

		return () => {
			removeEventListener("keydown", () => {});
		};
	}, [gridDRP, node.networkNode.peerId]);

	function createConnectHandlers() {
		node.addCustomGroupMessageHandler(gridId, () => {
			const gridObject = node.objectStore.get(gridId);
			if (gridObject) {
				setGrid(gridObject.drp as GridDRP);
			}
		});

		node.objectStore.subscribe(gridId, () => {
			const gridObject = node.objectStore.get(gridId);
			if (gridObject) {
				setGrid(gridObject.drp as GridDRP);
			}
		});
	}

	return (
		<div className="flex flex-col items-center grow w-full">
			<h2 className="text-3xl">Grid DRP</h2>
			<div>
				<div className="flex gap-4">
					<button
						onClick={async () => {
							const drpObject = await node.createObject(new GridDRP());
							setGridId(drpObject.id);
							setGrid(drpObject.drp as GridDRP);
							createConnectHandlers();
						}}
						type="button"
					>
						Create new Grid
					</button>
					<button
						onClick={() => {
							navigator.clipboard.writeText(gridId);
						}}
						type="button"
					>
						Copy grid id
					</button>
				</div>
				<p>Your Grid id: {gridId || "none"}</p>
			</div>
			<div
				id="gridEl"
				ref={gridEl}
				className="relative border-1 border-black w-full h-[60vh] overflow-hidden"
			>
				{<>{xLines}</>}
				{<>{yLines}</>}
			</div>
		</div>
	);
}
