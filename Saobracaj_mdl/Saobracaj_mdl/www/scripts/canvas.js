$( document ).ready(function() {
			$("#statisticsBtn").click(function() {
		
		var height = $(window).height();
		var width = $(window).width();

		var c = document.getElementById("myCanvas");
		/*var ctx = c.getContext("2d");
		ctx.font = "20px Times New Roman";
		ctx.fillText("Aplikacija preko", 10, 20);
		ctx.fillText("koje korisnik proverava", 10, 50);
		ctx.fillText("probleme u saobracaju", 10, 90);*/

		var imgSizeH = height * 0.04;
		var imgSizeW = width * 0.15;
		var imgTxt = height * 0.02;
		var imgTxtY = imgSizeH / 2;
		var offsetX = width * 0.15;
		var imgTxtX = imgSizeW + imgTxt + offsetX;
		
		var img = new Image();
		var ctx = c.getContext("2d");
		ctx.font = "12px Times New Roman";
		img.src = "images/police.png";
		
		img.onload = function () {
		    ctx.drawImage(img, offsetX, 0, imgSizeW, imgSizeH);
		    ctx.fillText(" ---- Policijska kontrola", imgTxtX, imgTxtY);
		}
       
	    var img2 = new Image();
		img2.src = "images/accident.gif";
		img2.onload = function () {
		    ctx.drawImage(img2, offsetX, imgSizeH, imgSizeW, imgSizeH);
		    ctx.fillText(" ---- Nezgoda na putu", imgTxtX, imgTxtY + imgSizeH);
		}

		var img3 = new Image();
		img3.src = "images/roadWork.png";
		img3.onload = function () {
		    ctx.drawImage(img3, offsetX, imgSizeH * 2, imgSizeW, imgSizeH);
		    ctx.fillText(" ---- Radovi na putu", imgTxtX, imgTxtY + imgSizeH * 2);
		}

		var img4 = new Image();
		img4.src = "images/traffic.png";
		img4.onload = function () {
		    ctx.drawImage(img4, offsetX, imgSizeH * 3, imgSizeW, imgSizeH);
		    ctx.fillText(" ---- Zastoji i guzve", imgTxtX, imgTxtY + imgSizeH * 3);
		}

		var img5 = new Image();
		img5.src = "images/help.png";
		img5.onload = function () {
		    ctx.drawImage(img5, offsetX, imgSizeH * 4, imgSizeW, imgSizeH);
		    ctx.fillText(" ---- Pomoc na putu", imgTxtX, imgTxtY + imgSizeH * 4);
		}

		var img6 = new Image();
		img6.src = "images/other.png";
		img6.onload = function () {
		    ctx.drawImage(img6, offsetX, imgSizeH * 5, imgSizeW, imgSizeH);
		    ctx.fillText(" ---- Ostala obavestenja", imgTxtX, imgTxtY + imgSizeH * 5);
		}

	});
});