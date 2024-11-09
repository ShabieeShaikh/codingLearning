$(document).ready(async function () {
  //Reading File
  const filejson = await fetch("/assets/js/dummy.json").then((res) => {
    return res.json();
  });

  const localDB = localStorage;

  //Reload function calling
  FnCheckLogin();
  FnLoadNavigation();

  $("#frm-login").submit(function (e) {
    e.preventDefault();
    $("#frm-login-btn").attr("disabled", true);
    const loginEmail = $("input[name=Email]");
    const loginPassword = $("input[name=Password]");
    const loginMessage = $("#frm-login-message");
    if (
      filejson.Login.Email == loginEmail.val() &&
      filejson.Login.Password == loginPassword.val()
    ) {
      loginMessage.html(null);
      loginEmail.val("");
      loginPassword.val("");
      loginMessage.html(`<div class="alert alert-success text-center" role="alert">
                                    Successfully Authenticated!.
                                    <div class="spinner-border spinner-border-sm" role="status">
                                        <span class="visually-hidden">Loading...</span>
                                      </div>
                                  </div>`);
      localDB.setItem("LGN-KEY-DM", "TRUE");
      setTimeout(() => {
        window.location = "./index.html";
      }, 2000);
    } else {
      loginMessage.html(null);
      loginMessage.html(`<div class="alert alert-danger text-center" role="alert">
                                    Invalid Cridentials!.
                                    <i class="fa fa-exclamation-circle" aria-hidden="true"></i>
                                  </div>`);
      $("#frm-login-btn").attr("disabled", false);
    }
  });

  //Login Functions
  function FnCheckLogin() {
    const isLogin = localDB.getItem("LGN-KEY-DM");
    const isLognPage = window.location.pathname.includes("login.html");
    if (isLogin == "TRUE" && isLognPage) {
      window.location = "./index.html";
    } else if (isLogin != "TRUE" && !isLognPage) {
      window.location = "./login.html";
    }
  }

  function logout() {
    localDB.removeItem("LGN-KEY-DM");
    window.location = "./login.html";
  }
  //Layout Function
  function FnLoadNavigation() {
    $("#dynamicNavigation").load("./includes/navigation.html");
  }
});

function logout() {
    localStorage.removeItem("LGN-KEY-DM");
    window.location = "./login.html";
  }
