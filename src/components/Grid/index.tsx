import type { DRPNode } from "@ts-drp/node";
import { useEffect, useState } from "react";
import { GridDRP } from "../../drps/grid";
import { getColorForPeerId } from "../../utils/color";
import GridBackground from "./Background";

export default function Grid({ node }: { node: DRPNode }) {
	const [gridDRP, setGrid] = useState<GridDRP | null>(null);
	const [gridId, setGridId] = useState<string>("");

	// Draw players
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
			<GridBackground />
		</div>
	);
}
