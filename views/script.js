const form = document.getElementById('noteForm');
const notesList = document.getElementById('notesList');

const loadNotes = async () => {
    const res = await fetch('/api/notes');
    const notes = await res.json();
    notesList.innerHTML = '';
    notes.forEach(note => {
        const div = document.createElement('div');
        div.className = 'note';
        div.innerHTML = `
            <h3>${note.title}</h3>
            <p>${note.content}</p>
            <button onclick="editNote('${note._id}', '${note.title}', '${note.content}')">Edit</button>
            <button onclick="deleteNote('${note._id}')">Delete</button>
        `;
        notesList.appendChild(div);
    });
};

form.onsubmit = async (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    const body = { title, content };

    await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });

    form.reset();
    loadNotes();
};

const deleteNote = async (id) => {
    await fetch(`/api/notes/${id}`, { method: 'DELETE' });
    loadNotes();
};

const editNote = (id, title, content) => {
    document.getElementById('title').value = title;
    document.getElementById('content').value = content;
    form.onsubmit = async (e) => {
        e.preventDefault();
        await fetch(`/api/notes/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: document.getElementById('title').value,
                content: document.getElementById('content').value
            })
        });
        form.reset();
        loadNotes();
        form.onsubmit = defaultSubmit;
    };
};

const defaultSubmit = form.onsubmit;
loadNotes();
