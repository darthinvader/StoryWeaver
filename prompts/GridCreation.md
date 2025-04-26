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
Tiles that have the tile logic and can resize/move themselves remove, clone, and contain the components as children.They also have how to serialize it(for data upload and for the grid to get the data from here too for the save/load)
Container Tiles:
Tiles that contain other Tiles recursively too, and have the same rearrange capabilities as grids(where they have a button the can click to rearrange to minimize gaps).

Depending on Options
3 Different Grid Viewpoints: L Large(PC), Medium (Laptop or phone sideways), and small (phone upright)(x is for width how many tiles fit in the grid and y is for the height how many fit heightwise(height is approximate, width is exact))  
PC: 12x~8y
Tablet: 8x~6y
Phone: 4x~6y
Template Tiles: Are Tiles that come with predefined options and components inside (maybe).
But that is after we complete the above.

Make the Grid First, then the tile then the container tiles.

Here is some help, the directory structure and some of our files/routes and package.json and vite config
As well as my attempt at it, find issues and mistakes, also make an example in the index.tsx in the characters routes
Fix,revise

Here are examples from the gridstackjs page,some are react some are clean javascript

knockout.html:

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Knockout.js demo</title>

  <link rel="stylesheet" href="demo.css"/>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/knockout/3.5.0/knockout-debug.js"></script>
  <script src="../dist/gridstack-all.js"></script>
</head>
<body>
  <div class="container-fluid">
    <h1>knockout.js Demo</h1>
    <div>
      <a class="btn btn-primary" data-bind="click: addNewWidget">Add Widget</a>
    </div>
    <br>
    <div data-bind="component: {name: 'dashboard-grid', params: $data}"></div>
  </div>

  <script type="text/javascript">
    ko.components.register('dashboard-grid', {
      viewModel: {
        createViewModel: function (controller, componentInfo) {
          let ViewModel = function (controller, componentInfo) {
            let grid = null;

            this.widgets = controller.widgets;

            this.afterAddWidget = function (items) {
              if (!grid ) {
                grid = GridStack.init({auto: false});
              }

              let item = items.find(function (i) { return i.nodeType == 1 });
              grid.makeWidget(item);
              ko.utils.domNodeDisposal.addDisposeCallback(item, function () {
                grid.removeWidget(item);
              });
            };
          };

          return new ViewModel(controller, componentInfo);
        }
      },
      template:
        [
          '<div class="grid-stack" data-bind="foreach: {data: widgets, afterRender: afterAddWidget}">',
          '   <div class="grid-stack-item" data-bind="attr: {\'gs-x\': $data.x, \'gs-y\': $data.y, \'gs-w\': $data.w, \'gs-h\': $data.h, \'gs-auto-position\': $data.auto_position, \'gs-id\': $data.id}">',
          '     <div class="grid-stack-item-content"><button data-bind="click: $root.deleteWidget">Delete me</button></div>',
          '   </div>',
          '</div> '
        ].join('')
    });

    let Controller = function (widgets) {
      let self = this;

      this.widgets = ko.observableArray(widgets);

      this.addNewWidget = function () {
        this.widgets.push({
          x: 0,
          y: 0,
          w: Math.floor(1 + 3 * Math.random()),
          h: Math.floor(1 + 3 * Math.random()),
          auto_position: true
        });
        return false;
      };

      this.deleteWidget = function (item) {
        self.widgets.remove(item);
        return false;
      };
    };

    let widgets = [
      {x: 0, y: 0, w: 2, h: 2, id: '0'},
      {x: 2, y: 0, w: 4, h: 2, id: '1'},
      {x: 6, y: 0, w: 2, h: 4, id: '2'},
      {x: 1, y: 2, w: 4, h: 2, id: '3'}
    ];

    let controller = new Controller(widgets);
    ko.applyBindings(controller);
  </script>
</body>
</html>

lazy_load.html:

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Lazy loading demo</title>

  <link rel="stylesheet" href="demo.css"/>
  <script src="../dist/gridstack-all.js"></script>
</head>
<body>
  <div>
    <h1>Lazy loading + renderCB demo</h1>
    <p>New V11 GridStackWidget.lazyLoad feature. open console and see widget content (or angular components) created as they become visible.</p>
    <div style="height: 300px; overflow-y: auto">
      <div class="grid-stack"></div>
    </div>
  </div>
  <script type="text/javascript">
    // print when widgets are created, verify dragging by newly added content
    GridStack.renderCB = function(el, w) {
      const title = document.createElement('h3');
      title.textContent = 'Drag me by title';
      title.className = 'card-header';
      el.appendChild(title);
      const div = document.createElement('div');
      div.textContent = w.id;
      el.appendChild(div);
      console.log('created node id ', w.id);
    };

    let children = [];
    for (let y = 0; y <= 5; y++) children.push({x:0, y, id:String(y), content: String(y)});

    let grid = GridStack.init({
      cellHeight: 200,
      children,
      lazyLoad: true,  // delay creation until visible
      handle: '.card-header',
    });

  </script>
</body>
</html>

locked.html

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Locked demo</title>

  <link rel="stylesheet" href="demo.css"/>
  <script src="../dist/gridstack-all.js"></script>
  </style>
</head>
<body>
  <div class="container-fluid">
    <h1>Locked demo</h1>
    <div>
      <a class="btn btn-primary" onClick="addNewWidget()" href="#">Add Widget</a>
      <a class="btn btn-primary" onclick="toggleFloat()" id="float" href="#">float: true</a>
    </div>
    <br><br>
    <div class="grid-stack"></div>
  </div>

  <script type="text/javascript">
    let grid = GridStack.init({float: true});

    grid.on('added removed change', function(e, items) {
      let str = '';
      items.forEach(function(item) { str += ' (x,y)=' + item.x + ',' + item.y; });
      console.log(e.type + ' ' + items.length + ' items:' + str );
    });

    let items = [
      {x: 0, y: 1, w: 12, locked: 'yes', noMove: true, noResize: true, text: 'locked, noResize, noMove'},
      {x: 1, y: 0, w: 2, h: 3},
      {x: 4, y: 2},
      {x: 3, y: 1, h: 2},
      {x: 0, y: 6, w: 2, h: 2}
    ];
    let count = 0;

    addNewWidget = function() {
      let n = items[count] || {
        x: Math.round(12 * Math.random()),
        y: Math.round(5 * Math.random()),
        w: Math.round(1 + 3 * Math.random()),
        h: Math.round(1 + 3 * Math.random())
      };
      n.content = n.text ? n.text : String(count);
      grid.addWidget(n);
      count++
    };

    toggleFloat = function() {
      grid.float(! grid.float());
      document.querySelector('#float').innerHTML = 'float: ' + grid.float();
    };
    addNewWidget();
  </script>
</body>
</html>
mobile.html:
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Simple mobile demo</title>

  <link rel="stylesheet" href="demo.css"/>
  <script src="../dist/gridstack-all.js"></script>

</head>
<body>
  <h1>Simple mobile demo</h1>
  <p>shows resize handle on mobile and support native touch events</p>
  <div class="grid-stack"></div>
  <script type="text/javascript">
    let grid = GridStack.init({
      column: 3,
    });
    grid.load([{x:0, y:0, content: '1'}, {x:1, y:0, h:2, content: '2'}, {x:2, y:0, content: '3'}])
  </script>
</body>
</html>

nested.html:

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Nested grids demo</title>
  <link rel="stylesheet" href="demo.css"/>
  <script src="../dist/gridstack-all.js"></script>
