var canvas;
var gl;

var near = 1.0;		// near/far clipping in metres
var near = 1.0;		// near/far clipping in metres
var far = 300;

var fovy = 27.0;	// Vertical FoV to match standard 50mm lens with 35mm film
var aspect;			// Aspect ratio set from canvas should match 35mm film

var worldview, modelview, projection;	// Worldview, Modelview and projection matrices
var mvLoc, projLoc;						//   and their shader program locations
var colLoc;								// Colour shader program location

var eye = vec3(0.0, -75.0, 2.0);	// Viewed from standing height, 75m along negative y-axis
var at = vec3(0.0, 0.0, 2.0);		// Looking at standing height in henge centre
const up = vec3(0.0, 0.0, 1.0);		// VUP along world vertical

//colors for various objects
const GRASS = vec4(0.4, 0.8, 0.2, 1.0);		
const BLACK = vec4(0.0,0.0,0.0,1.0);
const HUTWALLS = vec4(0.36, 0.25, 0.2, 1.0);
const TRUNK = vec4(0.65, 0.50, 0.14, 1.0);
const ROOF = vec4(0.59, 0.41, 0.31, 1.0);
const PATH = vec4(0.9, 0.8, 0.85, 1.0);
//there are five different types of tree colors (all shades of green)
const TREETYPES = [
				   vec4(0.3,0.8,0.0,1.0),
				   vec4(0.3,0.5,0.18,1.0),
				   vec4(0.0,0.6,0.0,1.0),
				   vec4(0.6,0.8,0.19,1.0),
				   vec4(0.6,1.0,0.1,1.0)
				   ];
				  
				   
//	Ground vertices for a 2000m x 2000m triangle fan
//  Then, vertices for path of similar length, of a constant width of 40m
var ground = [
	vec3(1000.0, -1000.0, 0.0),
	vec3(1000.0, 1000.0, 0.0),
	vec3(-1000.0, 1000.0, 0.0),
	vec3(-1000.0, -1000.0, 0.0),
	vec3(10.0, -1000.0, 0.05),
	vec3(-10.0, -1000.0, 0.05),
	vec3(-10.0, 1000.0, 0.05),
	vec3(10.0, 1000.0, 0.05),
	vec3(1000.0, 10.0, 0.05),
	vec3(-1000.0, 10.0, 0.05),
	vec3(-1000.0, -10.0, 0.05),
	vec3(1000.0, -10.0, 0.05),

];

var NVground = 12;	// Number of ground vertices
var NVwalls = 24; // Number of vertices in hut walls
var treeTypeCount = 0; //keeps track of trees being added. ensures an even amount of each type of tree
const hutHeight = 1.5;
const treeHeight = 2.5;		// Standing tree height (above ground)
const numberOfHuts = 2;			// Number of huts
const numberOfTrees = 15; 		//Number of trees

//array of all the tree locations
var treeLocs =  [
			vec3(55.0, 15.0, 0.5 * treeHeight),
			vec3(152.0, -22.0, 0.5 * treeHeight),
		    vec3(55.0, -43.0, 0.5 * treeHeight),
			vec3(-44.0, 40.0, 0.5 * treeHeight),
			vec3(75.0, 95.0, 0.5 * treeHeight),
		    vec3(-100.0, 74.0, 0.5 * treeHeight),
			vec3(-33.0, -20, 0.5 * treeHeight),
			vec3(20.0, 51.0, 0.5 * treeHeight),
			vec3(-95.0, -100.0, 0.5 * treeHeight),
			vec3(-30.0, -55.0, 0.5 * treeHeight),
			vec3(-23.0, 79.0, 0.5 * treeHeight),
			vec3(-44.0, 90.0, 0.5 * treeHeight),
			vec3(55.0, -90.0, 0.5 * treeHeight),
			vec3(44.0, -40.0, 0.5 * treeHeight),
			vec3(-55.0, 15.0, 0.5 * treeHeight)
				   ];
//two hut locations
var hutLocs =   [
			vec3(75.0, -25.0, 0.5 * hutHeight),
			vec3(-60.0, 62.0, 0.5 * hutHeight)
				];
// Array of Hut objects
var huts = [];
// Array of Tree objects
var trees = [];

