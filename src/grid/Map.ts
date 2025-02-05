export const CELL_SIZE = 100;

export class GridMap {
	width: number;
	height: number;
	origin: { x: number; y: number };
	background: HTMLImageElement;

	constructor(width: number, height: number) {
		this.width = width;
		this.height = height;
		const offset = ~~(width / 3);
		const rem = offset % 1000;
		this.origin = { x: offset - rem, y: offset - rem };
		this.background = this._generate();
	}

	private _generate() {
		const ctx = document.createElement("canvas").getContext("2d");
		if (!ctx) return new Image();
		ctx.canvas.width = this.width;
		ctx.canvas.height = this.height;

		const rows = ~~(this.width / CELL_SIZE) + 1;
		const columns = ~~(this.height / CELL_SIZE) + 1;

		const color = "black";

		ctx.save();
		ctx.strokeStyle = color;
		for (let x = 0, i = 0; i < rows; x += CELL_SIZE, i++) {
			ctx.beginPath();
			for (let y = 0, j = 0; j < columns; y += CELL_SIZE, j++) {
				ctx.strokeRect(x, y, CELL_SIZE, CELL_SIZE);
			}
			ctx.closePath();
		}
		ctx.restore();
		// ctx.translate(3000, 3000);

		const image = new Image();
		image.src = ctx.canvas.toDataURL("image/png");
		return image;
	}

	draw(context: CanvasRenderingContext2D, xView: number, yView: number) {
		// biome-ignore lint/style/useSingleVarDeclarator: <explanation>
		// biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
		let sx, sy, dx, dy, sWidth, sHeight, dWidth, dHeight;

		// offset point to crop the image
		sx = xView;
		sy = yView;

		// dimensions of cropped image
		sWidth = context.canvas.width;
		sHeight = context.canvas.height;

		// if cropped image is smaller than canvas we need to change the source dimensions
		if (this.background.width - sx < sWidth) {
			sWidth = this.background.width - sx;
		}
		if (this.background.height - sy < sHeight) {
			sHeight = this.background.height - sy;
		}

		// location on canvas to draw the croped image
		dx = 0;
		dy = 0;
		// match destination with source to not scale the image
		dWidth = sWidth;
		dHeight = sHeight;

		context.drawImage(
			this.background,
			sx,
			sy,
			sWidth,
			sHeight,
			dx,
			dy,
			dWidth,
			dHeight,
		);
	}
}
