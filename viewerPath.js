
var PATH_VERTEX_POSITION_BUFFER;
var PATH_POINTS = [
        8000,  0.0,  0,
	8000,  8000, 0,
        8000,  8000,  8000,
        8000,  16000,  8000];


function PathInitBuffers() {
    PATH_VERTEX_POSITION_BUFFER = gl.createBuffer();
}
 

function PathDraw(program) {
    gl.bindBuffer(gl.ARRAY_BUFFER, PATH_VERTEX_POSITION_BUFFER);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(PATH_POINTS), 
                  gl.STATIC_DRAW);
    PATH_VERTEX_POSITION_BUFFER.itemSize = 3;
    PATH_VERTEX_POSITION_BUFFER.numItems = PATH_POINTS.length / 3;


    gl.bindBuffer(gl.ARRAY_BUFFER, PATH_VERTEX_POSITION_BUFFER);
    gl.vertexAttribPointer(program.vertexPositionAttribute, PATH_VERTEX_POSITION_BUFFER.itemSize, gl.FLOAT, false, 0, 0);
    
    //setMatrixUniforms();
    gl.drawArrays(gl.LINE_STRIP, 0, PATH_VERTEX_POSITION_BUFFER.numItems);
}

function AdvancePath(xMouse, yMouse, camera) {
    // Convert mouse into world coordinates.
    var worldPoint = camera.DisplayToWorld(xMouse, camera.ViewportHeight-yMouse, 0.0);
    PATH_POINTS.push(worldPoint[0]);
    PATH_POINTS.push(worldPoint[1]);
    PATH_POINTS.push(worldPoint[2]);    
}



