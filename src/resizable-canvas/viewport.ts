export default function(vWidth : number, vHeight : number, listeners : Array<(scale : number, width : number, height : number) => any>) {
	const aspectRatio = vHeight / vWidth;

	function invokeListeners(width : number, height : number, scale : number) {
		listeners.forEach(listener =>	listener(scale, width, height));
	}

	function onResize() {
		const { innerWidth, innerHeight } = window;
		if (innerWidth * aspectRatio > innerHeight) {
			invokeListeners(Math.floor(innerHeight / aspectRatio), innerHeight, (innerHeight / aspectRatio) / vWidth)
		} else {
			invokeListeners(innerWidth, Math.floor(innerWidth * aspectRatio), innerWidth / vWidth)
		}
	}

	onResize();
	window.addEventListener("resize", onResize);
}