window.onload = function init() {
    canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }

    gl.viewport(0, 0, canvas.width, canvas.height);
    aspect =  canvas.width/canvas.height;

    // Generate arrays of Huts and Trees
    doHuts();
	doTrees();

    gl.clearColor(0.6, 0.8, 1.0, 1.0);		// Light blue background for sky
    gl.enable(gl.DEPTH_TEST);

	//
	//  Load shaders and initialise attribute buffers
	//	Uses a single buffer and a single vertex array
	//
	var program = initShaders(gl, "vertex-shader", "fragment-shader");
	gl.useProgram(program);

	var vBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, sizeof['vec3']*(NVground+Hut.NV+Tree.NV), gl.STATIC_DRAW);
	gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(ground));
	gl.bufferSubData(gl.ARRAY_BUFFER, sizeof['vec3']*NVground, flatten(Hut.vertices));
	gl.bufferSubData(gl.ARRAY_BUFFER, sizeof['vec3']*(Hut.NV + NVground), flatten(Tree.vertices));

	var vPosition = gl.getAttribLocation(program, "vPosition");
	gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vPosition);

	mvLoc = gl.getUniformLocation(program, "modelView");
	projLoc = gl.getUniformLocation(program, "projection");
	colLoc = gl.getUniformLocation(program, "colour");

	projection = perspective(fovy, aspect, near, far);
	gl.uniformMatrix4fv(projLoc, false, flatten(projection));

	// Event handlers
	// Buttons to change fovy
	document.getElementById("Button1").onclick = function() {
		fovy += 6.0;
		if (fovy > 45.0) {fovy = 45.0;}
		projection = perspective(fovy, aspect, near, far);
		gl.uniformMatrix4fv(projLoc, false, flatten(projection));
		render();
	};
	document.getElementById("Button2").onclick = function() {
		fovy -= 6.0;
		if (fovy < 15.0) {fovy = 15.0;}
		projection = perspective(fovy, aspect, near, far);
		gl.uniformMatrix4fv(projLoc, false, flatten(projection));
		render();
	};


	// Keys to change viewing position/direction
	// Inefficient code arranged for readability
	window.onkeydown = function(event) {
		var key = String.fromCharCode(event.keyCode);
		var forev = subtract(at, eye);				// current view forward vector
		var foreLen = length(forev);				// current view forward vector length
		var fore = normalize(forev);				// current view forward direction
		var right = normalize(cross(fore, up));		// current horizontal right direction
		var ddir = 2.0*Math.PI/180.0;				// incremental view angle change
		var dat;									// incremental at change
		switch( key ) {
		  case 'W':
			at = add(at, fore);
			eye = add(eye, fore);
			break;
		  case 'S':
			at = subtract(at, fore);
			eye = subtract(eye, fore);
			break;
		  case 'A':
		    at = subtract(at, right);
		    eye = subtract(eye, right);
		    break;
		  case 'D':
		    at = add(at, right);
		    eye = add(eye, right);
		    break;
		  // The following calculate the displacement of 'at' for +/- 2 degree view angle change
		  //   around the horizontal circle centred at 'eye', then apply it to 'at'
		  case 'Q':
		    dat = subtract(scale(foreLen*(Math.cos(ddir) - 1.0), fore), scale(foreLen*Math.sin(ddir), right));
		    at = add(at, dat);
		    break;
		  case 'E':
		    dat = add(scale(foreLen*(Math.cos(ddir) - 1.0), fore), scale(foreLen*Math.sin(ddir), right));
		    at = add(at, dat);
		    break;
		}
		render();
	};

	render();
};

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	worldview = lookAt(eye, at, up);
	// Ground in world coordinates needs modelview = worldview
	gl.uniformMatrix4fv(mvLoc, false, flatten(worldview));
    gl.uniform4fv(colLoc, flatten(GRASS));
	//render grass
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
	gl.uniform4fv(colLoc, flatten(PATH));
	//vertical pathway
	gl.drawArrays(gl.TRIANGLE_FAN, 4, 4);
	//horizonal pathway
	gl.drawArrays(gl.TRIANGLE_FAN, 8, 4);
	
	//render two huts
	for (var i = 0; i < numberOfHuts; i++) {
		huts[i].render(NVground, worldview);
	}
	
	//render trees
	for(var i = 0; i < numberOfTrees; i++) {
		trees[i].render((NVground + Hut.NV), worldview);
	}
	
}

function doHuts() {
	// Generate huts array
	var scales = vec3(5.0,10.0,5.0); //scale hut along y axis - creates a general kind of hut
	var location;
	for (var i = 0; i < numberOfHuts; i++) {
		location = hutLocs[i];
		huts[i] = new Hut(location, scales);
	}

}


function doTrees(){
	//angle is irrelevant for trees due to their round shape. will only send scale and location matrices
	var height;
	var scales;
	var location;
	for (var i = 0; i < numberOfTrees; i++) {
		//calculate height - minimum of 3 
		height = (Math.random() * 5) + 3;
		//calculate width - minimum of 2
		width = (Math.random() *5) + 2;
		scales = vec3(width, width ,height);
		location = treeLocs[i];
		trees[i] = new Tree(location, scales);
	}
}









// The Tree class
// The constructor function for a tree
// Arguments: a vec3 location and a vec3 scales
function Tree(location, scales) {
	this.trs = mult(translate(location), scalem(scales));
	this.type = TREETYPES[++treeTypeCount];
	if(treeTypeCount == 4){
		treeTypeCount = 0;
	}
}

