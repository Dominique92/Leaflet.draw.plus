/*
 * Copyright (c) 2015 Dominique Cavailhez
 * Leaflet extension for Leaflet.draw.plus
 * Swap style between lines & polygons
 */

// Create the switch control
L.EditToolbar.SwitchPoly = L.EditToolbar.Delete.extend({
	statics: {
		TYPE: 'switchpoly' // not delete as delete is reserved in js
	},

	initialize: function(map, options) {
		L.EditToolbar.Delete.prototype.initialize.call(this, map, options);
		this.type = L.EditToolbar.Edit.TYPE;
	},

	addHooks: function() {
		L.EditToolbar.Delete.prototype.addHooks.call(this);
		if (this._map)
			this._tooltip.updateContent({
				text: L.drawLocal.edit.handlers.switchpoly.tooltip.text
			});
	},

	revertLayers: function() {}, // Cancel: does'nt work well

	_removeLayer: function(e) {
		this._map.fire('draw:created', { // Then, we recreate the layout with another type
			layer:
				e.target.options.fill
					? new L.Polyline(e.target._latlngs)
					: new L.Polygon(e.target._latlngs)
		});

		L.EditToolbar.Delete.prototype._removeLayer.call(this, e);
	},
});

// Add the switch control to the edit bar
L.EditToolbar.include({
	getModeHandlersNative: L.EditToolbar.prototype.getModeHandlers,

	getModeHandlers: function(map) {
		return [{
			enabled: this.options.switchpoly,
			handler: new L.EditToolbar.SwitchPoly(map, {
				featureGroup: this.options.featureGroup
			}),
			title: L.drawLocal.edit.toolbar.buttons.switchpoly
		}].concat(L.EditToolbar.prototype.getModeHandlersNative.call(this, map));
	}
});

// New texts associated to the new switch control
L.drawLocal.edit.toolbar.buttons.switchpoly = 'Switch Poly type.';
L.drawLocal.edit.handlers.switchpoly = {
	tooltip: {
		text: 'Click on a Polygon to make a Polyline and vice versa'
	}
};
