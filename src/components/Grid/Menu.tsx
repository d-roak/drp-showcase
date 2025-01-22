import type { DRPObject } from "@ts-drp/object";
import { useRef } from "react";

export default function GridMenu({
	gridId,
	createGrid,
	setCurrentGridId,
}: {
	gridId: string;
	createGrid: (gridId?: string) => Promise<DRPObject>;
	setCurrentGridId: (gridId: string) => void;
}) {
	const inputEl = useRef<HTMLInputElement>(null);

	const _createGrid = async () => {
		const grid = await createGrid();
		setCurrentGridId(grid.id);
	};

	return (
		<div>
			<div className="flex gap-4 justify-center">
				<button onClick={_createGrid} type="button">
					Create new Grid
				</button>
				<button
					type="button"
					onClick={() => {
						navigator.clipboard.writeText(gridId);
					}}
				>
					Copy grid id
				</button>
				<input ref={inputEl} type="text" placeholder="GRID ID" />
				<button
					type="button"
					onClick={() => setCurrentGridId(inputEl.current?.value ?? "")}
				>
					Join Grid
				</button>
			</div>
			<p className="text-center">Your Grid id: {gridId || "none"}</p>
		</div>
	);
}
