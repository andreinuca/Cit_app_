//#region       DOM elements and variables

//  Scans Section
const scansSection = document.querySelector('.cit-scans');

//  Save Scans Snapshot
var ScansSnapshot = '';

//      New Scan Form
const NewScanForm = document.querySelector('#newscan-form');

//  Storage Reference: Scans folder
const storageRef = firebase.storage().ref('scans'); //images

//  Scan Editor Modal
const modalScanEdit = document.querySelector('#modal-scaneditor');
const modalScanEditor = M.Modal.init(modalScanEdit, { dismissible: true });

//  Scan Creator Modal
const modalScanCreate = document.querySelector('#modal-scancreator');
const modalScanCreator = M.Modal.init(modalScanCreate, { dismissible: true });

//  
const modalScanImginp = document.getElementById('files');
const modalScanImgshw = document.getElementById('scanimg');

const ScanBtn = document.getElementById('cit__btnscan');

//
const modalshwScanImgshw = document.getElementById('scanshwimg');

//  Scan Progress
const ScanProgress = document.querySelector('#scan-progress');

//  ScanText
const ScanTextDiv = document.querySelector('#area-scan');
//  Image For scan
const ImageForScan = document.querySelector('#scanimg');

//  Nav
const cit__nav = document.getElementById('cit__nav');

const scanDelId = document.getElementById('scanId');

//#endregion

