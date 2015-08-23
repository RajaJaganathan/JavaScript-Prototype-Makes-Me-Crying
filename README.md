##Prototype

Yes many times I cried because of prototype pattern when ever I tried to understand about it. May be I'm came from another scripting language(ActionScript3) background with Class oriented language. Anyhow after read many times about Prototype my reaction will be :(

![alt text](https://raw.githubusercontent.com/RajaJaganathan/JavaScript-Prototype-Makes-Me-Crying/master/imgs/cry-icon.png "Prototype")

We are really exciting about es6 right. we have lot of stunning features like arrows, classes, enhanced object literals,template strings, let + const, iterators + for..of, generators, modules and many more wow feature in es6.Then why do we care about prototype matter even though we have Class feature in es6(atleast future) it purely rely on prototype pattern. In other words prototype pattern powered to class mechanism in es6. JavaScript remains prototype-based and one of reason behind this prototype pattern is more powerful than classical inheritance which is coming from static language like Java, C# etc...,

Let's discuss about why prototype pattern is important in javascript. why do we need to care about prototype? Where it's play critical role. Let's thing about prototype.

Going to define simple constructor function to hold the point of x,y number purpose of draw shapes in canvas.

Let's define Point constructor to hold x and y points to represents position of Shape.

###Constructor Function

```
function Point(x,y){
	this.x = x;
	this.y = y;
	
	this.getPoint = function(){
		return { x:x, y:y };
	}
	this.toString = function(){
		console.log("x : "+x + " y : "+y);
	}
}

```
We need Point constructor to draw a line. But above code have one disadvantage of Point constructor function and it's own constructor pattern problem.

```
var p1 = new Point(100,100);
var p2 = new Point(100,100);
var p3 = new Point(100,100);

```
Now examine construtor function. Let's do simple comparison with p1 and p2.

```
> p1.constructor === p2.constructor
> true

```
Any number of instance create by Point construtor function it is always points to Point.So what is the issue here. Wait look at 2 methods and 2 props on Point constructor function. These are own property of p1 and p2. Meaning, for each instance of Point having their own props and method this is cons of constructor function as well. Since there is no options to share properties and methods among their instance.

Let's see practically what is the problem with construtor function.

```
> p1.getPoint === p2.getPoint
false 

```
Above statement is clearly stated that p1 having getPoint their own funtion and p2 having getPoint their own function so completly unccesseary of creating getPoint() and toString() function for each instance of Point.

That's where the prototype come into the picture and it played nicely. Now redefine the above Point constructor function with the help of prototype

```
function Point(x,y){
	this.x = x;
	this.y = y;
}

Point.prototype.getPoint = function(){
	return { x:x, y:y };
}

Point.prototype.toString = function(){
	console.log("x : "+x + " y : "+y);
}
```
```
> p1.getPoint === p2.getPoint
> true

```

So Prototype is able to sharing properties and method among their instances. Here are we removed 2 methods from Point function atleast own methods. Also removed methods are attached into prototype object. Do you know Prototype object where it is come from ?

Prototype is simple plain object which will create every time when object instanitate with 'new' keyword. By default it always points to Object.prototype.

```
function Point(x,y){
	this.x = x;
	this.y = y;
}
```

```
> var p1 = new Point(100,100);
> console.log(p1.tostring());

```
toString() is not defined on Point constructor function then how it is print out "[object Object]". Because of all javascript object link to 'Object' prototype. Object prototype having 
toString(), valueOf, hasOwnProperty() and so on.

The reason behind this invoking a function as a constructor (i.e. with the new keyword) runs the following steps:

1. Create a new object

2. Set the prototype of that object to the object in the prototype property of the function

3. Execute the constructor function in the context of that object (i.e. this is the new object)

4. Return that object (if the constructor has no return statement)


If you understood #2 you will come to know toString() method where it is comes from. Let's see how prototype will supports inheritance with lot of flaws and by the time will correct it.

##Inheritance

In javascript inheritance is implemented through a special property \__proto__ (named [[Prototype]] in the specification. It is just one approach there are many way to acheive reusablity this manner.

```
function Shape(){
	this.props = {name:'Shape'};
}

function Square(){
}

Square.prototype = new Shape();

var s1 = new Square();
var s2 = new Square();

console.log(s1.props.name);
console.log(s2.props.name);
```
```
> s1.props.name
"Shape"
> s1.props.name = "I'm Square"
"I'm Square"
> s2.props.name
"I'm Square"

```

Problem #1 : All reference type in parent will reflect changes to child object. Square.prototype = new Shape(); become as Square.prototype.props then finally it share 'props' perperties with all instance of Square.

Problem #2 : Square.prototype = new Shape(); no way to pass parameters to Shape function(atleast at this point of time)

So let's solve the above problem #2 with the help of borrow constructor pattern.

```
function Shape(){
	this.props = {name:'Shape'};
}

function Square(){
	Shape.apply(this,arguments); //This line solve above two problem
}

Square.prototype = new Shape();

var s1 = new Square();
var s2 = new Square();

console.log(s1.props.name);
console.log(s2.props.name);
```

```
> s1.props.name = "I'm square instance"
  "I'm square instance"
> s2.props.name
  "Shape"
```

Now clearly stated that 2 instance having their own properties regardless of primities or reference type. Is it fine ohh wait one more issue with above code. what is the issue now. Constructor function is called twice ie,Square.prototype = new Shape(); and Shape.apply(this,arguments); both called construtctor function each time this shows clearly ineffecitent method. But don't worry about luckly we have option to solve the problems too.

```
function Shape(){
	console.log('Shape constructor called');
	this.props = {name:'Shape'};
}

function Square(){
	Shape.apply(this,arguments); //This line solve above two problems
}

Square.prototype = new Shape();

var s1 = new Square();
var s2 = new Square();

console.log(s1.props.name);
console.log(s2.props.name);
```
```
> Shape constructor called
> Shape constructor called
> Shape constructor called

> s1.props.name = "I'm square instance"
  "I'm square instance"
> s2.props.name
  "Shape"

```
How do we solve the problem instead of creating new instance of Shape. Do assign the prototype of Shape Object.

```
function Shape(){
	console.log('Shape constructor called');
	this.props = {name:'Shape'};
}

function Square(){
	Shape.apply(this,arguments);
}

```

Square.prototype = Shape.prototype; //This line solve the constructor called twice.Share the parent prototype alone instead of instance properties and methods

```
var s1 = new Square();
var s2 = new Square();
```

```
> Shape constructor called
> Shape constructor called
```

Ohh this time only once constructor function is being called. 

Let's examine 
```
> s1.constructor 
function Shape()
```
Why it is points to Shape construtor function it should points to Square right. what went wrongs ?
Take a look at 

```
Square.prototype = Shape.prototype;
```
Square protype is completely replace with Shape.prototype so constructor properties in prototype also override. So don't rely on construtor property. When ever protoptype obhect changes that time reset the constructor propery as well.

```
Square.prototype = Shape.prototype; 
Square.prototype.constructor = Square;
```
Now it will points to Square instead of Shape. Instead of rely on constructor property on prototype. How ever 'instance of' operator does job well even without resetting the constructor property.

```
> s1 instanceof Square
true
> s1 instanceof Shape
true
> s1 instanceof Object
true
```
Find the below complete prototype pattern snippets with inheritance usage.

```
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

var p1  = new Point(100,100);
var p2  = new Point(200,100);
var p3  = new Point(200,200);
var p4  = new Point(100,200);

var shape1 = new Shape('canvas',[p1,p2,p3,p4]);
shape1.draw();
```

Also Shape function can be used to create many geometrical objects like Rectangle,Triangle and circle etc. Here circle is bit different behaviour which have to override 'draw' method in order to get desired output.

![alt text](https://raw.githubusercontent.com/RajaJaganathan/JavaScript-Prototype-Makes-Me-Crying/master/imgs/proto_demo_output.png "Prototype")

Finally 

![alt text](https://raw.githubusercontent.com/RajaJaganathan/JavaScript-Prototype-Makes-Me-Crying/master/imgs/smile.png "Prototype")

