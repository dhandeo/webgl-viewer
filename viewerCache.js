
var NUM_TILES = 0;
var MAX_NUM_TILES = 2000;


// Keep a queue of tiles to load so we can sort them as
// new requests come in.
var LOAD_QUEUE = [];
var LOADING_COUNT = 0;
var LOADING_MAX = 4;

// We could chop off the lowest priority tiles if the queue gets too long.
function LoadQueueAdd (tile) {
    if (tile.LoadState == 2 || tile.LoadState == 3) {
	// Loading or loaded
	return;
    }
    if (tile.LoadState == 1) { // Resort the queue.
	// In queue
	for (var i = 0; i < LOAD_QUEUE.length; ++i) {
	    if (LOAD_QUEUE[i] == tile) {
		LOAD_QUEUE[i] = null;
		break;
	    }
	}
    }
    tile.LoadState = 1; // In queue
    LOAD_QUEUE.push(tile);
    LoadQueueUpdate();
}

// We will have some number of tiles loading at one time.
function LoadQueueUpdate() {
    while (LOADING_COUNT < LOADING_MAX && LOAD_QUEUE.length > 0) {
	var tile = LOAD_QUEUE.pop();
	if (tile != null) {
	    tile.StartLoad();
	    tile.LoadState = 2; // Loading.
	    ++LOADING_COUNT;
	}
    }
}

// Marks a tile as loaded so another can start.
function LoadQueueLoaded(tile) {
    --LOADING_COUNT;
    tile.LoadState = 3; // Loaded
    LoadQueueUpdate();
}


// Three stages to loading a tile:
// 1: Create a tile object.
// 2: Initialize the texture.
// 3: onload is called indicating the image has been loaded.
function Tile(x, y, level, name) {
    this.X = x;
    this.Y = y;
    this.Level = level;
    this.Children = []; 
    this.Parent = null;
    this.LoadState = 0;
    var scale = 1.0 / (1 << level);
    this.Matrix = mat4.create();
    this.Matrix[0] = this.Matrix[5] = scale;
    this.Matrix[12] = x * scale;
    this.Matrix[13] = y * scale;
    this.Matrix[14] = -(0.01 * this.Level);
    this.Matrix[15] = 1.0;
    this.Name = name;
    this.Texture = null;
    this.TimeStamp = TIME_STAMP;
    this.BranchTimeStamp = TIME_STAMP;
    ++NUM_TILES;
};

Tile.prototype.Recycle = function (x, y, level, name) {
    // This is bad.  We need to release the gl resource?
    this.Texture = null;
    this.LoadState = 0;
    this.X = x;
    this.Y = y;
    this.Level = level;
    this.Children[0] = null; 
    this.Children[1] = null; 
    this.Children[2] = null; 
    this.Children[3] = null; 
    this.Parent = null;
    var scale = 1.0 / (1 << level);
    this.Matrix = mat4.create();
    this.Matrix[0] = this.Matrix[5] = scale;
    this.Matrix[12] = x * scale;
    this.Matrix[13] = y * scale;
    this.Matrix[14] = -(0.01 * this.Level);
    this.Matrix[15] = 1.0;
    this.Name = name;
    this.TimeStamp = TIME_STAMP;
    this.BranchTimeStamp = TIME_STAMP;
};

// This starts the loading of the tile.
// Loading is asynchronous, so the tile will not 
// immediately change its state.
Tile.prototype.StartLoad = function () {
    if (this.Texture != null) {
	return;
    }
    // We need to generalize this.
    var imageSrc = "http://paraviewweb.kitware.com:82/tile.py/daniels/" 
            + this.Name + ".jpg";
    this.Texture = gl.createTexture();
    this.Texture.image = new Image();
    this.Texture.image.onload = GetLoadTextureFunction(this); 
    // This starts the loading.
    this.Texture.image.src = imageSrc;
};


Tile.prototype.Draw = function () {
    if ( this.LoadState != 3) {
	if (this.Parent) {
	    this.Parent.Draw();
	}
	return;
    }
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.Texture);
    gl.uniform1i(shaderProgram.samplerUniform, 0);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, tileVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, tileVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, tileVertexTextureCoordBuffer);
    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, tileVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, tileVertexNormalBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, tileVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);
    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, tileVertexIndexBuffer);
    setMatrixUniforms(this.Matrix);
    gl.drawElements(gl.TRIANGLES, tileVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
};

Tile.prototype.handleLoadedTexture = function () {
    var texture = this.Texture;
    //alert(tile);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    gl.generateMipmap(gl.TEXTURE_2D); 
    gl.bindTexture(gl.TEXTURE_2D, null);
    LoadQueueLoaded(this);
};

function GetLoadTextureFunction (otherThis) {
    return function () {otherThis.handleLoadedTexture();}
}

