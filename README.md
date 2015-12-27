Leaflet.draw.Plus
====================

Leaflet extension for Leaflet.draw
* Markers, polylines, polygons, rectangles & circle editor
* Snap on others markers, lines & polygons including the edited one
* Stick on other vectors layers
* Cut & paste polylines
* Swap style between polylines & polygons

Depends on [Leaflet.draw](https://github.com/Leaflet.draw).
and [Leaflet.Snap](https://github.com/makinacorpus/Leaflet.Snap).

DEMO
----
[See a DEMO](http://dominique92.github.io/MyLeaflet/github.com/Dominique92/Leaflet.draw.Plus/)

Usage
-----
* Set to true the form & commands that you want the editor to handle.
Default is none.

```javascript
...
	var editor = new L.Control.Draw.Plus({
		draw: {
			marker: true,
			polyline: true,
			polygon: true,
//			rectangle: true,
//			circle: true
		},
		edit: {
//			edit: true,
			switchpoly: true
		}
	}).addTo(carte);
...
```
