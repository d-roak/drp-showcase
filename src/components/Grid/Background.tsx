interface BackgroundProps {
	centerX: number;
	centerY: number;
	clientWidth: number;
	clientHeight: number;
}

export default function GridBackground({
	centerX,
	centerY,
	clientWidth,
	clientHeight,
}: BackgroundProps) {
	const numLinesX = Math.floor(clientWidth / 50);
	const numLinesY = Math.floor(clientHeight / 50);

	const xLines = Array.from({ length: 2 * numLinesX + 1 }, (_, index) => {
		const i = index - numLinesX;
		return (
			<div
				key={`x-line-${i}`}
				style={{ left: `${centerX + i * 50}px` }}
				className={"absolute top-0 w-0.5 h-full bg-gray-400"}
			/>
		);
	});

	const yLines = Array.from({ length: 2 * numLinesY + 1 }, (_, index) => {
		const i = index - numLinesY;
		return (
			<div
				key={`y-line-${i}`}
				style={{ top: `${centerY + i * 50}px` }}
				className={"absolute left-0 w-full h-0.5 bg-gray-400"}
			/>
		);
	});

	return (
		<>
			{xLines}
			{yLines}
		</>
	);
}
