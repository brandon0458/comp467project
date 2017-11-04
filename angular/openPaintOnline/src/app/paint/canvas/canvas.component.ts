import { Component, OnInit } from '@angular/core';
import 'fabric';

declare let fabric; 


@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements OnInit {

  public canvas;
  private mouseIsDown;
  private line;
  private drawingModeButton;
  private sprayBrushButton;
  private defaultBrush;
  private sprayBool;
  private lineBool;
  private rectBool;
  private rect;
  private startX;
  private startY;
  private ellipseBool;
  private ellipse;

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

		  this.drawingModeButton.innerHTML = "Drawing Mode: On";
		  this.canvas.isDrawingMode = true;
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

      this.canvas.freeDrawingBrush = new fabric.SprayBrush(this.canvas);
      this.canvas.freeDrawingBrush.color = "rgb(150, 25, 20)";
      this.canvas.freeDrawingBrush.density = 28;
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


  public toggleLineMode(): void 
  {
    if(this.lineBool === false) //if lineMode is off
    {
      this.lineBool = true;
      this.canvas.selection = false;
      document.getElementById("lineToolButton").innerHTML = "Line Tool: On";
      if(this.canvas.isDrawingMode)
        this.toggleDrawingMode();
      if(this.rectBool === true)
        this.toggleRectMode();
      if(this.ellipseBool === true)
       this.toggleEllipseMode();
      var myCanvas = this.canvas;

      this.canvas.on("mouse:down", function(options)
      {
        this.mouseIsDown = true;
        //get the location of the mousedown event
        var mouseDownLocation = myCanvas.getPointer(options.e);

        //create an array of points to initialize the line on mousedown: origin and terminal points will be the location clicked.
        var points = [ mouseDownLocation.x, mouseDownLocation.y, mouseDownLocation.x, mouseDownLocation.y ];
        
        this.line = new fabric.Line(points, 
        {
          stroke: "rgb(0, 20, 250)",
          strokeWidth: "4",
          originX: "center",
          originY: "center"
        });
        this.line.set("selectable", true);
        myCanvas.add(this.line);
      });
      
      this.canvas.on("mouse:move", function(options)
      {
        //mouse needs to have been down inside canvas, otherwise return
        if(!this.mouseIsDown)
          return;
        var mouseDownLocation = myCanvas.getPointer(options.e);
        this.line.set({x2:mouseDownLocation.x, y2:mouseDownLocation.y});
        
        myCanvas.renderAll();
      });
      
      this.canvas.on("mouse:up", function(options)
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
        
      var myCanvas = this.canvas;

      this.canvas.on("mouse:down", function(options)
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
          stroke: '#666',
          strokeWidth: 2,
          angle: 0
        });
        this.rect.set("selectable", true);
        myCanvas.add(this.rect);
      });
      
      this.canvas.on("mouse:move", function(options)
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
      
      this.canvas.on("mouse:up", function(options)
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
        
      var myCanvas = this.canvas;

      this.canvas.on("mouse:down", function(options)
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
          stroke: '#666',
          strokeWidth: 2,
        });
        this.ellipse.set("selectable", true);
        myCanvas.add(this.ellipse);
      });
      
      this.canvas.on("mouse:move", function(options)
      {
        //mouse needs to have been down inside canvas, otherwise return
        if(!this.mouseIsDown)
          return;
        
        var x, y, l, t;
        var mouseDownLocation = myCanvas.getPointer(options.e);
       
        this.ellipse.set({ rx: Math.abs(this.startX - mouseDownLocation.x),ry:Math.abs(this.startY - mouseDownLocation.y) });
        myCanvas.renderAll();
      });
      
      this.canvas.on("mouse:up", function(options)
      {
        this.mouseIsDown = false;
      });
    }
    else //if ellipseMode is on, turn off
    {
      //alert("Rect is ON, will turn OFF");
      this.ellipseBool = false;
      document.getElementById("ellipseToolButton").innerHTML = "Ellipse Tool: Off";
      this.canvas.selection = true;
      //(!) Problem w/ this function. Doesn't turn off the mouseup/down methods. 
      this.canvas.off();
    }
  }

  public clearCanvas(): void 
  {
    //assuming the canvas context is not changed.
	  this.canvas.clear();
  }

  constructor() { }

  ngOnInit() {


    this.canvas = new fabric.Canvas("c");
    //canvas.isDrawingMode = true;
    this.drawingModeButton = document.getElementById("drawingModeButton");
    this.sprayBrushButton = fabric.document.getElementById("sprayModeButton");
    this.defaultBrush = this.canvas.freeDrawingBrush;
   
    this.sprayBool = false; 
    this.lineBool = false;
    this.rectBool = false;
    this.ellipseBool = false;
    this.canvas.freeDrawingBrush.color = "rgb(0, 200, 100)";
  }
}