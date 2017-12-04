import { Component, OnInit } from '@angular/core';
import 'fabric';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import { HttpService } from './../../http.service';
import { Canvas } from 'fabric';

declare let fabric; 


@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css'],
  providers: [HttpService]
})
export class CanvasComponent implements OnInit {

  getUser: String;
  postUser: String;
  public canvas;
  private mouseIsDown;
  private line;
  private drawingModeButton;
  private sprayBrushButton;
  private defaultBrush;
  private sprayBool;
  private lineBool; 
  private rectBool;
  private textBool;
  private circleBool;
  private triangleBool;  
  private rect;
  private circle;
  private triangle;
  private startX;
  private startY;
  private ellipseBool;
  private ellipse;
  private savedImage;
  private UNIVERSAL_COLOR;
  private colorPicker;
  private defaultColor;
  private DEFAULT_BRUSH_SIZE;
  private brushSizeEl;
  private textModeButton;
  private text;

  
  

  getCanvas() 
  {
    this.hideView();
    this.httpService.getCanvas().subscribe(
        data => this.savedImage = data.text(),
        error => alert(error),
        () =>
        {
          this.showView();
          // parse the response
          this.savedImage = this.savedImage.replace("\'" , "");
          this.savedImage = this.savedImage.slice(0, -1);
          // load the canvas
          this.canvas.loadFromJSON(this.savedImage);
        }
     );
  }

  postCanvas()
  { 
    this.hideView();
    this.savedImage = "'" + JSON.stringify(this.canvas) + "'";
    // post the canvas to backend
    this.httpService.postCanvas(this.savedImage).subscribe(
        data => this.savedImage = JSON.stringify(data),
        error => alert(error),
        () => 
        {
          this.showView();
          console.log('Finished');
        }
      );
  }


  public hideView(): void
  {
    document.getElementById('drawingModeButton').style.visibility='hidden';
    document.getElementById('brushSizeInput').style.visibility='hidden';
    document.getElementById('sprayModeButton').style.visibility='hidden';
    document.getElementById('lineToolButton').style.visibility='hidden';
    document.getElementById('rectToolButton').style.visibility='hidden';
    document.getElementById('ellipseToolButton').style.visibility='hidden';
    document.getElementById('circleToolButton').style.visibility='hidden';
    document.getElementById('triangleToolButton').style.visibility='hidden';
    document.getElementById('clearButton').style.visibility='hidden';
    document.getElementById('colorPicker').style.visibility='hidden';
    document.getElementById('grayscaleFilterButton').style.visibility='hidden';
    document.getElementById('inversionFilterButton').style.visibility='hidden';
    document.getElementById('brightnessFilterButton').style.visibility='hidden';
    document.getElementById('pixelateFilterButton').style.visibility='hidden';
    document.getElementById('textModeButton').style.visibility='hidden';
    document.getElementById('saveButton').style.visibility='hidden';
    document.getElementById('loadButton').style.visibility='hidden';
    document.getElementById('c').style.visibility='hidden';
    document.getElementById('loadingIcon').style.visibility='visible';
  }
  public showView(): void
  {
    document.getElementById('drawingModeButton').style.visibility='visible';
    document.getElementById('brushSizeInput').style.visibility='visible';
    document.getElementById('sprayModeButton').style.visibility='visible';
    document.getElementById('lineToolButton').style.visibility='visible';
    document.getElementById('rectToolButton').style.visibility='visible';
    document.getElementById('ellipseToolButton').style.visibility='visible';
    document.getElementById('circleToolButton').style.visibility='visible';
    document.getElementById('triangleToolButton').style.visibility='visible';
    document.getElementById('clearButton').style.visibility='visible';
    document.getElementById('colorPicker').style.visibility='visible';
    document.getElementById('grayscaleFilterButton').style.visibility='visible';
    document.getElementById('inversionFilterButton').style.visibility='visible';
    document.getElementById('brightnessFilterButton').style.visibility='visible';
    document.getElementById('pixelateFilterButton').style.visibility='visible';
    document.getElementById('textModeButton').style.visibility='visible';
    document.getElementById('saveButton').style.visibility='visible';
    document.getElementById('loadButton').style.visibility='visible';
    document.getElementById('c').style.visibility='visible';
    document.getElementById('loadingIcon').style.visibility='hidden';
    
   
  }

