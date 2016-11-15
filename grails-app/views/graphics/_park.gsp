<!DOCTYPE html>
<html>

<script id="vertex-shader" type="x-shader/x-vertex">
attribute  vec4 vPosition;
uniform mat4 modelView;
uniform mat4 projection;

void main() 
{
    gl_Position = projection*modelView*vPosition;
} 
</script>

<script id="fragment-shader" type="x-shader/x-fragment">
precision mediump float;
uniform vec4 colour;

void
main()
{
    gl_FragColor = colour;
}
</script>
    <asset:javascript src="Common/webgl-utils.js"/>
    <asset:javascript src="Common/initShaders.js"/>
    <asset:javascript src="Common/MV.js"/>
    <asset:javascript src="park.js"/>
    
    
<body>
<p><button id="Button1">Increase FoVY</button> <button id="Button2">Decrease FoVY</button></p>

<canvas id="gl-canvas" width="768" height="512">
Oops ... your browser doesn't support the HTML5 canvas element
</canvas>

</body>
</html>
