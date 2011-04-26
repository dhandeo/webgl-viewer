
var TILE_DIMENSIONS = [256, 256];
var ROOT_SPACING = [64.0, 64.0, 10.0];
var NUMBER_OF_LEVELS = 6;
var NUMBER_OF_SECTIONS = 1000;


// For pruning the cache
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
function Tile(x, y, z, level, name) {
    this.X = x;
    this.Y = y;
    this.Level = level;
    this.Children = []; 
    this.Parent = null;
    this.LoadState = 0;
    var xScale = TILE_DIMENSIONS[0] * ROOT_SPACING[0] / (1 << level);
    var yScale = TILE_DIMENSIONS[1] * ROOT_SPACING[1] / (1 << level);
    this.Matrix = mat4.create();
    this.Matrix[0] = xScale;
    this.Matrix[5] = yScale;
    this.Matrix[12] = x * xScale;
    this.Matrix[13] = y * yScale;
    this.Matrix[14] = z * ROOT_SPACING[2] -(0.01 * this.Level);
    this.Matrix[15] = 1.0;
    this.Name = name;
    this.Texture = null;
    this.TimeStamp = TIME_STAMP;
    this.BranchTimeStamp = TIME_STAMP;
    ++NUM_TILES;
};

Tile.prototype.Recycle = function (x, y, level, name) {
    gl.deleteTexture(this.Texture);
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
    // Reusing the image caused problems.
    //if (this.Image == null) {
	this.Image = new Image();
	this.Image.onload = GetLoadTextureFunction(this); 
    //}
    // This starts the loading.
    this.Image.src = imageSrc;
};


Tile.prototype.Draw = function (program) {
    if ( this.LoadState != 3) {
	if (this.Parent) {
	    this.Parent.Draw(program);
	}
	return;
    }
    // Texture
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.Texture);

    gl.uniform1i(program.samplerUniform, 0);
    // Matrix that tranforms the vertex p
    gl.uniformMatrix4fv(program.mvMatrixUniform, false, this.Matrix);

    gl.drawElements(gl.TRIANGLES, tileCellBuffer.numItems, gl.UNSIGNED_SHORT, 0);
};

Tile.prototype.handleLoadedTexture = function () {
    var texture = this.Texture;
    //alert(tile);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.Image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    gl.generateMipmap(gl.TEXTURE_2D); 
    gl.bindTexture(gl.TEXTURE_2D, null);
    LoadQueueLoaded(this);
};

function GetLoadTextureFunction (otherThis) {
    return function () {otherThis.handleLoadedTexture();}
}

function Camera (viewportWidth, viewportHeight) {
    this.Rotation = 0;;
    this.Matrix = mat4.create();
    this.ViewportWidth = viewportWidth;
    this.ViewportHeight = viewportHeight;
    this.Height = 256.0 * 64.0;
    this.FocalPoint = [128.0*64.0, 128.0*64.0, 10.0];
    this.ComputeMatrix();
}

Camera.prototype.SetRotation = function (theta) {
    this.Rotation = theta;
    this.ComputeMatrix();
}

Camera.prototype.GetHeight = function () {
    return this.Height;
}

Camera.prototype.GetWidth = function () {
    return this.Height * this.ViewportWidth / this.ViewportHeight;
}

Camera.prototype.ComputeMatrix = function () {
    var ct = Math.cos(this.Rotation);
    var st = Math.sin(this.Rotation);
    mat4.identity(this.Matrix);
    var yScale = 2.0 / this.GetHeight();
    var xScale = 2.0 / this.GetWidth();
    var zScale = yScale;
    this.Matrix[0] =  ct * xScale;
    this.Matrix[2] = -st * xScale; 
    this.Matrix[5] =  yScale;
    this.Matrix[8] =  st * zScale;
    this.Matrix[10]=  ct * zScale;
    this.Matrix[12]= -ct*this.FocalPoint[0]*xScale - st*this.FocalPoint[2]*zScale;
    this.Matrix[13]= -this.FocalPoint[1]*yScale;
    this.Matrix[14]=  st*this.FocalPoint[2]*xScale - ct*this.FocalPoint[2]*zScale;
    
}

