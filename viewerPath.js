






function AdvancePath(xMouse, yMouse, camera, slice) {
    var tmp = 1.0 / camera.Height;
    var level = 0;
    while (tmp > 1.5) {
        ++level;
        tmp = tmp * 0.5;
    }
    // Convert mouse into world coordinates.
    var x = (2.0 * xMouse / camera.ViewportWidth) - 1.0;
    var y = 1.0 - (2.0 * yMouse / camera.ViewportWidth);
    //var z = slice;
    // Invert the camera matrix and multiply point.
    // Or we could do it this simple way.
    var worldPt = [];
    worldPt[0] = camera.FY + y*camera.height;
    worldPt[1] = camera.FX + x*camera.height*camera.ViewportWidth/camera.ViewportHight;
    
    var tileId = GetTileIdContainingPoint(level, worldPt);
    tiles = [];
    tiles.push(GetTile(slice, level, tileId));
    return tiles;
}



