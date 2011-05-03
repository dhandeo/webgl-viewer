function initPath () {
PATHS[PATH_COUNT] = new Tree();
PATHS[PATH_COUNT].Color = [1.0, 0.0, 0.0, 1.0];
PATHS[PATH_COUNT].Paths[0] = new Path();
PATHS[PATH_COUNT].Paths[0].Points = [
];
PATHS[PATH_COUNT].Paths[0].CreateBuffer();
++PATH_COUNT;
}
