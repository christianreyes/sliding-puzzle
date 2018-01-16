/* 
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
Title:			Project 1: Sliding Puzzle!
Author : 		Christian Reyes 
Description:    Javascript for Puzzle
Course:         05-433D SSUI Web Lab
Created : 		08 Sep 2011
Modified : 		21 Sep 2011
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
*/

//  Array which contains the information needed for loading the pictures
//  image title in quotes, followed by the image width in pixels followed
//  by image height in pixels

var _pictures = [["woman.jpg", 640, 426],
                 ["blue_rose.jpg", 640, 400],
                 ["bamboo.jpg", 640, 480],
                 ["crayons.jpg", 600, 480],
                 ["hawaii.jpg", 640, 480],
                 ["swan.jpg", 660, 468]];


// global variables for the image which will be loaded.
var _image_path;
var _image_width;
var _image_height;

// global variables for puzzle dimensions. Determined at runtime.
var _num_rows;
var _num_cols;

// global variables for tile dimensions. Determined at runtime based
// on the dimensions of the tile and the image dimensions.
var _tile_width;
var _tile_height;

// global variable for the # of pixels in between each tile.
var _gap_size = 2;

// global variable for the empty tile
var _empty_tile;

// global variables for the container and frame divs
var _container;
var _frame;

// global variable to keep track of the last tile moved during
// shuffling. _able_to_click is toggled to prevent moving a tile
// when the tile is sliding
var _just_moved;
var _able_to_click;

// global variable for the array of tiles and divs
var _tiles = [];
var _divs = [];

// Returns the # pixels to position the tile left based on the column number
function colToLeft(col) { return col * _tile_width; }

// Returns the # pixels to position the tile top based on the row number
function rowToTop(row) { return row * _tile_height; }

// Returns the # pixels to add to position left based on the column number and gap size
function rowGap(row) { return row * _gap_size; }

// Returns the # pixels to add to position top based on the row number and gap size
function colGap(col) { return col * _gap_size; }

/*
* Summary:      Should return a div positioned based on the row and column
* Parameters:   row #, col #
* Returns:      The div for that row and column
*/
function createDiv(row, col) {
    var newDiv = document.createElement("div");

    newDiv.row = row;
    newDiv.col = col;
    newDiv.style.width = _tile_width + "px";
    newDiv.style.height = _tile_height + "px";
    newDiv.style.left = colGap(col) + colToLeft(col) + "px";
    newDiv.style.top = rowGap(row) + rowToTop(row) + "px";
    newDiv.className = "tile";
    newDiv.style.backgroundImage = 'url(' + _image_path + ')';
    // CSS sprite
    newDiv.style.backgroundPosition = "" + (-colToLeft(col)) + "px " + (-rowToTop(row)) + "px";
    newDiv.onclick = tileClicked;

    newDiv.slide = function (oldRow, oldCol, targetRow, targetCol, speed) {
        newDiv.onclick = undefined;
        newDiv.row = targetRow;
        newDiv.col = targetCol;

        // determine where the tile needs to go
        var dirRow = targetRow - oldRow;
        var dirCol = targetCol - oldCol;
        var targetRowPx = rowToTop(targetRow) + rowGap(targetRow);
        var targetColPx = colToLeft(targetCol) + colGap(targetCol);

        // determine where the tile currently is
        var tileLeft = parseInt(newDiv.style.left, 10);
        var tileTop = parseInt(newDiv.style.top, 10);

        // take big steps until close
        if (tileLeft != targetColPx) {
            if (Math.abs(targetColPx - tileLeft) >= speed) {
                newDiv.style.left = (tileLeft + dirCol * speed) + "px";
            } else {
                newDiv.style.left = (tileLeft + dirCol) + "px";
            }
            setTimeout(function () { newDiv.slide(oldRow, oldCol, targetRow, targetCol, speed) }, 1);
        } else{
          newDiv.onclick = tileClicked;
        }

        // take big steps until close
        if (tileTop != targetRowPx) {
            if (Math.abs(targetRowPx - tileTop) >= speed) {
                newDiv.style.top = (tileTop + dirRow * speed) + "px";
            } else {
                newDiv.style.top = (tileTop + dirRow) + "px";
            }

            setTimeout(function () { newDiv.slide(oldRow, oldCol, targetRow, targetCol, speed) }, 1);
        } else {
          newDiv.onclick = tileClicked;
        }
    };

    return newDiv;
}

