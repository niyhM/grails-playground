<!DOCTYPE html>
<html>
<head>
<title>Park</title>
<meta name="layout" content="main" />
</head>
<body>
	<section class="wrapper style5">
		<div class="inner">
			<h2>a Walk in the park</h2> <g:render contextPath="/graphics"
				template="park" /> <br> <br>
			<h3>Documentation</h3>
			<div id="documentation">The user interface of the park scene is
				relative simple. The camera is limited in its ability to be moved
				(due to the constant z-values within the eye and view-at vector);
				consequently, the user can only move in two dimensions. Pressing ‘W’
				will move the viewer towards the current view forward direction.
				Pressing ‘S’ will move the viewer backwards – the direction still
				determined by the current view forward direction. The user can
				strafe left and right, through pressing ‘A’ and ‘D’ respectively.
				The view-at vector can also be independently changed; pressing ‘Q’
				will move the viewer two degrees to the left, and pressing ‘E’ will
				move the viewer two degrees to the right. <br><br>
				
				My approach focused mainly around the creation of two classes: Tree and
				Hut. These classes are initialized by the main application thread.
				The creation of the trees is managed by the ‘doTrees()’; this
				function will create trees – their quantity determined by the
				‘numberOfTrees’ constant – with a random height (minimum of 3, with
				a maximum of 8), and a random width (minimum of 2, maximum of 7).
				For the purpose of this application I have set the ‘numberOfTrees’
				variable to 15. The location of the trees is not randomized. I
				initially attempted to implement a function that would – in addition
				to randomizing width and height – randomize the trees location
				within the scene. It proved difficult to create a sensible,
				efficient algorithm that would randomly place trees in a safe
				location (that is, a location not already occupied by another tree,
				hut, or pathway). Instead, the array ‘treeLocs’ holds the separate
				coordinates for all 15 trees. In regards to the two huts: their
				position, location, and scaling are all pre-determined. <br><br>
				
				Modelling
				the tree is accomplished by first computing the vertices of the
				conical top; this is achieved by pushing a centre point with a
				positive z-value, and then calculating the points of the circle
				beneath it. The vertices of the cone are connected by a
				‘TRIANGLE_FAN’. Due to the constant height of the view reference
				vector (and view at vector), the bottom of cone remains open.
				Furthermore, a black line is rendered around the bottom of the cone,
				helping to compensate for the lack of lighting in the scene (of
				which depth perception suffers as a result). The trunk is calculated
				via two circles with varying z-values, connected through a
				‘TRIANGLE_STRIP’. The hut is modelled in similar fashion – that
				being within two separate function calls (for the walls and roof).
				The wall is modelled by first computing the walls of a cube; the top
				and bottom of the cube are left open. A triangular prism is then
				created, using a centre point with a positive z-value, and the top
				vertices of the cube walls. They are connected via a ‘TRIANGLE_FAN’.
				<br><br>
				
				The colours within the scene are all pre-determined. There are five
				types of trees (meaning: different shades of green) kept in the
				array ‘treeTypes’. These shades are distributed amongst the trees
				evenly to create a diverse scenery. Both huts remain a static dark
				brown – with a lighter-tan distinguishing the roof. A perspective
				projection is used within the park application. The view-up vector
				is pointed towards the z-axis. The z-values of the view up vector,
				and the view at vector, are always kept at a constant of 2. This
				limits the camera’s ability to look up and down, and ensures the
				viewer is always kept parallel to the ground (a most sensible
				decision for a park-viewer).</div>
	</div>

</section>

</body>
</html>