import type { DRPNode } from "@ts-drp/node";
import { useRef, useEffect, useState } from "react";
import { Grid } from "./drps/grid";
import { getColorForPeerId } from "./utils/color";

const GridDRP = ({ node }: { node: DRPNode }) => {
    const canvasRef = useRef(null);
    const [gridDRP, setGrid] = useState<Grid | null>(null);
    const [gridId, setGridId] = useState<string>("");

    useEffect(() => {
        const element_grid = document.getElementById("grid") as HTMLDivElement;
        element_grid.innerHTML = "";

        const gridWidth = element_grid.clientWidth;
        const gridHeight = element_grid.clientHeight;
        const centerX = Math.floor(gridWidth / 2);
        const centerY = Math.floor(gridHeight / 2);

        // Draw grid lines
        const numLinesX = Math.floor(gridWidth / 50);
        const numLinesY = Math.floor(gridHeight / 50);

        for (let i = -numLinesX; i <= numLinesX; i++) {
            const line = document.createElement("div");
            line.style.position = "absolute";
            line.style.left = `${centerX + i * 50}px`;
            line.style.top = "0";
            line.style.width = "1px";
            line.style.height = "100%";
            line.style.backgroundColor = "lightgray";
            element_grid.appendChild(line);
        }

        for (let i = -numLinesY; i <= numLinesY; i++) {
            const line = document.createElement("div");
            line.style.position = "absolute";
            line.style.left = "0";
            line.style.top = `${centerY + i * 50}px`;
            line.style.width = "100%";
            line.style.height = "1px";
            line.style.backgroundColor = "lightgray";
            element_grid.appendChild(line);
        }

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
        gridDRP?.addUser(node.networkNode.peerId, getColorForPeerId(node.networkNode.peerId));
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
                setGrid(gridObject.drp as Grid);
            }
        });

        node.objectStore.subscribe(gridId, () => {
            const gridObject = node.objectStore.get(gridId);
            if (gridObject) {
                setGrid(gridObject.drp as Grid);
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
                            const drpObject = await node.createObject(new Grid());
                            setGridId(drpObject.id);
                            setGrid(drpObject.drp as Grid);
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
            <div ref={canvasRef} id="grid" className="relative border-2 border-black w-full h-[100%] overflow-hidden" />
        </div>
    );
};

export default GridDRP;