/*
* Summary:      Creates the tiles based on the puzzle dimensions
* Parameters:   None
* Returns:      undefined
*/
function createTiles() {
    for (var row = 0; row < _num_rows; row++) {
        for (var col = 0; col < _num_cols; col++) {
            // Creates a div and tile for every row, col combination.
            // Only creates tile for _empty_tile

            if (row == _empty_tile.row && col == _empty_tile.col) {
                _tiles.push(_empty_tile);
            }
            else 
            {
                _tiles.push(new Tile(row, col));

                var d = createDiv(row, col);
                _divs.push(d);
                _container.appendChild(d);
            }
        }
    }
}

/*
* Summary:      Function that is called when a tile div is clicked
* Parameters:   event: given to tileClicked by window when called
*/
function tileClicked(event) {
    // only executes the click action when it is OK to slide
    if (_able_to_click) {
        var tileDiv = event.target;
        var t = getTile(tileDiv.row, tileDiv.col);
        t.slide(5);
    }
}

/*
* Summary:      Returns the desired tile
* Parameters:   row #, col # of tile
*/
function getTile(row, col) {
    for (var i = 0; i < _tiles.length; i++) {
        if (_tiles[i].row == row && _tiles[i].col == col) {
            return _tiles[i];
        }
    }
}

/*
* Summary:      Returns the desired tile div
* Parameters:   row #, col # of div
*/
function getDiv(row, col) {
    for (var i = 0; i < _divs.length; i++) {
        if (_divs[i].row == row && _divs[i].col == col) {
            return _divs[i];
        }
    }
}

/*
* Summary: Generates a random puzzle 
*/
function generateRandomPuzzle() {
    // dynamically sets the tile dimensions
    _tile_width = Math.floor(_image_width / _num_cols);
    _tile_height = Math.floor(_image_height / _num_rows);

    var emptyRow;
    var emptyCol;

    Math.random() < .5 ? emptyRow = 0 : emptyRow = _num_rows - 1;
    Math.random() < .5 ? emptyCol = 0 : emptyCol = _num_cols - 1;

    _empty_tile = new Tile(emptyRow, emptyCol);
    _just_moved = _empty_tile;

    // creates all the tiles now that the empty tile has been determined
    createTiles();

    // tiles cannot be clicked until shuffling is done
    _able_to_click = false;

    // shuffle the tiles "enough" times to make it "random"
    shuffleTiles(_num_cols * _num_rows * 3);
}

/*
* Summary:      Shuffles the tiles by moving the tiles from the completed
*               stage to the "random" orientation. Ensures it is solvable
* Parameters:   numLeft: how many more tiles are left to shuffle
* Returns:      undefined
*/
function shuffleTiles(numLeft) {
    if (numLeft > 0) {
        var narr = _empty_tile.neighbors();
        var optionInd = [Math.floor(Math.random() * narr.length)]
        var selectedTile = narr[optionInd];

        // don't move a tile that was just moved. It would move it back where it was
        while (selectedTile.row == _just_moved.row && selectedTile.col == _just_moved.col) {
            optionInd = [Math.floor(Math.random() * narr.length)]
            selectedTile = narr[optionInd];
        }

        var t = getTile(selectedTile.row, selectedTile.col);
        t.slide(5);
        _just_moved = t;
        
        // keep shuffling
        setTimeout(function () { shuffleTiles(numLeft - 1) }, 50);
    } else {
        // when the shuffling is done, set puzzle so tiles can be clicked
        _able_to_click = true;
    }
}

/*
* Summary: When the page loads, dynamically create a "random" puzzle based on image dimensions
*/
window.onload = function () {
    _container = document.getElementById("tile_container");
    _frame = document.getElementById("puzzle_frame");

    // pic a random picture for the puzzle
    var imageProperties = _pictures[Math.floor(Math.random() * _pictures.length)];

    _image_path = "puzzle_images/" + imageProperties[0];
    _image_width = imageProperties[1];
    _image_height = imageProperties[2];

    // randomly pick the puzzle dimensions >= 12 and <= 14
    _num_rows = Math.floor((Math.random() * 3)) + 10;
    _num_cols = Math.floor((Math.random() * 3)) + 10;

    // setup frame and container
    _frame.style.width = _image_width + colGap(_num_cols) + "px";
    _frame.style.height = _image_height + rowGap(_num_rows) + "px";
    _container.style.width = _image_width + "px";
    _container.style.height = _image_height + "px";

    // generate the tiles and shuffle them
    generateRandomPuzzle();
}