  public toggleDrawingMode(): void 
  {
    if(this.canvas.isDrawingMode)
	{
      this.drawingModeButton.innerHTML = "Drawing Mode: Off";
      this.canvas.isDrawingMode = false;
      if(this.sprayBool === true)
        this.toggleSprayBrush();
	}
    else
    {
      if(this.lineBool === true)
        this.toggleLineMode();
      if(this.rectBool === true)
        this.toggleRectMode();
      if(this.ellipseBool === true)
        this.toggleEllipseMode();
      if(this.textBool === true)
        this.toggleTextMode(this);
      if(this.circleBool === true)
        this.toggleCircleMode();
      if(this.triangleBool === true)
        this.toggleTriangleMode();

	  this.drawingModeButton.innerHTML = "Drawing Mode: On";
      this.canvas.isDrawingMode = true;
      this.canvas.freeDrawingBrush.color = "#"+this.UNIVERSAL_COLOR.toHex();
      
      //(G) have to add color to this and spray brush and brush size
	}
  }

  public toggleSprayBrush(): void 
  {
    if(this.sprayBool === false) //canvas.freeDrawingBrush === defaultBrush) //sprayBool === false
    {
      this.sprayBool = !this.sprayBool;
      this.sprayBrushButton.innerHTML = "Spray Mode: On";
  
      //if the line tool is on, turn it off.
      if(this.lineBool === true)
        this.toggleLineMode();
      if(this.rectBool === true)
        this.toggleRectMode();
      if(this.ellipseBool === true)
        this.toggleEllipseMode();
      if(this.textBool === true)
        this.toggleTextMode(this);
      if(this.circleBool === true)
        this.toggleCircleMode();
      if(this.triangleBool === true)
        this.toggleTriangleMode();

      this.canvas.freeDrawingBrush = new fabric.SprayBrush(this.canvas);
      this.canvas.freeDrawingBrush.color = "#"+this.UNIVERSAL_COLOR.toHex();
      this.canvas.freeDrawingBrush.density = 35; //28
      this.canvas.freeDrawingBrush.width = 20;
  
      if(!this.canvas.isDrawingMode)
        this.toggleDrawingMode();
    }
    else
    {
      this.sprayBool = !this.sprayBool;
      this.sprayBrushButton.innerHTML = "Spray Mode: Off";

      //turning off draw mode
      if(this.canvas.isDrawingMode)
        this.toggleDrawingMode();
  
      this.canvas.freeDrawingBrush = this.defaultBrush;
    }
  }
  
  public toggleTextMode(mycontext): void
  {
    var upperScopeThis = mycontext;

    if(this.textBool === false) //if it's not text mode...
    {
      //activate textMode
      this.textBool = true;
      //var ownCanvas = this.canvas;

      //turn off the other tools if they're on.
      if(this.canvas.isDrawingMode)
        this.toggleDrawingMode();
      if(this.lineBool === true)
        this.toggleLineMode();
      if(this.rectBool === true)
        this.toggleRectMode();
      if(this.ellipseBool === true)
        this.toggleEllipseMode();
      if(this.circleBool === true)
        this.toggleCircleMode();
      if(this.triangleBool === true)
        this.toggleTriangleMode();
      
      this.textModeButton.innerHTML = "Text Mode: On";
      this.turnOnTextMode(); //.bind(this); //(!)(*)
    }
    else //text mode is on
    {
      //turn it off.
      this.textBool = false;
      this.textModeButton.innerHTML = "Text Mode: Off";
      this.canvas.selection = true;
      //remove the event listener(s)
      this.canvas.off();
      this.text.exitEditing();
      this.canvas.discardActiveObject();
      this.canvas.renderAll();
    }
  } 
  
