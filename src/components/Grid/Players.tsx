import { useEffect, useMemo, useRef } from "react";
import { getColorForPeerId } from "../../utils/color";

const PlayerElement = ({
	peerId,
	position,
	centerX,
	centerY,
}: {
	peerId: string;
	position: { x: number; y: number };
	centerX: number;
	centerY: number;
}) => {
	const playerRef = useRef<HTMLDivElement>(null);

	const left = useMemo(
		() => centerX + position.x * 50 + 5,
		[centerX, position.x],
	);
	const top = useMemo(
		() => centerY - position.y * 50 + 5,
		[centerY, position.y],
	);

	useEffect(() => {
		if (playerRef.current) {
			playerRef.current.style.left = `${left}px`;
			playerRef.current.style.top = `${top}px`;
		}
	}, [left, top]);

	return (
		<div
			ref={playerRef}
			key={`player-${peerId}`}
			style={{
				position: "absolute",
				left: `${centerX + position.x * 50 + 5}px`,
				top: `${centerY - position.y * 50 + 5}px`,
				width: "40px",
				height: "40px",
				backgroundColor: getColorForPeerId(peerId),
				borderRadius: "50%",
				transition: "background-color 1s ease-in-out",
				animation: `glow-${peerId} 0.5s infinite alternate`,
			}}
		/>
	);
};

export default function GridPlayers({
	positions,
	centerX,
	centerY,
}: {
	positions: [string, { x: number; y: number }][] | null;
	centerX: number;
	centerY: number;
}) {
	return (
		<>
			{positions?.map(([peerId, pos]) => (
				<PlayerElement
					key={peerId}
					peerId={peerId}
					position={pos}
					centerX={centerX}
					centerY={centerY}
				/>
			))}
		</>
	);
}