</head>
<body>
  <div class="container-fluid">
    <h1>Nested grids demo</h1>
    <p>This example shows v5.x dragging between nested grids (dark yellow) and parent grid (bright yellow.)<br>
      Use v9.2 <b>sizeToContent:true</b> on first subgrid item parent to grow/shrink as needed, while leaving leaf green items unchanged.<br>
      Uses v3.1 API to load the entire nested grid from JSON.<br>
      Nested grids uses v5 <b>column:'auto'</b> to keep items same size during resize.</p>
    <div class="actions" style="display: flex; flex-direction: row; gap: 5px;">
      <a class="btn btn-primary" onClick="addWidget()" href="#">Add Widget</a>
      <a class="btn btn-primary" onClick="addNewWidget('.sub1')" href="#">Add Widget Grid1</a>
      <a class="btn btn-primary" onClick="addNewWidget('.sub2')" href="#">Add Widget Grid2</a>
      <a class="btn btn-primary" onClick="addNested()" href="#">Add Nested Grid</a>
      <!-- add .grid-stack-item for acceptWidgets:true -->
      <div class="sidebar-item grid-stack-item">Drag nested</div>
    </div>
    <br />
    <div>
      <span>Grid Mode: </span>
      <input type="radio" id="static" name="mode" value="true" onClick="setStatic(true)"><label for="static">static</label>
      <input type="radio" id="edit" name="mode" value="false" checked onClick="setStatic(false)"><label for="edit">editable</label>
    </div>
    <span>entire save/re-create:</span>
    <a class="btn btn-primary" onClick="save()" href="#">Save</a>
    <a class="btn btn-primary" onClick="destroy()" href="#">Destroy</a>
    <a class="btn btn-primary" onClick="load()" href="#">Create</a>
    <span>partial save/load:</span>
    <a class="btn btn-primary" onClick="save(true, false)" href="#">Save list</a>
    <a class="btn btn-primary" onClick="save(false, false)" href="#">Save no content</a>
    <a class="btn btn-primary" onClick="destroy(false)" href="#">Clear</a>
    <a class="btn btn-primary" onClick="load(false)" href="#">Load</a>
    <br><br>
    <!-- grid will be added here -->
  </div>
  <script src="events.js"></script>
  <script type="text/javascript">
    // NOTE: REAL apps would sanitize-html or DOMPurify before blinding setting innerHTML. see #2736
    GridStack.renderCB = function(el, w) {
      if (w.content) el.innerHTML = w.content;
    };

    let staticGrid = false;
    let sub1 = [ {x:0, y:0}, {x:1, y:0}, {x:2, y:0}, {x:3, y:0}, {x:0, y:1}, {x:1, y:1}];
    let sub2 = [ {x:0, y:0, h:2}, {x:1, y:1, w:2}];
    let count = 0;
    [...sub1, ...sub2].forEach(d => d.content = String(count++));
    let options = { // main grid options
      staticGrid, // test - force children to inherit too if we set to true above ^^^
      // disableDrag: true,
      // disableResize: true,
      cellHeight: 50,
      margin: 5,
      minRow: 2, // don't collapse when empty
      acceptWidgets: true,
      id: 'main',
      resizable: { handles: 'se,e,s,sw,w'},
      // subGridOpts, // options for all subgrids, but defaults to column='auto' now so no need.
      children: [
        {x:0, y:0, content: 'regular item'},
        {x:1, y:0, w:4, h:4, sizeToContent: true, content: '<div>nested grid sizeToContent:true with some header content</div>', subGridOpts: {children: sub1, id:'sub1_grid', class: 'sub1'}},
        {x:5, y:0, w:3, h:4, subGridOpts: {children: sub2, id:'sub2_grid', class: 'sub2'}},
      ]
    };

    // create and load it all from JSON above
    let grid = GridStack.addGrid(document.querySelector('.container-fluid'), options);

    // add debug event handlers to main grid (new v12.1 handles sub-grids too)
    addEvents(grid);

    // setup drag drop behavior
    let sidebarContent = [
     { w:2, h:2, subGridOpts: { children: [{content: 'nest 1'}, {content: 'nest 2'}]}}
    ];
    GridStack.setupDragIn('.sidebar-item', undefined, sidebarContent);

    function setStatic(val) {
      staticGrid = val;
      grid.setStatic(staticGrid);
    }

    function addWidget() {
      grid.addWidget({x:0, y:100, content:"new item"});
    }

    function addNested() {
      grid.addWidget({x:0, y:100, sizeToContent: true, subGridOpts: {
        children: [ {content: 'hello'}, {y:1, content: 'world'}],
        ...subOptions}
      });
    }

    function addNewWidget(selector) {
      let subGrid = document.querySelector(selector).gridstack;
      let node = {
        x: Math.round(6 * Math.random()),
        y: Math.round(5 * Math.random()),
        w: Math.round(1 + 1 * Math.random()),
        h: Math.round(1 + 1 * Math.random()),
        content: String(count++)
      };
      subGrid.addWidget(node);
      return false;
    };

    //--- end of Drag and Drop Nested widget logic

    function save(content = true, full = true) {
      options = grid.save(content, full);
      console.log(options);
      // console.log(JSON.stringify(options));
    }
    function destroy(full = true) {
      if (full) {
        grid.off('dropped');
        grid.destroy();
        grid = undefined;
      } else {
        grid.removeAll();
      }
    }
    function load(full = true) {
      if (full) {
        grid = GridStack.addGrid(document.querySelector('.container-fluid'), options);
      } else {
        grid.load(options);
      }
    }

  </script>
</body>
</html>

nested_advanced.html:

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Advance Nested grids demo</title>
  <link rel="stylesheet" href="demo.css"/>
  <!-- test using CSS rather than minRow -->
  <style type="text/css">
    .container-fluid > .grid-stack { min-height: 250px}
  </style>
  <script src="../dist/gridstack-all.js"></script>
</head>
<body>
  <div class="container-fluid">
    <h1>Advanced Nested grids demo</h1>
    <p>Create sub-grids (darker background) on the fly, by dragging items completely over others (nest) vs partially (push) using
      the new v7 API <code>GridStackOptions.subGridDynamic=true</code></p>
    <p>This will use the new delay drag&drop option <code>DDDragOpt.pause</code> to tell the gesture difference</p>
    <a class="btn btn-primary" onClick="addMainWidget()" href="#">Add Widget</a>
    <a class="btn btn-primary" onClick="addNewWidget(0)" href="#">Add W Grid0</a>
    <a class="btn btn-primary" onClick="addNewWidget(1)" href="#">Add W Grid1</a>
    <a class="btn btn-primary" onClick="addNewWidget(2)" href="#">Add W Grid2</a>
    <span>entire option+layout:</span>
    <a class="btn btn-primary" onClick="save()" href="#">Save Full</a>
    <a class="btn btn-primary" onClick="destroy()" href="#">Destroy</a>
    <a class="btn btn-primary" onClick="load()" href="#">Re-create</a>
    <span>layout list:</span>
    <a class="btn btn-primary" onClick="save(true, false)" href="#">Save layout</a>
    <a class="btn btn-primary" onClick="save(false, false)" href="#">Save layout no content</a>
    <a class="btn btn-primary" onClick="destroy(false)" href="#">Clear</a>
    <a class="btn btn-primary" onClick="load(false)" href="#">Load</a>
    <br><br>
    <!-- grid will be added here -->
  </div>
  <p>Output</p>
  <textarea id="saved" style="width:100%; height:200px;"></textarea>
  <script type="text/javascript">
    let subOptions = {
      cellHeight: 50, // should be 50 - top/bottom
      column: 'auto', // size to match container
      acceptWidgets: true, // will accept .grid-stack-item by default
      margin: 5,
      subGridDynamic: true, // make it recursive for all future sub-grids
    };
    let main = [{x:0, y:0}, {x:0, y:1}, {x:1, y:0}]
    let sub1 = [{x:0, y:0}];
    let sub0 = [{x:0, y:0}, {x:1, y:0}];
    // let sub0 = [{x:0, y:0}, {x:1, y:0}, {x:1, y:1, h:2, subGridOpts: {children: sub1, ...subOptions}}];
    let options = { // main grid options
      cellHeight: 50,
      margin: 5,
      minRow: 2, // don't collapse when empty
      acceptWidgets: true,
      subGridOpts: subOptions,
      subGridDynamic: true, // v7 api to create sub-grids on the fly
      children: [
        ...main,
        {x:2, y:0, w:2, h:3, id: 'sub0', subGridOpts: {children: sub0, ...subOptions}},
        {x:4, y:0, h:2, id: 'sub1', subGridOpts: {children: sub1, ...subOptions}},
        // {x:2, y:0, w:2, h:3, subGridOpts: {children: [...sub1, {x:0, y:1, subGridOpts: subOptions}], ...subOptions}/*,content: "<div>nested grid here</div>"*/},
      ]
    };
    let count = 0;
    // create unique ids+content so we can incrementally load() and not re-create anything (updates)
    [...main, ...sub0, ...sub1].forEach(d => d.id = d.content = String(count++));

    // create and load it all from JSON above
    document.querySelector('#saved').value = JSON.stringify(options);
    let grid = GridStack.addGrid(document.querySelector('.container-fluid'), options);

    function addMainWidget() {
      grid.addWidget({x:0, y:100, content:"new item"});
    }

    function addNewWidget(i) {
      let subGrid = document.querySelectorAll('.grid-stack-nested')[i]?.gridstack;
      if (!subGrid) return;
      let node = {
        // x: Math.round(6 * Math.random()),
        // y: Math.round(5 * Math.random()),
        // w: Math.round(1 + 1 * Math.random()),
        // h: Math.round(1 + 1 * Math.random()),
        content: String(count++)
      };
      subGrid.addWidget(node);
      return false;
    };

    function save(content = true, full = true) {
      options = grid?.save(content, full);
      console.log(options);
      document.querySelector('#saved').value = JSON.stringify(options);
    }
    function destroy(full = true) {
      if (!grid) return;
      if (full) {
        grid.destroy();
        grid = undefined;
      } else {
        grid.removeAll();
      }
    }
    function load(full = true) {
      // destroy(full); // in case user didn't call
      if (full || !grid) {
        grid = GridStack.addGrid(document.querySelector('.container-fluid'), options);
      } else {
        grid.load(options);
      }
    }

    // save(true, false); load(false); // TESTing

  </script>
