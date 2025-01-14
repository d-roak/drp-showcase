import { getColorForPeerId } from "./color";

export const formatPeerId = (id: string) => {
    return (
        <span style={{ color: getColorForPeerId(id) }}>
            {id.slice(0, 4)}...{id.slice(-4)}
        </span>
    );
};
