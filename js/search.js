document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("searchForm");
    const results = document.getElementById("results");
  
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const keyword = document.getElementById("keyword").value || null;
      const start_date = document.getElementById("startDate").value || null;
      const end_date = document.getElementById("endDate").value || null;
      results.innerHTML = "Searching...";
      try {
        const res = await API.search({ keyword, start_date, end_date, content_type: null });
        results.innerHTML = "";
        const total = document.createElement("p");
        total.textContent = `Total results: ${res.total_results}`;
        results.appendChild(total);
  
        if (res.announcements.length) {
          const h = document.createElement("h3"); h.textContent = "Announcements";
          results.appendChild(h);
          res.announcements.forEach(a => {
            const el = document.createElement("div"); el.className = "p-2 border rounded my-1";
            el.innerHTML = `<strong>${escape(a.title)}</strong><div>${escape(a.content)}</div>`;
            results.appendChild(el);
          });
        }
  
        if (res.events.length) {
          const h = document.createElement("h3"); h.textContent = "Events";
          results.appendChild(h);
          res.events.forEach(ev => {
            const el = document.createElement("div"); el.className = "p-2 border rounded my-1";
            el.innerHTML = `<strong>${escape(ev.title)}</strong><div>${escape(ev.description)}</div>`;
            results.appendChild(el);
          });
        }
      } catch (err) {
        results.innerHTML = "Search failed.";
        console.error(err);
      }
    });
  
    function escape(s="") { return s.replace(/[&<>"']/g, (m)=>({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m])); }
  });
  