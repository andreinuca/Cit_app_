//#region       DOM elements and variables

//  Save User Snapshot
var RlCitUser = '';
var CitUser = '';

//  Name change Modal
const userchangeName = document.getElementById('modal-changeName');
const modaluserchangeName = M.Modal.init(userchangeName, { dismissible: false });

//  Email change Modal
const userchangeEmail = document.getElementById('modal-changeEmail');
const modaluserchangeEmail = M.Modal.init(userchangeEmail, { dismissible: false });

//  Password change Modal
const userchangePassword = document.getElementById('modal-changePassword');
const modaluserchangePassword = M.Modal.init(userchangePassword, { dismissible: false });

//  ProfilePic change Modal
const userchangeProfilePic = document.getElementById('modal-changeProfilePic');
const modaluserchangeProfilePic = M.Modal.init(userchangeProfilePic, { dismissible: false });

//  Div with User information
const userinfoCard = document.getElementById('profileCard');

//  Nav
const cit__nav = document.getElementById('cit__nav');

//  SignOut
const SignOut = document.querySelector('#signout');

//  Storage Reference: Profile Pictures folder
const storageRef = firebase.storage().ref('profilepics');

//  Forms: profilepic, username, email and password 
const new_userprofilepicForm = document.getElementById('newprofilepic-form');
const new_userusernameForm = document.getElementById('newusername-form');
const new_useremailForm = document.getElementById('newuseremail-form');
const new_userpasswordForm = document.getElementById('newuserpassword-form');

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

        //  Get UserId from SessionStorage
        var userID = sessionStorage.getItem("useruid");

        // Read from DataBase: collection: 'users' : user Document
        db.collection('users').doc(userID).get().then(userdoc => {

            //  Show User information
            renderUserInfo(userdoc);

            //  Save user Document Snapshot
            CitUser = userdoc;

        }, err => {

            //  Show Error
            console.log(err.message);

            if (itsOnlineOrOffline() == 'offline') {
                //  Show User information
                renderUserInfo('Offline');
            }



        });

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

                location.reload();

            }, 1500);

            break;
        case 'offline':

            //      Offline

            cit__nav.className = 'nav-list cit__navoffline';

            //  Hide Online
            setTimeout(function() {

                location.reload();

            }, 1500);

            break;
        default:

            //  Show Error
            console.log('Error')
            break;
    }
};

// Check Online/Offline
function itsOnlineOrOffline(event) {

    //  Check if navigator is Online or Ofline
    var OnOff = navigator.onLine ? "online" : "offline";

    switch (OnOff) {

        case 'online':

            //      Online

            return 'online';

            break;
        case 'offline':

            //      Offline

            return 'offline';

            break;
        default:

            //  Show Error
            console.log('Error');

            break;

    }

};

