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

function createPoint(x, y, onPositionChanged) {	
	let circle = new Graphics()
	circle.lineStyle(2, 0x3300ff, .6);
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
			onPositionChanged(newPosition)
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

// cp1x - The x-axis coordinate of the first control point.
// cp2x - The x-axis coordinate of the second control point.
// x - The x-axis coordinate of the end point.
function createBezie(x1, y1, cp1x, cp1y, cp2x, cp2y, x2, y2) {
	let container = new Container()

	let curve = new Graphics();
	curve.lineStyle(4, 0x00FFFF, 1)
	let startLine = new Graphics();
	startLine.lineStyle(2, 0x33aa33, 0.3);
	let endLine = new Graphics();
	endLine.lineStyle(2, 0x33aa33, 0.3);

	// Save initial curve props for future updates 
	let saved = {
		x1, y1, cp1x, cp1y, cp2x, cp2y, x2, y2
	}
	
	updateCurve(saved)
	updateStartLine(saved)
	updateEndLine(saved)

	let startPoint = createPoint(x1, y1, newPosition => {
		saved.x1 = newPosition.x
		saved.y1 = newPosition.y
		updateCurve(saved)
		updateStartLine(saved)
	})
	let startControlPoint = createPoint(cp1x, cp1y, newPosition => {
		saved.cp1x = newPosition.x
		saved.cp1y = newPosition.y
		updateCurve(saved)
		updateStartLine(saved)
	})
	let endControlPoint = createPoint(cp2x, cp2y, newPosition => {
		saved.cp2x = newPosition.x
		saved.cp2y = newPosition.y
		updateCurve(saved)
		updateEndLine(saved)
	})
	let endPoint = createPoint(x2, y2, newPosition => {
		saved.x2 = newPosition.x
		saved.y2 = newPosition.y
		updateCurve(saved)
		updateEndLine(saved)
		console.log(saved)
	})

	function updateStartLine(props) {
		startLine.clear()
		startLine.moveTo(props.x1, props.y1);
		startLine.lineTo(props.cp1x, props.cp1y);
	}
	function updateEndLine(props) {
		endLine.clear()
		endLine.moveTo(props.x2, props.y2);
		endLine.lineTo(props.cp2x, props.cp2y);
	}
	function updateCurve(props) {
		curve.clear()
		curve.moveTo(props.x1,props.y1)
		curve.bezierCurveTo(props.cp1x, props.cp1y, props.cp2x, props.cp2y, props.x2, props.y2);
	}

	container.addChild(startLine)
	container.addChild(endLine)
	container.addChild(curve)
	container.addChild(startControlPoint)
	container.addChild(endControlPoint)
	container.addChild(startPoint)
	container.addChild(endPoint)
	

	return container
}

// Square grid
let lineStyle = [2, 0x0, 0.07]
var horizontalLines = 20
var verticalLines = appHeight / (appWidth/horizontalLines) // formula for squares
var grid = createGrid(lineStyle, appWidth, appHeight, horizontalLines, verticalLines)

app.stage.addChild(grid)

var bezie = createBezie(400, 75,  193,210,  656,330,  318, 512)

app.stage.addChild(bezie)

