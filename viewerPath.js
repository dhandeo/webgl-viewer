
var count = 0;
var PATH_VERTEX_POSITION_BUFFER = [];


function Path() {
    this.Points = [];
    this.Buffer = null;
}


Path.prototype.Draw = function (program) {
    gl.bindBuffer(gl.ARRAY_BUFFER, this.Buffer);
    gl.vertexAttribPointer(program.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.LINE_STRIP, 0, this.Points.length / 3);
}
 

Path.prototype.Copy = function (inPath) {
    var i;
    for (i = 0; i < inPath.Points.length; ++i) {
	this.Points.push(inPath.Points[i]);
    }
}


Path.prototype.AddPoint = function (x, y, z) {
    this.Points.push(x);
    this.Points.push(y);
    this.Points.push(z);
}


Path.prototype.CreateBuffer = function () {
    if (this.Buffer != null) {
	gl.deleteBuffer(this.Buffer);
    }
    this.Buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.Buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.Points), 
                  gl.STATIC_DRAW);

}

//function PathUpdateBuffers() {
    //gl.bindBuffer(gl.ARRAY_BUFFER, PATH_VERTEX_POSITION_BUFFER[0]);
    //gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(PATH_POINTS)); 
//}
 


Path.prototype.Advance = function (xMouse, yMouse, camera) {
    // Convert mouse into world coordinates.
    var worldPoint = camera.DisplayToWorld(xMouse, camera.ViewportHeight-yMouse, 0.0);
    this.Points.push(worldPoint[0]);
    this.Points.push(worldPoint[1]);
    this.Points.push(worldPoint[2]);    
    this.CreateBuffer();

    // Lets modify the camera so the next slice will not translate much.
    // Should we look at the direction of the last two points, or use
    // more points to try and avoid small / variations?
    var idx = this.Points.length - 12;
    if (idx >= 0) {
	var dx = (worldPoint[0] - this.Points[idx]) * 0.5;
	var dy = (worldPoint[1] - this.Points[idx+1]) * 0.5;
	camera.Translate(dx, dy, 0);
    }
}


