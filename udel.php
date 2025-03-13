<?php
header("Content-type: application/json");
$UID = $_POST["UID"];

$conn = new PDO ("mysql:host=sql309.infinityfree.com;dbname=epiz_29332357_housemate;","epiz_29332357","0P01KtITNeYT");
$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$statement = $conn->prepare("DELETE FROM uid WHERE ID = ?; DELETE FROM ua WHERE U_ID = ?;");
$statement->bindparam(1, $UID);
$statement->bindparam(2, $UID);
$statement->execute();
?>