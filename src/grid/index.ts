import { Camera } from "./Camera";
import { CELL_SIZE, GridMap } from "./Map";
import type { Player } from "./Player";

export class GridGame {
	canvas: HTMLCanvasElement;
	ctx: CanvasRenderingContext2D;
	width: number;
	height: number;
	camera: Camera;
	map: GridMap;
	players: Player[] = [];
	center: { x: number; y: number } = { x: 0, y: 0 };

	constructor(canvas: HTMLCanvasElement, width: number, height: number) {
		this.canvas = canvas;
		const rect = canvas.getBoundingClientRect();
		this.ctx = canvas.getContext("2d") || new CanvasRenderingContext2D();
		this.ctx.translate(rect.width / 3, rect.height / 3);
		canvas.width = rect.width;
		canvas.height = rect.height;
		this.width = width || 0;
		this.height = height || 0;
		console.log(rect.width, rect.height);

		this.center = {
			x: (~~(rect.width / CELL_SIZE) * CELL_SIZE) / 2,
			y: ~~(rect.height / CELL_SIZE) * CELL_SIZE - 2 * CELL_SIZE,
		};

		const viewportWidth = Math.min(canvas.width, width);
		const viewportHeight = Math.min(canvas.height, height);
		this.camera = new Camera(
			0,
			0,
			viewportWidth,
			viewportHeight,
			width,
			height,
		);
		this.map = new GridMap(this.width * 1.5, this.height * 1.5);
	}

	draw() {
		console.log(this.ctx.canvas.width, this.ctx.canvas.height);

		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.map.draw(this.ctx, this.camera.xView, this.camera.yView);
		for (const player of this.players) {
			player.draw(this.ctx, this.camera.xView, this.camera.yView);
		}
	}

	track(player: Player) {
		this.camera.setPlayer(player);
	}

	clear() {
		this.ctx.clearRect(0, 0, this.width, this.height);
	}

	resize() {
		const rect = this.canvas.getBoundingClientRect();
		// this.ctx.resetTransform();
		// this.ctx.translate(rect.width / 3, rect.height / 3);
		this.canvas.width = rect.width;
		this.canvas.height = rect.height;
		this.camera.viewportWidth = Math.min(this.canvas.width, this.width);
		this.camera.viewportHeight = Math.min(this.canvas.height, this.height);
		this.center = { x: rect.width / 2, y: rect.height / 2 };
	}
}
