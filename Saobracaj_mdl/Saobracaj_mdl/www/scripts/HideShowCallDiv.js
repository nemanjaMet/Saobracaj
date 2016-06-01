/* Prikazivanje i skrivanje layouta (div-ova) */
$(document).ready(function () {

    $("#homeBtn").click(function () {
        pikabu.closeSidebars();
        $("#home").show();
        /*$("#maps").hide();*/
        $("#statistics").hide();
        $("#about").hide();
        $(".divDataInput").hide();
    });

    $("#mapsBtn").click(function () {
        pikabu.closeSidebars();
        $("#maps").show();
        $("#home").hide();
        $("#statistics").hide();
        $("#about").hide();
        $(".divDataInput").hide();
    });

    $("#statisticsBtn").click(function () {
        pikabu.closeSidebars();
        $("#statistics").show();
        $("#home").hide();
        /*$("#maps").hide();*/
        $("#about").hide();
        $(".divDataInput").hide();
    });

    $("#aboutBtn").click(function () {
        pikabu.closeSidebars();
        $("#about").show();
        $("#home").hide();
        $(".divDataInput").hide();
        /*$("#maps").hide();*/
        $("#statistics").hide();
    });
});


/* 'Height' dugmica u zavisnosti od 'height' uredjaja*/
$(document).ready(function () {
    var height = $(window).height();

    $(".homeButtons").height(height * 0.12 + "px");
    $(".hamburgerButtons").height(height * 0.05 + "px");

    $(".description").height(height * 0.2 + "px");
    $(".btnHeight").height(height * 0.08 + "px");

    $("#myCanvas").height(height * 0.91 + "px");
    /*$(".hideLayout").height(height * 0.91 + "px");*/
    $(".twoDivs").height(height * 0.91 + "px");
    /*$("#maps").height(height * 0.91 + "px");
    $("#home").height(height * 0.915 + "px");*/
});


$(document).ready(function () {
    $(".pikabu-viewport").hide();
    $("#newUser").hide();
    $("#logInF").show();
    var usernme = localStorage.getItem("username");
    if (usernme === null || usernme === "") {
        $(".pikabu-viewport").hide();
        $("#newUser").hide();
        $("#logInF").show();
    }
    else {
        $("#logInF").hide();
        $(".pikabu-viewport").show();
        usernameHeader.innerText = usernme;
        setLoadMap();
        clientSide();
    }

});

$(document).ready(function () {
    $("#radarBtn").click(function () {
        $(".divDataInput").show();
        $("#home").hide();
        $("#statistics").hide();
        $("#about").hide();
        $("#headerInput").val("Radar");
    });

    $("#nezgodeBtn").click(function () {
        $(".divDataInput").show();
        $("#home").hide();
        $("#statistics").hide();
        $("#about").hide();
        $("#headerInput").val("Nezgode");
    });

    $("#rnpBtn").click(function () {
        $(".divDataInput").show();
        $("#home").hide();
        $("#statistics").hide();
        $("#about").hide();
        $("#headerInput").val("Radovi na putu");
    });

    $("#zastojiBtn").click(function () {
        $(".divDataInput").show();
        $("#home").hide();
        $("#statistics").hide();
        $("#about").hide();
        $("#headerInput").val("Zastoji");
    });

    $("#pnpBtn").click(function () {
        $(".divDataInput").show();
        $("#home").hide();
        $("#statistics").hide();
        $("#about").hide();
        $(".textMiddle").val("Pomoc na putu");
    });

    $("#ostaloBtn").click(function () {
        $(".divDataInput").show();
        $("#home").hide();
        $("#statistics").hide();
        $("#about").hide();
        $("#headerInput").val("Ostalo");
    });
});


$(document).ready(function () {

    //$("#sendData").submit(function (event) {
    $("#sbmButton").click(function (e) {
        //$('#sendData').on('submit',function (e) {
        if ($.trim($("#longitude").val()) != "" && $.trim($("#latitude").val()) != "") {

            // Stop form from submitting normally
            e.preventDefault();
            validateForm(e);

            $.post("https://mosis.herokuapp.com/process_post",
                {
                    username: $("#usernameHeader").text(),
                    naslov: $(".textMiddle").val(),
                    longitude: $("#longitude").val(),
                    latitude: $("#latitude").val(),                   
                    description: $("#description").val(), /*NEKOLIKO KARAKTERA SE NE SALJU!?*/
                    procenaTrajanja: $("#procenaTrajanja").val()
                },
                 function (data, status) {
                     //alert("Data: " + data + "\nStatus: " + status);
                     if (status == "success") {
                         //$('#sendData')[0].reset();
                         // $("form").trigger("reset");
                         $(".divDataInput").hide();
                         $("#home").show();

                         $("#usernameHeader").val("");
                         $(".textMiddle").val("");
                         $("#longitude").val("");
                         $("#latitude").val("");
                         $("#procenaTrajanja").val("");
                         $("#description").val("");
                         /*MESSAGE BOX TREBA DA JE USPESNO POSLATO!*/
                         refreshData();
                     }
                 });
            e.preventDefault();
            validateForm(e);
        }
    });

    /*(function ($) {
        function processForm(e) {
            if ($("#longitude").text != null && $("#latitude").text != null) {
                $.ajax({
                    url: "http://127.0.0.1:8081/process_post",
                    dataType: 'json',
                    type: 'post',
                    contentType: 'application/json',
                    data: JSON.stringify({ "naslov": $(".textMiddle").val(), "longitude": $("#longitude").val(), "latitude": $("#latitude").val(), "procenaTrajanja": $("#procenaTrajanja").val(), "description": $("#description").val() }),
                    processData: false,
                    success: function (data, textStatus, jQxhr) {
                        console.log(JSON.stringify(data));
                    },
                    error: function (jqXhr, textStatus, errorThrown) {
                        console.log(errorThrown);
                    }

                });

                e.preventDefault();
                $('#sendData').submit(proccessForm);
            }
        }
    });*/

    /*$("#sendData").click(function () {
        if ($.trim($("#longitude").val()) != "" && $.trim($("#latitude").val()) != "") {
            $.post("http://127.0.0.1:8081/process_post",
                {
                    naslov: $(".textMiddle").val(),
                    longitude: $("#longitude").val(),
                    latitude: $("#latitude").val(),
                    procenaTrajanja: $("#procenaTrajanja").val(),
                    description: $("#description").val()
                },
                function (data, status) {
                    alert("Data: " + data + "\nStatus: " + status);
                });
        }
    });*/
});


$(document).ready(function () {
    $("#testStat").click(function () {
        $.get("http://127.0.0.1:8081/process_get", function (data, status) {
            //alert("Data: " + data + "\nStatus: " + status);
            /*data.forEach(function (row) {
                alert(JSON.stringify(row));
            });*/
            //alert(JSON.stringify(data));
        });
    });
});


function validateForm(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.returnValue = false; // for IE
}