  public turnOnTextMode(): void
  {
    this.canvas.on("mouse:down", (options) =>
    {
      var coordinates = this.canvas.getPointer(options.e);
    
      this.text = new fabric.IText("", { left:coordinates.x, top:coordinates.y });
      this.canvas.selection = false;
      this.canvas.add(this.text);
      this.canvas.setActiveObject(this.text);
      //canvas.selectAll();
      this.text.enterEditing();
    });
  }
  
  public toggleLineMode(): void 
  {
    if(this.lineBool === false) //if lineMode is off
    {
      this.lineBool = true;
      //selection
      this.canvas.selection = false;
      document.getElementById("lineToolButton").innerHTML = "Line Tool: On";
      if(this.canvas.isDrawingMode)
        this.toggleDrawingMode();
      if(this.rectBool === true)
        this.toggleRectMode();
      if(this.ellipseBool === true)
        this.toggleEllipseMode();
      if(this.textBool === true)
        this.toggleTextMode(this);
      if(this.circleBool === true)
        this.toggleCircleMode();
      if(this.triangleBool === true)
        this.toggleTriangleMode();
      var myCanvas = this.canvas;

      //this.canvas.on("mouse:down", function(options)
      this.canvas.on("mouse:down", (options) =>
      {
        this.mouseIsDown = true;
        //get the location of the mousedown event
        var mouseDownLocation = myCanvas.getPointer(options.e);

        //create an array of points to initialize the line on mousedown: origin and terminal points will be the location clicked.
        var points = [ mouseDownLocation.x, mouseDownLocation.y, mouseDownLocation.x, mouseDownLocation.y ];
        
        this.line = new fabric.Line(points, 
        {
          stroke: "#"+this.UNIVERSAL_COLOR.toHex(),
          strokeWidth: "4",
          originX: "center",
          originY: "center"
        });
        this.line.set("selectable", true);
        myCanvas.add(this.line);
      });
      
      this.canvas.on("mouse:move", (options) =>
      {
        //mouse needs to have been down inside canvas, otherwise return
        if(!this.mouseIsDown)
          return;
        var mouseDownLocation = myCanvas.getPointer(options.e);
        this.line.set({x2:mouseDownLocation.x, y2:mouseDownLocation.y});
        
        myCanvas.renderAll();
      });
      
      this.canvas.on("mouse:up", (options) =>
      {
        this.mouseIsDown = false;
      });
    }
    else //if lineMode is on, turn off
    {
      //alert("Line is ON, will turn OFF");
      this.lineBool = false;
      document.getElementById("lineToolButton").innerHTML = "Line Tool: Off";
      this.canvas.selection = true;
      //(!) Problem w/ this function. Doesn't turn off the mouseup/down methods. 
      this.canvas.off();
    }
  }