function Camera (fx, fy, height, viewportWidth, viewportHeight) {
    this.Matrix = mat4.create();
    this.FX = fx;
    this.FY = fy;
    this.Height = height;
    this.ViewportWidth = viewportWidth;
    this.ViewportHeight = viewportHeight;
    this.ComputeMatrix();
}

Camera.prototype.GetHeight = function () {
    return this.Height;
}

Camera.prototype.GetWidth = function () {
    return this.Height * this.ViewportWidth / this.ViewportHeight;
}

Camera.prototype.ComputeMatrix = function () {
    mat4.identity(this.Matrix);
    var yScale = 2.0 / this.GetHeight();
    var xScale = 2.0 / this.GetWidth();
    this.Matrix[0] = xScale;
    this.Matrix[5] = yScale;
    //this.Matrix[10] = 0.0; // need this for depth sorting.
    this.Matrix[12] = -this.FX*xScale;
    this.Matrix[13] = -this.FY*yScale;
    this.Matrix[14] = 0.9686353206634521;
}

Camera.prototype.Reset = function () {
    this.FX = 0.5;
    this.FY = 0.5;
    this.Height = 1.0;
    this.ComputeMatrix();
}


// This could get expensive because it is called so often.
// Eventually I want a quick coverage test to exit early.
function ChooseTiles(camera, slice, tiles) {
    var tmp = 1.0 / camera.Height;
    var level = 0;
    while (tmp > 1.5) {
        ++level;
        tmp = tmp * 0.5;
    }
    var bounds = [];
    bounds[0] = camera.FX-(camera.GetWidth()*0.5);
    bounds[1] = bounds[0] + camera.GetWidth();
    bounds[2] = camera.FY-(camera.GetHeight()*0.5);
    bounds[3] = bounds[2] + camera.GetHeight();
    var tileIds = GetVisibleTileIds(level, bounds);
    var tile;
    tiles = [];
    for (var i = 0; i < tileIds.length; ++i) {
        tile = GetTile(slice, level, tileIds[i]);
	tiles.push(tile);
	LoadQueueAdd(tile);
    }
    StampTiles(tiles);
    // Preload the next slice.
    bounds[0] = bounds[1] = camera.FX;
    bounds[2] = bounds[3] = camera.FY;
    tileIds = GetVisibleTileIds(level, bounds);
    // There will be only one tile because the bounds
    // contains only the center point.
    for (var i = 0; i < tileIds.length; ++i) {
        tile = GetTile(slice+1, level, tileIds[i]);
	LoadQueueAdd(tile);
    }

    return tiles;
}



function GetVisibleTileIds (level, bounds) {
    var id;
    var idList = [];
    var dim = 1 << level;
    bounds[0] = Math.floor(bounds[0] * dim);
    bounds[1] = Math.ceil(bounds[1] * dim) - 1.0;
    bounds[2] = Math.floor(bounds[2] * dim);
    bounds[3] = Math.ceil(bounds[3] * dim) - 1.0;
    if (bounds[0] < 0) {bounds[0] = 0;}
    if (bounds[1] >= dim) {bounds[1] = dim-1;}
    if (bounds[2] < 0) {bounds[2] = 0;}
    if (bounds[3] >= dim) {bounds[3] = dim-1;}
    for (var y = bounds[2]; y <= bounds[3]; ++y) {
	for (var x = bounds[0]; x <= bounds[1]; ++x) {
	    id = x | (y << level);
	    idList.push(id);
        }
    }
    return idList;
}


function GetTileIdContainingPoint (level, wPt) {
    var dim = 1 << level;
    var xIdx = Math.floor(wPt[0] * dim);
    var yIdx = Math.floor(wPt[1] * dim);
    if (xIdx < 0) {xIdx = 0;}
    if (xIdx >= dim) {xIdx = dim-1;}
    if (yIdx < 0) {yIdx = 0;}
    if (yIdx >= dim) {yIdx = dim-1;}
    var id = xIdx | (yIdx << level);
    return id;
}


var TIME_STAMP = 0;
var ROOT_TILES = [];


function StampTiles(tiles) {
    ++TIME_STAMP;
    for (var i = 0; i < tiles.length; ++i) {
	tiles[i].TimeStamp = TIME_STAMP;
	UpdateBranchTimeStamp(tiles[i]);
    }
}

