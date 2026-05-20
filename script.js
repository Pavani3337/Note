let notes = JSON.parse(localStorage.getItem("notes")) || [];

// SAVE
function save() {
    localStorage.setItem("notes", JSON.stringify(notes));
}

// ADD NOTE
function addNote() {

    let title = document.getElementById("title").value.trim();
    let content = document.getElementById("content").value.trim();

    if (!title || !content) return;

    notes.push({
        title,
        content,
        pinned: false,
        time: new Date().toLocaleString()
    });

    document.getElementById("title").value = "";
    document.getElementById("content").value = "";

    save();
    render();
}

// DELETE
function deleteNote(i) {
    notes.splice(i, 1);
    save();
    render();
}

// PIN NOTE
function pinNote(i) {
    notes[i].pinned = !notes[i].pinned;
    save();
    render();
}

// SEARCH
function searchNotes() {

    let val = document.getElementById("search").value.toLowerCase();

    let filtered = notes.filter(n =>
        n.title.toLowerCase().includes(val) ||
        n.content.toLowerCase().includes(val)
    );

    render(filtered);
}

// RENDER
function render(list = notes) {

    let container = document.getElementById("notesContainer");

    container.innerHTML = "";

    // pinned first
    list.sort((a,b) => b.pinned - a.pinned);

    list.forEach((n, i) => {

        container.innerHTML += `
        <div class="note ${n.pinned ? "pin" : ""}">

            <h3>${n.title}</h3>

            <p>${n.content}</p>

            <small>${n.time}</small><br><br>

            <button onclick="pinNote(${i})">
                ${n.pinned ? "Unpin" : "Pin"}
            </button>

            <button onclick="deleteNote(${i})">Delete</button>

        </div>
        `;
    });
}

// INIT
render();