<?php
include_once('../../../phayes/geoPHP/geoPHP.inc');
$mysqli = new mysqli('localhost', 'root', '', 'll');

/*DCMM*/echo"<pre style='background-color:white;color:black;font-size:14px;'>_POST = ".var_export($_POST,true).'</pre>';

if (isset ($_POST['geom'])) {
	$wkt_post = geoPHP::load($_POST['geom'], 'json')->out('wkt');
	/*DCMM*/echo"<pre style='background-color:white;color:black;font-size:14px;'>wkt_post = ".var_export($wkt_post,true).'</pre>';
	$result = $mysqli->query("UPDATE geo SET geom = GeomFromText('$wkt_post') WHERE geo.id = 1");
}
$result = $mysqli->query("SELECT ST_AsText(geom) AS geom FROM geo");
$ST_AsText = $result->fetch_object();
/*DCMM*/echo"<pre style='background-color:white;color:black;font-size:14px;'>ST_AsText = ".var_export($ST_AsText,true).'</pre>';

$json_sql = geoPHP::load($ST_AsText->geom,'wkt')->out('json');
/*DCMM*/echo"<pre style='background-color:white;color:black;font-size:14px;'>json_sql = ".var_export($json_sql,true).'</pre>';

$json_edit = isset ($_POST ['geom'])
	? $_POST ['geom']
	: $json_sql;

?>
<!DOCTYPE html>
<html lang="fr">
<head>
	<title>Leaflet</title>
	<meta charset="utf-8">
	<link rel="icon" type="image/png" href="http://leafletjs.com/docs/images/favicon.ico" />

	<link rel="stylesheet" href="../src/leaflet.css" />
	<script src="../src/leaflet.js"></script>

	<script>
		var key = {
			ign: window.location.host == 'localhost'
				? 'u71tqebfror0c2nn3nppcbk2' // localhost 31/03/2016 http://api.ign.fr
				: 'o6owv8ubhn3vbz2uj8jq5j0z', // dominique92.github.io http://pro.ign.fr/api-web
			bing: 'ArLngay7TxiroomF7HLEXCS7kTWexf1_1s1qiF7nbTYs2IkD3XLcUnvSlKbGRZxt', // https://www.bingmapsportal.com
			os: 'CBE047F823B5E83CE0405F0ACA6042AB' // http://www.ordnancesurvey.co.uk/business-and-government/products/os-openspace/
		};

		window.addEventListener('load', function() {
			map = L.map('map', { // France
				center: [47, 2],
				zoom: 6,
				layers: [L.TileLayer.collection('OSM-FR')]
			});
			new L.Control.Scale().addTo(map); // core
			new L.Control.Fullscreen().addTo(map);
			new L.Control.Coordinates().addTo(map);
			new L.Control.OSMGeocoder({
				position: 'topleft'
			}).addTo(map);

			new L.Control.Permalink.Cookies({ // shramov/leaflet-plugins
				layers: new L.Control.Layers.autoHeight(L.TileLayer.collection()).addTo(map)
			}).addTo(map);

			var editeur = new L.Control.Draw.Plus({
				draw: {
					marker: true,
					polyline: true,
					polygon: true
				},
				edit: {
					remove: true
				},
				entry: 'entree',
				editType: 'MultiPolyline',
				changed: 'change'
			}).addTo(map);

			var fl = new L.Control.FileLayerLoad().addTo(map);
			fl.loader.on ('data:loaded', function (e){
				e.layer.addTo(editeur);
			}, fl);

			new L.Control.GetGpxFile(editeur.editLayers).addTo(map);
		});
	</script>
</head>

<body>
	<p>Leaflet <script>document.write(L.version)</script></p>
	<div id="map" style="width: 800px; height: 600px;"></div>
	<form method="post" action="#">
		<button type="submit" name="action" value="Modifier">Modifier</button>
		<span id="change" style="display:none"><i>Changé</i></span>
		<br/>
		<textarea id="entree" rows="10" cols="120" name="geom"><?=$json_edit?></textarea>
	</form>
	<div style="position: absolute;right:0;top:0"><a href="../github.com/Dominique92/Leaflet.GeoJSON.Ajax">&gt;</a>&nbsp;</div>
</body>
</html>
