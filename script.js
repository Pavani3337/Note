// =====================
// DATA
// =====================

let subjects =
JSON.parse(localStorage.getItem("subjects"))
|| [];

let currentSubject = null;

// =====================
// SAVE
// =====================

function saveData(){

    localStorage.setItem(
        "subjects",
        JSON.stringify(subjects)
    );
}

// =====================
// ADD SUBJECT
// =====================

function addSubject(){

    let input =
    document.getElementById("subjectInput");

    let name =
    input.value.trim();

    if(name==="") return;

    let subject = {

        id:Date.now(),

        name:name,

        notes:[]
    };

    subjects.push(subject);

    input.value="";

    saveData();

    renderSubjects();
}

// =====================
// RENDER SUBJECTS
// =====================

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
                data-id="${subject.id}"
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
                class="deleteSubjectBtn"
                data-id="${subject.id}"
            >
                Delete
            </button>

        </div>
        `;
    });

    // OPEN SUBJECT
    document
    .querySelectorAll(".subjectOpen")
    .forEach(item=>{

        item.onclick = function(){

            openDashboard(
                Number(this.dataset.id)
            );
        };
    });

    // DELETE SUBJECT
    document
    .querySelectorAll(".deleteSubjectBtn")
    .forEach(btn=>{

        btn.onclick = function(){

            deleteSubject(
                Number(this.dataset.id)
            );
        };
    });
}

// =====================
// DELETE SUBJECT
// =====================

function deleteSubject(id){

    subjects =
    subjects.filter(
        subject=>subject.id!==id
    );

    saveData();

    renderSubjects();
}

// =====================
// OPEN DASHBOARD
// =====================

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

// =====================
// GO HOME
// =====================

function goHome(){

    document.getElementById(
        "dashboardScreen"
    ).style.display="none";

    document.getElementById(
        "homeScreen"
    ).style.display="block";

    renderSubjects();
}

// =====================
// SAVE NOTE
// =====================

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

        pinned:false
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

// =====================
// RENDER NOTES
// =====================

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

            <button
                class="pinBtn"
                data-id="${note.id}"
            >

                ${note.pinned ? "Unpin":"Pin"}

            </button>

            <button
                class="editBtn"
                data-id="${note.id}"
            >
                Edit
            </button>

            <button
                class="deleteBtn"
                data-id="${note.id}"
            >
                Delete
            </button>

        </div>
        `;
    });

    // PIN
    document
    .querySelectorAll(".pinBtn")
    .forEach(btn=>{

        btn.onclick = function(){

            togglePin(
                Number(this.dataset.id)
            );
        };
    });

    // EDIT
    document
    .querySelectorAll(".editBtn")
    .forEach(btn=>{

        btn.onclick = function(){

            editNote(
                Number(this.dataset.id)
            );
        };
    });

    // DELETE
    document
    .querySelectorAll(".deleteBtn")
    .forEach(btn=>{

        btn.onclick = function(){

            deleteNote(
                Number(this.dataset.id)
            );
        };
    });
}

// =====================
// DELETE NOTE
// =====================

function deleteNote(id){

    currentSubject.notes =
    currentSubject.notes.filter(
        note=>note.id!==id
    );

    saveData();

    renderNotes();
}

// =====================
// PIN NOTE
// =====================

function togglePin(id){

    let note =
    currentSubject.notes.find(
        note=>note.id===id
    );

    note.pinned = !note.pinned;

    saveData();

    renderNotes();
}

// =====================
// EDIT NOTE
// =====================

function editNote(id){

    let note =
    currentSubject.notes.find(
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

// =====================
// SEARCH
// =====================

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

// =====================
// BUTTON EVENTS
// =====================

document.getElementById(
    "addSubjectBtn"
).onclick = addSubject;

document.getElementById(
    "saveNoteBtn"
).onclick = saveNote;

document.getElementById(
    "backBtn"
).onclick = goHome;

document.getElementById(
    "searchInput"
).onkeyup = searchNotes;

// =====================
// START
// =====================

renderSubjects();