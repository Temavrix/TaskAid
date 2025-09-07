import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Notes() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [notes, setNotes] = useState<any[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [selectedNote, setSelectedNote] = useState<any | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [saving, setSaving] = useState(false);

  // Sidebar navigation
  const handleToDo = () => navigate("/ToDo");
  const handleCalander = () => navigate("/calanderpage");
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Fetch notes
  const refreshNotes = async (selectedId?: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/notes", {
        headers: { Authorization: token || "" },
      });
      setNotes(res.data);

      // If editing one note, refresh its content too
      if (selectedId) {
        const updated = res.data.find((n: any) => n._id === selectedId);
        if (updated) setSelectedNote(updated);
      }
    } catch (err) {
      console.error("Error fetching notes:", err);
    }
  };

  useEffect(() => {
    refreshNotes();
  }, []);

  // Add new notebook
  const handleAddNote = async () => {
    if (!newTitle.trim()) return;
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/notes",
        { title: newTitle, content: "" },
        { headers: { Authorization: token || "" } }
      );
      await refreshNotes(); // refresh list
      setNewTitle("");
    } catch (err) {
      console.error("Error adding note:", err);
    }
  };

  // Open note editor
  const handleOpenNote = (note: any) => {
    setSelectedNote(note);
    setShowEditor(true);
  };

  // Save note changes
  const handleSave = async () => {
    if (!selectedNote) return;
    try {
      setSaving(true);
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/notes/${selectedNote._id}`,
        { title: selectedNote.title, content: selectedNote.content },
        { headers: { Authorization: token || "" } }
      );

      // Refresh list & selected note
      await refreshNotes(selectedNote._id);
    } catch (err) {
      console.error("Error updating note:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="h-screen flex bg-neutral-600">
      {/* ==== Left Sidebar ==== */}
      <div className={`fixed top-0 left-0 h-full bg-neutral-800 text-white flex flex-col justify-between transform transition-transform duration-300 z-40
            ${isOpen ? "translate-x-0 w-64" : "-translate-x-full w-50"} lg:translate-x-0 lg:w-64`}>
        <div>
          <h2 className="text-2xl font-bold p-4">TaskAid</h2>
          <nav className="flex flex-col gap-2 p-4">
            <button onClick={handleToDo} className="px-3 py-2 rounded-lg bg-neutral-700 hover:bg-neutral-600 text-left" >
              To-Dos
            </button>
            <button className="px-3 py-2 rounded-lg bg-neutral-700 hover:bg-neutral-600 text-left">
              Notes
            </button>
            <button onClick={handleCalander} className="px-3 py-2 rounded-lg bg-neutral-700 hover:bg-neutral-600 text-left">
              Calendar
            </button>
          </nav>
        </div>
        <div className="p-4">
          <button onClick={handleLogout} className="w-full px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700">
            Logout
          </button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden" onClick={() => setIsOpen(false)}/>
      )}

      {/* Toggle Button */}
      <button className="fixed top-0 left-0 p-2 bg-neutral-800 text-white lg:hidden z-50" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "✖" : "☰"}
      </button>

      {/* ==== Main Notes Area ==== */}
      <div className="flex-1 p-6 ml-0 lg:ml-64 text-white overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4">Your Notes</h1>

        {/* Add new note */}
        <div className="flex mb-6 gap-2">
          <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Enter note title..." className="flex-1 p-2 rounded-lg text-white" />
          <button onClick={handleAddNote} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg">
            Add Notebook
          </button>
        </div>

        {/* Notes list */}
        <div className="grid gap-4">
          {notes.map((note) => (
            <div key={note._id} onClick={() => handleOpenNote(note)} className="bg-neutral-700 p-4 rounded-lg shadow hover:bg-neutral-600 cursor-pointer" >
              <h2 className="text-lg font-semibold">{note.title}</h2>
              <p className="text-sm text-gray-300">
                {note.createdAt ? new Date(note.createdAt).toLocaleDateString(): ""}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ==== Right Editor Sidebar ==== */}
      <div className={`fixed top-0 right-0 h-full w-96 bg-neutral-800 text-white transform transition-transform duration-300 shadow-lg z-40 ${showEditor ? "translate-x-0" : "translate-x-full"}`}>
        {selectedNote && (
          <div className="flex flex-col h-full p-6">
            <h2 className="text-xl font-bold mb-4">Edit Note</h2>
            <input type="text" value={selectedNote.title} onChange={(e) => setSelectedNote({ ...selectedNote, title: e.target.value })} className="p-2 rounded-lg mb-4 text-white"/>
            <textarea value={selectedNote.content || ""} onChange={(e) => setSelectedNote({ ...selectedNote, content: e.target.value })}
              className="flex-1 p-3 rounded-lg text-white resize-none" placeholder="Write your note..."/>
            <div className="flex justify-between mt-4 gap-2">
              <button onClick={() => setShowEditor(false)} className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg" >
                Close
              </button>
              <button onClick={handleSave} disabled={saving} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg" >
                {saving ? "Saving..." : "Save"}
              </button>
              <button onClick={async () => { if (!selectedNote) return;
                  if (!window.confirm("Are you sure you want to delete this note?")) return;

                  try {
                    const token = localStorage.getItem("token");
                    await axios.delete(
                      `http://localhost:5000/api/notes/${selectedNote._id}`,
                      { headers: { Authorization: token || "" } }
                    );
                    setShowEditor(false);
                    setSelectedNote(null);
                    await refreshNotes();
                  } catch (err) {
                    console.error("Error deleting note:", err);
                  }
                }}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg" >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
