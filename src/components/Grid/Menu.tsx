import { useRef, useState } from "react";
import { GridDRP } from "../../drps/grid";
import { DRPNode } from "@ts-drp/node";

export default function GridMenu(props: {
	node: DRPNode;
	setGrid: (grid: GridDRP | null) => void;
	setRerender: (rerender: number) => void;
}) {
	const inputEl = useRef<HTMLInputElement>(null);
	const [gridId, setGridId] = useState<string>("");

	function createConnectHandlers() {
		props.node.addCustomGroupMessageHandler(gridId, () => {
			props.setRerender(Math.random());
			const gridObject = props.node.objectStore.get(gridId);
			if (gridObject) {
				props.setGrid(gridObject.drp as GridDRP);
			}
		});

		props.node.objectStore.subscribe(gridId, () => {
			props.setRerender(Math.random());
			const gridObject = props.node.objectStore.get(gridId);
			if (gridObject) {
				props.setGrid(gridObject.drp as GridDRP);
			}
		});
	}

	async function createGrid() {
		const drpObject = await props.node.createObject(new GridDRP());
		const drp = drpObject.drp as GridDRP;
		drp.addUser(props.node.networkNode.peerId);
		setGridId(drpObject.id);
		props.setGrid(drp);
		createConnectHandlers();
	}

	async function connectGrid() {
		const drpId = inputEl.current?.value;
		if (!drpId) return;
		try {
			const drpObject = await props.node.createObject(
				new GridDRP(),
				drpId,
				undefined,
				true,
			);
			const drp = drpObject.drp as GridDRP;
			createConnectHandlers();
			drp.addUser(props.node.networkNode.peerId);
			setGridId(drpId);
			props.setGrid(drp);
			props.setRerender(Math.random());
			console.log("Succeeded in connecting with DRP", drpId);
		} catch (e) {
			console.error("Error while connecting with DRP", drpId, e);
		}
	}

	return (
		<div>
			<div className="flex gap-4 justify-center">
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
				<input ref={inputEl} type="text" placeholder="GRID ID" />
				<button onClick={() => connectGrid()}>Join Grid</button>
			</div>
			<p className="text-center">Your Grid id: {gridId || "none"}</p>
		</div>
	);
}
