document.addEventListener("DOMContentLoaded", async () => {
    const el = document.getElementById("archiveList");
    el.innerHTML = "Loading...";
    try {
      const items = await API.getArchive();
      el.innerHTML = "";
      items.forEach(i => {
        const d = document.createElement("div");
        d.className = "p-3 border rounded";
        d.innerHTML = `<h4 class="font-semibold">${escapeHtml(i.title)}</h4>
          <p class="text-sm mt-1">${escapeHtml(i.content)}</p>
          <p class="text-xs text-gray-500 mt-2">Archived: ${new Date(i.archived_at).toLocaleString()}</p>`;
        el.appendChild(d);
      });
    } catch (err) {
      el.innerHTML = "Error loading archive.";
      console.error(err);
    }
  
    function escapeHtml(s="") { return s.replace(/[&<>"']/g, (m)=>({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m])); }
  });
  