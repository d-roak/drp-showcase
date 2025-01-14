import { useEffect, useState } from "react";
import { GridDRP } from "../../drps/grid";
import { getColorForPeerId } from "../../utils/color";

export default function GridPlayers(props: {
    peerId: string;
    grid: GridDRP | null;
    gridEl: React.RefObject<HTMLDivElement>;
    rerender: number;
    setRerender: (rerender: number) => void;
}) {
    const [playersEls, setPlayersEls] = useState<JSX.Element[]>([]);

    const [centerX, setCenterX] = useState<number>(0);
    const [centerY, setCenterY] = useState<number>(0);

    useEffect(() => {
        const gridWidth = props.gridEl.current?.clientWidth as number;
        const gridHeight = props.gridEl.current?.clientHeight as number;
        setCenterX(Math.floor(gridWidth / 2));
        setCenterY(Math.floor(gridHeight / 2));
    }, [props.gridEl]);

    // add player movement controls
    const movementHandler = (e: KeyboardEvent) => {
        if (!props.grid) return;
        switch (e.key) {
            case "ArrowUp":
                props.grid.moveUser(props.peerId, "U");
                break;
            case "ArrowDown":
                props.grid.moveUser(props.peerId, "D");
                break;
            case "ArrowLeft":
                props.grid.moveUser(props.peerId, "L");
                break;
            case "ArrowRight":
                props.grid.moveUser(props.peerId, "R");
                break;
        }
        props.setRerender(Math.random());
    };

    useEffect(() => {
        addEventListener("keydown", movementHandler);
        return () => {
            removeEventListener("keydown", movementHandler);
        };
    });

    // Draw players
    useEffect(() => {
        setPlayersEls([]);
        const positions = props.grid?.getPositions();
        for (const pos of positions ?? []) {
            setPlayersEls((prev) => [
                ...prev,
                <div
                    key={`player-${pos[0]}`}
                    style={{
                        position: "absolute",
                        left: `${centerX + pos[1].x * 50 + 5}px`,
                        top: `${centerY - pos[1].y * 50 + 5}px`,
                        width: `${40}px`,
                        height: `${40}px`,
                        backgroundColor: getColorForPeerId(pos[0]),
                        borderRadius: "50%",
                        transition: "background-color 1s ease-in-out",
                        animation: `glow-${pos[0]} 0.5s infinite alternate`,
                    }}
                ></div>,
            ]);
        }
    }, [props.rerender, props.grid, props.peerId, centerX, centerY]);

    return <>{playersEls}</>;
}
