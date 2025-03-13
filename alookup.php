<?php
header("Content-type: application/json");
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
$QID = $_GET["ID"];

$conn = new PDO ("mysql:host=sql309.infinityfree.com;dbname=epiz_29332357_housemate;","epiz_29332357","0P01KtITNeYT");
$statement = $conn->prepare("SELECT answer.Answer, question.ID as QID, answer.ID as AID, qa.ID as QAID FROM answer, qa, question WHERE answer.Active = 1 and qa.Active = 1 and qa.Q_ID = question.ID and answer.ID = qa.A_ID and qa.Q_ID = ?");
$statement->bindparam(1, $QID);
$statement->execute();
$row = $statement->fetch();

IF ($row == FALSE){
  header("HTTP/1.1 204");
  $results = ("No answers found");
  echo json_encode($results);
}
ELSE {
  header("HTTP/1.1 200");
  $results = array();
  while($row != false){
    $results[] = $row;
    $row = $statement->fetch(PDO::FETCH_ASSOC);
  }
  echo json_encode($results);
}
?>