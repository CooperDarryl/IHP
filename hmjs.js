var questions;
var qcount = 1;
var q = 0;
var len;
var qspin = "<div class='d-flex justify-content-center'><div class='spinner-border text-primary m-5' role='status' style='width: 5rem; height: 5rem;'><span class='visually-hidden'>Loading...</span></div></div><div class='d-flex justify-content-center'><h1>Loading...</h1></div>";
var aspin = "<div class='d-flex justify-content-center'><div class='spinner-border text-primary mb-1' role='status' style='width: 3.1rem; height: 3.1rem;'><span class='visually-hidden'></span></div></div><div class='d-flex justify-content-center'></div>";
var getq;
var userid;
var ori;
var oaid;
var lname;
var fname;

//Document Ready
$(document).ready(function() {
	$("#invert").click(function(){
		if ($("body").hasClass('inverted') == true){
			$("body").fadeOut();
			setTimeout(function(){
				$("#invert").html("<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-eye-slash-fill' viewBox='0 0 16 16'><path d='m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7.029 7.029 0 0 0 2.79-.588zM5.21 3.088A7.028 7.028 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474L5.21 3.089z'/><path d='M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829l-2.83-2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12-.708.708z'/></svg>");
				$("body").removeClass('inverted');
				$("body").fadeIn('slow');
			},500);
		}
		else{
			$("body").fadeOut();
			setTimeout(function(){
				$("#invert").html("<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-eye-fill' viewBox='0 0 16 16'><path d='M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z'/><path d='M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z'/></svg>");
				$("body").addClass("inverted");
				$("body").fadeIn('slow');
			},500);
		}
	})
	$('#infoModal').modal('show');

	$('#InputModalToggle').on('shown.bs.modal', function () {
		if ($("#OTextarea").val() !== ""){
			$("#OTextarea").removeClass('glow');
			$("#confirminput").addClass('tglow');
		 }
		 else {
			$("#OTextarea").addClass('glow');
			$("#confirminput").removeClass('tglow');
		 };
	});
	$("#OTextarea").keyup(function() {
		if ($("#OTextarea").val() !== ""){
		   $("#OTextarea").removeClass('glow');
		   setTimeout(function(){
			$("#confirminput").addClass('tglow');
		   }, 2000);
		   $("#next").addClass('tglow');
		}
		else {
			$('#OTextarea').addClass('glow');
			$("#confirminput").removeClass('tglow');
			$("#next").removeClass('tglow');
		}
		 });

		$("#fname").keyup(function(){
			if($("#fname").val() != "" && $("#lname").val() != ""){
				$("#start").removeClass('disabled');
				$("#start").addClass('tglow');
			}
			else {
				
				$("#start").removeClass('tglow');
				
			}


		});
		$("#lname").keyup(function(){
			if($("#fname").val() != "" && $("#lname").val() != ""){
				$("#start").removeClass('disabled');
				$("#start").addClass('tglow');
			}
			else {
				$("#start").addClass('disabled');
				$("#start").removeClass('tglow');
			}
		});

		$(document).on('change', 'input[name=answer]', function(){
			$("#next").addClass('tglow');
		});

	window.onbeforeunload = function(){
		return 'Are you sure you want to leave?';
	  };
	window.onunload = function() {
		uDel();
	};


//Check name inputs before displaying questions and answers
$("#start").click(function(){
	if($("#fname").val() == "" || $("#lname").val() == ""){
		if($("#fname").val() == "" && $("#lname").val() == ""){
			$("#fname").addClass("is-invalid");
			$("#lname").addClass("is-invalid");
			const audio = new Audio("error.mp3");
			audio.play();
	}
		else if($("#fname").val() == "" && $("#lname").val() != ""){
			$("#lname").removeClass("is-invalid");
			$("#fname").addClass("is-invalid");
			const audio = new Audio("error.mp3");
			audio.play();
		}
		else if($("#lname").val() == "" && $("#fname").val() != ""){
			$("#fname").removeClass("is-invalid");
			$("#lname").addClass("is-invalid");
			const audio = new Audio("error.mp3");
			audio.play();
		}
	}
	else {
		fname = $("#fname").val();
		lname = $("#lname").val();
		$("#fname").removeClass("is-invalid");
		$("#lname").removeClass("is-invalid");
		setTimeout(function(){
			loadQ();
			$("#answers").removeClass("d-none");
		},300)
	}
});


//Get questions ajax + creat UID ajax
function loadQ(){
		$("#result").html(qspin);
		$.ajax({
			url: "dbc.php",
			type: "GET",
			dataType: "json",
			statusCode: {
				404:  function(){
					$(".modal-body").html("<h4>Oh no, looks like something went wrong. <br/>Error: <strong>Q404</strong></h4><p>Contact the Aldingbourne Trust and let them know.</p>");
				},
				400: function(){
					$(".modal-body").html("<h4>Oh no, looks like something went wrong. <br/>HTTP Error: <strong>Q400</strong></h4><p>Contact the Aldingbourne Trust and let them know.</p>");
				},
				403: function() {
					$(".modal-body").html("<h4>Oh no, looks like something went wrong. <br/>HTTP Error: <strong>Q403</strong></h4><p>Contact the Aldingbourne Trust and let them know.</p>");
				},
				500: function(){
					$(".modal-body").html("<h4>Oh no, looks like something went wrong. <br/>HTTP Error: <strong>Q500</strong></h4><p>Contact the Aldingbourne Trust and let them know.</p>");
				},
				503: function(){
					$(".modal-body").html("<h4>Oh no, looks like something went wrong. <br/>HTTP Error: <strong>Q503</strong></h4><p>Contact the Aldingbourne Trust and let them know.</p>");
				}

			},
			success: onSuccess
		});
}

//Process and display results of questions ajax, show hide navigation buttons
function onSuccess(results, status, xmlHTTP) {
	
	if ( xmlHTTP.status === 200){
		//console.log(status);
		//console.log(results);
		$("#answers").html("").hide();
		$(".modal-body, .modal-footer").hide();
		$(".modal-body, .modal-footer").fadeIn("slow");
		$("#start").hide();
      	$("#reset").removeClass("d-none");
		$("#next").removeClass("d-none");
		$("#reset").removeClass("disabled");
		questions = results;
		len = results.length;
		fetchUser();
		fetchQuestion();
		fetchAnswer();
	}
	else if(xmlHTTP.status === 200 && $("#floatingInput").val() == "" && $("#floatingInput1").val() == "") {

	} 
	else if(xmlHTTP.status === 204){
		$(".modal-body").html("<h4>We couldn't find any questions. Sorry. <br/>HTTP Error: <strong>Q204</strong></h4><p>Contact the Aldingbourne Trust and let them know.</p>");
	}
	else {
		$(".modal-body").html("<h2>Something has gone wrong, we're not sure why. :(</h2><p>Contact the Aldingbourne Trust and let them know.</p><p>Status: "+xmlHTTP.status+"</p>");
	}
};

//Fetch user
function fetchUser(){
	$.ajax({
		url: "uid.php",
		type: "POST",
		dataType: "json",
		data: {fname: fname, lname: lname},
		statusCode: {
			404: function() {
				$(".modal-body").html("<h4>Oh no, looks like something went wrong. <br/>Error: <strong>U404</strong></h4><p>Contact the Aldingbourne Trust and let them know.</P>");
			},
			400: function() {
				$(".modal-body").html("<h4>Oh no, looks like something went wrong. <br/>HTTP Error: <strong>U400</strong></h4><p>Contact the Aldingbourne Trust and let them know.</P>");
			},
			403: function() {
				$(".modal-body").html("<h4>Oh no, looks like something went wrong. <br/>HTTP Error: <strong>U403</strong></h4><p>Contact the Aldingbourne Trust and let them know.</P>");
			},
			500: function() {
				$(".modal-body").html("<h4>Oh no, looks like something went wrong. <br/>HTTP Error: <strong>U500</strong></h4><p>Contact the Aldingbourne Trust and let them know.</P>");
			},
			503: function() {
				$(".modal-body").html("<h4>Oh no, looks like something went wrong. <br/>HTTP Error: <strong>U503</strong></h4><p>Contact the Aldingbourne Trust and let them know.</P>");
			}
		},
		success: UID
	});
}

//Create User ID function
function UID(user, status, xmlHTTP){
	if (xmlHTTP.status === 200) {
		//console.log(xmlHTTP.status);
		//console.log(user);
		userid = user[0].UID;
		//console.log(userid);
		$("#userid").text("IHP"+userid);
		$("#username").text(fname+" "+lname);
		$("#FN").val(fname);
		$("#LN").val(lname);
		$("#UID").val(userid);
		$("#userid").fadeIn();
		$("#username").fadeIn(); 
		//console.log($("#FN").val());
		//console.log($("#LN").val());
		//console.log($("#UID").val());
		

	}
	else if (xmlHTTP.status === 204){
		$(".modal-body").html("Uanble to create or fetch user ID: <strong>"+xmlHTTP.staus+"</strong><p>Contact the Aldingbourne Trust and let them know.</p>");
	}
	else {
		$(".modal-body").html("<h2>Something has gone wrong, we're not sure why. :(</h2><p>Contact the Aldingbourne Trust and let them know.</p><p>Status: "+xmlHTTP.status+"</p>");
	}

}

//Process json results and display in modal body 
function fetchQuestion() {
	$("#result").html("<h1 id='qh1' class='mt-1'>" + questions[q].Question + "</h1>");
	$("#counter").html("<h3>Question <strong style='color: #ea6c0d;'>" + (qcount) + "</strong> of <strong  style='color: #ea6c0d;'>" + len + "</strong></h3>");
	//console.log(questions[q].ID);
}

//Get Question answers ajax
function fetchAnswer() {
	$("#answers").html(aspin);
	$("#next").addClass('disabled');
	//console.log(qcount);
	$.ajax({
		url: "alookup.php",
		type: "GET",
		dataType: "json",
		data: "ID=" + questions[q].ID,
		statusCode: {
			404: function() {
				$(".modal-body").html("<h4>Oh no, looks like something went wrong. <br/>Error: <strong>A404</strong></h4><p>Contact the Aldingbourne Trust and let them know.</p>");
			},
			400: function() {
				$(".modal-body").html("<h4>Oh no, looks like something went wrong. <br/>HTTP Error: <strong>A400</strong></h4><p>Contact the Aldingbourne Trust and let them know.</p>");
			},
			403: function() {
				$(".modal-body").html("<h4>Oh no, looks like something went wrong. <br/>HTTP Error: <strong>A403</strong></h4><p>Contact the Aldingbourne Trust and let them know.</p>");
			},
			500: function() {
				$(".modal-body").html("<h4>Oh no, looks like something went wrong. <br/>HTTP Error: <strong>A500</strong></h4><p>Contact the Aldingbourne Trust and let them know.</p>");
			},
			503: function() {
				$(".modal-body").html("<h4>Oh no, looks like something went wrong. <br/>HTTP Error: <strong>A503</strong></h4><p>Contact the Aldingbourne Trust and let them know.</p>");
			}
		},
		success: onAnswer
	});
}


//Process answers and display in modal footer
var i = 0;
function onAnswer(data, status, xmlHTTP) {
	//console.log(xmlHTTP.status);
	$("#next").removeClass('disabled');
	if (xmlHTTP.status === 200) {
		$("#answers").hide();
		$("#answers").html("");

		if (data.length === 1){
			
			//console.log("Open Answer");
			oaid = 4;
			var glower;
			$("#answers").html("<div id='aarea' data-bs-target='#InputModalToggle' data-bs-toggle='modal' data-bs-dismiss='modal' class='input-group w-100'><span class='input-group-text' id='basic-addon1' style='cursor:pointer;'><svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' fill='#0d6efd' class='bi bi-pencil-fill' viewBox='0 0 16 16'><path d='M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z'></path></svg></span><input type='text' style='cursor:pointer;' id='ainput' class='form-control' readonly placeholder='Add Answer' style='font-size: 24px;' maxlength='255' aria-label='Answer input' aria-describedby='basic-addon1'></div>");
			$("#OTextarea").val("");
			$("#imodalh").html("<h5>Answer for question <strong style='color: #ea6c0d;'>" + (qcount) + "</strong> of <strong  style='color: #ea6c0d;'>" + len + "</strong></h5>");
			$("#confirminput").html("< Return to question<span style='color: #ea6c0d; font-weight: bold;'> "+(qcount)+"</span>");
			$("#OTextarea[maxlength]").maxlength({
			});
			$("#confirminput").blur();
			$("#qrem").text($("#qh1").text());
			$("#answers").fadeIn("slow");
			setTimeout(function (){
					$("#aarea").addClass('glow')}, 2000);}

		else {
			$("#answers").hide();
			oaid = 0;
			for (var i = 0; i < data.length; i++) {
				$("#answers").prepend("<input type='radio' class='form-check-input form-check-inline btn-check' name='answer' id='" + data[i].QAID + "' autocomplete='off' value='" + data[i].QAID + "' required><label class='btn btn-outline-success btn-lg' style='margin: 10px;' for='" + data[i].QAID + "'><strong>" + data[i].Answer + "</strong></label>");
				$("#OTextarea").val("");
			}
			$("#answers").fadeIn("slow");
		} 
	}
	else if(xmlHTTP.status === 204){
		$(".modal-body").html("<h2>No answers found for this question. Sorry.</h2><p>Contact the Aldingbourne Trust and let them know.");
}
	else {
		$(".modal-body").html("<h2>Something has gone wrong, we're not sure why.</h2><p>Contact the Aldingbourne Trust and let them know.<h3>HTTP: "+xmlHTTP.status+"</h3>");
	}
};

//Copy value of textarea to input
$("#confirminput").click(function(){
	$("#ainput").val($("#OTextarea").val());
		if ($("#ainput").val() !== ""){
			$("#aarea").removeClass('glow');

		}
		else {
			$("#aarea").removeClass('glow');
			setTimeout(function(){
				$("#aarea").addClass('glow');
			}, 2000);
		}

});

//Wrie user ID and answer ID to ua table
function onNext(){
	q ++;
	$.ajax({
		url: "submitanswer.php",
		type: "POST",
		dataType: "json",
		data: {QA_ID: $("input[name='answer']:checked").val(), U_ID: userid, OAV: $("#OTextarea").val(), QID: questions[q-1].ID, OAID: oaid},
		statusCode: {
			404: function() {
				$(".modal-body").html("<h4>Oh no, looks like something went wrong. <br/>Error: <strong>UQ404</strong></h4><p>Contact the Aldingbourne Trust and let them know.</P>");
			},
			400: function() {
				$(".modal-body").html("<h4>Oh no, looks like something went wrong. <br/>HTTP Error: <strong>UQ400</strong></h4><p>Contact the Aldingbourne Trust and let them know.</P>");
			},
			403: function() {
				$(".modal-body").html("<h4>Oh no, looks like something went wrong. <br/>HTTP Error: <strong>UQ403</strong></h4><p>Contact the Aldingbourne Trust and let them know.</P>");
			},
			500: function() {
				$(".modal-body").html("<h4>Oh no, looks like something went wrong. <br/>HTTP Error: <strong>UQ500</strong></h4><p>Contact the Aldingbourne Trust and let them know.</P>");
				//console.log("QA "+$("input[name='answer']:checked").val()+", U_ID "+userid+", OAV "+$("#OTextarea").val()+", QID "+questions[q-1].ID+", OAID "+oaid);
			},
			503: function() {
				$(".modal-body").html("<h4>Oh no, looks like something went wrong. <br/>HTTP Error: <strong>UQ503</strong></h4><p>Contact the Aldingbourne Trust and let them know.</P>");
			}
		},
		success: function(){
			//console.log("UID & QA_ID added successfully")
			}
	});
}


//Next button funtion
$("#next").click(function next() {
	var radio = $("input[name='answer']:checked").val();
	var textarea = $("#OTextarea").val();
	//console.log(radio);
	//console.log(textarea);
	$("#next").removeClass('tglow');
	$("#OTextarea").removeClass('glow');
	

	if (typeof radio != 'undefined' && radio != "") {
	
		QandA();
		$("#next").blur();

	} 
	else if (typeof textarea != 'undefined' && textarea != "") {

		QandA();
		$("#next").blur();

	}
	
	else {
		//console.log("No answer selected");
		$("#next").addClass("disabled");
		$("#answers").effect("shake");
		const audio = new Audio("error.mp3");
		audio.play();
		setTimeout(function() {
			$("#next").removeClass("disabled");
		}, 500);

	}
});

//Question and answers function
function QandA() {
	if (qcount < len) {
		qcount++;
		//console.log($("input[name='answer']:checked").val());
		onNext();

		$("#result").hide();
		setTimeout(function() {
			$("#result").fadeIn("slow");
		}, 200);
		fetchQuestion();
		fetchAnswer();
		$(".fadein").hide();
		$(".fadein").fadeIn("slow");
		$(".modal-body").scrollTop(0);
	} else if (qcount == len) {
		onNext();
		$("#next").hide();
		$("#next").parent().css("padding", "0 !important;", "margin", "0 !important");
		$("#submit").removeClass("d-none");
		$("#result").hide();
		$("#result").html("<div class='col-md-12 d-flex justify-content-center'><img src='contract.png' alt='' width='80' class='d-inline-block align-bottom img-fluid'></div><br/><div class='col-md-12 d-flex justify-content-center'> <h1>Complete, click submit to download your IHP...<strong style='color: #ea6c0d;'>:)</strong></h1></div>");
		setTimeout(function(){
			$("#result").fadeIn("slow");
		},100);
		$("#counter").hide();
		$("#answers").html("<div class='col-md-12 d-flex justify-content-center pb-2'><img src='../wp-content/uploads/2021/08/houseo.png' alt='' class='d-inline-block align-bottom img-fluid'></div>").fadeIn("slow");
	 $("#counter").html("<h4>Click submit to download your IHP <strong style='color: #ea6c0d;'>:)</strong></h4>");
	 $("#reset").addClass("disabled");
		//console.log(qcount);

	}
}

//Delete user ID & answers on quit or reset
function uDel(){
	$.ajax({
		url: "udel.php",
		type: "POST",
		dataType: "json",
		data: {UID: userid},
		statusCode: {
			404: function() {
				$(".modal-body").html("<h4>Oh no, looks like something went wrong. <br/>Error: <strong>D404</strong></h4><p>Contact the Aldingbourne Trust and let them know.</P>");
			},
			400: function() {
				$(".modal-body").html("<h4>Oh no, looks like something went wrong. <br/>HTTP Error: <strong>D400</strong></h4><p>Contact the Aldingbourne Trust and let them know.</P>");
			},
			403: function() {
				$(".modal-body").html("<h4>Oh no, looks like something went wrong. <br/>HTTP Error: <strong>D403</strong></h4><p>Contact the Aldingbourne Trust and let them know.</P>");
			},
			500: function() {
				$(".modal-body").html("<h4>Oh no, looks like something went wrong. <br/>HTTP Error: <strong>D500</strong></h4><p>Contact the Aldingbourne Trust and let them know.</P>");
			},
			503: function() {
				$(".modal-body").html("<h4>Oh no, looks like something went wrong. <br/>HTTP Error: <strong>D503</strong></h4><p>Contact the Aldingbourne Trust and let them know.</P>");
			}
		},
		success: console.log("UID Deleted")
	});
}

//Submit button function
$("#submit").click(function pDF(){
	window.onbeforeunload = false;
	$("#counter").html("<h4>Your download will begin shortly...<strong style='color: #ea6c0d;'>:)</strong></h4>");
		$("#submit").addClass("disabled");
		$("#result").hide();
		$("#result").html("<br/><br/><div class='col-md-12 d-flex justify-content-center'><img src='file.png' alt='' width='80' class='d-inline-block align-bottom img-fluid'></div><br/><div class='col-md-12 d-flex justify-content-center'> <h1>Press the button below to go back to housemate once your IHP has downloaded... <strong style='color: #ea6c0d;'>:)</strong></h1><br/></div><div class='col-md-12 d-flex justify-content-center'><a class='btn btn-success btn-lg w-50' href='/' role='button'><strong>Home</stong></a></div>");
		setTimeout(function(){
			$("#result").fadeIn("slow");
		}, 1000);
});

//Exit questions funtions call
$(".exit").click(function() {
	window.open("https://dcooper.lovestoblog.com/","_self");
}
);

});
