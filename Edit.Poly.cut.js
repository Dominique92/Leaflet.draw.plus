/*
 * Copyright (c) 2015 Dominique Cavailhez
 * Leaflet extension for Leaflet.draw.plus
 * Cut a polyline by removing a segment whose the middle marker is cliqued
 *
 * Needs modification of Leaflet.draw/src/edit/handler/Edit.Poly line 233 : .on('click', this._cut, this)
 */

// Modify onClick action on MiddleMarkers Leaflet.draw/Edit.Poly.js line 233
// Horible hack awaiting the official plugin uddate
eval ('L.Edit.Poly.prototype._createMiddleMarker = ' +
	L.Edit.Poly.prototype._createMiddleMarker.toString()
		.replace (/'click', onClick, this|"click",i,this/g, '"click",this._cut,this')
);

L.Edit.Poly.include({
	_cut: function(e) {
		if (!this._poly.options.fill) { // We can't cut a polygon: switch to polyline before !
			var marker1, marker2,
				map = this._poly._map;

			for (m in this._markers)
				if (this._markers[m]._middleRight && this._markers[m]._middleRight._leaflet_id == e.target._leaflet_id)
					marker1 = this._markers[m];
				else if (this._markers[m]._middleLeft && this._markers[m]._middleLeft._leaflet_id == e.target._leaflet_id)
					marker2 = this._markers[m];

			if (marker1 && marker2) {
				if (!marker1._prev && !marker2._next) { // There is only 1 segment
					map.removeLayer(this._poly); // Destroy the polyline
				}
				else if (!marker1._prev) // This is the first segment
					this._onMarkerClick({
					target: marker1,
					remove: true // Just remove it
				});
				else if (!marker2._next) // This is the last segment
					this._onMarkerClick({
						target: marker2,
						remove: true // Just remove it
					});
				else {
					var ll = [];
					for (var m = marker2; m; m = m._next) { // Remove all the summits after the cut
						ll.push([m._latlng.lat, m._latlng.lng]);
						this._onMarkerClick({
							target: m,
							remove: true
						});
					}
					// And reuse these summits to create a new polyline
					map.fire('draw:created', {
						layer: new L.Polyline(ll, this._poly.options)
					});
				}
			}
		}
	}
});
