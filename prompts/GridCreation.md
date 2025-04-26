Gridstack.js
Shadcn
Tailwindcss
React19
Typescript

Grid:
The grid is the place that Tiles go in, it has a background that shows the edges of where the tiles snap too (a repetitive perhaps 1x1 background that has white outlines on the corners make them stylized or something). It has width equal to the remaining width and height equal to the remaining, height but can be expanded if the tiles expand or try to snap below the grid it will expand. Also there should be a button that you click that rearranges the grid to the best possible form i.e. make it have as little gaps as possible.
Add: 
Also we need a sidebar or a modal that shows the options for tiles(with components inside), the tiles go on the best position on the grid, that best position is the position the user can see.
Saving & Loading: The grid must have a way to save and load.
Inside Components:
Different Components with different presentation, they are just the inside they do not have any logic for the title component itself but might have logic generally for something else, they need a wrapper like Tile to be included in the Grid
Tile:
Tiles that have the tile logic and can resize/move themselves remove, clone, and contain the components as children
Container Tiles:
Tiles that contain other Tiles recursively too,  and have the same rearrange capabilities as grids(where they have a button the can click to rerrang to minimize gaps).

Depending on Options
3 Different Grid Viewpoints: L Large(PC), Medium (Laptop or phone sideways), and small (phone upright)(x is for width how many tiles fit in the grid and y is for the height how many fit heightwise(height is approximate, width is exact))
PC: 12x~8y
Tablet: 8x~6y
Phone: 4x~6y
Template Tiles: Are Tiles that come with predefined options and components inside (maybe).
But that is after we complete the above.