</body>
</html>
nested_constraint.html:
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Constraint nested grids demo</title>
  <link rel="stylesheet" href="demo.css"/>
  <script src="../dist/gridstack-all.js"></script>
  <style type="text/css">
    .grid-stack-item.sub .grid-stack-item-content {
      background: lightpink;
    }
  </style>
</head>
<body>
  <div class="container-fluid">
    <h1>Constraint Nested grids demo</h1>
    <p>This example shows sub-grids only accepting pink items, while parent accept all.</p>
    <a class="btn btn-primary" onClick="addNested()" href="#">Add Widget</a>
    <a class="btn btn-primary" onClick="addNewWidget('.sub1')" href="#">Add Widget Grid1</a>
    <a class="btn btn-primary" onClick="addNewWidget('.sub2')" href="#">Add Widget Grid2</a>
    <span>entire save/re-create:</span>
    <a class="btn btn-primary" onClick="save()" href="#">Save</a>
    <a class="btn btn-primary" onClick="destroy()" href="#">Destroy</a>
    <a class="btn btn-primary" onClick="load()" href="#">Create</a>
    <span>partial save/load:</span>
    <a class="btn btn-primary" onClick="save(true, false)" href="#">Save list</a>
    <a class="btn btn-primary" onClick="save(false, false)" href="#">Save no content</a>
    <a class="btn btn-primary" onClick="destroy(false)" href="#">Clear</a>
    <a class="btn btn-primary" onClick="load(false)" href="#">Load</a>
    <br><br>
    <!-- grid will be added here -->
  </div>

  <script type="text/javascript">
    let sub1 = [ {x:0, y:0}, {x:1, y:0}, {x:2, y:0}, {x:3, y:0}, {x:0, y:1}, {x:1, y:1}];
    let sub2 = [ {x:0, y:0}, {x:0, y:1, w:2}];
    let count = 0;
    [...sub1, ...sub2].forEach(d => d.content = String(count++));
    let subOptions = {
      cellHeight: 50,
      column: 'auto', // size to match container
      itemClass: 'sub', // style sub items differently and use to prevent dragging in/out
      acceptWidgets: '.grid-stack-item.sub', // only pink sub items can be inserted
      margin: 2,
      minRow: 1, // don't collapse when empty
    };
    let options = { // main grid options
      cellHeight: 50,
      margin: 5,
      minRow: 2, // don't collapse when empty
      acceptWidgets: true,
      id: 'main',
      children: [
        {y:0, content: 'regular item'},
        {x:1, w:4, h:4, subGridOpts: {children: sub1, class: 'sub1', ...subOptions}},
        {x:5, w:4, h:4, subGridOpts: {children: sub2, class: 'sub2', ...subOptions}},
      ]
    };

    // create and load it all from JSON above
    let grid = GridStack.addGrid(document.querySelector('.container-fluid'), options);

    addNested = function() {
      grid.addWidget({x:0, y:100, content:"new item"});
    }

    addNewWidget = function(selector) {
      let subGrid = document.querySelector(selector).gridstack;
      let node = {
        x: Math.round(6 * Math.random()),
        y: Math.round(5 * Math.random()),
        w: Math.round(1 + 1 * Math.random()),
        h: Math.round(1 + 1 * Math.random()),
        content: String(count++)
      };
      subGrid.addWidget(node);
      return false;
    };

    save = function(content = true, full = true) {
      options = grid.save(content, full);
      console.log(options);
      // console.log(JSON.stringify(options));
    }
    destroy = function(full = true) {
      if (full) {
        grid.destroy();
        grid = undefined;
      } else {
        grid.removeAll();
      }
    }
    load = function(full = true) {
      if (full) {
        grid = GridStack.addGrid(document.querySelector('.container-fluid'), options);
      } else {
        grid.load(options);
      }
    }

  </script>
</body>
</html>
react-hooks-controlled-multiple.html
<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Gridstack.js React integration example</title>
  <link rel="stylesheet" href="demo.css" />
  <script src="../dist/gridstack-all.js"></script>

  <!-- Scripts to use react inside html - DEVELOPMENT FILES -->
  <script src="https://unpkg.com/react@16/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/babel-standalone@6.15.0/babel.js"></script>
</head>

<body>
  <div>
    <h2>Controlled stack</h2>
    <div id="controlled-stack"></div>
  </div>
</body>

<script type="text/babel">
  /***********************************************************************************************************/
  /********************************* NOT IDEAL - see comments below line ~96) ********************************/
  /***********************************************************************************************************/

  const { useState, useEffect, useLayoutEffect, createRef, useRef } = React
  const Item = ({ id }) => <div>{id}</div>

  //
  // Controlled example
  //
  const ControlledStack = ({ items, addItem, changeItems }) => {
    const refs = useRef({})
    const gridRef = useRef()
    const gridContainerRef = useRef(null)
    refs.current = {}

    if (Object.keys(refs.current).length !== items.length) {
      items.forEach(({ id }) => {
        refs.current[id] = refs.current[id] || createRef()
      })
    }

    useLayoutEffect(() => {
      if (!gridRef.current) {
        // no need to init twice (would will return same grid) or register dup events
        const grid = gridRef.current = GridStack.init(
          {
            float: false,
            acceptWidgets: true,
            column: 6,
            minRow: 1,
          },
          gridContainerRef.current
        )
        .on('added', (ev, gsItems) => {
          if (grid._ignoreCB) return;
          // remove the new element as React will re-create it again (dup) once we add to the list or we get 2 of them with same ids but different DOM el!
          // TODO: this is really not ideal - we shouldn't mix React templating with GS making it own edits as those get out of sync! see comment below ~96.
          gsItems.forEach(n => {
            grid.removeWidget(n.el, true, false); // true=remove DOM, false=don't call use back!
            // can't pass n directly even though similar structs as it has n.el.gridstackNode which gives JSON error for circular write.
            addItem({id:n.id, x:n.x, y:n.y, w:n.w, h:n.h});
          });
        })
        .on('removed change', (ev, gsItems) => {
          // synch our version from GS....
          // Note: we could just update those few items passed but save() is fast and it's easier to just set an entire new list
          // and since we have the same ids, React will not re-create anything...
          const newItems = grid.save(false); // saveContent=false
          changeItems(newItems);
        })
        // addEvents(grid, i);
      } else {
        //
        // update existing GS layout, which is optimized to updates only diffs and add new/delete items as well
        //
        const grid = gridRef.current;
        const layout = items.map((a) => 
          // use exiting nodes (which will skip diffs being the same) else new elements Widget but passing the React dom .el so we know what to makeWidget() on!
          refs.current[a.id].current.gridstackNode || {...a, el: refs.current[a.id].current}
        );
        grid._ignoreCB = true; // hack: ignore added/removed since we're the one doing the update
        grid.load(layout);
        delete grid._ignoreCB;
      }

    }, [items])

    return (
      // ********************
      // NOTE: constructing DOM grid items in template when gridstack is also allowed creating (dragging between grids, or adding/removing from say a toolbar)
      // is NOT A GOOD IDEA as you end up fighting between gridstack users' edits and your template items structure which are not in sync.
      // At best, you end up re-creating widgets DOM (from React template) and all their content & state after a widget was inserted/re-parented by the user.
      // a MUCH better way is to let GS create React components using it's API/user interactions, with only initial load() of a stored layout.
      // See the Angular component wrapper that does that: https://github.com/gridstack/gridstack.js/tree/master/angular/ (lib author uses Angular)
      // ...TBD creating React equivalent...
      //
      // Also templating forces you to spell out the 15+ GridStackWidget attributes (only x,y,w,h done below), instead of passing an option structure that 
      // supports everything, is not robust as things get added and pollutes the DOM attr for default/missing entries, vs the optimized code in GS.
      // ********************
      <div style={{ width: '100%', marginRight: '10px' }}>
        <div className="grid-stack" ref={gridContainerRef}>
          {items.map((item, i) => {
            return (
              <div ref={refs.current[item.id]} key={item.id} className="grid-stack-item" gs-id={item.id} gs-w={item.w} gs-h={item.h} gs-x={item.x} gs-y={item.y}>
                <div className="grid-stack-item-content">
                  <Item {...item} />
                </div>
              </div>
            )
          })}
        </div>
        <code>
          <pre>{JSON.stringify(items, null, 2)}</pre>

        </code>
      </div>
    )

}

const ControlledExample = () => {
const [items1, setItems1] = useState([{ id: 'item-1-1', x: 0, y: 0, w: 2, h: 2 }, { id: 'item-1-2', x: 2, y: 0, w: 2, h: 2 }])
const [items2, setItems2] = useState([{ id: 'item-2-1', x: 0, y: 0 }, { id: 'item-2-2', x: 0, y: 1 }, { id: 'item-2-3', x: 1, y: 0 }])

    return (
      <div>
        <div style={{display: 'flex', gap: '16px', marginBottom: '16px'}}>
          <div></div>
        </div>

        <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
          <button onClick={() => setItems1(items => [...items, { id: `item-1-${Date.now()}`, x: 2, y: 0, w: 2, h: 2 }])}>Add Item to 1 grid</button>
          <button onClick={() => setItems2(items => [...items, { id: `item-2-${Date.now()}`, x: 2, y: 0, w: 2, h: 2 }])}>Add Item to 2 grid</button>
        </div>
        <div style={{display: 'flex'}}>
          <div style={{ display: 'flex', width: '50%' }}>
            <ControlledStack
              items={items1}
              addItem={(item) => {
                setItems1(items => [...items, item])
              }}
              changeItems={(items) => setItems1(items)}
            />
          </div >
          <div style={{ display: 'flex', width: '50%' }}>
            <ControlledStack
              items={items2}
              addItem={(item) => {
                setItems2(items => [...items, item])
              }}
              changeItems={(items) => setItems2(items)}
            />
          </div>
        </div >
      </div>
    )

}

