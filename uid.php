<?php
header("Content-type: application/json");
$fname = $_POST["fname"];
$lname = $_POST["lname"];

$conn = new PDO ("mysql:host=sql309.infinityfree.com;dbname=epiz_29332357_housemate;","epiz_29332357","0P01KtITNeYT");
$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$statement = $conn->prepare("INSERT INTO uid (fname, lname) VALUES (?, ?);");
$fhash = password_hash($fname, PASSWORD_DEFAULT);
$lhash = password_hash($lname, PASSWORD_DEFAULT);
$statement->bindparam(1, $fhash);
$statement->bindparam(2, $lhash);
$statement->execute();
$statement2 = $conn->prepare("SELECT MAX(ID) as UID FROM uid");
$statement2->execute();
$row = $statement2->fetch();

IF ($row == FALSE){
  header("HTTP/1.1 204");
  $results = ("No User Found or Created");
  echo json_encode($result);
}
ELSE {
  header("HTTP/1.1 200");
  $results = array();
  while($row != false){
    $result[] = $row;
    $row = $statement2->fetch(PDO::FETCH_ASSOC);
  }
  echo json_encode($result);
}
?>

