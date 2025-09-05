// Events logic: uses backend for event meta, localStorage for images mapping
document.addEventListener("DOMContentLoaded", () => {
    const eventsList = document.getElementById("eventsList");
    const adminControls = document.getElementById("adminControls");
    const eventForm = document.getElementById("eventForm");
    const token = localStorage.getItem("sb_token");
  
    if (token && adminControls) adminControls.classList.remove("hidden");
  
    // local image mapping key
    const IM_KEY = "sb_event_images";
  
    function getImageMap() {
      try {
        return JSON.parse(localStorage.getItem(IM_KEY) || "{}");
      } catch {
        return {};
      }
    }
    function setImageMap(m) { localStorage.setItem(IM_KEY, JSON.stringify(m)); }
  
    async function loadEvents() {
      eventsList.innerHTML = "Loading...";
      try {
        const evs = await API.getEvents();
        eventsList.innerHTML = "";
        const map = getImageMap();
        evs.forEach(ev => {
          const card = document.createElement("div");
          card.className = "border rounded p-3 flex flex-col";
          const imgHtml = map[ev.id] ? `<img src="${map[ev.id]}" class="w-full h-48 object-cover rounded mb-2" />` : "";
          card.innerHTML = `
            ${imgHtml}
            <h3 class="text-lg font-semibold">${escapeHtml(ev.title)}</h3>
            <p class="text-sm mt-1">${escapeHtml(ev.description)}</p>
            <p class="text-xs text-gray-500 mt-2">Date: ${new Date(ev.event_date).toLocaleDateString()}</p>
          `;
          if (token) {
            const btns = document.createElement("div");
            btns.className = "mt-3 flex gap-2";
            const edit = document.createElement("button");
            edit.textContent = "Edit";
            edit.className = "px-2 py-1 bg-blue-600 text-white rounded";
            edit.onclick = () => editEvent(ev);
            const del = document.createElement("button");
            del.textContent = "Delete";
            del.className = "px-2 py-1 bg-red-600 text-white rounded";
            del.onclick = () => deleteEvent(ev.id);
            btns.append(edit, del);
            card.appendChild(btns);
          }
          eventsList.appendChild(card);
        });
      } catch (err) {
        eventsList.innerHTML = "Error loading events.";
        console.error(err);
      }
    }
  
    // creating event
    if (eventForm) {
      eventForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const title = document.getElementById("eTitle").value.trim();
        const desc = document.getElementById("eDesc").value.trim();
        const date = document.getElementById("eDate").value;
        const file = document.getElementById("eImage").files[0];
  
        try {
          const created = await API.createEvent({ title, description: desc, event_date: date });
          // handle image locally if selected
          if (file) {
            const reader = new FileReader();
            reader.onload = () => {
              const map = getImageMap();
              map[created.id] = reader.result;
              setImageMap(map);
              loadEvents();
            };
            reader.readAsDataURL(file);
          } else {
            loadEvents();
          }
          eventForm.reset();
        } catch (err) {
          alert("Create event failed: " + err.message);
        }
      });
    }
  
    async function editEvent(ev) {
      const newTitle = prompt("Title", ev.title);
      if (newTitle === null) return;
      const newDesc = prompt("Description", ev.description);
      if (newDesc === null) return;
      const newDate = prompt("Date (YYYY-MM-DD)", ev.event_date.split("T")[0]);
      if (newDate === null) return;
  
      try {
        await API.updateEvent(ev.id, { title: newTitle, description: newDesc, event_date: newDate });
        // optionally change image
        if (confirm("Change image?")) {
          const input = document.createElement("input");
          input.type = "file";
          input.accept = "image/*";
          input.onchange = () => {
            const f = input.files[0];
            if (!f) return;
            const r = new FileReader();
            r.onload = () => {
              const map = getImageMap();
              map[ev.id] = r.result;
              setImageMap(map);
              loadEvents();
            };
            r.readAsDataURL(f);
          };
          input.click();
        } else {
          loadEvents();
        }
      } catch (err) {
        alert("Update failed: " + err.message);
      }
    }
  
    async function deleteEvent(id) {
      if (!confirm("Delete event?")) return;
      try {
        await API.deleteEvent(id);
        // remove local image
        const map = getImageMap();
        if (map[id]) {
          delete map[id];
          setImageMap(map);
        }
        loadEvents();
      } catch (err) {
        alert("Delete failed: " + err.message);
      }
    }
  
    function escapeHtml(s = "") {
      return s.replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[m]));
    }
  
    loadEvents();
  });
  