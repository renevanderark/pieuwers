export interface Drawable {
    updated: () => boolean;
    clear: (ctx : CanvasRenderingContext2D, scale : number) => void;
    draw: (ctx : CanvasRenderingContext2D, scale : number) => void;
}