//      Listen for auth status changes
auth.onAuthStateChanged(user => {

    //  Signed or not
    if (user && sessionStorage.getItem("useruid")) {

        //  SignedIn

        //  Get UserId from SessionStorage
        var userID = sessionStorage.getItem("useruid");

        // Read from DataBase: collection: 'scans': all Documents By the User
        db.collection('scans') //imagensadds
            .where('ByID', '==', userID)
            .onSnapshot(snapshot => {

                //  Reset Scans Section
                scansSection.innerHTML = '';

                //  Show scans
                RenderScans(snapshot.docs);

                //  Save scans Documents Snapshot
                ScansSnapshot = snapshot.docs;

            }, err => {

                //  Show Erros
                console.log(err.message);

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

            ScanBtn.setAttribute("onclick", "modalScanCreator.open();");


            break;
        case 'offline':

            //      Offline

            ScanBtn.setAttribute("onclick", "alert('Offline');");

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

            ScanBtn.setAttribute("onclick", "modalScanCreator.open();");

            cit__nav.className = 'nav-list cit__navonline';

            //  Hide Online
            setTimeout(function() {

                cit__nav.className = 'nav-list cit__remove';

            }, 3000);

            break;
        case 'offline':

            //      Offline

            ScanBtn.setAttribute("onclick", "alert('Offline');");

            cit__nav.className = 'nav-list cit__navoffline';

            break;
        default:

            //  Show Error
            console.log('Error')
            break;
    }
};

//      Firebase - Enable Offline Data
db.enablePersistence()
    .catch(function(err) {

        if (err.code == 'failed-precondition') {

            // probably multible tabs open at once
            console.log('persistance failed');

        } else if (err.code == 'unimplemented') {

            // lack of browser support for the feature
            console.log('persistance not available');

        }

    });

// setup img
const RenderScans = (data) => {

    //  Check if it has data
    if (data.length) {

        //  Scan Index
        var ScanIndex = 0;

        //  Adding a scan div ForEach scans Document
        data.forEach(doc => {

            //  Scan Data
            const scan = doc.data();

            //  Scan Date: Timestamp to Date
            //const ntdate = scan.DateCreated.toDate().toDateString();
            const ntdate = (new Date(scan.DateCreated)).toDateString();

            //  Create Scan Div
            var scanCard = document.createElement('div');

            //  Add class
            scanCard.classList.add("citcard");

            //  Set OnClick
            scanCard.setAttribute("onclick", "showScan(" + ScanIndex + ")");

            //  Add content of div: Image, Description, Date
            scanCard.innerHTML = `

            <div class="citcard__image-container ">

            <img src="${scan.ImageUrl} " alt="Scan image" />
            
                
            </div>
                <div class="citcard__content">
                
                    <p class="citcard__title text--medium">
                    ${scan.Description}
                    </p>

                    <div class="citcard__info cittext--medium">
                        <p class="">${ntdate}</p>
                        
                    </div>

                </div>
                `;

            //  Add div to Page
            scansSection.appendChild(scanCard);

            //  Add 1 to ScanIndex
            ScanIndex = ScanIndex + 1;

        });

    } else {

        //  No Scans
        scansSection.innerHTML = '<div class="cit__noscans" ><center><h5 >Sem scans guardados</h5></center></div>';

    }

    //  Materialize set modal and colapsible divs
    var modals = document.querySelectorAll('.modal');
    M.Modal.init(modals);

    var items = document.querySelectorAll('.collapsible');
    M.Collapsible.init(items);

};



const showScan = (ScanIndex) => {

    //  Scan Edit Data
    var eScan = ScansSnapshot[ScanIndex].data();

    //  Field Data
    const scanID = ScansSnapshot[ScanIndex].id.toString();
    const scanDescription = eScan.Description.toString();
    const scanImgurl = eScan.ImageUrl.toString();
    const scanText = eScan.ImageText.toString();

    //  Open Modal
    modalScanEditor.open();

    //  Insert Data into Fields
    document.getElementById('scanId').value = scanID;

    document.getElementById('scancontent').value = scanText;
    document.getElementById('lbltitle').classList.add('active');

    document.getElementById('scanshwdescription').value = scanDescription;
    document.getElementById('lblscanshwdescription').classList.add('active');

    modalshwScanImgshw.src = scanImgurl;

    //  Update Fields
    M.updateTextFields();

};

//      New Scan
NewScanForm.addEventListener('submit', (e) => {
    e.preventDefault();

    //  Get Image file
    const file = document.getElementById('files').files[0];

    //  Set new name
    const name = +new Date() + "-" + file.name;
    const metadata = {
        contentType: file.type
    };

    //  Save Image in Storage
    const task = storageRef.child(name).put(file, metadata);

    //Form Fields
    var DescriptionScan = NewScanForm.description.value;

    //  After saving
    task
        .then(snapshot => snapshot.ref.getDownloadURL())
        .then(url => {

            //  Add to Database: New Note
            db.collection('scans').add({
                ByID: sessionStorage.getItem("useruid"),
                DateCreated: Date.now(),

                ImageUrl: url,
                Description: DescriptionScan,
                ImageText: ScanTextDiv.textContent.toString()

            }).then(() => {

                //  Reset Form
                NewScanForm.reset();

                //  Close Form
                modalScanCreator.close();

            }).catch(err => {

                //  Show Error
                console.log(err.message);

            });

        })
        .catch(console.error);

    //  Reset Form
    NewScanForm.reset();

    //  Close Form
    modalScanCreator.close();

});


//      Save Scaned Text to SessionStorage
function copyToNote() {

    //  Save Scaned Text to SessionStorage
    sessionStorage.setItem("scanedText", document.getElementById('scancontent').value.toString());
}

//      Show inserted Image in img
function readURL() {

    //  Get Image
    const [file] = modalScanImginp.files;

    if (file) {

        //  Show Image
        modalScanImgshw.src = URL.createObjectURL(file);
    }
};

//      Close and Reset Scan Creator Modal
function closescancreator() {

    //  Reset Form
    NewScanForm.reset();

    //  Close Modal
    modalScanCreator.close();

    //  Reset <img>
    modalScanImgshw.src = '';

    //  Reset text
    ScanTextDiv.textContent = '';

    //  Reset Progress
    ScanProgress.textContent = '';
};

//      Get Text from Image
function CitScanImage() {

    if (ImageForScan.src != window.location.href + '#') {

        Tesseract.recognize(
            ImageForScan.src,
            'por', {

                logger: m => {

                    //  Show Progress
                    ScanProgress.textContent = Math.round(m.progress * 100) + '%';

                }

            }

        ).then(({ data: { text } }) => {

            //  Clear Progress text
            ScanProgress.textContent = '';

            //  Show ScanedText
            ScanTextDiv.textContent = text;

        });

    } else {

        //  Alert Error
        alert('Precisa de inserir uma imagem');
    }

};

function ScanDelete() {

    //  Note Document
    var Scan = db.collection('scans').doc(scanDelId.value);

    //  Delete Note
    Scan.delete().then(() => {

        //  Close Modal
        modalScanEditor.close();

    }).catch(err => {

        //  Show Error
        console.log(err.message);

    });

    //  Close Modal
    modalScanEditor.close();

};