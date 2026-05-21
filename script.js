// ======================
// STORAGE
// ======================

let subjects =
JSON.parse(localStorage.getItem("subjects"))
|| [];

let currentSubjectId = null;

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

document.getElementById(
    "addSubjectBtn"
).onclick = function(){

    let input =
    document.getElementById(
        "subjectInput"
    );

    let name =
    input.value.trim();

    if(name==="") return;

    subjects.push({

        id:Date.now(),

        name:name,

        notes:[]
    });

    input.value="";

    saveData();

    renderSubjects();
};

// ======================
// RENDER SUBJECTS
// ======================

function renderSubjects(){

    let container =
    document.getElementById(
        "subjectsContainer"
    );

    container.innerHTML="";

    subjects.forEach(subject=>{

        container.innerHTML += `

        <div class="subjectCard">

            <h2>
                📘 ${subject.name}
            </h2>

            <p>
                Notes:
                ${subject.notes.length}
            </p>

            <button
                onclick="openSubject(${subject.id})"
            >
                Open
            </button>

            <button
                onclick="deleteSubject(${subject.id})"
            >
                Delete
            </button>

        </div>
        `;
    });
}

// ======================
// DELETE SUBJECT
// ======================

function deleteSubject(id){

    let confirmDelete =
    confirm("Delete Subject?");

    if(!confirmDelete) return;

    subjects =
    subjects.filter(
        subject=>subject.id!==id
    );

    saveData();

    renderSubjects();
}

// ======================
// OPEN SUBJECT
// ======================

function openSubject(id){

    currentSubjectId = id;

    let subject =
    subjects.find(
        subject=>subject.id===id
    );

    document.getElementById(
        "homePage"
    ).style.display="none";

    document.getElementById(
        "dashboardPage"
    ).style.display="block";

    document.getElementById(
        "subjectTitle"
    ).innerText =
    "📘 " + subject.name;

    renderNotes();
}

// ======================
// BACK BUTTON
// ======================

document.getElementById(
    "backBtn"
).onclick = function(){

    document.getElementById(
        "dashboardPage"
    ).style.display="none";

    document.getElementById(
        "homePage"
    ).style.display="block";

    renderSubjects();
};

// ======================
// SAVE NOTE
// ======================

document.getElementById(
    "saveNoteBtn"
).onclick = function(){

    let title =
    document.getElementById(
        "noteTitle"
    ).value.trim();

    let content =
    document.getElementById(
        "noteContent"
    ).value.trim();

    if(title==="" || content==="")
    return;

    let subject =
    subjects.find(
        subject=>
        subject.id===currentSubjectId
    );

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
};

// ======================
// RENDER NOTES
// ======================

function renderNotes(){

    let container =
    document.getElementById(
        "notesContainer"
    );

    container.innerHTML="";

    let subject =
    subjects.find(
        subject=>
        subject.id===currentSubjectId
    );

    let notes =
    [...subject.notes];

    // PINNED FIRST
    notes.sort((a,b)=>
        b.pinned-a.pinned
    );

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
// DELETE NOTE
// ======================

function deleteNote(id){

    let subject =
    subjects.find(
        subject=>
        subject.id===currentSubjectId
    );

    subject.notes =
    subject.notes.filter(
        note=>note.id!==id
    );

    saveData();

    renderNotes();
}

// ======================
// PIN NOTE
// ======================

function togglePin(id){

    let subject =
    subjects.find(
        subject=>
        subject.id===currentSubjectId
    );

    let note =
    subject.notes.find(
        note=>note.id===id
    );

    note.pinned = !note.pinned;

    saveData();

    renderNotes();
}

// ======================
// EDIT NOTE
// ======================

function editNote(id){

    let subject =
    subjects.find(
        subject=>
        subject.id===currentSubjectId
    );

    let note =
    subject.notes.find(
        note=>note.id===id
    );

    let newTitle =
    prompt(
        "Edit Title",
        note.title
    );

    if(newTitle===null) return;

    let newContent =
    prompt(
        "Edit Content",
        note.content
    );

    if(newContent===null) return;

    note.title = newTitle;

    note.content = newContent;

    saveData();

    renderNotes();
}

// ======================
// START
// ======================

renderSubjects();