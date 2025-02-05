import { CELL_SIZE } from "./Map";
import mandu from "../assets/grid/mandu.svg";

export class Player {
	x: number;
	y: number;
	color = "red";
	img: HTMLImageElement;

	constructor(x: number, y: number, color: string) {
		this.x = x;
		this.y = y;
		this.color = color;
		this.img = new Image();
		this.img.src = mandu;
	}

	draw(ctx: CanvasRenderingContext2D, xView: number, yView: number) {
		ctx.save();
		ctx.beginPath();
		// ctx.fillStyle = this.color;
		const coords = {
			x: this.x - xView + 10,
			y: this.y - yView + 10,
		};

		// if (coords.x < xView) {
		// 	coords.x = xView;
		// }
		// if (coords.y < yView) {
		// 	coords.y = yView;
		// }
		// if (coords.x > xView + ctx.canvas.width) {
		// 	coords.x = xView + ctx.canvas.width;
		// }
		// if (coords.y > yView + ctx.canvas.height) {
		// 	coords.y = yView + ctx.canvas.height;
		// }

		ctx.drawImage(this.img, coords.x, coords.y, CELL_SIZE - 20, CELL_SIZE - 20);
		ctx.restore();
	}
}
