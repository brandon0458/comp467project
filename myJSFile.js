var canvas = new fabric.Canvas("c");

//canvas.isDrawingMode = true;

var mouseIsDown, line;





//add on mouse move here	

//var canvasContext = document.getElementById("c").getContext("2d");


var drawingModeButton = document.getElementById("drawingModeButton");
var sprayBrushButton = fabric.document.getElementById("sprayModeButton");

var defaultBrush = canvas.freeDrawingBrush;

var sprayBool, lineBool;
sprayBool = false; 
lineBool = false;

canvas.freeDrawingBrush.color = "rgb(0, 200, 100)";


//****PENCIL TOOL (DRAWING MODE)****//
function toggleDrawingMode()
{
	if(lineBool === true)
		toggleLineMode();
	
	if(canvas.isDrawingMode)
	{
		drawingModeButton.innerHTML = "Drawing Mode: Off";
		canvas.isDrawingMode = false;
	}
	else
	{
		drawingModeButton.innerHTML = "Drawing Mode: On";
		canvas.isDrawingMode = true;
	}
}

//****SPRAY BRUSH****//
function toggleSprayBrush()
{
	//if the line tool is on, turn it off.
	if(lineBool === true)
		toggleLineMode();
	//
	if(sprayBool === false) //canvas.freeDrawingBrush === defaultBrush) //sprayBool === false
	{
		sprayBool = !sprayBool;
		sprayBrushButton.innerHTML = "Spray Mode: On";
		
		canvas.freeDrawingBrush = new fabric.SprayBrush(canvas);
		canvas.freeDrawingBrush.color = "rgb(150, 25, 20)";
		canvas.freeDrawingBrush.density = 28;
		canvas.freeDrawingBrush.width = 20;
		
		if(!canvas.isDrawingMode)
			toggleDrawingMode();
	}
	else
	{
		sprayBool = !sprayBool;
		sprayBrushButton.innerHTML = "Spray Mode: Off";
		
		canvas.freeDrawingBrush = defaultBrush;
	}
	
}

//****LINE TOOL****//
function toggleLineMode()
{
	if(lineBool === false) //if lineMode is off
	{
		lineBool = true;
		
		canvas.selection = false;
		
		document.getElementById("lineToolButton").innerHTML = "Line Tool: On";
		
		if(canvas.isDrawingMode) toggleDrawingMode();
		
		canvas.on("mouse:down", function(options)
		{
			mouseIsDown = true;
			//get the location of the mousedown event
			var mouseDownLocation = canvas.getPointer(options.e);
			//create an array of points to initialize the line on mousedown: origin and terminal points will be the location clicked.
			var points = [ mouseDownLocation.x, mouseDownLocation.y, mouseDownLocation.x, mouseDownLocation.y ];
			
			line = new fabric.Line(points, 
			{
				stroke: "rgb(0, 20, 250)",
				strokeWidth: "4",
				originX: "center",
				originY: "center"
			});
			line.set("selectable", true);
			canvas.add(line);
		});
		
		canvas.on("mouse:move", function(options)
		{
			//mouse needs to have been down inside canvas, otherwise return
			if(!mouseIsDown)
				return;
			var mouseDownLocation = canvas.getPointer(options.e);
			line.set({x2:mouseDownLocation.x, y2:mouseDownLocation.y});
			
			canvas.renderAll();
		});
		
		canvas.on("mouse:up", function(options)
		{
			mouseIsDown = false;
		});
	}
	else //if lineMode is on, turn off
	{
		//alert("Line is ON, will turn OFF");

		lineBool = false;
		
		document.getElementById("lineToolButton").innerHTML = "Line Tool: Off";
		
		canvas.selection = true;
		
		//(!) Problem w/ this function. Doesn't turn off the mouseup/down methods. 
		canvas.off();
		
	}
}

//****CLEAR CANVAS****//
function clearCanvas()
{
	//assuming the canvas context is not changed.
	canvas.clear();
}
