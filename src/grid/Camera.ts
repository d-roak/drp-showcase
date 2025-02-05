import { CELL_SIZE } from "./Map";
import type { Player } from "./Player";
import { Rect } from "./Rect";

export class Camera {
	xView: number;
	yView: number;
	playerLastX: number | null = null;
	playerLastY: number | null = null;
	xDeadZone: number;
	yDeadZone: number;
	viewportWidth: number;
	viewportHeight: number;
	player: Player | null = null;
	viewportRect: Rect;
	worldRect: Rect;

	constructor(
		xView: number,
		yView: number,
		viewportWidth: number,
		viewportHeight: number,
		worldWidth: number,
		worldHeight: number,
	) {
		this.xView = xView || 0;
		this.yView = yView || 0;
		this.playerLastX = 0;
		this.playerLastY = 0;
		this.viewportWidth = viewportWidth;
		this.viewportHeight = viewportHeight;

		this.xDeadZone = 0;
		this.yDeadZone = 0;
		this.viewportRect = new Rect(
			this.xView,
			this.yView,
			this.viewportWidth,
			this.viewportHeight,
		);
		this.worldRect = new Rect(
			0,
			0,
			Math.max(this.viewportWidth, worldWidth),
			Math.max(this.viewportHeight, worldHeight),
		);
	}

	setPlayer(player: Player, xDeadZone = 0, yDeadZone = 0) {
		this.player = player;
		this.xDeadZone = xDeadZone;
		this.yDeadZone = yDeadZone;
		if (this.playerLastX == null) this.playerLastX = this.player?.x;
		if (this.playerLastY == null) this.playerLastY = this.player?.y;
	}

	update() {
		if (this.player) {
			if (this.player.x - this.xView + this.xDeadZone > this.viewportWidth) {
				if (this.player.x !== this.playerLastX) {
					this.xView +=
						(CELL_SIZE / 2) *
						Math.floor((this.player.x - this.xView) / CELL_SIZE >= 2 ? 3 : 1);
				}
			} else if (this.player.x - this.xDeadZone < this.xView) {
				if (this.player.x !== this.playerLastX) {
					this.xView -=
						(CELL_SIZE / 2) *
						Math.floor((this.player.x - this.xView) / CELL_SIZE < 2 ? 3 : 1);
				}
			}

			if (this.player.y - this.yView + this.yDeadZone > this.viewportHeight) {
				if (this.player.y !== this.playerLastY) {
					this.yView +=
						(CELL_SIZE / 2) *
						(Math.floor((this.player.y - this.yView) / CELL_SIZE) >= 2 ? 3 : 1);
				}
			} else if (this.player.y - this.yDeadZone < this.yView) {
				if (this.player.y !== this.playerLastY) {
					this.yView -=
						(CELL_SIZE / 2) *
						Math.floor((this.player.y - this.yView) / CELL_SIZE < 2 ? 3 : 1);
				}
			}

			this.playerLastX = this.player.x;
			this.playerLastY = this.player.y;
		}
		this.viewportRect.set(this.xView, this.yView);

		if (this.viewportRect.x < this.worldRect.x) {
			this.xView = this.worldRect.x;
		}
		if (this.viewportRect.y < this.worldRect.y) {
			this.yView = this.worldRect.y;
		}
		if (this.viewportRect.xx > this.worldRect.xx) {
			this.xView = this.worldRect.xx - this.viewportWidth;
		}
		if (this.viewportRect.yy > this.worldRect.yy) {
			this.yView = this.worldRect.yy - this.viewportRect.height;
		}
	}
}