Camera.prototype.Reset = function () {
    // Compute the bounds
    var bounds = [];
    bounds[0] = bounds[2] = bounds[4] = 0.0;
    bounds[1] = TILE_DIMENSIONS[0] * ROOT_SPACING[0];
    bounds[3] = TILE_DIMENSIONS[1] * ROOT_SPACING[1];
    bounds[5] = NUMBER_OF_SECTIONS * ROOT_SPACING[2];

    this.FocalPoint[0] = (bounds[0] + bounds[1]) * 0.5;
    this.FocalPoint[1] = (bounds[2] + bounds[3]) * 0.5;
    this.FocalPoint[2] = (bounds[4] + bounds[5]) * 0.5;
    this.Height = bounds[3]-bounds[2];
    this.ComputeMatrix();
}

Camera.prototype.Translate = function (dx,dy,dz) {
    this.FocalPoint[0] += dx;
    this.FocalPoint[1] += dy;
    this.FocalPoint[2] += dz;
    this.ComputeMatrix();
}

// Currenly assumes parallel projection and display z range = [-1,1].
// Also no rotation!
Camera.prototype.DisplayToWorld = function (x,y,z) {
    var scale = this.Height / this.ViewportHeight;
    x = x - (0.5*this.ViewportWidth);
    y = y - (0.5*this.ViewportHeight);
    var worldPt = [];
    worldPt[0] = this.FocalPoint[0] + (x * scale);
    worldPt[1] = this.FocalPoint[1] + (y * scale);
    worldPt[2] = this.FocalPoint[2] + (z * this.Height * 0.5);

    return worldPt;
}

// This could get expensive because it is called so often.
// Eventually I want a quick coverage test to exit early.
// Note:  This does not work for cameras with rotation.
function ChooseTiles(camera, slice, tiles) {
    var tmp = TILE_DIMENSIONS[1]*ROOT_SPACING[1] / camera.Height;
    var level = 0;
    while (tmp > 1.5) {
        ++level;
        tmp = tmp * 0.5;
    }
    var bounds = [];
    bounds[0] = camera.FocalPoint[0]-(camera.GetWidth()*0.5);
    bounds[1] = bounds[0] + camera.GetWidth();
    bounds[2] = camera.FocalPoint[1]-(camera.GetHeight()*0.5);
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
    bounds[0] = bounds[1] = camera.FocalPoint[0];
    bounds[2] = bounds[3] = camera.FocalPoint[1];
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
    bounds[0] = Math.floor(bounds[0] * dim / (TILE_DIMENSIONS[0]*ROOT_SPACING[0]));
    bounds[1] = Math.ceil(bounds[1] * dim / (TILE_DIMENSIONS[0]*ROOT_SPACING[0])) - 1.0;
    bounds[2] = Math.floor(bounds[2] * dim / (TILE_DIMENSIONS[1]*ROOT_SPACING[1]));
    bounds[3] = Math.ceil(bounds[3] * dim / (TILE_DIMENSIONS[1]*ROOT_SPACING[1])) - 1.0;
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
    for (var i = 0; i < tiles.length; ++i) {
	tiles[i].TimeStamp = TIME_STAMP;
	UpdateBranchTimeStamp(tiles[i]);
    }
    ++TIME_STAMP;
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
	    tile = new Tile(0,0,slice, 0, name);
	} else {
	    tile = StealTile();
	    tile.Recycle(0,0,0, name);
	}
	ROOT_TILES[slice] = tile;
    }
    return RecursiveGetTile(ROOT_TILES[slice], level, x, y, slice);
}

function RecursiveGetTile(node, deltaDepth, x, y, z) {
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
	    child = new Tile(x>>deltaDepth, y>>deltaDepth, z,
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
    return RecursiveGetTile(child, deltaDepth, x, y, z);
}


// Find the oldest tile, remove it from the tree and return it to be recycled.
function StealTile()
{
    var min = TIME_STAMP;
    var minNode = null;
    for (var i = 0; i < ROOT_TILES.length; ++i) {
	var node = ROOT_TILES[i];
	if (node != null && node.BranchTimeStamp <= min) {
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
    if (node.Children[0] != null && node.Children[0].BranchTimeStamp <= min) {
	minNode = node.Children[0];
	min = minNode.BranchTimeStamp;
    }
    if (node.Children[1] != null && node.Children[1].BranchTimeStamp <= min) {
	minNode = node.Children[1];
	min = minNode.BranchTimeStamp;
    }
    if (node.Children[2] != null && node.Children[2].BranchTimeStamp <= min) {
	minNode = node.Children[2];
	min = minNode.BranchTimeStamp;
    }
    if (node.Children[3] != null && node.Children[3].BranchTimeStamp <= min) {
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













