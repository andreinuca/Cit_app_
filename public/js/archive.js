//#region       DOM elements and variables

//  Archived Notes Section
const ArchivedNotesSection = document.querySelector('.cit-archive');

//  ArchivedNote Editor Modal
const modalEdit = document.querySelector('#modal-edit');
const modalEditor = M.Modal.init(modalEdit, { dismissible: true });

//  UnArchive Form
const unarchiveForm = document.querySelector('#unarchive-form');

//  Nav
const cit__nav = document.getElementById('cit__nav');

//  Save Notes Snapshot
var ArchivedNotesSnapshot = '';

//#endregion

//      Listen for auth status changes
auth.onAuthStateChanged(user => {

    //  Signed or not
    if (user) {

        //  SignedIn

        //  Get UserId from SessionStorage
        var userID = sessionStorage.getItem("useruid");

        // Read from DataBase: collection: 'notes': all Documents with filters:
        db.collection('notes')
            .where('ByID', '==', user.uid) // By the User
            .where('Archived', '==', true) //  Archived
            .orderBy("DateCreated", "desc") //  Ordered by date
            .orderBy("Category", "desc") //  Ordered by Category
            .onSnapshot(snapshot => {

                //  Reset ArchivedNotes Section
                ArchivedNotesSection.innerHTML = '';

                //  Show archived notes
                RenderArchivedNotes(snapshot.docs);

                //  Save archived notes Documents Snapshot
                ArchivedNotesSnapshot = snapshot.docs;


            }, err => {

                //  Show Error
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

//      Render All ArchivedNote Divs
const RenderArchivedNotes = (data) => {

    //  Check if it has data
    if (data.length) {

        //  ArchivedNote Index
        var ArchivedNoteIndex = 0;

        //  Adding a archivednote div ForEach notes Document
        data.forEach(doc => {

            //  ArchivedNote Data
            const arqnote = doc.data();

            //  Check div TextOverflow
            if (arqnote.Content.length > 270) {

                //  Add BottomFade to NoteDiv
                var addfade = '<citcard__note-containerbtmfade/>';
            } else {

                //  Add no BottomFade to NoteDiv
                var addfade = '';
            }

            //  Note Date: Timestamp to Date
            const arqntdate = (new Date(arqnote.DateCreated)).toDateString();

            //  Note Category default: Nothing
            var arqntcategory = '&nbsp&nbsp&nbsp';

            //  Check If note Has Category
            if (arqnote.Category.length > 0) {

                //  Add Category To NoteDiv
                arqntcategory = arqnote.Category;

            }

            //  Create ArchivedNote Div
            var noteCard = document.createElement('div');

            //  Add class
            noteCard.classList.add("citcard", "waves-effect", "waves-light");

            //  Set OnClick
            noteCard.setAttribute("onclick", "editNote(" + ArchivedNoteIndex + ")");

            //  Add content of div: Title, Date, Category, Content
            noteCard.innerHTML = `
                <div class="citcard__content">
                
                    <p class="citcard__title text--medium">
                    ${arqnote.Title}
                    </p>

                    <div class="citcard__info">
                        <p class="cittext--medium">${arqntdate}</p>
                        <p class="citcard__price text--medium">${arqntcategory}</p>
                    </div>

                </div>
                

                <div class="citcard__note-container">
                ${arqnote.Content}    
                ${addfade} 
                </div>

                `;

            //  Add div to Page
            ArchivedNotesSection.appendChild(noteCard);

            //  Add 1 to ArchivedNoteIndex
            ArchivedNoteIndex = ArchivedNoteIndex + 1;

        });

    } else {

        //  No ArchivedNotes
        ArchivedNotesSection.innerHTML = '<div class="cit__noarchived" ><center><h5 >Sem notas arquivadas</h5></center></div>';

    }

    //  Materialize set modal and colapsible divs
    var modals = document.querySelectorAll('.modal');
    M.Modal.init(modals);

    var items = document.querySelectorAll('.collapsible');
    M.Collapsible.init(items);

};

const editNote = (ArchivedNoteIndex) => {

    //  Note Edit Data
    var earqNote = ArchivedNotesSnapshot[ArchivedNoteIndex].data();

    //  Field Data
    const noteID = ArchivedNotesSnapshot[ArchivedNoteIndex].id.toString();
    const noteTitle = earqNote.Title.toString();
    const noteCategory = earqNote.Category.toString();
    const noteContent = earqNote.Content.toString();

    //  Open Modal
    modalEditor.open();

    //  Insert Data into Fields
    document.getElementById('noteId').value = noteID;

    document.getElementById('edittitle').value = noteTitle;
    document.getElementById('lbltitle').classList.add('active');

    document.getElementById('editcategory').value = noteCategory;
    document.getElementById('lblcategory').classList.add('active');

    document.getElementById('editcontent').value = noteContent;


    //  Update Fields
    M.updateTextFields();

}

//      UnArchive Note
unarchiveForm.addEventListener('submit', (e) => {
    e.preventDefault();

    //  Note Document
    var Note = db.collection('notes').doc(unarchiveForm.noteId.value);

    //  Edit Note Document: set Archived To false
    var setWithMerge = Note.set({

        Archived: false,
        DateUltEdit: Date.now(),

    }, { merge: true }).then(() => {

        //  Reset Form
        unarchiveForm.reset();

        //  Close Modal
        modalEditor.close();

    }).catch(err => {

        //  Show Error
        console.log(err.message);

    });

    //  Reset Form
    unarchiveForm.reset();

    //  Close Modal
    modalEditor.close();

});

//      Delete ArchivedNote
function deleteArchivedNote() {

    //  Note Document
    var Note = db.collection('notes').doc(unarchiveForm.noteId.value);

    //  Delete Note
    Note.delete().then(() => {

        //  Reset Form
        unarchiveForm.reset();

        //  Close Modal
        modalEditor.close();

    }).catch(err => {

        //  Show Error
        console.log(err.message);

    });

    //  Reset Form
    unarchiveForm.reset();

    //  Close Modal
    modalEditor.close();

};