  public toggleRectMode(): void 
  {
    if(this.rectBool === false) //if rectMode is off
    {
      this.rectBool = true;
      this.canvas.selection = false;
      document.getElementById("rectToolButton").innerHTML = "Rect Tool: On";
      if(this.canvas.isDrawingMode)
        this.toggleDrawingMode();
      if(this.lineBool === true)
        this.toggleLineMode();
      if(this.ellipseBool === true)
        this.toggleEllipseMode();
      if(this.textBool === true)
        this.toggleTextMode(this);
      if(this.circleBool === true)
        this.toggleCircleMode();
      if(this.triangleBool === true)
        this.toggleTriangleMode();
        
      var myCanvas = this.canvas;

      this.canvas.on("mouse:down", (options) =>
      {
        this.mouseIsDown = true;
        //get the location of the mousedown event
        var mouseDownLocation = myCanvas.getPointer(options.e);

        //create an array of points to initialize the line on mousedown: origin and terminal points will be the location clicked.
        this.startX = mouseDownLocation.x;
        this.startY = mouseDownLocation.y;
        this.rect = new fabric.Rect( 
        {
          left: mouseDownLocation.x,
          top: mouseDownLocation.y,
          fill: 'rgba(0,0,0,0)',
          width: 0,
          height: 0,
          stroke: "#"+this.UNIVERSAL_COLOR.toHex(),
          strokeWidth: 2,
          angle: 0
        });
        this.rect.set("selectable", true);
        myCanvas.add(this.rect);
      });
      
      this.canvas.on("mouse:move", (options) =>
      {
        //mouse needs to have been down inside canvas, otherwise return
        if(!this.mouseIsDown)
          return;
        
        var x, y, l, t;
        var mouseDownLocation = myCanvas.getPointer(options.e);
       
        x = Math.abs(mouseDownLocation.x - this.startX);
        y = Math.abs(mouseDownLocation.y - this.startY);
        
        l = Math.min(this.startX, mouseDownLocation.x);
        t = Math.min(this.startY, mouseDownLocation.y);

        this.rect.set({width:x, height:y, top:t, left:l});
        myCanvas.renderAll();
      });
      
      this.canvas.on("mouse:up", (options) =>
      {
        this.mouseIsDown = false;
      });
    }
    else //if rectMode is on, turn off
    {
      //alert("Rect is ON, will turn OFF");
      this.rectBool = false;
      document.getElementById("rectToolButton").innerHTML = "Rect Tool: Off";
      this.canvas.selection = true;
      //(!) Problem w/ this function. Doesn't turn off the mouseup/down methods. 
      this.canvas.off();
    }
  }

  public toggleEllipseMode(): void 
  {
    if(this.ellipseBool === false) //if ellipseMode is off
    {
      this.ellipseBool = true;
      this.canvas.selection = false;
      document.getElementById("ellipseToolButton").innerHTML = "Ellipse Tool: On";
      if(this.canvas.isDrawingMode)
        this.toggleDrawingMode();
      if(this.lineBool === true)
        this.toggleLineMode();
      if(this.rectBool === true)
        this.toggleRectMode();
      if(this.textBool === true)
        this.toggleTextMode(this);
      if(this.circleBool === true)
        this.toggleCircleMode();
      if(this.triangleBool === true)
        this.toggleTriangleMode();
        
      var myCanvas = this.canvas;

      this.canvas.on("mouse:down", (options) =>
      {
        this.mouseIsDown = true;
        //get the location of the mousedown event
        var mouseDownLocation = myCanvas.getPointer(options.e);

        this.startX = mouseDownLocation.x;
        this.startY = mouseDownLocation.y;
        this.ellipse = new fabric.Ellipse( 
        {
          left: mouseDownLocation.x,
          top: mouseDownLocation.y,
          fill: 'rgba(0,0,0,0)',
          rx: 0,
          ry: 0,
          originX: 'center',
          originY: 'center',
          stroke: "#"+this.UNIVERSAL_COLOR.toHex(),
          strokeWidth: 2,
        });
        this.ellipse.set("selectable", true);
        myCanvas.add(this.ellipse);
      });
      
      this.canvas.on("mouse:move", (options) =>
      {
        //mouse needs to have been down inside canvas, otherwise return
        if(!this.mouseIsDown)
          return;
        
        var x, y, l, t;
        var mouseDownLocation = myCanvas.getPointer(options.e);
       
        this.ellipse.set({ rx: Math.abs(this.startX - mouseDownLocation.x),ry:Math.abs(this.startY - mouseDownLocation.y) });
        myCanvas.renderAll();
      });
      
      this.canvas.on("mouse:up", (options) =>
      {
        this.mouseIsDown = false;
      });
    }
    else //if ellipseMode is on, turn off
    {
      //alert("Ellipse is ON, will turn OFF");
      this.ellipseBool = false;
      document.getElementById("ellipseToolButton").innerHTML = "Ellipse Tool: Off";
      this.canvas.selection = true;
      //(!) Problem w/ this function. Doesn't turn off the mouseup/down methods. 
      this.canvas.off();
    }
  }
  
