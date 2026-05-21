// ======================
// STORAGE
// ======================

let subjects =
JSON.parse(localStorage.getItem("subjects"))
|| [];

let currentSubject = null;

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
}

// ======================
// DELETE SUBJECT
// ======================

function deleteSubject(id){

    subjects =
    subjects.filter(
        subject=>subject.id!==id
    );

    saveData();

    renderSubjects();
}

// ======================
// RENDER SUBJECTS
// ======================

function renderSubjects(){

    let container =
    document.getElementById(
        "subjectsContainer"
    );

    container.innerHTML = "";

    subjects.forEach(subject=>{

        container.innerHTML += `

        <div class="subjectCard">

            <div
                class="subjectOpen"
                onclick="openDashboard(${subject.id})"
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
                onclick="deleteSubject(${subject.id})"
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

function openDashboard(id){

    currentSubject =
    subjects.find(
        subject=>subject.id===id
    );

    document.getElementById(
        "homeScreen"
    ).style.display="none";

    document.getElementById(
        "dashboardScreen"
    ).style.display="block";

    document.getElementById(
        "subjectTitle"
    ).innerText =
    "📘 " + currentSubject.name;

    renderNotes();
}

// ======================
// GO HOME
// ======================

function goHome(){

    document.getElementById(
        "dashboardScreen"
    ).style.display="none";

    document.getElementById(
        "homeScreen"
    ).style.display="block";

    renderSubjects();
}

// ======================
// SAVE NOTE
// ======================

function saveNote(){

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

    currentSubject.notes.push({

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

function renderNotes(filteredNotes){

    let container =
    document.getElementById(
        "notesContainer"
    );

    container.innerHTML="";

    let notes =
    filteredNotes
    ||
    [...currentSubject.notes];

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
// FIND NOTE
// ======================

function getNote(id){

    return currentSubject.notes.find(
        note=>note.id===id
    );
}

// ======================
// DELETE NOTE
// ======================

function deleteNote(id){

    currentSubject.notes =
    currentSubject.notes.filter(
        note=>note.id!==id
    );

    saveData();

    renderNotes();
}

// ======================
// TOGGLE PIN
// ======================

function togglePin(id){

    let note = getNote(id);

    note.pinned = !note.pinned;

    saveData();

    renderNotes();
}

// ======================
// EDIT NOTE
// ======================

function editNote(id){

    let note = getNote(id);

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
// SEARCH NOTES
// ======================

function searchNotes(){

    let text =
    document.getElementById(
        "searchInput"
    )
    .value
    .toLowerCase();

    let filtered =
    currentSubject.notes.filter(note=>

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
// START APP
// ======================

renderSubjects();