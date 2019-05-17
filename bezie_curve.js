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

function createPoint(x, y) {	
	let circle = new Graphics()
	circle.lineStyle(2, 0xFF3300, 1);
	circle.beginFill(0xffffff, 1);
	circle.drawCircle(0,0,5)
	circle.endFill();
	circle.x = x;
	circle.y = y;
	circle.interactive = true;
	circle.buttonMode = true;
	circle
		.on('pointerdown', onDragStart)
		.on('pointerup', onDragEnd)
		.on('pointerupoutside', onDragEnd)
		.on('pointermove', onDragMove);
	function onDragStart(event) {
		// store a reference to the data
		// the reason for this is because of multitouch
		// we want to track the movement of this particular touch
		this.data = event.data;
		this.alpha = 0.5;
		this.dragging = true;
	}
	function onDragMove() {
		if (this.dragging) {
			const newPosition = this.data.getLocalPosition(this.parent);
			this.x = newPosition.x;
			this.y = newPosition.y;
		}
	}
	function onDragEnd() {
		this.alpha = 1;
		this.dragging = false;
		// set the interaction data to null
		this.data = null;
	}

	return circle
}

// Square grid
let lineStyle = [2, 0x0, 0.07]
var horizontalLines = 20
var verticalLines = appHeight / (appWidth/horizontalLines) // formula for squares
var grid = createGrid(lineStyle, appWidth, appHeight, horizontalLines, verticalLines)

app.stage.addChild(grid)
app.stage.addChild(createPoint(100,100))

