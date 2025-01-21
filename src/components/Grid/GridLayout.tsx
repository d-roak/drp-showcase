import { useCallback, useEffect, useState } from "react";

interface GridLayoutProps {
	children: (dimensions: {
		centerX: number;
		centerY: number;
		clientWidth: number;
		clientHeight: number;
	}) => React.ReactNode;
}

export default function GridLayout({ children }: GridLayoutProps) {
	const [dimensions, setDimensions] = useState({
		centerX: 0,
		centerY: 0,
		clientWidth: 0,
		clientHeight: 0,
	});

	const updateDimensions = useCallback(() => {
		const gridEl = document.getElementById("gridContainer");
		if (gridEl) {
			setDimensions({
				centerX: Math.floor(gridEl.clientWidth / 2),
				centerY: Math.floor(gridEl.clientHeight / 2),
				clientWidth: gridEl.clientWidth,
				clientHeight: gridEl.clientHeight,
			});
		}
	}, []);

	useEffect(() => {
		updateDimensions();
		window.addEventListener("resize", updateDimensions);
		return () => {
			window.removeEventListener("resize", updateDimensions);
		};
	}, [updateDimensions]);

	return (
		<div
			id="gridContainer"
			className="relative mt-5 border-2 border-gray-400 w-full h-[60vh] overflow-hidden"
		>
			{children(dimensions)}
		</div>
	);
}