ReactDOM.render(<ControlledExample />, document.getElementById('controlled-stack'))
</script>

</html>

react-hooks.html

<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Gridstack.js React integration example</title>
  <link rel="stylesheet" href="demo.css" />
  <script src="../dist/gridstack-all.js"></script>

  <!-- Scripts to use react inside html -->
  <script src="https://unpkg.com/react@16/umd/react.production.min.js"></script>
  <script src="https://unpkg.com/react-dom@16/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/babel-standalone@6.15.0/babel.min.js"></script>
</head>

<body>
  <div>
    <h1>Using GridStack.js with React hooks</h1>
    <p>
      As with any virtual DOM based framework, you need to check if React has rendered the DOM (or any updates to it)
      <strong>before</strong> you initialize GridStack or call its methods. This example shows how to make rendered
      components widgets:
    </p>
    <ol>
      <li>Render items, each with a reference</li>
      <li>Convert each rendered item to a widget using the reference and the <a
          href="https://github.com/gridstack/gridstack.js/tree/master/doc#makewidgetel">
          makeWidget()</a> function</li>
    </ol>
  </div>
  <div>
    <h2>Controlled stack</h2>
    <div id="controlled-stack"></div>
  </div>
  <div>
    <h2>Uncontrolled stack</h2>
    <div id="uncontrolled-stack"></div>
  </div>
</body>

