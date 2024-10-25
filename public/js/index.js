//#region      DOM elements

//      SignIn and SignUp: changing div buttons
const opSIn = document.querySelector('#btnSIn');
const opSUp = document.querySelector('#btnSUp');

const BtnSingUp = document.querySelector('#btnSignUp');
const BtnSingIn = document.querySelector('#btnSignIn');

//      SignIn and SignUp: Forms
const SignUpForm = document.querySelector('#signup-form');
const SignInForm = document.querySelector('#signin-form');

//      Show Online/Offline
const showOnlineOfflineSUp = document.querySelector('#ShowOnOffSUp');
const showOnlineOfflineSIn = document.querySelector('#ShowOnOffSIn');

//      SignIn Email input
const inputSingIn = document.querySelector('#signinemail');

//#endregion


//      Listen for auth status changes
auth.onAuthStateChanged(user => {

    //  Signed or not
    if (user && sessionStorage.getItem("useruid") != null) {

        //  SignedIn

        //  Redirect to Profile
        location.href = "pages/me.html";

    } else {

        //  Not SignedIn

        //  SignOut
        auth.signOut();

        //  Remove UserId from SessionStorage
        sessionStorage.removeItem('useruid');

    }

});


//      Hear Online/Offline status
window.addEventListener('load', function() {

    window.addEventListener('online', itsOnlineOrOffline());
    window.addEventListener('offline', itsOnlineOrOffline());

});


//#region Show SignIn or SignUp
function actSIn() {

    SignInForm.style.display = "block";
    SignInForm.querySelector('.error').innerHTML = '';

    SignUpForm.style.display = "none";
    SignUpForm.reset();

    opSIn.className = "cit__signOption cit__signOptionActive";
    opSUp.className = "cit__signOption ";

    itsOnlineOrOffline();
}

function actSUp() {

    SignInForm.style.display = "none";
    SignInForm.reset();

    SignUpForm.style.display = "block";
    SignUpForm.querySelector('.error').innerHTML = '';

    opSIn.className = "cit__signOption ";
    opSUp.className = "cit__signOption cit__signOptionActive";

    itsOnlineOrOffline();

}

//#endregion


//      SignUp
SignUpForm.addEventListener('submit', (e) => {

    e.preventDefault();

    //  Check if passwords match
    if (SignUpForm.signuppassword.value ==
        SignUpForm.confirmsignuppassword.value) {


        //  Form fields
        const email = SignUpForm.signupemail.value;
        const password = SignUpForm.signuppassword.value;

        //  Define name based on email
        var namefromemail = email.substring(0, email.lastIndexOf("@"));

        //  Create new user
        auth.createUserWithEmailAndPassword(email, password).then(cred => {

            //  Save user info
            return db.collection('users').doc(cred.user.uid).set({

                ProfilePicture: 'https://firebasestorage.googleapis.com/v0/b/pap1-686d7.appspot.com/o/profilepics%2Fcit_defaultuserimage.png?alt=media&token=4c738cbb-0e5a-4499-8699-bacafc195a25',
                Email: email,
                Name: namefromemail

            });

        }).then(() => {

            //  Reset Form
            SignUpForm.reset();
            SignUpForm.querySelector('.error').innerHTML = '';

        }).catch(err => {

            //  Show Error
            if (err.code === 'auth/invalid-password') {
                SignUpForm.querySelector('.error').innerHTML = 'Password invalida';
            } else if (err.code === 'auth/email-already-in-use') {
                SignUpForm.querySelector('.error').innerHTML = 'Utilizador já existe';
            } else {
                SignUpForm.querySelector('.error').innerHTML = err.message;
            }

        });

    } else {

        //  Show Error
        SignUpForm.reset();
        SignUpForm.querySelector('.error').innerHTML = 'Erro ao registar, tende denovo';

    }

});

//      SignIn
SignInForm.addEventListener('submit', (e) => {

    e.preventDefault();

    //  Form fields
    const email = SignInForm.signinemail.value;
    const password = SignInForm.signinpassword.value;

    // SignIn user
    auth.signInWithEmailAndPassword(email, password).then((cred) => {

        //  Create UserId session
        sessionStorage.setItem("useruid", cred.user.uid);

        //  Reset Form
        SignInForm.reset();
        SignInForm.querySelector('.error').innerHTML = '';

        //  Redirect to Profile
        window.location.href = "pages/me.html";

    }).catch(err => {

        if (err.code === 'auth/wrong-password') {
            SignInForm.querySelector('.error').innerHTML = 'Password incorreta';
        } else if (err.code === 'auth/user-not-found') {
            SignInForm.querySelector('.error').innerHTML = 'Utilizador não existe';
        } else {
            SignInForm.querySelector('.error').innerHTML = err.message;
        }

        //  Show Error


    });

});

//      Check if passwords match
function checkPassword() {

    if (document.getElementById('signuppassword').value ==
        document.getElementById('confirmsignuppassword').value) {

        //  Enable SignUp button
        document.getElementById('btnSignUp').disabled = false;

        // Check again for Online/Offline
        itsOnlineOrOffline();

    } else {

        //  Disable SignUp button
        document.getElementById('btnSignUp').disabled = true;

    }

};

//      Check Online/Offline
function itsOnlineOrOffline(event) {

    //  Check if navigator is Online or Ofline
    var OnOff = navigator.onLine ? "online" : "offline";

    switch (OnOff) {
        case 'online':

            //      Online

            //  Enable Buttons
            BtnSingIn.disabled = false;
            BtnSingUp.disabled = false;

            //  Show Online
            showOnlineOfflineSUp.innerHTML = "Online";
            showOnlineOfflineSUp.className = 'cit__online';

            showOnlineOfflineSIn.innerHTML = "Online";
            showOnlineOfflineSIn.className = 'cit__online';

            //  Hide Online
            setTimeout(function() {
                showOnlineOfflineSUp.className = 'cit__remove';
                showOnlineOfflineSIn.className = 'cit__remove';
            }, 3000);

            break;
        case 'offline':

            //      Offline

            //  Disable Buttons
            BtnSingIn.disabled = true;
            BtnSingUp.disabled = true;

            //  Show Offline
            showOnlineOfflineSUp.innerHTML = "Offline";
            showOnlineOfflineSUp.className = 'cit__offline';

            showOnlineOfflineSIn.innerHTML = "Offline";
            showOnlineOfflineSIn.className = 'cit__offline';


            break;
        default:

            //  Show Error
            console.log('Error')
            break;
    }

};

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

//      User Forgot Password
function forgotPassword() {

    var forgotPassword = prompt("Insira o email da conta e será enviado um email com a recuperaçao da senha", "");
    if (forgotPassword != null) {

        //  Virify Email
        if (validateEmail(forgotPassword)) {

            //  Valid Email

            auth.sendPasswordResetEmail(forgotPassword).then(() => {

                alert('Email enviado, verifique o seu email');

            }).catch(function(error) {

                // An error happened.
                alert('Ocorreu um erro tente denovo');

                console.log(error);

            });

        } else {

            //  Invalid Email

            alert('Insira um email valido');
        }
    } else {
        alert('Insira um email');
    }


}