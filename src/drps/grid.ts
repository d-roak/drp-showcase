import {
    ActionType,
    type DRP,
    type ResolveConflictsType,
    SemanticsType,
} from "@ts-drp/object";

export class GridDRP implements DRP {
    semanticsType: SemanticsType = SemanticsType.pair;
    positions: Map<string, { x: number; y: number }>;

    constructor() {
        this.positions = new Map<string, { x: number; y: number }>();
    }

    addUser(peerId: string): void {
        this.positions.set(peerId, { x: 0, y: 0 });
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
        }
    }

    getUsers(): string[] {
        return [...this.positions.keys()];
    }

    getPositions(): [string, { x: number; y: number }][] {
        return [...this.positions.entries()];
    }

    getUserPosition(peerId: string): { x: number; y: number } | undefined {
        return this.positions.get(peerId);
    }

    resolveConflicts(): ResolveConflictsType {
        return { action: ActionType.Nop };
    }
}
