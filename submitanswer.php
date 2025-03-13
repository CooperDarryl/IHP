<?php
header("Content-type: application/json");
$U_ID = $_POST["U_ID"];
$QA_ID = $_POST["QA_ID"];
$qid = $_POST["QID"];
$oaid = $_POST["OAID"];
$oav = $_POST["OAV"];
$aid = 4;
$ACT = 0;


$conn = new PDO ("mysql:host=sql309.infinityfree.com;dbname=epiz_29332357_housemate;","epiz_29332357","0P01KtITNeYT");
$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

IF (isset($oaid) && $oaid == 4 && isset($U_ID) && isset($oav)){
  $statement = $conn->prepare("INSERT INTO Oanswer (Answer) VALUES (?)");
  $statement->bindparam(1, $oav);
  $statement->execute();
  $statement2 = $conn->prepare("SELECT MAX(ID) as OAID FROM Oanswer");
  $statement2->execute();
  $row = $statement2->fetch();
  IF($row == FALSE){
    header("HTTP/1.1 503");
  }
  ELSE {
    $theaid = array();
    while($row != FALSE){
      $theaid[] = $row;
      $row = $statement2->fetch(PDO::FETCH_ASSOC);
    }
    $oav = $theaid[0]["OAID"];
    $statement3 = $conn->prepare("INSERT INTO qa (Q_ID, A_ID, OA_ID, Active) VALUES (?, ?, ?, ?)");
    $statement3->bindparam(1, $qid);
    $statement3->bindparam(2, $aid);
    $statement3->bindparam(3, $oav);
    $statement3->bindparam(4, $ACT);
    $statement3->execute();
    $statement4 = $conn->prepare("SELECT MAX(ID) as QAID FROM qa");
    $statement4->execute();
    $row = $statement4->fetch();
    IF($row == FALSE){
      header("HTTP/1.1 503");
    }
    ELSE {
      $qaid = array();
      while($row != FALSE){
        $qaid[] = $row;
        $row = $statement4->fetch(PDO::FETCH_ASSOC);
      }
      $theqaid = $qaid[0]["QAID"];
      $statement5 = $conn->prepare("INSERT INTO ua (QA_ID, U_ID) VALUES (?, ?)");
      $statement5->bindparam(1, $theqaid);
      $statement5->bindparam(2, $U_ID);
      $statement5->execute();
      header("HTTP/1.1 200");
    }
  }
}
ELSE IF(isset($U_ID) && isset($QA_ID)){
  $statement6 = $conn->prepare("INSERT INTO ua (QA_ID, U_ID) VALUES (?, ?)");
  $statement6->bindparam(1, $QA_ID);
  $statement6->bindparam(2, $U_ID);
  $statement6->execute();
  header("HTTP/1.1 200");
}
ELSE {
  header("HTTP/1.1 500");
  echo "Closed and open IDs and/or UID not set.";
}
?>