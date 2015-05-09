/** @jsx React.DOM */
define(["react"], function(React) {
	"use strict";
	
	var mineRow = React.createClass({
		render: function() {
			return (
				<div>{this.props.buttons}</div>
			);
		}
	});
	
	return mineRow;
});