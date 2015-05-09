/** @jsx React.DOM */
require(["react", "jsx!./code/gameArea", "underscore", "backbone", "Bacon"], function(React, GameArea) {"use strict";

	var MineModel = Backbone.Model.extend({
		defaults : {
			name : "?",
			row : 0,
			column : 0,
			open : false,
			hasBomb : false,
			flagged : false,
			nearCount : 0,
			neighbours : []
		},

		clicked : function() {
			if (this.get("flagged")) {
				return;
			}

			if (this.get("hasBomb")) {
				this.set("name", "X");
			} else {
				var near = this.get("nearCount");
				this.set("name", near > 0 ? near : "");
			}

			this.set("open", true);
		},

		flagged : function() {
			var isFlagged = this.get("flagged");

			this.set("name", !isFlagged ? "x" : "?");
			this.set("flagged", !isFlagged);
		}
	});

	var List = Backbone.Collection.extend({
		model : MineModel
	});

	var ListView = Backbone.View.extend({
		el : $("#content"),

		initialize : function() {
			_.bindAll(this, "render");
		},

		rowCount : 0,
		columnCount : 0,
		setMines : function(rows, columns) {

			if (rows > 0)
				this.rowCount = rows;
			if (columns > 0)
				this.columnCount = columns;

			var mines = createMines(this.rowCount, this.columnCount);

			var that = this;
			_.each(mines, function(mine) {
				that.listenTo(mine, "change:open", function() {
					that.mineClicked(mine);
					checkProgress(mines);
				});

				that.listenTo(mine, "change:flagged", function() {
					that.mineFlagged(mine);
					checkProgress(mines);
				});
			});

			this.collection = new List(mines);
		},

		mineClicked : function(mine) {
			if (mine.get("nearCount") < 1 && !mine.get("hasBomb")) {
				openEmptyNeighbours(mine);
			}

			this.render();
		},

		mineFlagged : function(mine) {
			this.render();
		},

		render : function() {

			if ($(".sizeContainer"))
				$(".sizeContainer").unbind("resize");

			var ga = new GameArea({
				collection : this.collection,
				resetFunction : reset
			});

			React.renderComponent(ga, this.el);

			$(".sizeContainer").bind("resize", function(event, rows, columns) {
				fieldRouter.navigate("size/r" + rows + "/c" + columns, {trigger: true});
			});

			return this;
		}
	});

	function newGame(rows, columns) {
		$("#header2").html("Play");
		
		if ($(".rowCount").html() !== rows)
			$(".rowCount").html(rows);
		
		if ($(".columnCount").html() !== columns)	
			$(".columnCount").html(columns);
		
		listView.setMines(rows, columns);
		listView.render();
	}

	function reset() {
		$("#header2").html("Play");

		listView.setMines(0, 0);
		listView.render();
	}

	function createMines(rows, columns) {
		var rowCount = rows;
		var columnCount = columns;
		var mines = [];

		for (var i = 0; i < rowCount; i++) {
			for (var j = 0; j < columnCount; j++) {
				var mine = new MineModel({
					row : i,
					column : j
				});
				mines.push(mine);
			}
		}

		var neighbours;
		_.each(mines, function(mine) {
			neighbours = _.filter(mines, function(neighbour) {
				var isNextTo = Math.abs(mine.get("row") - neighbour.get("row")) < 2 && Math.abs(mine.get("column") - neighbour.get("column")) < 2;

				var isSameMine = (mine.get("row") === neighbour.get("row") && mine.get("column") === neighbour.get("column"));

				return isNextTo && !isSameMine;
			});

			mine.set("neighbours", neighbours);
		});

		var bombCount = Math.ceil(rows * columns / 10);

		while (bombCount > 0) {
			var rand = _.random(0, mines.length - 1);

			if (mines[rand].get("hasBomb") === false) {
				mines[rand].set("hasBomb", true);
				bombCount--;

				_.each(mines[rand].get("neighbours"), function(neighbour) {
					neighbour.set("nearCount", neighbour.get("nearCount") + 1);
				});
			}
		}

		return mines;
	}

	function openEmptyNeighbours(mine) {

		var neighs = mine.get("neighbours");

		_.each(neighs, function(neighbour) {
			if (!neighbour.get("open"))
				neighbour.clicked();
		});
	}

	function checkProgress(mines) {

		var allEmptyOpened = true;
		var minesLeftUnflagged = 0;

		_.each(mines, function(mine) {
			if (!mine.get("hasBomb") && !mine.get("open"))
				allEmptyOpened = false;

			if (mine.get("hasBomb") && !mine.get("flagged"))
				minesLeftUnflagged++;

			if (mine.get("hasBomb") && mine.get("open"))
				gameLost();
		});

		if (allEmptyOpened && minesLeftUnflagged === 0) {

			gameWon();

		} else if (allEmptyOpened && minesLeftUnflagged === 1) {

			var lastMine = _.find(mines, function(mine) {
				return mine.get("hasBomb") && !mine.get("flagged");
			});

			lastMine.flagged();
		}
	}

	function gameWon() {

		$("#header2").html("You Won!");
		listView.stopListening();
	}

	function gameLost() {

		$("#header2").html("You Lost!");
		listView.stopListening();
	}

	var listView = new ListView();
	listView.setMines(5, 8);
	listView.render();

	var FieldRouter = Backbone.Router.extend({
		routes : {
			"size/r:row/c:column" : "changeSize",
			"*default" : "start"
		},

		changeSize : function(row, column) {
			newGame(row, column);
		},
		
		start : function() {
			newGame(5, 8);
		}
	});

	var fieldRouter = new FieldRouter();

	Backbone.history.start({
		pushState : true
	});
});

