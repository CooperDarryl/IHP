<?php
header("Content-type: application/json");
//Mpdf
require_once __DIR__ . '/vendor/autoload.php';
$UID = $_POST['UID'];
$FN = $_POST['FN'];
$LN = $_POST['LN'];
$date = date("d/m/Y");
$conn = new PDO ("mysql:host=sql309.infinityfree.com;dbname=epiz_29332357_housemate;","epiz_29332357","0P01KtITNeYT");
$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$statement = $conn->prepare("SELECT q.ID as ID, q.question as Question, oa.answer as Answer FROM question q, Oanswer oa, qa, uid, ua, answer a WHERE q.ID = qa.Q_ID AND qa.A_ID = a.ID AND qa.OA_ID = oa.ID AND ua.QA_ID = qa.ID AND uid.ID = ua.U_ID AND qa.OA_ID IS NOT NULL and uid.id = ? UNION SELECT q.ID as ID, q.question as Question, a.answer as Answer FROM question q, answer a, qa, ua, uid u WHERE u.ID = ua.U_ID AND ua.QA_ID = qa.ID AND qa.Q_ID = q.ID AND qa.A_ID =a.ID AND qa.OA_ID IS NULL AND u.ID = ?;");
$statement->bindparam(1, $UID);
$statement->bindparam(2, $UID);
$statement->execute();
$row = $statement->fetchAll();


//Retreive user answers
IF($row != FALSE){
  $statement2 = $conn->prepare("SELECT q.ID as ID, q.question as Question, oa.answer as Answer FROM question q, Oanswer oa, qa, uid, ua, answer a WHERE q.ID = qa.Q_ID AND qa.A_ID = a.ID AND qa.OA_ID = oa.ID AND ua.QA_ID = qa.ID AND uid.ID = ua.U_ID AND qa.OA_ID IS NOT NULL and uid.id = ? UNION SELECT q.ID as ID, q.question as Question, a.answer as Answer FROM question q, answer a, qa, ua, uid u WHERE u.ID = ua.U_ID AND ua.QA_ID = qa.ID AND qa.Q_ID = q.ID AND qa.A_ID =a.ID AND qa.OA_ID IS NULL AND u.ID = ? ORDER BY ID ASC;");
  $statement2->bindparam(1, $UID);
  $statement2->bindparam(2, $UID);
  $statement2->execute();
  $results = array();
  $row2 = $statement2->fetch();
    
  $html = "<html lang='en' class='h-100'><head>
  <style> h2, h3, h4, h5, span, p {  font-family: Arial, sans-serif;} .anw {color: #fd7e14;} h3 {text-align: center;} .right {text-align: right;} .center {text-align: center; display: inline;}</style>
  </head>
  <body>
      <main>
          <header>
          <h2><img src='houseo.png' width='30'> <strong>Housemate</strong></h2>
          <h3>Independent Housing Plan</h3>
          <p class='center'>for: <strong>$FN $LN - IHP$UID</strong></p>
          </header>
          <div>";
  $q = 1;
  $results = array();
  while($row2 != false){
    $results[] = $row2;
    $row2 = $statement2->fetch(PDO::FETCH_ASSOC);
  }
  foreach($results as $result) {
    $html .='<span>Question '.$q++.'</span><br><h4>'.$result['Question'].'</h4><h4 class="anw">'.$result['Answer'].'</h4><br>';
}
$html .="</div>
</main>
<footer class='py-1 bg-dark'>
    <div class='center'>
       <p class='center'><strong style='font-size: x-large;'>housemate</strong><br/>@aldingbourne</p>
          <p class='center'><img src='at.png' height='30'></p>
          <span>Created on: $date</span>
    </div>
    </footer>
</body>
</html>";
}
else if ($row == FALSE) {
  $html = "Sorry, there were no entries found for IHP$UID, please contact the Aldingbourne Trust.";
}
$mpdf = new \Mpdf\Mpdf();
$mpdf->WriteHTML($html);
$mpdf->Output("IHP".$UID.'-'.$FN.' '.$LN.'.pdf',\Mpdf\Output\Destination::DOWNLOAD);

?>