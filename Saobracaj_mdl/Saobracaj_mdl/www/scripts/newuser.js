$(document).ready(function () {
    var self = this;
    //alert("form loaded");

    $("#cancel").click(function () {
        $(".pikabu-viewport").hide();
        $("#newUser").hide();
        $("#logInF").show();
    });

    $("#create").click(function (e) {

        e.preventDefault();

        var usernme = $.trim($("#userNm").val());
        var pass = $.trim($("#passwrd").val());
        var retpass = $.trim($("#reppasswrd").val());


        if ((usernme == "") && (pass == "") && (retpass == "")) {
            alert("Type in username, password and retyped password!");
        }
        else {
            if (usernme == "") {
                alert("Type in username");
            }
            else if (pass == "") {
                alert("Type in password");
            }
            else if (retpass == "") {
                alert("Type in retyped password");
            }
            else {
                if (pass != retpass) {
                    alert("password nad retyped password dont match, please make sure they do");
                }
                else {
                    //ovde treba kod za kreiranje novog korisnika!!!!!
                    $.post("http://127.0.0.1:8081/process_newuser",
                    {
                        username: usernme,
                        password: pass
                    },
                     function (data, status) {
                         //alert("Data: " + data + "\nStatus: " + status);
                         if (status == "success") {
                             //$('#sendData')[0].reset();
                             //$("form").trigger("reset");

                             if (typeof (Storage) !== "undefined") {
                                 localStorage.setItem("username", usernme);
                                 //localStorage.setItem("password",pass);
                             } else {
                                 alert("Browser does not support local storage!");
                             }
                             $("#newUser").hide();
                             $(".pikabu-viewport").show();
                             usernameHeader.innerText = usernme;
                             setLoadMap();
                         }
                     });
                }
            }
        }
    });
});
