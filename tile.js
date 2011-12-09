/* 
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
Title:			Project 1: Sliding Puzzle!
Author : 		Christian Reyes 
Description:    Javascript file for Tile
Course:         05-433D SSUI Web Lab
Created : 		08 Sep 2011
Modified : 		21 Sep 2011
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
*/

/*
* Summary:      Constructor for a Tile object. 
* Parameters:   row # and col # for tile
* Returns:      The tile object
*/
function Tile(row, col) {
    this.row = row;
    this.col = col;

    // returns boolean
    this.valid = function () {
        var rowValid = this.row >= 0 && this.row < _num_rows;
        var colValid = this.col >= 0 && this.col < _num_cols;

        return rowValid && colValid;
    };

    // returns valid neighbor tiles
    this.neighbors = function () {
        var surrounding = [];
        var left = new Tile(this.row, this.col - 1);
        var right = new Tile(this.row, this.col + 1);
        var top = new Tile(this.row - 1, this.col);
        var bottom = new Tile(this.row + 1, this.col);

        if (left.valid()) { surrounding.push(left); }
        if (right.valid()) { surrounding.push(right); }
        if (top.valid()) { surrounding.push(top); }
        if (bottom.valid()) { surrounding.push(bottom); }

        return surrounding;
    };

    // slides the tile object with the other tile object
    this.slide = function (speed) {
        var neighs = this.neighbors();

        // checks if the empty tile is a neighbor before trying to switch
        var i = neighs.length;
        while (i--) {
            if (neighs[i].row == _empty_tile.row && neighs[i].col == _empty_tile.col) {
                //capture the old tile information
                var thisOldRow = this.row;
                var thisOldCol = this.col;
                var thatOldRow = _empty_tile.row;
                var thatOldCol = _empty_tile.col;

                // switch this tile info with that
                this.row = thatOldRow;
                this.col = thatOldCol;

                _empty_tile.row = thisOldRow;
                _empty_tile.col = thisOldCol;

                // slide the div corresponding to that tile
                getDiv(thisOldRow, thisOldCol).slide(thisOldRow, thisOldCol, thatOldRow, thatOldCol, speed);
                break;
            }
        }
    };
}