//      Render div with User information
const renderUserInfo = (user) => {

    //  Create User Div
    var UserDiv = document.createElement('div');

    //  Add class
    UserDiv.classList.add("cit__profileCard");

    if (user == 'Offline') {



        //  Add content of div: Profile picture, name and email
        UserDiv.innerHTML = `

    <div class="circle cit__profileImage" ');">
    <img class="cit_userimage" src="../img/offlinePic.png" alt="Profile picture"  media="(max-width: 15rem )"/>
            
    
    <div id="setting1" class=" cit__profileImageChange" onClick="cit__changeOpener(1);">
    <center><span class="material-icons-outlined">
    add_a_photo
    </span></center>
    
    </div>
    </div>


    <div class="cit__proInfo">

        <b>Offline :</b><br> 
        Offline
        
    </div>

        `;

        //  Add div to Page
        userinfoCard.appendChild(UserDiv);

        const setting1 = document.getElementById('setting1');

        setting1.setAttribute("onclick", "alert('Offline');");
        setting2.setAttribute("onclick", "alert('Offline');");
        /*setting3.setAttribute("onclick", "alert('Offline');");*/
        setting4.setAttribute("onclick", "alert('Offline');");

    } else if (user != null) {

        //  User Data
        var userinfo = user.data();

        //  Add content of div: Profile picture, name and email
        UserDiv.innerHTML = `

    <div class="circle cit__profileImage" ');">
    <img class="cit_userimage" src="${userinfo.ProfilePicture} " alt="Profile picture"  media="(max-width: 15rem )"/>
            
    
    <div id="setting1" class=" cit__profileImageChange" onClick="cit__changeOpener(1);">
    <center><span class="material-icons-outlined">
    add_a_photo
    </span></center>
    
    </div>
    </div>


    <div class="cit__proInfo">

        <b>${userinfo.Name} :</b><br> 
        ${userinfo.Email}
        
    </div>

        `;

        //  Add div to Page
        userinfoCard.appendChild(UserDiv);

        const setting1 = document.getElementById('setting1');

        setting1.setAttribute("onclick", "cit__changeOpener(1);");
        setting2.setAttribute("onclick", "cit__changeOpener(2);");
        //setting3.setAttribute("onclick", "cit__changeOpener(3);");
        setting4.setAttribute("onclick", "cit__changeOpener(4);");

    }

};

//      SignOut
SignOut.addEventListener('click', (e) => {
    e.preventDefault();

    //  SignOut
    auth.signOut();

    //  Remove UserId from SessionStorage
    sessionStorage.removeItem('useruid');

});

//      Show inserted Image in img
function readURL() {

    //  Get Image
    const [file] = document.querySelector('#files').files;

    if (file) {

        //  Show Image
        document.querySelector('#newprofilepic').src = URL.createObjectURL(file);
    }
};


//      Modal Opener
const cit__changeOpener = (change) => {

    switch (change) {

        case 1:

            //  Open Modal: ProfilePicture Changer 
            modaluserchangeProfilePic.open();

            break;

        case 2:

            //  Open Modal: UserName Changer
            modaluserchangeName.open();

            break;

        case 3:

            //  Open Modal: UserEmail Changer
            modaluserchangeEmail.open();

            break;

        case 4:

            //  Open Modal: UserPassword Changer
            modaluserchangePassword.open();

            break;

        default:

            //  Show Error  
            console.log('error');

    }

};

//      Modal Closer
const cit__changeCloser = (change) => {


    switch (change) {

        case 1:

            //  Close Modal: ProfilePicture Changer 
            modaluserchangeProfilePic.close();

            //  Clear Form: ProfilePicture Form
            new_userprofilepicForm.reset();

            //  Reset <img> with image inserted
            document.querySelector('#newprofilepic').src = '';

            break;

        case 2:

            //  Close Modal: UserName Changer 
            modaluserchangeName.close();

            //  Clear Form: UserName Form
            new_userusernameForm.reset();

            break;

        case 3:

            //  Close Modal: UserEmail Changer
            modaluserchangeEmail.close();

            //  Clear Form: UserEmail Form
            new_useremailForm.reset();

            break;

        case 4:

            //  Close Modal: UserPassword Changer
            modaluserchangePassword.close();

            //  Clear Form: UserPassword Form
            new_userpasswordForm.reset();

            break;

        default:

            //  Show Error
            console.log('error');

    }

};

//      Check if passwords match
function checkPassword() {

    if (document.getElementById('newuserpassword').value ==
        document.getElementById('confirmnewuserpassword').value) {

        //  Enable Button
        document.getElementById('btnnewpassword').disabled = false;

    } else {

        //  Disable Button
        document.getElementById('btnnewpassword').disabled = true;
    }

};

//      Check if emails match
function checkEmail() {

    if (document.getElementById('newuseremail').value ==
        document.getElementById('confirmnewuseremail').value) {

        //  Enable Button
        document.getElementById('btnnewemail').disabled = false;

    } else {

        //  Disable Button
        document.getElementById('btnnewemail').disabled = true;

    }

};

