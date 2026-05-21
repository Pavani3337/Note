// ======================
// DATA
// ======================

let subjects =
JSON.parse(localStorage.getItem("subjects"))
|| [];

let currentSubjectIndex = null;

// ======================
// SAVE DATA
// ======================

function saveData(){

    localStorage.setItem(
        "subjects",
        JSON.stringify(subjects)
    );
}

// ======================
// ADD SUBJECT
// ======================

function addSubject(){

    let input =
    document.getElementById("subjectInput");

    let name = input.value.trim();

    if(name==="") return;

    subjects.push({

        name:name,

        notes:[]
    });

    input.value="";

    saveData();

    renderSubjects();
}

// ======================
// DELETE SUBJECT
// ======================

function deleteSubject(index){

    let confirmDelete =
    confirm("Delete this subject?");

    if(confirmDelete){

        subjects.splice(index,1);

        saveData();

        renderSubjects();
    }
}

// ======================
// RENDER SUBJECTS
// ======================

function renderSubjects(){

    let container =
    document.getElementById("subjectsContainer");

    container.innerHTML="";

    subjects.forEach((subject,index)=>{

        container.innerHTML += `

        <div class="subjectCard">

            <div
                onclick="openDashboard(${index})"
                style="cursor:pointer;"
            >

                <h2>
                    📘 ${subject.name}
                </h2>

                <p>
                    Notes:
                    ${subject.notes.length}
                </p>

            </div>

            <button
                onclick="deleteSubject(${index})"
            >
                Delete
            </button>

        </div>
        `;
    });
}

// ======================
// OPEN DASHBOARD
// ======================

function openDashboard(index){

    currentSubjectIndex = index;

    document.getElementById(
        "homeScreen"
    ).style.display = "none";

    document.getElementById(
        "dashboardScreen"
    ).style.display = "block";

    document.getElementById(
        "subjectTitle"
    ).innerText =
    "📘 " + subjects[index].name;

    renderNotes();
}

// ======================
// GO HOME
// ======================

function goHome(){

    document.getElementById(
        "dashboardScreen"
    ).style.display = "none";

    document.getElementById(
        "homeScreen"
    ).style.display = "block";

    renderSubjects();
}

// ======================
// SAVE NOTE
// ======================

function saveNote(){

    let title =
    document.getElementById("noteTitle")
    .value
    .trim();

    let content =
    document.getElementById("noteContent")
    .value
    .trim();

    if(title==="" || content==="") return;

    let subject =
    subjects[currentSubjectIndex];

    subject.notes.push({

        id:Date.now(),

        title:title,

        content:content,

        pinned:false,

        date:new Date().toLocaleString()
    });

    document.getElementById(
        "noteTitle"
    ).value="";

    document.getElementById(
        "noteContent"
    ).value="";

    saveData();

    renderNotes();
}

// ======================
// RENDER NOTES
// ======================

function renderNotes(filtered=null){

    let container =
    document.getElementById("notesContainer");

    container.innerHTML="";

    let subject =
    subjects[currentSubjectIndex];

    let notes =
    filtered || [...subject.notes];

    // pinned first
    notes.sort((a,b)=>b.pinned-a.pinned);

    notes.forEach(note=>{

        container.innerHTML += `

        <div class="
            note
            ${note.pinned ? "pinned":""}
        ">

            <h3>
                ${note.pinned ? "📌":""}
                ${note.title}
            </h3>

            <p>
                ${note.content}
            </p>

            <small>
                📅 ${note.date}
            </small>

            <br><br>

            <button
                onclick="togglePin(${note.id})"
            >
                ${note.pinned ? "Unpin":"Pin"}
            </button>

            <button
                onclick="editNote(${note.id})"
            >
                Edit
            </button>

            <button
                onclick="deleteNote(${note.id})"
            >
                Delete
            </button>

        </div>
        `;
    });
}

// ======================
// FIND NOTE
// ======================

function findNote(id){

    let subject =
    subjects[currentSubjectIndex];

    return subject.notes.find(
        note=>note.id===id
    );
}

// ======================
// DELETE NOTE
// ======================

function deleteNote(id){

    let subject =
    subjects[currentSubjectIndex];

    subject.notes =
    subject.notes.filter(
        note=>note.id!==id
    );

    saveData();

    renderNotes();
}

// ======================
// TOGGLE PIN
// ======================

function togglePin(id){

    let note = findNote(id);

    note.pinned = !note.pinned;

    saveData();

    renderNotes();
}

// ======================
// EDIT NOTE
// ======================

function editNote(id){

    let note = findNote(id);

    let newTitle =
    prompt(
        "Edit Title",
        note.title
    );

    let newContent =
    prompt(
        "Edit Content",
        note.content
    );

    if(
        newTitle!==null &&
        newContent!==null
    ){

        note.title = newTitle;

        note.content = newContent;

        saveData();

        renderNotes();
    }
}

// ======================
// SEARCH NOTES
// ======================

function searchNotes(){

    let text =
    document.getElementById("searchInput")
    .value
    .toLowerCase();

    let subject =
    subjects[currentSubjectIndex];

    let filtered =
    subject.notes.filter(note=>

        note.title
        .toLowerCase()
        .includes(text)

        ||

        note.content
        .toLowerCase()
        .includes(text)
    );

    renderNotes(filtered);
}

// ======================
// INIT
// ======================

renderSubjects();