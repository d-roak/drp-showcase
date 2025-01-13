import type { DRPNode } from "@ts-drp/node";
import { useRef, useState } from "react";
import { GridDRP } from "../../drps/grid";
import GridBackground from "./Background";
import GridPlayers from "./Players";

export default function Grid({ node }: { node: DRPNode }) {
	const gridEl = useRef<HTMLDivElement>(null);

	const peerId = node.networkNode.peerId;
	const [gridDRP, setGrid] = useState<GridDRP | null>(null);
	const [gridId, setGridId] = useState<string>("");

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

	async function createGrid() {
		const drpObject = await node.createObject(new GridDRP());
		const drp = drpObject.drp as GridDRP;
		drp.addUser(node.networkNode.peerId);
		setGridId(drpObject.id);
		setGrid(drp);
		createConnectHandlers();
	}

	return (
		<div className="flex flex-col items-center grow w-full">
			<div>
				<div className="flex gap-4">
					<button onClick={async () => createGrid()} type="button">
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
				className="relative mt-5 border-2 border-gray-400 w-full h-[60vh] overflow-hidden"
			>
				<GridBackground gridEl={gridEl} />
				<GridPlayers peerId={peerId} grid={gridDRP} gridEl={gridEl} />
			</div>
		</div>
	);
}
