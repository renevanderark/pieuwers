import {Drawable} from "./drawable";

export default function(ctx : CanvasRenderingContext2D, can : HTMLCanvasElement) {
	let scale : number;
	let clearRequested : boolean = false;
	let forceUpdate = false;
	return {
		onResize(s : number) {
			scale = s;
			forceUpdate = true;
		},
		clear() {
			clearRequested = true;
		},
		render(drawables : Array<Drawable>) {
			if (clearRequested) {
				ctx.clearRect(0, 0, can.width, can.height);
				clearRequested = false;
			} else {
				drawables.filter(d => forceUpdate || d.updated()).forEach(d => d.clear(ctx, scale));
			}
			drawables.filter(d => forceUpdate || d.updated()).forEach(d => d.draw(ctx, scale));
			forceUpdate = false;
		}
	}
}
