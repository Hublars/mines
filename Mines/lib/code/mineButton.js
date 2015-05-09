/** @jsx React.DOM */
define(["react"], function(React) {
	"use strict";
	
	var mineButton = React.createClass({
    	handleClick : function(ev) {
    		if (ev.button === 0) {
    			this.props.model.clicked();
    		} else if (ev.button === 2) {
    			this.props.model.flagged();
    		}
    	},
    	
		render: function() {
			var cx = React.addons.classSet;
			
			var classes = cx({
				"mineUnopened": this.props.model.get("open") === false,
				"mineOpened": this.props.model.get("open") === true,
				"hasBomb": this.props.model.get("hasBomb") && this.props.model.get("open") === true,
				"mineFlagged": this.props.model.get("flagged")
			});
			
			return (
				<button className={classes} onClick={this.handleClick} onMouseUp={this.handleClick}><span>{this.props.model.get("name")}</span></button>
			);
		}
	});
	
	return mineButton;
});
