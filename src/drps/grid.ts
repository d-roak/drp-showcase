import {
	ActionType,
	type DRP,
	type ResolveConflictsType,
	SemanticsType,
} from "@ts-drp/object";

export class GridDRP implements DRP {
	semanticsType: SemanticsType = SemanticsType.pair;
	positions: Map<string, { x: number; y: number }>;
	query_reactCallback: (
		peerId: string,
		position: { x: number; y: number },
	) => void;

	constructor(
		query_reactCallback: (
			peerId: string,
			position: { x: number; y: number },
		) => void,
	) {
		this.positions = new Map<string, { x: number; y: number }>();
		this.query_reactCallback = query_reactCallback;
	}

	addUser(peerId: string): void {
		this.positions.set(peerId, { x: 0, y: 0 });
		this.query_reactCallback(peerId, { x: 0, y: 0 });
	}

	moveUser(peerId: string, direction: string): void {
		const position = this.positions.get(peerId);
		if (position) {
			switch (direction) {
				case "U":
					position.y += 1;
					break;
				case "D":
					position.y -= 1;
					break;
				case "L":
					position.x -= 1;
					break;
				case "R":
					position.x += 1;
					break;
			}
			this.query_reactCallback(peerId, position);
		}
	}

	query_positions(): [string, { x: number; y: number }][] {
		return [...this.positions.entries()];
	}

	resolveConflicts(): ResolveConflictsType {
		return { action: ActionType.Nop };
	}
}
