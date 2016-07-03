Leaflet.draw.plus
====================

Leaflet extension for Leaflet.draw
* Markers, polylines, polygons, rectangles & circle editor
* Snap on others markers, lines & polygons including the edited one
* Stick on other vectors layers
* Cut & paste polylines
* Swap style between polylines & polygons

Depends on [Leaflet.draw](https://github.com/Leaflet/Leaflet.draw).
and [Leaflet.Snap](https://github.com/makinacorpus/Leaflet.Snap).

DEMO
----
[See a DEMO here](http://dominique92.github.io/MyLeaflet/github.com/Dominique92/Leaflet.draw.plus/)

Usage
-----
* Set to true the form & commands that you want the editor to handle.
Default is none.

```javascript
...
	var editor = new L.Control.Draw.Plus({
		draw: {
			marker: true, // Capability to create a marker
			polyline: true, // Capability to create a polyline
			polygon: true, // Capability to create a polygon
			rectangle: true, // Capability to create a rectangle
			circle: true // Capability to create a circle
		},
		edit: {
			edit: true, // Capability to edit a feature
			remove: true // Capability to remove a feature
		},
		entry: 'edit-json', // <textarea id="edit-json">JSON</textarea> | <input type="hidden" id="edit-json" name="xxx" value="JSON"> : geoJson field to be edited
		jsonOptions: {}, // Options to be used when retreiving Json from <input />
		changed: 'edit-changed' // <span id="edit-changed" style="display:none">changed</span> : warn changes to be saved
	}).addTo(map);
...
```
