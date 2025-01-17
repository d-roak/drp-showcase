import type { DRPNode } from "@ts-drp/node";
import { useRef, useState } from "react";
import type { GridDRP } from "../../drps/grid";
import GridBackground from "./Background";
import GridMenu from "./Menu";
import GridPlayers from "./Players";

export default function Grid(props: { node: DRPNode }) {
	const gridEl = useRef<HTMLDivElement>(null);
	const peerId = props.node.networkNode.peerId;

	const [grid, setGrid] = useState<GridDRP | null>(null);
	const [rerender, setRerender] = useState(0);

	return (
		<>
			<GridMenu node={props.node} setGrid={setGrid} setRerender={setRerender} />
			<div className="flex flex-col items-center grow w-full">
				<div
					id="gridEl"
					ref={gridEl}
					className="relative mt-5 border-2 border-gray-400 w-full h-[60vh] overflow-hidden"
				>
					<GridBackground gridEl={gridEl} />
					<GridPlayers
						peerId={peerId}
						grid={grid}
						gridEl={gridEl}
						rerender={rerender}
						setRerender={setRerender}
					/>
				</div>
			</div>
		</>
	);
}
