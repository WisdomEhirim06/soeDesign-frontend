// Minimal announcements page logic
document.addEventListener("DOMContentLoaded", () => {
    const listEl = document.getElementById("list");
    const adminControls = document.getElementById("adminControls");
  
    const token = localStorage.getItem("sb_token");
    if (token && adminControls) adminControls.classList.remove("hidden");
  
    async function load() {
      listEl.innerHTML = "Loading...";
      try {
        const items = await API.getAnnouncements();
        listEl.innerHTML = "";
        items.forEach(a => {
          const card = document.createElement("div");
          card.className = "p-4 border rounded";
          card.innerHTML = `
            <h3 class="font-semibold text-lg">${escapeHtml(a.title)}</h3>
            <p class="mt-2">${escapeHtml(a.content)}</p>
            <p class="text-sm text-gray-500 mt-2">Posted: ${new Date(a.created_at).toLocaleString()}</p>
          `;
          if (token) {
            const btns = document.createElement("div");
            btns.className = "mt-3 flex gap-2";
            const edit = document.createElement("button");
            edit.textContent = "Edit";
            edit.className = "px-2 py-1 bg-blue-600 text-white rounded";
            edit.onclick = () => editAnnouncement(a);
            const del = document.createElement("button");
            del.textContent = "Delete";
            del.className = "px-2 py-1 bg-red-600 text-white rounded";
            del.onclick = () => deleteAnnouncement(a.id);
            btns.append(edit, del);
            card.appendChild(btns);
          }
          listEl.appendChild(card);
        });
      } catch (err) {
        listEl.innerHTML = "Error loading announcements.";
        console.error(err);
      }
    }
  
    // create form
    const createForm = document.getElementById("createForm");
    if (createForm) {
      createForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const title = document.getElementById("aTitle").value.trim();
        const content = document.getElementById("aContent").value.trim();
        try {
          await API.createAnnouncement({ title, content });
          createForm.reset();
          await load();
        } catch (err) {
          alert("Create failed: " + err.message);
        }
      });
    }
  
    async function editAnnouncement(a) {
      const newTitle = prompt("Edit title", a.title);
      if (newTitle === null) return;
      const newContent = prompt("Edit content", a.content);
      if (newContent === null) return;
  
      try {
        await API.updateAnnouncement(a.id, { title: newTitle, content: newContent });
        await load();
      } catch (err) {
        alert("Update failed: " + err.message);
      }
    }
  
    async function deleteAnnouncement(id) {
      if (!confirm("Delete announcement?")) return;
      try {
        await API.deleteAnnouncement(id);
        await load();
      } catch (err) {
        alert("Delete failed: " + err.message);
      }
    }
  
    function escapeHtml(s = "") {
      return s.replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[m]));
    }
  
    load();
  });
  