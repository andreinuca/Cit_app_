//#region       DOM elements and variables





//  Nav
const cit__nav = document.getElementById('cit__nav');




//  Settings
const setting2 = document.getElementById('setting2');
const setting3 = document.getElementById('setting3');
const setting4 = document.getElementById('setting4');

//#endregion

//      Listen for auth status changes
auth.onAuthStateChanged(user => {

    //  Signed or not
    if (user && sessionStorage.getItem("useruid") != null) {

        //  SignedIn

    } else {

        //  Not SignedIn

        //  SignOut
        auth.signOut();

        //  Remove UserId from SessionStorage
        sessionStorage.removeItem('useruid');

        //  Redirect To Index( Sing In/Up )
        location.href = "../index.html";


    }

    //  Materialize set modal and colapsible divs
    var modals = document.querySelectorAll('.modal');
    M.Modal.init(modals);

    var items = document.querySelectorAll('.collapsible');
    M.Collapsible.init(items);

});

//      Hear Online/Offline status
window.addEventListener('load', function() {

    changeNavOnOff();

    window.addEventListener('online', changeNavOnOff2);
    window.addEventListener('offline', changeNavOnOff2);

});

function changeNavOnOff(event) {
    //  Check if navigator is Online or Ofline
    var OnOff = navigator.onLine ? "online" : "offline";

    switch (OnOff) {
        case 'online':

            //      Online



            break;
        case 'offline':

            //      Offline


            cit__nav.className = 'nav-list cit__navoffline';

            break;
        default:

            //  Show Error
            console.log('Error')
            break;
    }
};

function changeNavOnOff2(event) {
    //  Check if navigator is Online or Ofline
    var OnOff = navigator.onLine ? "online" : "offline";

    switch (OnOff) {
        case 'online':

            //      Online

            cit__nav.className = 'nav-list cit__navonline';

            //  Hide Online
            setTimeout(function() {

                cit__nav.className = 'nav-list cit__remove';

            }, 3000);

            break;
        case 'offline':

            //      Offline

            cit__nav.className = 'nav-list cit__navoffline';

            break;
        default:

            //  Show Error
            console.log('Error')
            break;
    }
};