// Aliases
var Application = PIXI.Application
var Graphics = PIXI.Graphics
var Container = PIXI.Container

const app = new Application({
	width: 800,
	height: 600,
	antialias: true,
	transparent: false,
	resolution: 1,
	backgroundColor: 0xffffff,
});
var appHeight = app.renderer.view.height
var appWidth = app.renderer.view.width

document.getElementById("app-container").appendChild(app.view)

function createGrid(lineStyle, width, height, hLines, vLines) {
	let grid = new Container()
	let hGap = width / (hLines + 1)
	let vGap = height / (vLines + 1)

	let hLinePos = hGap
	for (let i = 0; i < hLines; i++) {
		let line = new Graphics();
		line.lineStyle(...lineStyle)
		line.moveTo(0, 0)
		line.lineTo(0, height)
		line.position.set(hLinePos, 0)
		grid.addChild(line)
		hLinePos += hGap;
	}
	let vLinePos = vGap
	for (let i = 0; i < vLines; i++) {
		let line = new Graphics();
		line.lineStyle(...lineStyle)
		line.moveTo(0, 0)
		line.lineTo(width, 0)
		line.position.set(0, vLinePos)
		grid.addChild(line)
		vLinePos += vGap;
	}

	return grid
}

let lineStyle = [2, 0x0, 0.07]
var horizontalLines = 20
var verticalLines = appHeight / (appWidth/horizontalLines) // for squares
var grid = createGrid(lineStyle, appWidth, appHeight, horizontalLines, verticalLines)

app.stage.addChild(grid)