$( document ).ready(function() {
			$("#statisticsBtn").click(function() {
		

		var c = document.getElementById("myCanvas");
		var ctx = c.getContext("2d");
		ctx.font = "20px Times New Roman";
		ctx.fillText("Aplikacija preko", 10, 20);
		ctx.fillText("koje korisnik proverava", 10, 50);
		ctx.fillText("probleme u saobracaju", 10, 90);
		/*var img = new Image();
		var ctx = c.getContext("2d");
		img.src = "/images/police.png";
		ctx.drawImage(img, 0, 0);*/
       
	});
});