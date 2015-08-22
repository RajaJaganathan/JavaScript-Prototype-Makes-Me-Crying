function Point(x,y){
	this.x = x;
	this.y = y;	
}

function Shape(elem, points){
	this.lines = [];
	this.points = points || [];
	this.elem = elem;
	this.init();
}

Shape.prototype = {
	constructor:Shape,
	init:function(){
		this.context = this.context || document.getElementById(this.elem).getContext('2d');		
	},
	draw:function(){
		var ctx = this.context;
		ctx.fillStyle = 'green';
		ctx.beginPath();

		ctx.moveTo(this.points[0].x,this.points[0].y);
		for (var idx = 1; idx < this.points.length; idx++) {			
			ctx.lineTo(this.points[idx].x,this.points[idx].y);ctx.fill();
		}

		ctx.stroke();
		ctx.closePath();
	}
};

function extend(Child, Parent){
	Child.prototype = Object.create(Parent.prototype);
	Child.prototype.constructor = Child;
}

function Square(elem, points){
	Shape.apply(this, arguments);	
}

extend(Square,Shape);
// Square.prototype = Object.create(Shape.prototype);
// Square.prototype.constructor = Square;


function Rectangle(elem, points){
	Square.apply(this, arguments);	//Note here Square instead of Shape
}

function Triangle(elem, points){
	Shape.apply(this, arguments);
}

extend(Triangle,Shape);
// Triangle.prototype = Object.create(Shape.prototype);
// Triangle.prototype.constructor = Triangle;

function Circle(elem, points){
	Shape.apply(this, arguments);	
	this.points = points;
}

extend(Circle,Shape);
// Circle.prototype = Object.create(Shape.prototype);
// Circle.prototype.constructor = Circle;
Circle.prototype.draw = function(){
	var ctx = this.context;	
	ctx.beginPath();
	ctx.fillStyle = 'red';
	ctx.arc(this.points.centerX, this.points.centerY, this.points.radius, 0, Math.PI*2, true); 	
	ctx.fill();
};

var p1  = new Point(100,100);
var p2  = new Point(200,100);
var p3  = new Point(200,200);
var p4  = new Point(100,200);

var shape1 = new Shape('canvas',[p1,p2,p3,p4]);
shape1.draw();

var circle1 = new Circle('canvas1',{
	centerX:150,
	centerY:150,
	radius:60
});

circle1.draw();

var p1  = new Point(100,100);
var p2  = new Point(130,200);
var p3  = new Point(200,100);

var triangle1 = new Triangle('canvas2',[p1,p2,p3]);
triangle1.draw();