// Set parent to be minimum of children.
function UpdateBranchTimeStamp(tile) {
    var min = TIME_STAMP;
    if (tile.Children[0] != null) {
	if (tile.Children[0].BranchTimeStamp < min) {
	    min = tile.Children[0].BranchTimeStamp;
	}
    }
    if (tile.Children[1] != null) {
	if (tile.Children[1].BranchTimeStamp < min) {
	    min = tile.Children[1].BranchTimeStamp;
	}
    }
    if (tile.Children[2] != null) {
	if (tile.Children[2].BranchTimeStamp < min) {
	    min = tile.Children[2].BranchTimeStamp;
	}
    }
    if (tile.Children[3] != null) {
	if (tile.Children[3].BranchTimeStamp < min) {
	    min = tile.Children[3].BranchTimeStamp;
	}
    }
    if (min == TIME_STAMP) { // no children
	min = tile.TimeStamp;
    }
    if (min != tile.BranchTimeStamp) {
	tile.BranchTimeStamp = min;
	if (tile.Parent != null) {
	    UpdateBranchTimeStamp(tile.Parent);
	}
    }
}

function GetTile(slice, level, id) {
    //Separate x and y.
    var dim = 1 << level;
    var x = id & (dim-1);
    var y = id >> level;
    if (ROOT_TILES[slice] == null) {
        var tile;
	var name = slice + "/t";
	if (NUM_TILES < MAX_NUM_TILES) {
	    tile = new Tile(0,0,0, name);
	} else {
	    tile = StealTile();
	    tile.Recycle(0,0,0, name);
	}
	ROOT_TILES[slice] = tile;
    }
    return RecursiveGetTile(ROOT_TILES[slice], level, x, y);
}

function RecursiveGetTile(node, deltaDepth, x, y) {
    if (deltaDepth == 0) {
	return node;
    }
    --deltaDepth;
    var cx = (x>>deltaDepth)&1;
    var cy = (y>>deltaDepth)&1;
    var childIdx = cx+(2*cy);
    var child = node.Children[childIdx];
    if (child == null) {
	var childName = node.Name;
        if (childIdx == 0) {childName += "t";} 
        if (childIdx == 1) {childName += "s";} 
        if (childIdx == 2) {childName += "q";} 
        if (childIdx == 3) {childName += "r";} 
	if (NUM_TILES < MAX_NUM_TILES) {
	    child = new Tile(x>>deltaDepth, y>>deltaDepth, 
                             (node.Level + 1),
                             childName);
	} else {
	    child = StealTile();
	    child.Recycle(x>>deltaDepth, y>>deltaDepth, 
                         (node.Level + 1),
                         childName);
	}
	// This is to fix a bug. Root.BranchTime larger
	// than all children BranchTimeStamps.  When
	// long branch is added, node never gets updated.
	if (node.Children[0] == null && node.Children[1] == null &&
	    node.Children[2] == null && node.Children[3] == null) {
	    node.BranchTimeStamp = TIME_STAMP;
	}

	node.Children[childIdx] = child;
        child.Parent = node;
    }
    return RecursiveGetTile(child, deltaDepth, x, y);
}


// Find the oldest tile, remove it from the tree and return it to be recycled.
function StealTile()
{
    var min = TIME_STAMP;
    var minNode = null;
    for (var i = 0; i < ROOT_TILES.length; ++i) {
	var node = ROOT_TILES[i];
	if (node != null && node.BranchTimeStamp < min) {
	    // We cannot steal root tiles.
	    // Skip roots that do not have children.
	    if (node.Children[0] != null || node.Children[1] != null ||
		node.Children[2] != null || node.Children[3] != null) {
		minNode = ROOT_TILES[i];
		min = minNode.BranchTimeStamp;
	    }
	}
    }
    return RecursiveStealTile(minNode);
}

function RecursiveStealTile(node)
{
    var min = TIME_STAMP;
    var minNode = null;
    if (node.Children[0] != null && node.Children[0].BranchTimeStamp < min) {
	minNode = node.Children[0];
	min = minNode.BranchTimeStamp;
    }
    if (node.Children[1] != null && node.Children[1].BranchTimeStamp < min) {
	minNode = node.Children[1];
	min = minNode.BranchTimeStamp;
    }
    if (node.Children[2] != null && node.Children[2].BranchTimeStamp < min) {
	minNode = node.Children[2];
	min = minNode.BranchTimeStamp;
    }
    if (node.Children[3] != null && node.Children[3].BranchTimeStamp < min) {
	minNode = node.Children[3];
	min = minNode.BranchTimeStamp;
    }
    if (minNode == null) { // steal this leaf
	var parent = node.Parent;
	// nodes will always have parents because we do not steal roots.
	if (parent.Children[0] == node) {
	    parent.Children[0] = null;
	} else if (parent.Children[1] == node) {
	    parent.Children[1] = null;
	} else if (parent.Children[2] == node) {
	    parent.Children[2] = null;
	} else if (parent.Children[3] == node) {
	    parent.Children[3] = null;
	}
	node.Parent = null;
	UpdateBranchTimeStamp(parent)
	return node;
    }
    return RecursiveStealTile(minNode);
}