//      Change User: ProfilePicture
new_userprofilepicForm.addEventListener('submit', (e) => {
    e.preventDefault();

    //  UserId from session storage
    var User_Id = sessionStorage.getItem("useruid");

    //  Ask for confirmation
    if (confirm('Deseja mesmo alterar a imagem?')) {

        //  Get Image file
        const file = document.getElementById('files').files[0];

        //  Set new name
        const name = +new Date() + "-" + file.name;
        const metadata = {
            contentType: file.type
        };

        //  Save Image in Storage
        const task = storageRef.child(name).put(file, metadata);

        //  After saving
        task
            .then(snapshot => snapshot.ref.getDownloadURL())
            .then(url => {

                //  User document
                var current_userdoc = db.collection('users').doc(User_Id);

                //  Edit user document : new profile picture URL 
                var setWithMerge = current_userdoc.set({

                    ProfilePicture: url

                }, { merge: true }).then(() => {

                    //  Reset Form
                    new_userprofilepicForm.reset();

                    //  Close Modal
                    modaluserchangeProfilePic.close();

                    //  Reload Page
                    location.reload();

                }).catch(err => {

                    //  Show Error
                    console.log(err.message);

                });

            })
            .catch(console.error);

    }

});

//      Change User: Name
new_userusernameForm.addEventListener('submit', (e) => {
    e.preventDefault();

    //  UserId from session storage
    var User_Id = sessionStorage.getItem("useruid");

    //  User document
    var current_userdoc = db.collection('users').doc(User_Id);

    //  Edit user document : new Name
    var setWithMerge = current_userdoc.set({

        Name: new_userusernameForm.newusername.value

    }, { merge: true }).then(() => {

        //  Reset Form
        new_userusernameForm.reset();

        //  Close Modal
        modaluserchangeName.close();

        //  Reload Page
        location.reload();

    }).catch(err => {

        //  Show Error
        console.log(err.message);
    });

});

//      Change User: Email
/*new_useremailForm.addEventListener('submit', (e) => {
    e.preventDefault();


    //  Check if Emails match
    if (new_useremailForm.newuseremail.value ==
        new_useremailForm.confirmnewuseremail.value) {

        //  Change CurrentUser: Email
        auth.currentUser.updateEmail(new_useremailForm.newuseremail.value).then(() => {

                //  UserId from session storage
                var User_Id = sessionStorage.getItem("useruid");

                //  User document
                var current_userdoc = db.collection('users').doc(User_Id);

                //  Edit user document : new Email
                var setWithMerge = current_userdoc.set({

                    Email: new_useremailForm.newuseremail.value

                }, { merge: true }).then(() => {

                    //  Reset Form
                    new_useremailForm.reset();

                    //  Close Modal
                    modaluserchangeEmail.close();

                    //  SignOut
                    auth.signOut();

                    //  Remove UserId from SessionStorage
                    sessionStorage.removeItem('useruid');

                }).catch(err => {

                    //  Show Error
                    console.log(err.message);
                });


            })
            .catch(err => {

                //  Show Error
                console.log(err.message);

            });

    } else {

        //  Alert Error
        alert(`Parece que ocorreu um erro, <b>tente denovo</b>`);
    }

});*/

//      Change User: Password
new_userpasswordForm.addEventListener('submit', (e) => {
    e.preventDefault();

    //  Check if Passwords match
    if (new_userpasswordForm.newuserpassword.value ==
        new_userpasswordForm.confirmnewuserpassword.value) {

        //  Change CurrentUser: Password
        auth.currentUser.updatePassword(new_userpasswordForm.newuserpassword.value).then(() => {

                //  SignOut
                auth.signOut();

                //  Remove UserId from SessionStorage
                sessionStorage.removeItem('useruid');

            })
            .catch(err => {

                //  Show Error
                console.log(err.message);

            });

    } else {

        //  Alert Error
        alert(`Parece que ocorreu um erro, <b>tente denovo</b>`);

    }

});