<script type="text/babel">
  const { useState, useEffect, createRef, useRef } = React
  const Item = ({ id }) => <div>{id}</div>

  //
  // Controlled example
  //
  const ControlledStack = ({ items, addItem }) => {
    const refs = useRef({})
    const gridRef = useRef()

    if (Object.keys(refs.current).length !== items.length) {
      items.forEach(({ id }) => {
        refs.current[id] = refs.current[id] || createRef()
      })
    }

    useEffect(() => {
      gridRef.current = gridRef.current ||
        GridStack.init({float: true}, '.controlled')
      const grid = gridRef.current
      grid.batchUpdate()
      grid.removeAll(false)
      items.forEach(({ id }) => grid.makeWidget(refs.current[id].current))
      grid.batchUpdate(false)
    }, [items])

    return (
      <div>
        <button onClick={addItem}>Add new widget</button>
        <div className={`grid-stack controlled`}>
          {items.map((item, i) => {
            return (
              <div ref={refs.current[item.id]} key={item.id} className={'grid-stack-item'}>
                <div className="grid-stack-item-content">
                  <Item {...item} />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const ControlledExample = () => {
    const [items, setItems] = useState([{ id: 'item-1' }, { id: 'item-2' }])
    return (
      <ControlledStack
        items={items}
        addItem={() => setItems([...items, { id: `item-${items.length + 1}` }])}
      />
    )
  }

  //
  // Uncontrolled example
  //
  const UncontrolledExample = () => {
    const gridRef = useRef()
    const [state, setState] = useState({
      count: 0,
      info: '',
      items: [
        { x: 2, y: 1, h: 2 },
        { x: 2, y: 4, w: 3 },
        { x: 4, y: 2 },
        { x: 3, y: 1, h: 2 },
        { x: 0, y: 6, w: 2, h: 2 },
      ],
    })

    useEffect(() => {
      gridRef.current = gridRef.current ||
        GridStack.init(
          {
            float: true,
            cellHeight: '70px',
            minRow: 1,
          },
          '.uncontrolled'
        )
      const grid = gridRef.current

      grid.on('dragstop', (event, element) => {
        const node = element.gridstackNode
        setState(prevState => ({
          ...prevState,
          info: `you just dragged node #${node.id} to ${node.x},${node.y} – good job!`,
        }))

        let timerId
        window.clearTimeout(timerId)
        timerId = window.setTimeout(() => {
          setState(prevState => ({
            ...prevState,
            info: '',
          }))
        }, 2000)
      })
    }, [])

    return (
      <div>
        <button
          onClick={() => {
            const grid = gridRef.current
            const node = state.items[state.count] || {
              x: Math.round(12 * Math.random()),
              y: Math.round(5 * Math.random()),
              w: Math.round(1 + 3 * Math.random()),
              h: Math.round(1 + 3 * Math.random()),
            }
            node.id = node.content = String(state.count)
            setState(prevState => ({
              ...prevState,
              count: prevState.count + 1,
            }))
            grid.addWidget(node)
          }}
        >
          Add Widget
        </button>
        <div>{JSON.stringify(state)}</div>
        <section class="grid-stack uncontrolled"></section>
      </div>
    )
  }

  ReactDOM.render(<ControlledExample />, document.getElementById('controlled-stack'))
  ReactDOM.render(<UncontrolledExample />, document.getElementById('uncontrolled-stack'))
</script>
</html>

react.html

<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Gridstack.js React integration example</title>
    <link rel="stylesheet" href="demo.css" />
    <script src="../dist/gridstack-all.js"></script>

    <!-- Scripts to use react inside html -->
    <script src="https://unpkg.com/react@16/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@16/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/babel-standalone@6.15.0/babel.min.js"></script>

  </head>

  <body>
    <div id="root"></div>
  </body>

  <script type="text/babel">
    class App extends React.Component {
      state = {
        count: 0,
        info: "",
        items: [
          { x: 2, y: 1, h: 2 },
          { x: 2, y: 4, w: 3 },
          { x: 4, y: 2 },
          { x: 3, y: 1, h: 2 },
          { x: 0, y: 6, w: 2, h: 2 },
        ],
      };

      componentDidMount() {
        // Provides access to the GridStack instance across the React component.
        this.grid = GridStack.init({
          float: true,
          cellHeight: "70px",
          minRow: 1,
        });

        this.grid.on("dragstop", (event, element) => {
          const node = element.gridstackNode;
          this.setState({
            info: `you just dragged node #${node.id} to ${node.x},${node.y} – good job!`,
          });

          // Clear the info text after a two second timeout.
          // Clears previous timeout first.
          window.clearTimeout(this.timerId);
          this.timerId = window.setTimeout(() => {
            this.setState({
              info: "",
            });
          }, 2000);
        });
      }

      addNewWidget = () => {
        const node = this.state.items[this.state.count] || {
          x: Math.round(12 * Math.random()),
          y: Math.round(5 * Math.random()),
          w: Math.round(1 + 3 * Math.random()),
          h: Math.round(1 + 3 * Math.random()),
        };
        node.id = node.content = String(this.state.count);
        this.setState((prevState) => ({
          count: prevState.count + 1,
        }));
        this.grid.addWidget(node);
      };

      render() {
        return (
          <div>
            <h1>How to integrate GridStack.js with React.js</h1>
            <p>
              As with any virtual DOM based framework, you need to check if React
              has rendered the DOM (or any updates to it){" "}
              <strong>before</strong> you initialize GridStack or call its
              methods. As a basic example, check this component's{" "}
              <code>mounted</code> hook.
            </p>
            <p>
              If your app requires more complex render logic than the inline
              template in `addWidget`, consider&nbsp;
              <a href="https://github.com/gridstack/gridstack.js/tree/master/doc#makewidgetel">
                makeWidget
              </a>
              &nbsp;to let React deal with DOM rendering.
            </p>
            <button type="button" onClick={this.addNewWidget}>
              Add Widget
            </button>
            {this.state.info}
            <section class="grid-stack"></section>
          </div>
        );
      }
    }

    ReactDOM.render(<App />, document.getElementById("root"));
  </script>
</html>

responsive.html

<!DOCTYPE html>
<html lang="en">
<head>
  <title>Responsive column</title>

  <link rel="stylesheet" href="demo.css"/>
  <script src="../dist/gridstack-all.js"></script>
</head>
<body>
  <div>
    <h1>Responsive: by column size</h1>
    <p>Using new v10 <code>GridStackOptions.columnOpts: { columnWidth: x }</code></p>

    <div>
      <span>Number of Columns:</span> <span id="column-text"></span>
    </div>
    <div>
      <label>Choose re-layout:</label>
      <select onchange="grid.opts.columnOpts.layout = this.value">
        <option value="moveScale">move + scale</option>
        <option value="move">move</option>
        <option value="scale">scale</option>
        <option value="list">list</option>
        <option value="compact">compact</option>
        <option value="none">none</option>
      </select>
      <a onClick="grid.removeAll()" class="btn btn-primary" href="#">Clear</a>
      <a onClick="addWidget()" class="btn btn-primary" href="#">Add Widget</a>
    </div>
    <br/>
    <div class="grid-stack">
    </div>

  </div>

  <script type="text/javascript">
    let text = document.querySelector('#column-text');

    function addWidget() {
      grid.addWidget({x:0, y:0, w:4, id:count++, content: '4x1'});
    };
    
    let count = 0;
    let items = [ // our initial 12 column layout loaded first so we can compare
      {x: 0, y: 0},
      {x: 1, y: 0, w: 2, h: 2, minW: 4},
      {x: 4, y: 0, w: 2},
      {x: 1, y: 3, w: 4},
      {x: 5, y: 3, w: 2},
      {x: 0, y: 4, w: 12}
    ];
    items.forEach(n => {n.id = count; n.content = String(count++)});

    let grid = GridStack.init({
      cellHeight: 80, // use 'auto' to make square
      animate: false, // show immediate (animate: true is nice for user dragging though)
      columnOpts: {
        columnWidth: 100, // wanted width
      },
      children: items,
      float: true })
    .on('change', (ev, gsItems) => text.innerHTML = grid.getColumn());
    text.innerHTML = grid.getColumn();
  </script>
</body>
</html>

responsive_break.html

<!DOCTYPE html>
<html lang="en">
<head>
  <title>Responsive breakpoint</title>

  <link rel="stylesheet" href="demo.css"/>
  <script src="../dist/gridstack-all.js"></script>
</head>
<body>
  <div>
    <h1>Responsive: using breakpoint</h1>
    <p>Using new v10 <code>GridStackOptions.columnOpts: { breakpoints: [] }</code></p>
    <div>
      <span>Number of Columns:</span> <span id="column-text"></span>
    </div>
    <div>
      <label>Choose re-layout:</label>
      <select onchange="grid.opts.columnOpts.layout = this.value">
        <option value="moveScale">move + scale</option>
        <option value="move">move</option>
        <option value="scale">scale</option>
        <option value="list">list</option>
        <option value="compact">compact</option>
        <option value="none">none</option>
      </select>
      <a onClick="grid.removeAll()" class="btn btn-primary" href="#">Clear</a>
      <a onClick="addWidget()" class="btn btn-primary" href="#">Add Widget</a>
    </div>
    <br/>
    <div class="grid-stack">
    </div>
  </div>

  <script type="text/javascript">
    let text = document.querySelector('#column-text');

    function addWidget() {
      grid.addWidget({x:0, y:0, w:4, id:count++, content: '4x1'});
    };
    
    let count = 0;
    let items = [ // our initial 12 column layout loaded first so we can compare
      {x: 0, y: 0},
      {x: 1, y: 0, w: 2, h: 2},
      {x: 4, y: 0, w: 2},
      {x: 1, y: 3, w: 4},
      {x: 5, y: 3, w: 2},
      {x: 0, y: 4, w: 12}
    ];
    items.forEach(n => {n.id = count; n.content = String(count++)});

    let grid = GridStack.init({
      cellHeight: 80,
      animate: false, // show immediate (animate: true is nice for user dragging though)
      columnOpts: {
        breakpointForWindow: true,  // test window vs grid size
        breakpoints: [{w:700, c:1},{w:850, c:3},{w:950, c:6},{w:1100, c:8}]
      },
      children: items,
      float: true })
    .on('change', (ev, gsItems) => text.innerHTML = grid.getColumn());
    text.innerHTML = grid.getColumn();
  </script>
</body>
</html>
responsive_none.html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Responsive layout:'none'</title>

  <link rel="stylesheet" href="demo.css"/>
  <script src="../dist/gridstack-all.js"></script>

</head>
<body>
  <div class="container-fluid">
    <h1>Responsive layout:'none'</h1>
    <p>show loading a fixed (<b>layout:'none'</b>) but still responsive design (150px columns) with items w:2-4</p>
    <p>showing how it will not change the layout unless it doesn't fit. loading into small view remembers the full layout (column:6)</p>
    <div class="grid-stack"></div>
  </div>
  <script src="events.js"></script>
  <script type="text/javascript">
    let children = [ {}, {}, {}];
    children.forEach((w, i) => { 
      w.x=i, w.y=i, // comment out to have autoPosition:true which behaves differently
      w.w=i+2, w.content = `${i} w:${w.w}`})
    
    GridStack.init({
      children,
      column: 6,
      cellHeight: 100,
      columnOpts: {
        columnWidth: 150,
        columnMax: 12,
        layout: 'none',
      },
    });
  </script>
</body>
</html>

serialization.html

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Serialization demo</title>

  <link rel="stylesheet" href="demo.css"/>
  <script src="../dist/gridstack-all.js"></script>
</head>
<body>
  <div class="container-fluid">
    <h1>Serialization demo</h1>
    <a onclick="saveGrid()" class="btn btn-primary" href="#">Save</a>
    <a onclick="loadGrid()" class="btn btn-primary" href="#">Load</a>
    <a onclick="saveFullGrid()" class="btn btn-primary" href="#">Save Full</a>
    <a onclick="loadFullGrid()" class="btn btn-primary" href="#">Load Full</a>
    <a onclick="clearGrid()" class="btn btn-primary" href="#">Clear</a>
    <br/><br/>
    <div id="gridCont"><div class="grid-stack"></div></div>
    <hr/>
    <textarea id="saved-data" style="width: 100%" cols="100" rows="20" readonly="readonly"></textarea>
  </div>
  <script src="events.js"></script>
  <script type="text/javascript">
    // NOTE: REAL apps would sanitize-html or DOMPurify before blinding setting innerHTML. see #2736
    GridStack.renderCB = function(el, w) {
      el.innerHTML = w.content;
    };

    let serializedData = [
      {x: 0, y: 0, w: 2, h: 2},
      {x: 2, y: 1, w: 2, h: 3,
      content: `<button onclick=\"alert('clicked!')\">Press me</button><div>text area</div><div><textarea></textarea></div><div>Input Field</div><input type="text"><div contenteditable=\"true\">Editable Div</div><div class=\"no-drag\">no drag</div>`},
      {x: 4, y: 1},
      {x: 1, y: 3},
      {x: 2, y: 3, w:3},
    ];
    serializedData.forEach((n, i) => {
      n.id = String(i);
      n.content = `<button onclick="removeWidget(this.parentElement.parentElement)">X</button><br> ${i}<br> ${n.content ? n.content : ''}`;
    });
    let serializedFull;

    let grid = GridStack.init({
      minRow: 1, // don't let it collapse when empty
      cellHeight: 80,
      float: true,
      draggable: { cancel: '.no-drag'} // example of additional custom elements to skip drag on
    }).load(serializedData);
    addEvents(grid);

    // 2.x method - just saving list of widgets with content (default)
    function loadGrid() {
      grid.load(serializedData);
    }

    // 2.x method
    function saveGrid() {
      delete serializedFull;
      serializedData = grid.save();
      document.querySelector('#saved-data').value = JSON.stringify(serializedData, null, '  ');
    }

    // 3.1 full method saving the grid options + children (which is recursive for nested grids)
    function saveFullGrid() {
      serializedFull = grid.save(true, true);
      serializedData = serializedFull.children;
      document.querySelector('#saved-data').value = JSON.stringify(serializedFull, null, '  ');
    }

    // 3.1 full method to reload from scratch - delete the grid and add it back from JSON
    function loadFullGrid() {
      if (!serializedFull) return;
      grid.destroy(true); // nuke everything
      grid = GridStack.addGrid(document.querySelector('#gridCont'), serializedFull)
    }

    function clearGrid() {
      grid.removeAll();
    }

    function removeWidget(el) {
      // TEST removing from DOM first like Angular/React/Vue would do
      el.remove();
      grid.removeWidget(el, false);
    }

    // setTimeout(() => loadGrid(), 1000); // TEST force a second load which should be no-op

  </script>
</body>
</html>
demo/sizeToContent.html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>sizeToContent demo</title>

  <link rel="stylesheet" href="demo.css"/>
  <script src="../dist/gridstack-all.js"></script>
  <style type="text/css">
    .grid-stack-item-content {
      text-align: unset;
    }
    .sidebar.inline {
      width: fit-content;
      height: fit-content;
      display: inline-block;
      padding: 0;
    }
  </style>  
</head>
<body>
  <div class="container">
    <h1>sizeToContent options demo</h1>
    <p>New 9.x feature that size the items to fit their content height as to not have scroll bars
    <br>case C: `sizeToContent:false` to turn off.
    <br>case E: has soft maxsize `sizeToContent:3`, shrinking to smaller content as needed
    <br>Defaulting to different initial size (see code) to show grow/shrink behavior</p>
    <div>
      <a onClick="clearGrid()" class="btn btn-primary" href="#">clear</a>
      <a onClick="load()" class="btn btn-primary" href="#">load</a>
      column:
      <a onClick="column(8)" class="btn btn-primary" href="#">8</a>
      <a onClick="column(12)" class="btn btn-primary" href="#">12</a>
      cellHeight:
      <a onClick="cellHeight(25)" class="btn btn-primary" href="#">25</a>
      <a onClick="cellHeight('3rem')" class="btn btn-primary" href="#">3rem</a>
      <a onClick="cellHeight(50)" class="btn btn-primary" href="#">50</a>
      <a onClick="cellHeight(75)" class="btn btn-primary" href="#">75</a>
      Widget:
      <a onClick="addWidget()" class="btn btn-primary" href="#">Add</a>
      <a onClick="makeWidget()" class="btn btn-primary" href="#">Make w:2</a>
      <div class="sidebar inline">
        <div class="grid-stack-item" gs-w="2" gs-h="3">
          <div class="grid-stack-item-content"><div>Insert me 2x3</div></div>
        </div>
      </div>
    </div>
    <br>
    <div id="grid1"></div>
    <p>from DOM test:</p>
    <div id="grid2">
      <div class="grid-stack-item" gs-x="11" gs-y="0" gs-h="4">
        <div class="grid-stack-item-content">
          <div>DOM: h:4 sized down</div>
        </div>
      </div>
    </div>

  </div>
  <script type="text/javascript">
    // NOTE: REAL apps would sanitize-html or DOMPurify before blinding setting innerHTML. see #2736
    GridStack.renderCB = function(el, w) {
      el.innerHTML = w.content;
    };

    let text ='some very large content that will normally not fit in the window.'
    text = text + text;
    let count = 0;
    let items = [
      // {x:0, y:0, w:2, h:3, sizeToContent: false, content: `<div>A no h: ${text}</div>`},
      {x:0, y:0, w:2, content: `<div>A no h: ${text}</div>`},
      {x:2, y:0, w:1, h:2, content: '<div>B: shrink h=2</div>'}, // make taller than needed upfront
      {x:3, y:0, w:2, sizeToContent: false, content: `<div>C: WILL SCROLL. ${text}</div>`}, // prevent this from fitting testing
      {x:0, y:1, w:3, content: `<div>D no h: ${text} ${text}</div>`},
      {x:3, y:1, w:2, sizeToContent:3, content: `<div>E sizeToContent=3 <button onClick="more()">more</button><button onClick="less()">less</button><div id="dynContent">${text} ${text} ${text}</div></div>`},
    ];
    items.forEach(n => n.id = String(count++));
    let opts = {
      margin: 5,
      cellHeight: '3rem', // = 48px
      sizeToContent: true, // default to make them all fit
      resizable: { handles: 'all'}, // do all sides for testing
      acceptWidgets: true,
      // cellHeightThrottle: 100, // ms before sizeToContent happens
      // children: items, // test loading first
    }
    let grid = GridStack.init(opts, '#grid1');
    grid.load(items); // test loading after
    GridStack.init({...opts, children:undefined}, '#grid2');

    GridStack.setupDragIn('.sidebar>.grid-stack-item');

    function clearGrid() {
      grid.removeAll();
    }
    function load() {
      grid.load(items);
    }
    function column(n) {
      grid.column(n, 'none');
    }
    function cellHeight(n) {
      grid.cellHeight(n);
    }
    function addWidget() {
      grid.addWidget({content: `<div>New: ${text}</div>`});
    }
    function makeWidget() {
      let el = grid.createWidgetDivs({content: `<div>New Make: ${text}</div>`}, grid.el)
      grid.makeWidget(el, {w:2});
    }
    function more() {
      let cont = document.getElementById('dynContent');
      if (!cont) return;
      cont.innerHTML += cont.innerHTML;
      let el = cont.parentElement.parentElement.parentElement;
      grid.resizeToContent(el)
    }
    function less() {
      let cont = document.getElementById('dynContent');
      if (!cont) return;
      let content = cont.innerHTML;
      cont.innerHTML = content.substring(0, content.length/2);
      let el = cont.parentElement.parentElement.parentElement;
      grid.resizeToContent(el);
    }

    // TEST
    // grid.update(grid.engine.nodes[0].el, {x:7});
    // load();

  </script>
</body>
</html>

demo/transform.html

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Transform Parent demo</title>

  <link rel="stylesheet" href="demo.css"/>
  <script src="../dist/gridstack-all.js"></script>

</head>
<body>
  <div class="container-fluid">
    <h1>Transform Parent demo</h1>
    <p>example where the grid parent has a translate(50px, 100px) and a scale(<span id="scale-x"></span>, <span id="scale-y"></span>)</p>
    <div>
      <a class="btn btn-primary" onClick="addNewWidget()" href="#">Add Widget</a>
      <a class="btn btn-primary" onClick="zoomIn()" href="#">Zoom in</a>
      <a class="btn btn-primary" onClick="zoomOut()" href="#">Zoom out</a>
      <a class="btn btn-primary" onClick="increaseScaleX()" href="#">Increase Scale X</a>
      <a class="btn btn-primary" onClick="decreaseScaleX()" href="#">Decrease Scale X</a>
      <a class="btn btn-primary" onClick="increaseScaleY()" href="#">Increase Scale Y</a>
      <a class="btn btn-primary" onClick="decreaseScaleY()" href="#">Decrease Scale Y</a>
    </div>
    <br><br>
    <div style="transform: translate(50px, 100px) scale(var(--global-scale-x), var(--global-scale-y)); transform-origin: 0 0;">
        <div class="grid-stack"></div>
    </div>
  </div>
  <script src="events.js"></script>
  <script type="text/javascript">
    let scaleX = 0.5;
    let scaleY = 0.5;

    let grid = GridStack.init({float: true});
    addEvents(grid);

    let items = [
      {x: 0, y: 0, w: 2, h: 2},
      {x: 2, y: 0, w: 1},
      {x: 3, y: 0, h: 1},
      {x: 0, y: 2, w: 2},
    ];
    let count = 0;

    getNode = function() {
      let n = items[count] || {
        x: Math.round(12 * Math.random()),
        y: Math.round(5 * Math.random()),
        w: Math.round(1 + 3 * Math.random()),
        h: Math.round(1 + 3 * Math.random())
      };
      n.content = n.content || String(count);
      count++;
      return n;
    };

    addNewWidget = function() {
      let w = grid.addWidget(getNode());
    };

    const updateScaleCssVariable = () => {
      document.body.style.setProperty('--global-scale-x', `${scaleX}`);
      document.body.style.setProperty('--global-scale-y', `${scaleY}`);
      document.getElementById("scale-x").textContent = scaleX.toFixed(2);
      document.getElementById("scale-y").textContent = scaleY.toFixed(2);
    }

    zoomIn = function() {
      const scaleStep = scaleX < 1 ? 0.05 : 0.1;
      scaleX += scaleStep;
      scaleY += scaleStep;
      updateScaleCssVariable();
    }

    zoomOut = function() {
      if(scaleX >= 0.2 && scaleY >= 0.2) {
        const scaleStep = scaleX < 1 ? 0.05 : 0.1;
        scaleX -= scaleStep;
        scaleY -= scaleStep;
        updateScaleCssVariable();
      }
    }

    increaseScaleX = function() {
      const scaleStep = scaleX < 1 ? 0.05 : 0.1;
      scaleX += scaleStep;
      updateScaleCssVariable();
    }

    decreaseScaleX = function() {
      if(scaleX >= 0.2) {
        const scaleStep = scaleX < 1 ? 0.05 : 0.1;
        scaleX -= scaleStep;
        updateScaleCssVariable();
      }
    }

    increaseScaleY = function() {
      const scaleStep = scaleX < 1 ? 0.05 : 0.1;
      scaleY += scaleStep;
      updateScaleCssVariable();
    }

    decreaseScaleY = function() {
      if(scaleY >= 0.2) {
        const scaleStep = scaleX < 1 ? 0.05 : 0.1;
        scaleY -= scaleStep;
        updateScaleCssVariable();
      }
    }

    updateScaleCssVariable();


    addNewWidget();
    addNewWidget();
    addNewWidget();

  </script>
</body>
</html>

demo/web-comp.html

<html>
<head>
  <title>Web Component demo</title>
  <!-- Polyfills only needed for Firefox and Edge. -->
  <script src="https://unpkg.com/@webcomponents/webcomponentsjs@latest/webcomponents-loader.js"></script>
  <link rel="stylesheet" href="demo.css"/>
  <script src="../dist/gridstack-all.js"></script>
</head>
<body>
  <h1>LitElement Web Component</h1>
  <script type="module">
    import {LitElement, html, css} from 'https://unpkg.com/lit-element@3/lit-element.js?module';

    class MyElement extends LitElement {
      static get properties() { return {} }
      render() { return html`<style>:host {display: block;} </style><slot></slot>`; }
    }
    customElements.define('my-element', MyElement);

</script>

<my-element class="grid-stack"></my-element>

<script type="text/javascript">
  let items = [
    {x:0, y:0, w:2, content: 'item 0'},
    {x:0, y:1, content: 'item 1'}
  ];
  let grid = GridStack.init();
  grid.load(items);
</script>
</body>
</html>

demo/web1.html

<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>demo1</title>

  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
  <link rel="stylesheet" href="demo.css" />

  <script type="module" src="https://unpkg.com/ionicons@4.5.10-0/dist/ionicons/ionicons.esm.js"></script>
  <script nomodule="" src="https://unpkg.com/ionicons@4.5.10-0/dist/ionicons/ionicons.js"></script>

  <script src="../dist/gridstack-all.js"></script>
</head>

<body>
  <h1>Web demo 1</h1>
  <div class="grid-stack"></div>

  <script type="text/javascript">
    // NOTE: REAL apps would sanitize-html or DOMPurify before blinding setting innerHTML. see #2736
    GridStack.renderCB = function(el, w) {
      el.innerHTML = w.content;
    };

    let children = [
      {x: 0, y: 0, w: 4, h: 2, content: '1'},
      {x: 4, y: 0, w: 4, h: 4, content: '2'},
      {x: 8, y: 0, w: 2, h: 2, content: '<p class="card-text text-center" style="margin-bottom: 0">Drag me!<p class="card-text text-center"style="margin-bottom: 0"><ion-icon name="hand" style="font-size: 300%"></ion-icon><p class="card-text text-center" style="margin-bottom: 0">'},
      {x: 10, y: 0, w: 2, h: 2, content: '4'},
      {x: 0, y: 2, w: 2, h: 2, content: '5'},
      {x: 2, y: 2, w: 2, h: 4, content: '6'},
      {x: 8, y: 2, w: 4, h: 2, content: '7'},
      {x: 0, y: 4, w: 2, h: 2, content: '8'},
      {x: 4, y: 4, w: 4, h: 2, content: '9'},
      {x: 8, y: 4, w: 2, h: 2, content: '10'},
      {x: 10, y: 4, w: 2, h: 2, content: '11'},
    ];

    let grid = GridStack.init({ cellHeight: 70, children });
    grid.on('added removed change', function(e, items) {
      let str = '';
      items.forEach(function(item) { str += ' (x,y)=' + item.x + ',' + item.y; });
      console.log(e.type + ' ' + items.length + ' items:' + str );
    });
  </script>
</body>

</html>

demo/web2.html

<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Advanced grid demo</title>

  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
  <link rel="stylesheet" href="demo.css" />

  <script type="module" src="https://unpkg.com/ionicons@4.5.10-0/dist/ionicons/ionicons.esm.js"></script>
  <script nomodule="" src="https://unpkg.com/ionicons@4.5.10-0/dist/ionicons/ionicons.js"></script>

  <script src="../dist/gridstack-all.js"></script>

  <style type="text/css">
    .grid-stack-item-removing {
      opacity: 0.8;
      filter: blur(5px);
    }
    .sidepanel-item {
      background-color: #18bc9c;
      text-align: center;
      padding: 5px;
      margin-bottom: 15px;
    }
    #trash {
      background-color: rgba(255, 0, 0, 0.4);
    }
    ion-icon {
      font-size: 300%;
    }
  </style>
</head>

<body>
  <h1>Advanced Demo</h1>
  <div class="row">
    <div class="sidepanel col-md-2 d-none d-md-block">
      <div id="trash" class="sidepanel-item">
        <ion-icon name="trash"></ion-icon>
        <div>Drop here to remove!</div>
      </div>
      <div class="grid-stack-item sidepanel-item">
        <ion-icon name="add-circle"></ion-icon>
        <div>Drag me in the dashboard!</div>
      </div>
    </div>
    <div class="col-sm-12 col-md-10">
      <div class="grid-stack"></div>
    </div>
  </div>

  <script type="text/javascript">
    // NOTE: REAL apps would sanitize-html or DOMPurify before blinding setting innerHTML. see #2736
    GridStack.renderCB = function(el, w) {
      el.innerHTML = w.content;
    };

    let children = [
      {x: 0, y: 0, w: 4, h: 2, content: '1'},
      {x: 4, y: 0, w: 4, h: 4, locked: true, content: 'locked: can\'t be pushed by others, only user!<br><ion-icon name="ios-lock"></ion-icon>'},
      {x: 8, y: 0, w: 2, h: 2, minW: 2, noResize: true, content: '<p class="card-text text-center" style="margin-bottom: 0">Drag me!<p class="card-text text-center"style="margin-bottom: 0"><ion-icon name="hand"></ion-icon><p class="card-text text-center" style="margin-bottom: 0">...but don\'t resize me!'},
      {x: 10, y: 0, w: 2, h: 2, content: '4'},
      {x: 0, y: 2, w: 2, h: 2, content: '5'},
      {x: 2, y: 2, w: 2, h: 4, content: '6'},
      {x: 8, y: 2, w: 4, h: 2, content: '7'},
      {x: 0, y: 4, w: 2, h: 2, content: '8'},
      {x: 4, y: 4, w: 4, h: 2, content: '9'},
      {x: 8, y: 4, w: 2, h: 2, content: '10'},
      {x: 10, y: 4, w: 2, h: 2, content: '11'},
    ];
    let insert = [ {h: 2, content: 'new item'}];

    let grid = GridStack.init({
      cellHeight: 70,
      acceptWidgets: true,
      removable: '#trash', // drag-out delete class
      children
    });
    GridStack.setupDragIn('.sidepanel>.grid-stack-item', undefined, insert);
    
    grid.on('added removed change', function(e, items) {
      let str = '';
      items.forEach(function(item) { str += ' (x,y)=' + item.x + ',' + item.y; });
      console.log(e.type + ' ' + items.length + ' items:' + str );
    });
  </script>
</body>

</html>
# Project Structure

Name: StoryWeaver

├── 📁 playwright-report
│ └── 📄 index.html
├── 📁 prompts
│ ├── 📄 GeneralInfo.md
│ └── 📄 GridCreation.md
├── 📁 public
├── 📁 scripts
├── 📁 src
│ ├── 📁 api
│ │ ├── 📄 api.ts
│ │ ├── 📄 apiClient.ts
│ │ ├── 📄 queries.ts
│ │ ├── 📄 queryKeys.ts
│ │ ├── 📄 schemas.ts
│ │ ├── 📄 storageService.ts
│ │ └── 📄 supabaseClient.ts
│ ├── 📁 auth
│ │ ├── 📄 AuthContext.tsx
│ │ └── 📄 authService.ts
│ ├── 📁 components
│ │ └── 📁 ui
│ │ ├── 📄 accordion.tsx
│ │ ├── 📄 badge.tsx
│ │ ├── 📄 button.tsx
│ │ ├── 📄 card.tsx
│ │ ├── 📄 dialog.tsx
│ │ ├── 📄 dropdown-menu.tsx
│ │ ├── 📄 input.tsx
│ │ └── 📄 tooltip.tsx
│ ├── 📁 containers
│ │ ├── 📁 gridstack
│ │ │ └── 📄 index.ts
│ │ ├── 📄 auth-dialog.tsx
│ │ ├── 📄 auth-menu.tsx
│ │ ├── 📄 book-card.tsx
│ │ ├── 📄 navbar.tsx
│ │ └── 📄 theme-toggle.tsx
│ ├── 📁 lib
│ │ ├── 📄 theme-provider.tsx
│ │ └── 📄 utils.ts
│ ├── 📁 routes
│ │ ├── 📁 books
│ │ │ └── 📄 index.tsx
│ │ ├── 📁 characters
│ │ │ └── 📄 index.tsx
│ │ ├── 📄 \_\_root.tsx
│ │ └── 📄 index.tsx
│ ├── 📄 index.css
│ ├── 📄 main.tsx
│ ├── 📄 routeTree.gen.ts
│ ├── 📄 setupTests.ts
│ └── 📄 vite-env.d.ts
├── 📁 test-results
├── 📁 tests
│ └── 📄 example.spec.ts
├── 📁 tests-examples
│ └── 📄 demo-todo-app.spec.ts
├── 📄 components.json
├── 📄 db.json
├── 📄 eslint.config.js
├── 📄 index.html
├── 📄 package.json
├── 📄 playwright.config.ts
├── 📄 pnpm-lock.yaml
├── 📄 template.env
├── 📄 tsconfig.app.json
├── 📄 tsconfig.json
├── 📄 tsconfig.node.json
└── 📄 vite.config.ts

# Copied Context

### File: package.json

```json5
{
  name: "storyweaver",
  private: true,
  version: "0.0.0",
  type: "module",
  scripts: {
    dev: "vite",
    build: "tsc -b && vite build",
    lint: "eslint .",
    format: "prettier --write .",
    "format:check": "prettier --check .",
    "test:coverage": "vitest run --coverage",
    "test:coverage:report": "vitest run --coverage --reporter=html",
    preview: "vite preview",
    "generate-routes": "npx tsr generate",
    "watch-routes": "npx tsr watch",
    test: "vitest",
    "test:watch": "vitest --watch",
    playwright: "playwright test",
  },
  dependencies: {
    "@radix-ui/react-accordion": "^1.2.8",
    "@radix-ui/react-dialog": "^1.1.11",
    "@radix-ui/react-dropdown-menu": "^2.1.12",
    "@radix-ui/react-slot": "^1.2.0",
    "@radix-ui/react-tooltip": "^1.2.4",
    "@supabase/supabase-js": "^2.49.4",
    "@tailwindcss/vite": "^4.1.4",
    "@tanstack/react-form": "^1.7.0",
    "@tanstack/react-query": "^5.74.4",
    "@tanstack/react-query-devtools": "^5.74.6",
    "@tanstack/react-router": "^1.117.1",
    "class-variance-authority": "^0.7.1",
    clsx: "^2.1.1",
    gridstack: "^12.1.0",
    ky: "^1.8.1",
    "lucide-react": "^0.487.0",
    react: "^19.1.0",
    "react-dom": "^19.1.0",
    "tailwind-merge": "^3.2.0",
    tailwindcss: "^4.1.4",
    "tw-animate-css": "^1.2.8",
    zod: "4.0.0-beta.20250412T085909",
  },
  devDependencies: {
    "@eslint/js": "^9.25.1",
    "@playwright/test": "^1.52.0",
    "@tailwindcss/typography": "^0.5.16",
    "@tanstack/eslint-plugin-query": "^5.73.3",
    "@tanstack/react-router-devtools": "^1.117.1",
    "@tanstack/router-plugin": "^1.117.2",
    "@tanstack/router-vite-plugin": "^1.117.2",
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.3.0",
    "@testing-library/user-event": "^14.6.1",
    "@types/node": "^22.15.2",
    "@types/react": "^19.1.2",
    "@types/react-dom": "^19.1.2",
    "@vitejs/plugin-react": "^4.4.1",
    eslint: "^9.25.1",
    "eslint-plugin-react-hooks": "^5.2.0",
    "eslint-plugin-react-refresh": "^0.4.20",
    "eslint-plugin-tailwindcss": "^3.18.0",
    globals: "^15.15.0",
    jsdom: "^26.1.0",
    prettier: "3.5.3",
    "prettier-plugin-tailwindcss": "^0.6.11",
    typescript: "~5.7.3",
    "typescript-eslint": "^8.31.0",
    vite: "^6.3.3",
    vitest: "^3.1.2",
  },
}
```

### File: vite.config.ts

```typescript
/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    TanStackRouterVite({ target: "react", autoCodeSplitting: true }),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true, // Use Vitest global APIs (describe, test, expect) without importing them
    environment: "jsdom", // Use jsdom as the testing environment
    setupFiles: "./src/setupTests.ts", // Path to your setup file (see step 3)
    include: ["src/**/*.{test,spec}.{js,ts,jsx,tsx}"],
    exclude: ["node_modules", "test-results", "test-examples", "tests"],
    // You might want to disable CSS parsing if it's causing issues
    // css: false,
  },
});
```

### File: src\routes\characters\index.tsx

```typescript
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/characters/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div></div>;
}
```

### File: src\routes\_\_root.tsx

```typescript
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { NavBar } from "@/containers/navbar";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  // Important: Wrap with AuthProvider *inside* ThemeProvider if AuthProvider
  // needs theme context, or wrap ThemeProvider with AuthProvider if ThemeProvider
  // needs auth context (less likely). Usually, AuthProvider goes outside or alongside.
  // Let's assume they are independent for now and wrap ThemeProvider first.
  return (
    <div className="bg-background text-foreground flex min-h-screen w-full flex-col">
      <NavBar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
```

### File: src\routes\index.tsx

```typescript
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return <div></div>;
}
```

### File: src\main.tsx

```typescript
// Example in src/main.tsx (adjust based on your setup)
import React from "react";
import ReactDOM from "react-dom/client";
import {
  RouterProvider,
  createRouter,
  parseSearchWith,
  stringifySearchWith,
} from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { routeTree } from "./routeTree.gen";
import { ThemeProvider } from "./lib/theme-provider";
import { AuthProvider } from "./auth/AuthContext"; // Import AuthProvider
import "./index.css";

const queryClient = new QueryClient();

const router = createRouter({
  routeTree,
  context: {
    queryClient,
  },
  defaultPreloadStaleTime: 0,
  parseSearch: parseSearchWith(JSON.parse),
  stringifySearch: stringifySearchWith(JSON.stringify),
  scrollRestoration: true,
  defaultPreload: "intent",
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
          </QueryClientProvider>
        </AuthProvider>
      </ThemeProvider>
    </React.StrictMode>,
  );
}
```

### File: src\index.css

```css
@import "tailwindcss";
@import "tw-animate-css"; /* Assuming you use this for animations */

/* Tells Tailwind to activate dark: utilities when .dark is present */
@custom-variant dark (&:is(.dark *));
@import "gridstack/dist/gridstack.min.css";

/* Define BASE variables (Light Theme) */
:root {
  /* --- Base Font & Layout Settings --- */
  font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  /* --- Shadcn/UI Theme Variables (Light Mode Defaults) --- */
  --radius: 0.625rem;
  --background: oklch(1 0 0); /* White */
  --foreground: oklch(0.145 0 0); /* Near Black */
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0); /* Often a primary or accent color */
  --chart-1: oklch(0.646 0.222 41.116);
  --chart-2: oklch(0.6 0.118 184.704);
  --chart-3: oklch(0.398 0.07 227.392);
  --chart-4: oklch(0.828 0.189 84.429);
  --chart-5: oklch(0.769 0.188 70.08);
  --sidebar: oklch(0.985 0 0);
  --sidebar-foreground: oklch(0.145 0 0);
  --sidebar-primary: oklch(0.205 0 0);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.97 0 0);
  --sidebar-accent-foreground: oklch(0.205 0 0);
  --sidebar-border: oklch(0.922 0 0);
  --sidebar-ring: oklch(0.708 0 0);
}

/* Define Dark Theme Variable Overrides */
.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.205 0 0);
  --card-foreground: oklch(0.985 0 0);
  --popover: oklch(0.205 0 0);
  --popover-foreground: oklch(0.985 0 0);
  --primary: oklch(0.922 0 0);
  --primary-foreground: oklch(0.205 0 0);
  --secondary: oklch(0.269 0 0);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
  --accent: oklch(0.269 0 0);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.704 0.191 22.216);
  --border: oklch(1 0 0 / 10%); /* White with alpha */
  --input: oklch(1 0 0 / 15%); /* White with alpha */
  --ring: oklch(0.556 0 0);
  --chart-1: oklch(0.488 0.243 264.376);
  --chart-2: oklch(0.696 0.17 162.48);
  --chart-3: oklch(0.769 0.188 70.08);
  --chart-4: oklch(0.627 0.265 303.9);
  --chart-5: oklch(0.645 0.246 16.439);
  --sidebar: oklch(0.205 0 0);
  --sidebar-foreground: oklch(0.985 0 0);
  --sidebar-primary: oklch(0.488 0.243 264.376);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.269 0 0);
  --sidebar-accent-foreground: oklch(0.985 0 0);
  --sidebar-border: oklch(1 0 0 / 10%);
  --sidebar-ring: oklch(0.556 0 0);
}

/* Map Shadcn variables to Tailwind's color namespace */
@theme inline {
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);
}

/* --- Base Styles using Tailwind --- */
@layer base {
  * {
    /* Apply border color using the theme variable */
    /* NO TRANSITION HERE - Applying transition:border-color to * is still expensive */
    @apply border-border;
  }

  body {
    /* Apply background and text color using theme variables */
    @apply bg-background text-foreground antialiased;
    /* Apply transition specifically to background and text color */
    @apply transition-[background-color,color] duration-200 ease-in-out;
    margin: 0;
    min-width: 320px;
    min-height: 100vh;
  }

  /* Apply transitions to common interactive elements and containers */
  /* This targets elements likely to change background, text, or border colors */
  /* You might need to adjust this selector based on your specific components */
  a,
  button,
  input,
  textarea,
  select,
  /* Common Shadcn/Radix primitive selectors that might have backgrounds/borders */
  [role="dialog"], /* Dialog content */
  [role="menu"], /* DropdownMenu content */
  [role="tooltip"], /* Tooltip content */
  [data-radix-collection-item], /* DropdownMenu items, Select items etc. */
  [data-accent-color] /* Shadcn components sometimes use this */ {
    @apply transition-colors duration-200 ease-in-out;
  }

  /* You could add more specific base styles with transitions here if needed */
  /* e.g., for specific card components if they don't handle it themselves */
  /* .my-card-component { */
  /*   @apply bg-card text-card-foreground transition-colors duration-200 ease-in-out; */
  /* } */
}

/* --- REMOVED Global Element Styles that conflict with Components --- */
/* (a, h1, button, etc. global styles removed as before) */

/* --- REMOVED prefers-color-scheme media query --- */

/* --- REMOVED the global '*' transition --- */
/* * {
  @apply transition-colors duration-200 ease-in-out;
} */
```
