<?php
// Replace SQL parameters by yours
$mysqli_server_name = 'localhost';
$mysqli_user = 'root';
$mysqli_psswd = '';
$mysqli_db = 'drawdb';
$mysqli_table = 'drawtable';
$mysqli_field = 'geom';

/* Create this database on your server:
CREATE DATABASE drawdb;
USE drawdb;
CREATE TABLE drawtable (
  geom geometrycollection NOT NULL,
  id int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (id)
);
INSERT INTO drawtable (geom, id) VALUES (GeomFromText('POINT(5 45)',0), 1);
*/

// Connect to the database
$mysqli = @new mysqli ($mysqli_server_name, $mysqli_user, $mysqli_psswd, $mysqli_db);
if ($mysqli->connect_errno) {
	echo $mysqli->connect_error;
	exit;
}

// Include geoPHP library
include_once ('geoPHP/geoPHP.inc');

// Upload edition changes to the database
echo ('$_POST = '); var_dump ($_POST);
if (isset ($_POST['geom'])) {
	echo ('$wkt_post = '); var_dump ($wkt_post = geoPHP::load($_POST['geom'], 'json')->out('wkt'));
	echo ('$sql = '); var_dump ($sql = "UPDATE $mysqli_table SET $mysqli_field = GeomFromText('$wkt_post') where id = 1");
	$mysqli->query($sql);
}

// Get existing data from the database
$result = $mysqli->query("SELECT ST_AsText($mysqli_field) AS geom FROM $mysqli_table where id = 1");
echo ('$ST_AsText = '); var_dump ($ST_AsText = $result->fetch_object());
echo ('$json_sql = '); var_dump ($json_sql = geoPHP::load($ST_AsText->geom,'wkt')->out('json'));

include ('../index.html');
?>