  public toggleTriangleMode(): void 
  {
    if(this.triangleBool === false) //if triangleMode is off
    {
      this.triangleBool = true;
      this.canvas.selection = false;
      document.getElementById("triangleToolButton").innerHTML = "Triangle Tool: On";
      if(this.canvas.isDrawingMode)
        this.toggleDrawingMode();
      if(this.lineBool === true)
        this.toggleLineMode();
      if(this.ellipseBool === true)
        this.toggleEllipseMode();
      if(this.textBool === true)
        this.toggleTextMode(this);
      if(this.circleBool === true)
        this.toggleCircleMode();
      if(this.rectBool === true)
        this.toggleRectMode();
        
      var myCanvas = this.canvas;

      this.canvas.on("mouse:down", (options) =>
      {
        this.mouseIsDown = true;
        //get the location of the mousedown event
        var mouseDownLocation = myCanvas.getPointer(options.e);

        //create an array of points to initialize the line on mousedown: origin and terminal points will be the location clicked.
        this.startX = mouseDownLocation.x;
        this.startY = mouseDownLocation.y;
        this.triangle = new fabric.Triangle( 
        {
          left: mouseDownLocation.x,
          top: mouseDownLocation.y,
          fill: 'rgba(0,0,0,0)',
          width: 1,
          height: 1,
          stroke: "#"+this.UNIVERSAL_COLOR.toHex(),
          strokeWidth: 2
        });
        this.triangle.set("selectable", true);
        myCanvas.add(this.triangle);
      });
      
      this.canvas.on("mouse:move", (options) =>
      {
        //mouse needs to have been down inside canvas, otherwise return
        if(!this.mouseIsDown)
          return;
        
        var x, y, l, t;
        var mouseDownLocation = myCanvas.getPointer(options.e);
       
        x = Math.abs(mouseDownLocation.x - this.startX);
        y = Math.abs(mouseDownLocation.y - this.startY);
        
        l = Math.min(this.startX, mouseDownLocation.x);
        t = Math.min(this.startY, mouseDownLocation.y);

        this.triangle.set({width:x, height:y, top:t, left:l});
        myCanvas.renderAll();
      });
      
      this.canvas.on("mouse:up", (options) =>
      {
        this.mouseIsDown = false;
      });
    }
    else //if triangleMode is on, turn off
    {
      //alert("Triangle is ON, will turn OFF");
      this.triangleBool = false;
      document.getElementById("triangleToolButton").innerHTML = "Triangle Tool: Off";
      this.canvas.selection = true;
      //(!) Problem w/ this function. Doesn't turn off the mouseup/down methods. 
      this.canvas.off();
    }
  }

