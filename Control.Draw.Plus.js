/*
 * Copyright (c) 2015 Dominique Cavailhez
 * Leaflet extension for Leaflet.draw
 * Markers, polylines, polygons, rectangles & circle editor
 * Snap on others markers, lines & polygons including the edited shape itself
 * Need https://github.com/Leaflet/Leaflet.draw and https://github.com/makinacorpus/Leaflet.Snap
 */

// Poly edition style
L.Util.extend(L.Polyline.prototype.options, {
	color: 'red',
	weight: 4,
	opacity: 1
});
L.Util.extend(L.Draw.Polyline.prototype.options.shapeOptions, L.Polyline.prototype.options);
L.Util.extend(L.Draw.Polygon.prototype.options.shapeOptions, L.Polygon.prototype.options); // (blue)

L.Control.Draw.Plus = L.Control.Draw.extend({

	snapLayers: new L.FeatureGroup(), // Container of layers used for snap
	editLayers: new L.FeatureGroup(), // Container of editable layers

	options: {
		draw: {
			marker: false,
			polyline: false,
			polygon: false,
			rectangle: false,
			circle: false
		},
		edit: {
			edit: false,
			switchpoly: false
		}
	},

	initialize: function (options) {
		options.edit = L.extend(this.options.edit, options.edit); // Init false non chosen options
		options.draw = L.extend(this.options.draw, options.draw);
		for (o in options.draw)
			if (options.draw[o])
				options.draw[o] = {guideLayers: [this.snapLayers]}; // Allow snap on creating elements

		L.Control.Draw.prototype.initialize.call(this, options);
	},

	onAdd: function (map) {
		this._toolbars.edit.options.featureGroup = this.editLayers;
		this.editLayers.addTo(this.snapLayers);
		this.snapLayers.addTo(map);

		map.on('draw:created', function (e) {this.addLayer(e.layer)}, this); // Add a new feature
		map.on('draw:edited draw:deleted', this._mergePoly, this); // Finish modifications & upload

		return L.Control.Draw.prototype.onAdd.call(this, map);
	},

	// Add a new feature
	addLayer: function (layer) {
		if (layer._layers) { // Récurse in GeometryCollection
			for (l in layer._layers)
				this.addLayer (layer._layers[l]);
			return;
		}
		layer.addTo(this.editLayers);
		if (layer._latlng) // Point
			layer.snapediting = new L.Handler.MarkerSnap(this._map, layer);
		else if (layer._latlngs) // Polyline, Polygon, Rectangle
			layer.snapediting = new L.Handler.PolylineSnap(this._map, layer);
		else // ?? protection
			return;

		layer.options.editing = {}; //DCMM TODO voir pourquoi (nouvelle version de draw)
		layer.snapediting.addGuideLayer(this.snapLayers);
		layer.snapediting.enable();

		// Close enables edit toolbar handlers & save changes
		layer.on('deleted', function () {
			for (m in this._toolbars.edit._modes)
				this._toolbars.edit._modes[m].handler.disable();
		}, this);

		// Fire the map to enable any changes uploads
		layer.on('created edit dragend deleted', function () {
			this._map.fire('draw:edited');
		}, this);

		layer.fire('created');
	},

	// Merge polylines having ends at the same position
	_mergePoly: function (e) {
		var ls = this.editLayers._layers;
		for (il1 in ls) // For all layers being edited
			for (il2 in ls) {
				var ll1 = ls[il1]._latlngs,
					ll2 = ls[il2]._latlngs,
					lladd = null; // List of points to move to another polyline
				if (ll1 && !ls[il1].options.fill &&  // If both are polyline
					ll2 && !ls[il2].options.fill &&
					ls[il1]._leaflet_id < ls[il2]._leaflet_id) { // Only once each pair
					if (ll1[0].equals(ll2[0])) {
						ll1.reverse();
						lladd = ll2;
					} else if (ll1[0].equals(ll2[ll2.length - 1])) {
						ll1.reverse();
						lladd = ll2.reverse();
					} else if (ll1[ll1.length - 1].equals(ll2[0])) {
						lladd = ll2;
					} else if (ll1[ll1.length - 1].equals(ll2[ll2.length - 1])) {
						lladd = ll2.reverse();
					}
					if (lladd) {
						ll1.pop(); // We remove the last point as it's already there
						ls[il1]._latlngs = ll1.concat(lladd);
						ls[il1].editing._poly.redraw(); // Redraw the lines
						ls[il1].snapediting.updateMarkers(); // Redraw the markers
						this.editLayers.removeLayer(ls[il2].editing._poly); // Erase the initial Polyline
						this._map.fire('draw:edited'); // Redo this until there are no more merge to do
					}
				}
			}
	}
});
