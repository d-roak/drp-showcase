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
		console.log(xView, yView);

		ctx.save();
		ctx.beginPath();
		// ctx.fillStyle = this.color;
		ctx.drawImage(
			this.img,
			this.x - xView + 5,
			this.y - yView + 5,
			CELL_SIZE - 10,
			CELL_SIZE - 10,
		);
		ctx.restore();
	}
}
