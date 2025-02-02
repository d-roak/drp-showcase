import { CELL_SIZE } from "./Map";

export class Player {
	x: number;
	y: number;
	color = "red";

	constructor(x: number, y: number, color: string) {
		this.x = x;
		this.y = y;
		this.color = color;
	}

	draw(ctx: CanvasRenderingContext2D, xView: number, yView: number) {
		console.log(xView, yView);

		ctx.save();
		ctx.beginPath();
		ctx.fillStyle = this.color;
		ctx.fillRect(
			this.x - xView + 5,
			this.y - yView + 5,
			CELL_SIZE - 10,
			CELL_SIZE - 10,
		);
		ctx.fill();
		ctx.restore();
	}
}
