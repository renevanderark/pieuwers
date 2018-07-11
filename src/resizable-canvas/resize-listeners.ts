export default (canvases : Array<HTMLCanvasElement>, ...listeners : Array<(scale : number) => void>) => {
	function rescaleGame(scale : number, width : number, height : number) {
		canvases.forEach(canvas => {
			canvas.style.left = `${Math.floor((window.innerWidth - width) / 2)}px`;
			canvas.style.top = `${Math.floor((window.innerHeight - height) / 2)}px`;
			canvas.width = width;
			canvas.height = height;
		});
	}

	return [rescaleGame].concat(listeners);
};