  public toggleCircleMode(): void 
  {
    if(this.circleBool === false) //if circleMode is off
    {
      this.circleBool = true;
      this.canvas.selection = false;
      document.getElementById("circleToolButton").innerHTML = "Circle Tool: On";
      if(this.canvas.isDrawingMode)
        this.toggleDrawingMode();
      if(this.lineBool === true)
        this.toggleLineMode();
      if(this.rectBool === true)
        this.toggleRectMode();
      if(this.textBool === true)
        this.toggleTextMode(this);
      if(this.ellipseBool === true)
        this.toggleEllipseMode();
      if(this.triangleBool === true)
        this.toggleTriangleMode();
        
      var myCanvas = this.canvas;

      this.canvas.on("mouse:down", (options) =>
      {
        this.mouseIsDown = true;
        //get the location of the mousedown event
        var mouseDownLocation = myCanvas.getPointer(options.e);

        this.startX = mouseDownLocation.x;
        this.startY = mouseDownLocation.y;
        this.circle = new fabric.Circle( 
        {
          left: mouseDownLocation.x,
          top: mouseDownLocation.y,
          fill: 'rgba(0,0,0,0)',
          radius: 0,
          stroke: "#"+this.UNIVERSAL_COLOR.toHex(),
          strokeWidth: 2,
        });
        this.circle.set("selectable", true);
        myCanvas.add(this.circle);
      });
      
      this.canvas.on("mouse:move", (options) =>
      {
        //mouse needs to have been down inside canvas, otherwise return
        if(!this.mouseIsDown)
          return;
        
        var mouseDownLocation = myCanvas.getPointer(options.e);
        var x, y;
        x = Math.min(this.startX, mouseDownLocation.x);
        y = Math.min(this.startY, mouseDownLocation.y);

        this.circle.set({left:x, top:y, radius: Math.max(Math.abs(this.startX - mouseDownLocation.x), Math.abs(this.startY - mouseDownLocation.y)) / 2 });
        myCanvas.renderAll();
      });
      
      this.canvas.on("mouse:up", (options) =>
      {
        this.mouseIsDown = false;
      });
    }
    else //if circleMode is on, turn off
    {
      //alert("Circle is ON, will turn OFF");
      this.circleBool = false;
      document.getElementById("circleToolButton").innerHTML = "Circle Tool: Off";
      this.canvas.selection = true;
      //(!) Problem w/ this function. Doesn't turn off the mouseup/down methods. 
      this.canvas.off();
    }
  }

    // OCCASIONALLY, 
  // artifacts are left over on the edges of objects after filtering.
  // This is due to inherent inaccuracy within the fabricJS drawing mode.

  public grayscaleFilter(): void
  {
	var canvas = this.canvas;
	var url = canvas.toDataURL();
	
	var img = new Image();
	img.src = url;
	fabric.Image.fromURL(img.src, function(img)
	{
		img.filters.push(new fabric.Image.filters.Grayscale());
		img.applyFilters(canvas.renderAll.bind(canvas));
		
		img.width = canvas.width;
		img.height = canvas.height;
		canvas.add(img);
		canvas.bringToFront(img);
		canvas.deactivateAll();
		canvas.renderAll();
		canvas.forEachObject(function(object){
			object.selectable = false;
		});
	});
	
	
  }

  public inversionFilter(): void
  {
    var canvas = this.canvas;
	var url = canvas.toDataURL();
	
	var img = new Image();
	img.src = url;
	fabric.Image.fromURL(img.src, function(img)
	{
		img.filters.push(new fabric.Image.filters.Invert());
		img.applyFilters(canvas.renderAll.bind(canvas));
		
		img.width = canvas.width;
		img.height = canvas.height;
		canvas.add(img);
		canvas.bringToFront(img);
		canvas.deactivateAll();
		canvas.renderAll();
		canvas.forEachObject(function(object){
			object.selectable = false;
		});
	});
  }
  
  
  
  public brightnessFilter(): void
  {
    var canvas = this.canvas;
	var url = canvas.toDataURL();
	
	var img = new Image();
	img.src = url;
	fabric.Image.fromURL(img.src, function(img)
	{
		img.filters.push(new fabric.Image.filters.Brightness({brightness: 200}));
		img.applyFilters(canvas.renderAll.bind(canvas));
		
		img.width = canvas.width;
		img.height = canvas.height;
		canvas.add(img);
		canvas.bringToFront(img);
		canvas.deactivateAll();
		canvas.renderAll();
		canvas.forEachObject(function(object){
			object.selectable = false;
		});
	});
  }
  
