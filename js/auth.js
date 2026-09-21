/* ============================================================
   SMART STUDENT ASSISTANT
   LOGIN / REGISTER
   ============================================================ */


/* ============================================================
   ELEMENTS
   ============================================================ */

const loginForm =
    document.getElementById("login-form");

const registerForm =
    document.getElementById("register-form");

const showRegisterButton =
    document.getElementById("show-register");

const showLoginButton =
    document.getElementById("show-login");

const loginButton =
    document.getElementById("login-button");

const registerButton =
    document.getElementById("register-button");


/* ============================================================
   SHOW REGISTER FORM
   ============================================================ */

if (showRegisterButton) {

    showRegisterButton.addEventListener(
        "click",
        function () {

            loginForm.style.display =
                "none";

            registerForm.style.display =
                "block";

        }
    );

}


/* ============================================================
   SHOW LOGIN FORM
   ============================================================ */

if (showLoginButton) {

    showLoginButton.addEventListener(
        "click",
        function () {

            registerForm.style.display =
                "none";

            loginForm.style.display =
                "block";

        }
    );

}


/* ============================================================
   REGISTER
   ============================================================ */

if (registerButton) {

    registerButton.addEventListener(
        "click",
        function () {

            const name =
                document.getElementById(
                    "register-name"
                ).value.trim();

            const email =
                document.getElementById(
                    "register-email"
                ).value.trim();

            const password =
                document.getElementById(
                    "register-password"
                ).value;

            const confirmPassword =
                document.getElementById(
                    "register-confirm-password"
                ).value;

            const message =
                document.getElementById(
                    "register-message"
                );


            if (
                !name ||
                !email ||
                !password ||
                !confirmPassword
            ) {

                message.textContent =
                    "Please fill in all fields.";

                message.style.color =
                    "#dc2626";

                return;

            }


            if (password !== confirmPassword) {

                message.textContent =
                    "Passwords do not match.";

                message.style.color =
                    "#dc2626";

                return;

            }


            if (password.length < 6) {

                message.textContent =
                    "Password must be at least 6 characters.";

                message.style.color =
                    "#dc2626";

                return;

            }


            const user = {

                name: name,

                email: email,

                password: password

            };


            localStorage.setItem(
                "smartStudentUser",
                JSON.stringify(user)
            );


            message.textContent =
                "Account created successfully!";

            message.style.color =
                "#16a34a";


            setTimeout(
                function () {

                    registerForm.style.display =
                        "none";

                    loginForm.style.display =
                        "block";

                    document.getElementById(
                        "login-email"
                    ).value = email;

                },
                1000
            );

        }
    );

}


/* ============================================================
   LOGIN
   ============================================================ */

if (loginButton) {

    loginButton.addEventListener(
        "click",
        function () {

            const email =
                document.getElementById(
                    "login-email"
                ).value.trim();

            const password =
                document.getElementById(
                    "login-password"
                ).value;

            const message =
                document.getElementById(
                    "login-message"
                );


            const savedUser =
                localStorage.getItem(
                    "smartStudentUser"
                );


            if (!savedUser) {

                message.textContent =
                    "No account found. Please create an account first.";

                message.style.color =
                    "#dc2626";

                return;

            }


            const user =
                JSON.parse(savedUser);


            if (
                email !== user.email ||
                password !== user.password
            ) {

                message.textContent =
                    "Invalid email or password.";

                message.style.color =
                    "#dc2626";

                return;

            }


            localStorage.setItem(
                "smartStudentLoggedIn",
                "true"
            );


            localStorage.setItem(
                "smartStudentCurrentUser",
                JSON.stringify(user)
            );


            message.textContent =
                "Login successful!";

            message.style.color =
                "#16a34a";


            setTimeout(
                function () {

                    window.location.href =
                        "index.html";

                },
                700
            );

        }
    );

}
/* ============================================================
   LOGOUT
   ============================================================ */

const logoutButton = document.getElementById("logout-button");

if (logoutButton) {

    logoutButton.addEventListener("click", function () {

        localStorage.removeItem("smartStudentLoggedIn");
        localStorage.removeItem("smartStudentCurrentUser");

        window.location.href = "login.html";

    });

}
/* ============================================================
   DISPLAY LOGGED-IN USER NAME
   ============================================================ */

const currentUserData =
    localStorage.getItem("smartStudentCurrentUser");

if (currentUserData) {

    const currentUser =
        JSON.parse(currentUserData);

    const welcomeUser =
        document.getElementById("welcome-user");

    if (welcomeUser && currentUser.name) {

        welcomeUser.textContent =
            `Welcome back, ${currentUser.name}! 👋`;

    }

}