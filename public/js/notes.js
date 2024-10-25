//#region       DOM elements and variables

//  Notes Section
const notesSection = document.querySelector('.cit-notes');

//  Save Notes Snapshot
var NotesSnapshot = '';

//  Note Editor Modal
const modalNoteEdit = document.querySelector('#modal-NoteEdit');
const modalNoteEditor = M.Modal.init(modalNoteEdit, { dismissible: true });

//  Note Creator Modal
const modalNoteCreate = document.querySelector('#modal-NoteCreate');
const modalNoteCreator = M.Modal.init(modalNoteCreate, { dismissible: true });

//  New Note Form
const NewNoteForm = document.querySelector('#newnote-form');

//  Edit Note Form
const EditNoteForm = document.querySelector('#editnote-form');

//  Nav
const cit__nav = document.getElementById('cit__nav');

//#endregion


//      Listen for auth status changes
auth.onAuthStateChanged(user => {

    //  Signed or not
    if (user && sessionStorage.getItem("useruid") != null) {

        //  SignedIn

        //  Get UserId from SessionStorage
        var userID = sessionStorage.getItem("useruid");

        // Read from DataBase: collection: 'notes': all Documents with filters:
        db.collection('notes')
            .where('ByID', '==', userID) // By the User
            .where('Archived', '==', false) //  Not archived
            .orderBy("DateCreated", "desc") //  Ordered by date: new to old
            .orderBy("Category", "desc") //  Ordered by Category: alfabetic a-z
            .onSnapshot(snapshot => {

                //  Reset Notes Section
                notesSection.innerHTML = '';

                //  Show notes
                RenderNotes(snapshot.docs);

                //  Save notes Documents Snapshot
                NotesSnapshot = snapshot.docs;

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

//      Render All Note Divs
const RenderNotes = (data) => {

    //  Check if it has data
    if (data.length) {

        //  Note Index
        var NoteIndex = 0;

        //  CategoryList
        const categorylist = document.getElementById('categories');

        //  Array for Categories
        var arrcategory = [];

        //  Adding a note div ForEach notes Document
        data.forEach(doc => {

            //  Note Data
            const note = doc.data();

            //  Check div TextOverflow
            if (note.Content.length > 270) {

                //  Add BottomFade to NoteDiv
                var addfade = '<citcard__note-containerbtmfade/>';
            } else {

                //  Add no BottomFade to NoteDiv
                var addfade = '';
            }

            //  Note Date: Timestamp to Date
            const ntdate = (new Date(note.DateCreated)).toDateString();


            //  Note Category default: Nothing
            var ntcategory = '&nbsp&nbsp&nbsp';

            //  Check If note Has Category
            if (note.Category.length > 0) {

                //  Add Category To NoteDiv
                ntcategory = note.Category;

            }

            //  Create Note Div
            var NoteDiv = document.createElement('div');

            //  Add class
            NoteDiv.classList.add("citcard", "waves-effect", "waves-light");

            //  Set OnClick
            NoteDiv.setAttribute("onclick", "editNote(" + NoteIndex + ")");

            //  Add content of div: Title, Date, Category, Content
            NoteDiv.innerHTML = `

                <div class="citcard__content">
                
                    <p class="citcard__title text--medium">
                    ${note.Title}
                    </p>

                    <div class="citcard__info">

                        <p class="cittext--medium">${ntdate}</p>
                        
                        <p class="citcard__price text--medium">${ntcategory}</p>
                    
                        </div>

                </div>
                

                <div class="citcard__note-container">
                ${note.Content}    
                ${addfade} 
                </div>

                `;

            //  Add div to Page
            notesSection.appendChild(NoteDiv);

            //  Add Category To Array
            arrcategory[NoteIndex] = note.Category;

            //  Add 1 to NoteIndex
            NoteIndex = NoteIndex + 1;

        });

        //#region Add Category To Datalist
        var uniq = arrcategory.slice() // slice makes copy of array before sorting it
            .sort(function(a, b) {
                return a > b;
            })
            .reduce(function(a, b) {
                if (a.slice(-1)[0] !== b) a.push(b); // slice(-1)[0] means last item in array without removing it (like .pop())
                return a;
            }, []); // this empty array becomes the starting value for a

        //  Reset Datalist    
        categorylist.innerHTML = '';

        uniq.forEach(category => {

            //  Add Category to Datalist
            var option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categorylist.appendChild(option);

        });

        //#endregion

    } else {

        //  No Notes
        notesSection.innerHTML = '<div class="cit__nonotes" ><center><h5>Não adicionou nenhuma nota, <a onClick="modalNoteCreator.open();" >adicione uma</a> ou veja no <a href="/pages/archive.html">arquivo</a></h5></center></div>';

    }

    //  Materialize set modal and colapsible divs
    var modals = document.querySelectorAll('.modal');
    M.Modal.init(modals);

    var items = document.querySelectorAll('.collapsible');
    M.Collapsible.init(items);

};

//      Open Edit Modal With NoteData
const editNote = (NoteIndex) => {

    //  Note Edit Data
    var eNote = NotesSnapshot[NoteIndex].data();

    //  Field Data
    const noteID = NotesSnapshot[NoteIndex].id.toString();
    const noteTitle = eNote.Title.toString();
    const noteCategory = eNote.Category.toString();
    const noteContent = eNote.Content.toString();

    //  Open Modal
    modalNoteEditor.open();

    //  Insert Data into Fields
    document.getElementById('noteId').value = noteID;

    document.getElementById('edittitle').value = noteTitle;
    document.getElementById('lbltitle').classList.add('active');

    document.getElementById('editcategory').value = noteCategory;
    document.getElementById('lblcategory').classList.add('active');

    document.getElementById('editcontent').value = noteContent;

    //  Check If user Has Made a TextScan
    if (sessionStorage.getItem("scanedText") === null) {

        //  Dont Show TextPaste Button
        document.getElementById('scantextPaste').style.visibility = "hidden";

    } else {

        //  Show TextPaste Button
        document.getElementById('scantextPaste').style.visibility = "visible";
    }

    //  Update Fields
    M.updateTextFields();

};

//      New Note
NewNoteForm.addEventListener('submit', (e) => {
    e.preventDefault();

    //  Add to Database: New Note
    db.collection('notes').add({

        ByID: sessionStorage.getItem("useruid"),
        DateCreated: Date.now(),
        DateUltEdit: Date.now(),

        Title: NewNoteForm.title.value,
        Content: NewNoteForm.content.value,
        Category: NewNoteForm.category.value,

        Archived: false,
        Favorite: false

    }).then(() => {

        //  Reset Form
        NewNoteForm.reset();

        //  Close Modal
        modalNoteCreator.close();

    }).catch(err => {

        //Show Error
        console.log(err.message);

    });

    //  Reset Form
    NewNoteForm.reset();

    //  Close Modal
    modalNoteCreator.close();

});

//      Edit Note
EditNoteForm.addEventListener('submit', (e) => {
    e.preventDefault();

    //  Note Document
    var Note = db.collection('notes').doc(EditNoteForm.noteId.value);

    //  Edit Note Document: new DateUltEdit, Title, Content and Category
    var setWithMerge = Note.set({

        DateUltEdit: Date.now(),

        Title: EditNoteForm.edittitle.value,
        Content: EditNoteForm.editcontent.value,
        Category: EditNoteForm.editcategory.value

    }, { merge: true }).then(() => {

        //  Reset Form
        EditNoteForm.reset();

        //  Close Modal
        modalNoteEditor.close();

    }).catch(err => {


        //  Show Error
        console.log(err.message);

    });

    //  Reset Form
    EditNoteForm.reset();

    //  Close Modal
    modalNoteEditor.close();

});

//      Paste text from Last TextScan
function pasteToNote() {

    //  Add text to note
    document.getElementById('editcontent').value += sessionStorage.getItem("scanedText");

};

//      Archive Note
function archive() {

    //  Note Document
    var Note = db.collection('notes').doc(EditNoteForm.noteId.value);

    //  Edit Note Document: set Archived To true
    var setWithMerge = Note.set({

        Archived: true

    }, { merge: true }).then(() => {

        //  Reset Form
        EditNoteForm.reset();

        //  Close Modal
        modalNoteEditor.close();

    }).catch(err => {

        //  Show Error
        console.log(err.message);

    });

    //  Reset Form
    EditNoteForm.reset();

    //  Close Modal
    modalNoteEditor.close();

};