// A tree's render function
// Arguments:
//   offset - offset of vertices into current vertex attribute array
//   worldview - current worldview transformation
Tree.prototype.render = function(offset, worldview) {
	gl.uniformMatrix4fv(mvLoc, false, flatten(mult(worldview, this.trs)));
	gl.uniform4fv(colLoc, flatten(this.type));
	gl.drawArrays(gl.TRIANGLE_FAN, offset, ConeNV);
	gl.uniform4fv(colLoc, flatten(BLACK));
	gl.drawArrays(gl.LINE_STRIP, offset+1, ConeNV-1);
	gl.uniform4fv(colLoc, flatten(TRUNK));
	gl.drawArrays(gl.TRIANGLE_STRIP, offset+ConeNV, TrunkNV);
	
}


//segments control the angle changes when drawing the cone and trunks.
const segments = 25;
const ConeNV = segments + 2;
const TrunkNV = (segments * 2) + 2;
Tree.NV = ConeNV + TrunkNV;

// Generator of model vertices - a class method
Tree.initModel = function() {
	var vertices = [];
	var rad = 1;
	var zval = 0.0;

	
	function getCone() {
		vertices.push(vec3(0.0,0.0,1.5));
		//calculate circular shape of cones
		for(var i =0; i <= segments; i++){
			var angle = 2 * Math.PI * i / segments;
			var x = rad * Math.cos(angle);
			var y = rad * Math.sin(angle);
			vertices.push(vec3(x,y,zval));
		}
	}
	
	function getTrunk(){
		for(var i =0; i <= segments; i++){
			//calculate cylindrical trunks
			//created via two identical circles (with half the radius of conical head)
			//that connect vertically opposite vertices via a triangle strip
			var angle = 2 * Math.PI * i / segments;
			var x = (rad/4) * Math.cos(angle);
			var y = (rad/4) * Math.sin(angle);
			vertices.push(vec3(x,y,zval+0.4));
			vertices.push(vec3(x,y,zval-1));
		}
	}
	

	getCone();
	getTrunk();
	return vertices;
}

// The model vertices - a class field
Tree.vertices = Tree.initModel();
//----------------------------------------------------------------------------



// The Hut class
//Hut constructor
function Hut(location, scales) {
	//only need multiply a scale and location matrix
	//in this case huts will not be rotated
	this.trs = mult(translate(location), scalem(scales));
}

// A Hut's render function
// Arguments:
//   offset - offset of vertices into current vertex attribute array
//   worldview - current worldview transformation
Hut.prototype.render = function(offset, worldview) {
	gl.uniformMatrix4fv(mvLoc, false, flatten(mult(worldview, this.trs)));
	gl.uniform4fv(colLoc, flatten(HUTWALLS));
	gl.drawArrays(gl.TRIANGLES, offset, NVwalls);
	gl.uniform4fv(colLoc, flatten(ROOF));
	gl.drawArrays(gl.TRIANGLE_FAN, offset + NVwalls, Hut.NV - NVwalls);
	
};

// Hut class fields
// The number of vertices to represent a hut 
Hut.NV = 30;

// Generator of model vertices - a class method
// Order is important - It should appear before it is used for Hut.vertices
Hut.initModel = function() {
	// The 8 raw vertices of a cube	
	var rawverts = [
		vec3(-0.5, -0.5,  0.5),
		vec3(-0.5,  0.5,  0.5),
		vec3( 0.5,  0.5,  0.5),
		vec3( 0.5, -0.5,  0.5),
		vec3(-0.5, -0.5, -0.5),
		vec3(-0.5,  0.5, -0.5),
		vec3( 0.5,  0.5, -0.5),
		vec3( 0.5, -0.5, -0.5),
		vec3( 0.0,  0.0,  1.0)
	];
	// A local array in which to develop the 36 vertices
	var vertices = [];

	// A nested function generating the vertices for each face
	function quad(a, b, c, d) {
		// if abcd is an anticlockwise winding on a face
		// then abc and acd are anticlockwise windings on its triangles
		var indices = [a, b, c, a, c, d];

		for (var i = 0; i < indices.lenqqgth; ++i) {
			vertices.push(rawverts[indices[i]]);
		}
	}


	// A nested function generating the cube's faces
	function doHut() {
		// Use anticlockwise windings
	    quad( 2, 3, 7, 6 );
		quad( 3, 0, 4, 7 );
		quad( 6, 5, 1, 2 );
		quad( 5, 4, 0, 1 );
		//creating the triangular pyramid on top of the wrapped cube
		vertices.push(rawverts[8]);
		vertices.push(rawverts[0]);
		vertices.push(rawverts[1]);
		vertices.push(rawverts[2]);
		vertices.push(rawverts[3]);
		vertices.push(rawverts[0]);
	}

	doHut();
	return vertices;
	

}

// The model vertices - a class field
Hut.vertices = Hut.initModel();
//----------------------------------------------------------------------------