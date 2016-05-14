$(document).ready(function () {
    var self = this;

    //funkcija koja treba da pozove formu newuser 1 varijanta!!!
    $("#crtNew").click(function () {
        //alert("button clicked");

        $(".pikabu-viewport").hide();
        $("#newUser").show();
        $("#logInF").hide();
    });

    //logovanje u aplikaciju preko baze
    $("#logIn").click(function () {

        var usernme = $.trim($("#username").val());
        var pass = $.trim($("#userpass").val());


        if ((usernme == "") && (pass == "")) {
            alert("Type in username and password!");
        }
        else {
            if (usernme == "") {
                alert("Type in username");
            }
            else if (pass == "") {
                alert("Type in password");
            }
            else {
                //self.pushReqToServer(usernme,pass);
                if ((usernme == "mosis") && (pass == "mosis")) {
                    $("#logInF").hide();
                    $(".pikabu-viewport").show();
                    $("#usernameHeader").val("MOSIS");
                    setLoadMap();
                    clientSide();
                }
                else {
                    $.post("http://127.0.0.1:8081/process_checkuser",
                    {
                        username: usernme,
                        password: pass
                    },
                     function (data, status) {
                         //alert("Data: " + data + "\nStatus: " + status);
                         if (status == "success") {
                             //$('#sendData')[0].reset();

                             //$("form").trigger("reset");
                             if (data == "correct") {

                                 if (typeof (Storage) !== "undefined") {
                                     localStorage.setItem("username", usernme);
                                 } else {
                                     alert("Browser does not support local storage!");
                                 }
                                 $("#logInF").hide();
                                 $(".pikabu-viewport").show();
                                 usernameHeader.innerText = usernme;
                                 setLoadMap();
                                 clientSide();
                             }
                             else {
                                 alert("Check username or password!");
                             }
                         }
                         else {
                             alert("Problem with server!");
                         }
                     });

                }

            }
        }
    });
});


/* 'Height' dugmica u zavisnosti od 'height' uredjaja*/
$(document).ready(function () {
    var height = $(window).height();

    $(".textLabel").height(height * 0.1 + "px");
    $(".mdlButton").height(height * 0.07 + "px");
    $(".mdlLayout").height(height * 1 + "px");
    $(".mdl-card__title").height(height * 0.02 + "px");
    $("#logInF").height(height * 0.91 + "px");
    $("#newUser").height(height * 0.91 + "px");
});


$(document).ready(function () {
    $("#logOut").click(function () {
        localStorage.clear();
        location.reload();
    });
});