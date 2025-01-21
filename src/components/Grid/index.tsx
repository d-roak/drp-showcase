import type { DRPNode } from "@ts-drp/node";
import type { DRPObject } from "@ts-drp/object";
import { useCallback, useEffect, useState } from "react";
import { GridDRP } from "../../drps/grid";
import GridBackground from "./Background";
import GridLayout from "./GridLayout";
import GridMenu from "./Menu";
import GridPlayers from "./Players";

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

export default function Grid({ node }: { node: DRPNode }) {
	const peerId = node.networkNode.peerId;
	const [gridId, setGridId] = useState<string>("");
	const [grid, setGrid] = useState<GridDRP | null>(null);
	const [positions, setPositions] = useState<
		Map<string, { x: number; y: number }>
	>(new Map());

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
	}, [gridId, createGrid, peerId, node]);

	useEffect(() => {
		addEventListener("keydown", movementHandler);
		return () => {
			removeEventListener("keydown", movementHandler);
		};
	});

	return (
		<>
			<GridMenu
				gridId={gridId}
				setCurrentGridId={setGridId}
				createGrid={createGrid}
			/>
			<div className="flex flex-col items-center grow w-full">
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
			</div>
		</>
	);
}
