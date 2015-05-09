/** @jsx React.DOM */
define(function(require) {
	"use strict";
	
	var _ = require("underscore"),
		Backbone = require("backbone"),
		React = require("react"),
		MineRow = require("jsx!code/mineRow"),
		MineButton = require("jsx!code/mineButton");
    
    var mineField = React.createClass({
    	
		render: function() {
			
			var collection = [];
			var mines = [];
			var buttons = [];
			var currentRow = 0;
			var rowKey = 0;
		
			_.each(this.props.collection.models, function(mine) {
			
				if (mine.get("row") === currentRow) {
					buttons.push(new MineButton({model:mine, key:mine.get("row") + ":" + mine.get("column")}));
				} else {
					if (buttons.length > 0) {
						mines.push(new MineRow({className:"mineRow", buttons:buttons, key:"row:" + rowKey++}));
					}
				
					buttons = [];
					buttons.push(new MineButton({model:mine, key:mine.get("row") + ":" + mine.get("column")}));
				
					currentRow++;
				}
			});
			if (buttons.length > 0) {
				mines.push(new MineRow({className:"mineRow", buttons:buttons, key:"row:" + rowKey++}));
			}
		
			return (
				<div>
					{mines}
				</div>
			);
		}
	});
	
	return mineField;
});