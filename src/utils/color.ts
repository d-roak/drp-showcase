export const rgbToHex = (r: number, g: number, b: number): string => {
	return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
};

const hashCode = (str: string): number => {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		hash = (hash << 5) - hash + str.charCodeAt(i);
		hash |= 0; // Convert to 32bit integer
	}
	return hash;
};

export const getColorForPeerId = (id: string): string => {
	const hash = hashCode(id);
	const r = (hash & 0xff0000) >> 16;
	const g = (hash & 0x00ff00) >> 8;
	const b = hash & 0x0000ff;
	return rgbToHex(r, g, b); // Convert RGB to hex
};
