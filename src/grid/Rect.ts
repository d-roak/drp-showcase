export class Rect {
	x: number;
	y: number;
	xx: number;
	yy: number;
	width: number;
	height: number;

	constructor(x: number, y: number, width: number, height: number) {
		this.x = x;
		this.y = y;
		this.xx = x + width;
		this.yy = y + height;
		this.width = width;
		this.height = height;
	}

	set(x: number, y: number) {
		this.x = x;
		this.y = y;
		this.xx = x + this.width;
		this.yy = y + this.height;
	}

	within(other: Rect) {
		return (
			other.x <= this.x &&
			other.y <= this.y &&
			other.xx >= this.xx &&
			other.yy >= this.yy
		);
	}

	overlaps(other: Rect) {
		return (
			this.x < other.xx &&
			this.xx > other.x &&
			this.y < other.yy &&
			this.yy > other.y
		);
	}
}
