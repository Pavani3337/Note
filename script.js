// =====================
// DATA
// =====================

let subjects =
JSON.parse(
    localStorage.getItem("subjects")
)
|| [];

let currentSubjectId = null;

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
// RENDER SUBJECTS
// =====================

function renderSubjects(){

    let container =
    document.getElementById("subjects");

    container.innerHTML = "";

    subjects.forEach(subject=>{

        container.innerHTML += `

        <div class="card">

            <h2>${subject.name}</h2>

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

// =====================
// ADD SUBJECT
// =====================

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
// OPEN SUBJECT
// =====================

function openSubject(id){

    currentSubjectId = id;

    let subject =
    subjects.find(
        s=>s.id===id
    );

    document.getElementById(
        "homePage"
    ).style.display="none";

    document.getElementById(
        "dashboardPage"
    ).style.display="block";

    document.getElementById(
        "dashboardTitle"
    ).innerText =
    subject.name;

    renderNotes();
}

// =====================
// BACK
// =====================

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

// =====================
// SAVE NOTE
// =====================

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
        s=>s.id===currentSubjectId
    );

    subject.notes.push({

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
};

// =====================
// RENDER NOTES
// =====================

function renderNotes(filtered){

    let container =
    document.getElementById(
        "notesContainer"
    );

    container.innerHTML = "";

    let subject =
    subjects.find(
        s=>s.id===currentSubjectId
    );

    let notes =
    filtered || subject.notes;

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
                onclick="pinNote(${note.id})"
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

// =====================
// DELETE NOTE
// =====================

function deleteNote(id){

    let subject =
    subjects.find(
        s=>s.id===currentSubjectId
    );

    subject.notes =
    subject.notes.filter(
        note=>note.id!==id
    );

    saveData();

    renderNotes();
}

// =====================
// PIN NOTE
// =====================

function pinNote(id){

    let subject =
    subjects.find(
        s=>s.id===currentSubjectId
    );

    let note =
    subject.notes.find(
        n=>n.id===id
    );

    note.pinned = !note.pinned;

    saveData();

    renderNotes();
}

// =====================
// EDIT NOTE
// =====================

function editNote(id){

    let subject =
    subjects.find(
        s=>s.id===currentSubjectId
    );

    let note =
    subject.notes.find(
        n=>n.id===id
    );

    let title =
    prompt(
        "Edit Title",
        note.title
    );

    if(title===null) return;

    let content =
    prompt(
        "Edit Content",
        note.content
    );

    if(content===null) return;

    note.title = title;

    note.content = content;

    saveData();

    renderNotes();
}

// =====================
// SEARCH
// =====================

document.getElementById(
    "searchInput"
).addEventListener(
    "keyup",
    function(){

        let text =
        this.value.toLowerCase();

        let subject =
        subjects.find(
            s=>s.id===currentSubjectId
        );

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
);

// =====================
// START
// =====================

renderSubjects();