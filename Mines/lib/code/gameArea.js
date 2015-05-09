/** @jsx React.DOM */	
define(function(require) {
	"use strict";
	
	var React = require("react"),
		Bacon = require("Bacon"),
		MineField = require("jsx!code/minefield");
		
	var field = React.createClass({
		render : function() {
			return (new MineField({
				collection : this.props.collection
			}));
		}
	});
	
	var resetButton = React.createClass({
		render : function() {
			return (<button className="resetButton" onClick={this.props.resetFunction}>Reset</button>);
		}
	});
	
	var sizeSelect = React.createClass({
		componentDidMount : function() {
			
			var rowMinus = $(".rowMinus").asEventStream("click").map(-1);
			var rowPlus = $(".rowPlus").asEventStream("click").map(1);
			var rowBoth = rowMinus.merge(rowPlus).scan(5, function(x, y) {
				
				var sum = x + y;
				return sum > 0 ? sum : 1;
			});
			
			rowBoth.assign($(".rowCount"), "text");
			
			var columnMinus = $(".columnMinus").asEventStream("click").map(-1);
			var columnPlus = $(".columnPlus").asEventStream("click").map(1);
			var columnBoth = columnMinus.merge(columnPlus).scan(8, function(x, y) {
				
				var sum = x + y;
				return sum > 0 ? sum : 1;
			});
			
			columnBoth.assign($(".columnCount"), "text");
			
			Bacon.combineAsArray(rowBoth, columnBoth).onValue(function(rows, columns) {
				$(".sizeContainer").trigger("resize", rows, columns);
			});
		},
		
		render : function() {
			
			return (
				<div className="sizeContainer">
					<button className="rowMinus">-</button>
					<button className="rowPlus">+</button>
					<h4 className="sizeHeader">Rows: <span className="rowCount"></span></h4>
					<button className="columnMinus">-</button>
					<button className="columnPlus">+</button>
					<h4 className="sizeHeader">Columns: <span className="columnCount"></span></h4>
				</div>
			);
		}
	});
	
	/*
	 * 
	 */

	var gameArea = React.createClass({
		render : function() {
			return (
				<div>
					<field collection={this.props.collection} />
					<resetButton resetFunction={this.props.resetFunction} />
					<sizeSelect />
				</div>
			);
		}
	});

	return gameArea;
}); 