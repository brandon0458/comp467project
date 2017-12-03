import { Component, OnInit } from '@angular/core';
import 'fabric';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import { HttpService } from './../../http.service';

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
  private rect;
  private startX;
  private startY;
  private ellipseBool;
  private ellipse;
  private savedImage;
  private UNIVERSAL_COLOR;
  private colorPicker;
  private defaultColor;
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
    document.getElementById('sprayModeButton').style.visibility='hidden';
    document.getElementById('lineToolButton').style.visibility='hidden';
    document.getElementById('rectToolButton').style.visibility='hidden';
    document.getElementById('ellipseToolButton').style.visibility='hidden';
    document.getElementById('clearButton').style.visibility='hidden';
    document.getElementById('grayscaleFilterButton').style.visibility='hidden';
    document.getElementById('inversionFilterButton').style.visibility='hidden';
    document.getElementById('brightnessFilterButton').style.visibility='hidden';
    document.getElementById('pixelateFilterButton').style.visibility='hidden';
    document.getElementById('saveButton').style.visibility='hidden';
    document.getElementById('loadButton').style.visibility='hidden';
    document.getElementById('c').style.visibility='hidden';
    document.getElementById('loadingIcon').style.visibility='visible';
  }
  public showView(): void
  {
    document.getElementById('drawingModeButton').style.visibility='visible';
    document.getElementById('sprayModeButton').style.visibility='visible';
    document.getElementById('lineToolButton').style.visibility='visible';
    document.getElementById('rectToolButton').style.visibility='visible';
    document.getElementById('ellipseToolButton').style.visibility='visible';
    document.getElementById('clearButton').style.visibility='visible';
    document.getElementById('grayscaleFilterButton').style.visibility='visible';
    document.getElementById('inversionFilterButton').style.visibility='visible';
    document.getElementById('brightnessFilterButton').style.visibility='visible';
    document.getElementById('pixelateFilterButton').style.visibility='visible';
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
        this.toggleTextMode();

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
       if(this.textBool === true)
         this.toggleTextMode();

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
  
  public toggleTextMode(): void
  {
    if(!textBool) //if it's not text mode...
    {
      //activate textMode
      textBool = true;
      textModeButton.innerHTML = "Text Mode: On";
      turnOnTextMode();
    }
    else //text mode is on
    {
      //turn it off.
      textBool = false;
      textModeButton.innerHTML = "Text Mode: Off";
      canvas.selection = true;
      //remove the event listener(s)
      canvas.off();
      text.exitEditing();
      canvas.discardActiveObject();
      canvas.requestRenderAll();
    }
    
  }
  
  public turnOnTextMode(): void
  {
    canvas.on("mouse:down", function(options)
    {
      var coordinates = canvas.getPointer(options.e);
    
      text = new fabric.IText("", { left:coordinates.x, top:coordinates.y });
      canvas.selection = false;
      canvas.add(text);
      canvas.setActiveObject(text);
      //canvas.selectAll();
      text.enterEditing();
    });
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
      if(this.textBool === true)
       this.toggleTextMode();
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
          stroke: "#"+UNIVERSAL_COLOR.toHex(),
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
      if(this.textBool === true)
        this.toggleTextMode();
        
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
          stroke: "#"+UNIVERSAL_COLOR.toHex(),
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
      if(this.textBool === true)
        this.toggleTextMode();      
        
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
          stroke: "#"+UNIVERSAL_COLOR.toHex(),
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
  
  function colorIsChanging(event)
  {
    this.UNIVERSAL_COLOR = new fabric.Color(event.target.value);
    canvas.freeDrawingBrush.color = event.target.value;
    //line.set("stroke", "#"+UNIVERSAL_COLOR.toHex());
    //rect.set("stroke", "#"+UNIVERSAL_COLOR.toHex());
    //ellipse.set("stroke", "#"+UNIVERSAL_COLOR.toHex());
  }

  public setupColorPicker(): void
  {
     colorPicker = document.querySelector("#colorPicker");
     colorPicker.value = defaultColor;
     colorPicker.addEventListener("input", colorIsChanging, false);
    //vv in case the default color picker of the system is text input.
     colorPicker.select();
  }

  constructor(private httpService: HttpService) { }

  ngOnInit() {
    document.getElementById('loadingIcon').style.visibility='hidden';

    this.canvas = new fabric.Canvas("c");
    //canvas.isDrawingMode = true;
    this.drawingModeButton = document.getElementById("drawingModeButton");
    this.sprayBrushButton = fabric.document.getElementById("sprayModeButton");
    this.textModeButton = fabric.document.getElementById("textModeButton");
    this.defaultBrush = this.canvas.freeDrawingBrush;
    //default starting color is green.
    this.UNIVERSAL_COLOR  = new fabric.Color("#00cc00");
    this.defaultColor = "#"+UNIVERSAL_COLOR.toHex();
    //set up the color picker.
    window.addEventListener("load", this.setupColorPicker, false);
    
   
    this.sprayBool = false; 
    this.lineBool = false;
    this.rectBool = false;
    this.ellipseBool = false;
    this.textBool = false;
    this.canvas.freeDrawingBrush.color = "#"+this.UNIVERSAL_COLOR.toHex();
  }
}
