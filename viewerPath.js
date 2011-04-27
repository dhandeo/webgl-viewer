
var count = 0;
var PATH_VERTEX_POSITION_BUFFER = [];


function Path() {
    this.Points = [];
    this.Buffer = null;
}


Path.prototype.Draw = function (program) {
    gl.bindBuffer(gl.ARRAY_BUFFER, this.Buffer);
    gl.vertexAttribPointer(program.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.CellBuffer);

    //gl.drawArrays(gl.LINE_STRIP, 0, this.Points.length / 3);
    gl.drawElements(gl.LINE_STRIP, this.Points.length / 3, gl.UNSIGNED_SHORT, 0);

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
    this.Buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.Buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.Points), 
                  gl.STATIC_DRAW);


    var cellBuffer = [];
    var numPoints = this.Points.length / 3;
    for (var i = 0; i < numPoints; ++i) {
	cellBuffer.push(i);
    }
    this.CellBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.CellBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cellBuffer), gl.STATIC_DRAW);
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
}



