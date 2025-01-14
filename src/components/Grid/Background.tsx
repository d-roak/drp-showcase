import { useEffect, useState } from "react";

export default function GridBackground(props: {
    gridEl: React.RefObject<HTMLDivElement>;
}) {
    const [xLines, setXLines] = useState<JSX.Element[]>([]);
    const [yLines, setYLines] = useState<JSX.Element[]>([]);

    // Draw grid lines
    useEffect(() => {
        const gridWidth = props.gridEl.current?.clientWidth as number;
        const gridHeight = props.gridEl.current?.clientHeight as number;
        const centerX = Math.floor(gridWidth / 2);
        const centerY = Math.floor(gridHeight / 2);

        const numLinesX = Math.floor(gridWidth / 50);
        const numLinesY = Math.floor(gridHeight / 50);

        for (let i = -numLinesX; i <= numLinesX; i++) {
            setXLines((prev) => [
                ...prev,
                <div
                    key={`x-line-${i}`}
                    style={{ left: `${centerX + i * 50}px` }}
                    className={`absolute top-0 w-0.5 h-full bg-gray-400`}
                ></div>,
            ]);
        }

        for (let i = -numLinesY; i <= numLinesY; i++) {
            setYLines((prev) => [
                ...prev,
                <div
                    key={`y-line-${i}`}
                    style={{ top: `${centerY + i * 50}px` }}
                    className={`absolute left-0 w-full h-0.5 bg-gray-400`}
                ></div>,
            ]);
        }
    }, [props.gridEl]);
    return (
        <>
            {<>{xLines}</>}
            {<>{yLines}</>}
        </>
    );
}