  public pixelateFilter(): void
  {
    var canvas = this.canvas;
	var url = canvas.toDataURL();
	
	var img = new Image();
	img.src = url;
	fabric.Image.fromURL(img.src, function(img)
	{
		img.filters.push(new fabric.Image.filters.Pixelate({blocksize: 8}));
		img.applyFilters(canvas.renderAll.bind(canvas));
		
		img.width = canvas.width;
		img.height = canvas.height;
		canvas.add(img);
		canvas.bringToFront(img);
		canvas.deactivateAll();
		canvas.renderAll();
		canvas.forEachObject(function(object){
			object.selectable = false;
		});
	});
  }

  public clearCanvas(): void 
  {
    //assuming the canvas context is not changed.
	  this.canvas.clear();
  }
  

/*
  public setupColorPicker(): void
  {
     this.colorPicker = document.querySelector("#colorPicker"); //(*)(!)
     this.colorPicker.value = "#"+this.UNIVERSAL_COLOR.toHex();//this.defaultColor;
     this.colorPicker.addEventListener("input", this.colorIsChanging, false);
    //vv in case the default color picker of the system is text input.
     //colorPicker.select();
  }
  
  public setupBrushSize(): void
  {
    this.brushSizeEl.addEventListener("input", function()
	  {
		  this.canvas.freeDrawingBrush.width = parseInt(this.value, 10) || this.DEFAULT_BRUSH_SIZE;
		  //this.previousSibling.innerHTML = this.value;
	  }, false);
  }
*/

  constructor(private httpService: HttpService) { }

  ngOnInit() {
    document.getElementById('loadingIcon').style.visibility='hidden';

    this.canvas = new fabric.Canvas("c");
    //canvas.isDrawingMode = true;
    this.drawingModeButton = document.getElementById("drawingModeButton");
    this.sprayBrushButton = fabric.document.getElementById("sprayModeButton");
    this.textModeButton = document.getElementById("textModeButton");
    this.brushSizeEl = fabric.document.getElementById("brushSizeInput");
    this.defaultBrush = this.canvas.freeDrawingBrush;

    this.toggleDrawingMode.bind(this);
    var toggleTextMode = this.toggleTextMode.bind(this);
    //this.toggleLineMode.bind(this.canvas);
    //default starting color is green.
    this.UNIVERSAL_COLOR  = new fabric.Color("#00cc00");
    this.DEFAULT_BRUSH_SIZE = 1;
    //set up the color picker.
    this.colorPicker = document.querySelector("#colorPicker"); //(*)(!)
    this.colorPicker.value = "#"+this.UNIVERSAL_COLOR.toHex();//this.defaultColor;
    this.colorPicker.addEventListener("input",   (event)=>
    {
      var myCanvas = this.canvas;
      this.UNIVERSAL_COLOR = new fabric.Color(event.target.value);
      myCanvas.freeDrawingBrush.color = event.target.value; 
      //line.set("stroke", "#"+UNIVERSAL_COLOR.toHex());
      //rect.set("stroke", "#"+UNIVERSAL_COLOR.toHex());
      //ellipse.set("stroke", "#"+UNIVERSAL_COLOR.toHex());
    }, false);
    //setup the brush size.
    this.brushSizeEl.addEventListener("input", ()=>
	  {
		  this.canvas.freeDrawingBrush.width = parseInt(this.brushSizeEl.value, 10) || this.DEFAULT_BRUSH_SIZE;
		  //this.previousSibling.innerHTML = this.value;
	  }, false);
    
    this.brushSizeEl.addEventListener("change", ()=>
	  {
		  this.canvas.freeDrawingBrush.width = parseInt(this.brushSizeEl.value, 10) || this.DEFAULT_BRUSH_SIZE;
		  //this.previousSibling.innerHTML = this.value;
	  }, false);

    this.sprayBool = false; 
    this.lineBool = false;
    this.rectBool = false;
    this.ellipseBool = false;
    this.circleBool = false;
    this.triangleBool = false;
    this.textBool = false;
    this.canvas.freeDrawingBrush.color = "#"+this.UNIVERSAL_COLOR.toHex();
  }
}
