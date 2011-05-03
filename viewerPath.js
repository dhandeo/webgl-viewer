

function Tree() {
    this.Paths = [];
    this.Color = [0.2, 1.0, 1.0, 1.0];
}

Tree.prototype.Draw = function (program) {
    gl.uniform4fv(program.colorUniform,this.Color);
    for (var i = 0; i < this.Paths.length; ++i) {
	this.Paths[i].Draw(program);
    }
}

Tree.prototype.AddPoint = function (x, y, z) {
    var last = this.Paths.length - 1;
    if (last >= 0) {
	this.Paths[last].AddPoint(x,y,z);
    }
}

Tree.prototype.GetLength = function() {
    var length = 0;
    for (var i = 0; i < this.Paths.length; ++i) {
	length += this.Paths[i].Points.length;
    }
    return length;
}

Tree.prototype.PopPoint = function PopPoint() {
    var last = this.Paths.length - 1;
    if (last < 0) {
	return [0,0,0];
    }
    var point = this.Paths[last].PopPoint();
    if (this.Paths[last].length == 0) {
	var emptyPath = this.Paths.pop();
	gl.deleteBuffer(emptyPath.Buffer);
	emptyPath.Buffer = null;
    }
    return point;
}

Tree.prototype.Advance = function (xMouse, yMouse, camera, dz) {
    var last = this.Paths.length - 1;
    if (last < 0) {
	this.StartNewPath(xMouse, yMouse, camera, dz);
    }
    this.Paths[last].Advance(xMouse, yMouse, camera, dz);
}

Tree.prototype.StartNewPath = function (xMouse, yMouse, camera, dz) {
    var length = this.Paths.length;
    this.Paths[length] = new Path();
    this.Paths[length].Advance(xMouse, yMouse, camera, dz);
}







function Path() {
    this.Points = [];
    this.Buffer = null;
    this.CreateBuffer();

}

Path.prototype.Draw = function (program) {
    gl.bindBuffer(gl.ARRAY_BUFFER, this.Buffer);
    gl.vertexAttribPointer(program.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

    gl.lineWidth(5.0);
    gl.drawArrays(gl.LINE_STRIP, 0, this.Points.length / 3);
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

Path.prototype.PopPoint = function PopPoint() {
    var z = this.Points.pop();
    var y = this.Points.pop();
    var x = this.Points.pop();
    var point = [x,y,z];
    this.CreateBuffer();
    return point;
}

    
Path.prototype.Advance = function (xMouse, yMouse, camera, dz) {
    // Convert mouse into world coordinates.
    var worldPoint = camera.DisplayToWorld(xMouse, camera.ViewportHeight-yMouse, 0.0);
    this.Points.push(worldPoint[0]);
    this.Points.push(worldPoint[1]);
    this.Points.push(worldPoint[2]);    
    this.CreateBuffer();

    // Lets modify the camera so the next slice will not translate much.
    // Should we look at the direction of the last two points, or use
    // more points to try and avoid small / variations?
    var idx = this.Points.length - 3*4; // 4 points back
    if (idx >= 0) {
	var pdz = worldPoint[2]-this.Points[idx+2];
	if (pdz != 0) {
	    var dx = dz*(worldPoint[0]-this.Points[idx]) / pdz;
	    var dy = dz*(worldPoint[1]-this.Points[idx+1]) / pdz;
	    camera.Translate(dx, dy, 0.0);
	}
    }
    camera.Translate(0.0, 0.0, dz);
}


