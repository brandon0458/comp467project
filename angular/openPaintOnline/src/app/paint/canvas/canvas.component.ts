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


  public toggleDrawingMode(): void 
  {

    if(this.lineBool === true)
		this.toggleLineMode();
	
	  if(this.canvas.isDrawingMode)
	  {
		  this.drawingModeButton.innerHTML = "Drawing Mode: Off";
		  this.canvas.isDrawingMode = false;
	  }
	  else
	  {
		  this.drawingModeButton.innerHTML = "Drawing Mode: On";
		  this.canvas.isDrawingMode = true;
	  }
  }

  public toggleSprayBrush(): void 
  {
    //if the line tool is on, turn it off.
	  if(this.lineBool === true)
    this.toggleLineMode();
    //
    if(this.sprayBool === false) //canvas.freeDrawingBrush === defaultBrush) //sprayBool === false
    {
      this.sprayBool = !this.sprayBool;
      this.sprayBrushButton.innerHTML = "Spray Mode: On";
  
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
      if(this.canvas.isDrawingMode) this.toggleDrawingMode();
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
    this.canvas.freeDrawingBrush.color = "rgb(0, 200, 100)";
  }
}