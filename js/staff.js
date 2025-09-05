// Static staff rendering (simple array). Adjust pictures in images/staff/
document.addEventListener("DOMContentLoaded", () => {
    const staff = [
      { name: "Dr. Ada Example", role: "Head of Department", img: "images/staff/ada.jpg" },
      { name: "Mr. John Doe", role: "Lecturer", img: "images/staff/john.jpg" },
      { name: "Mrs. Jane Smith", role: "Secretary", img: "images/staff/jane.jpg" },
    ];
  
    const el = document.getElementById("staffList");
    staff.forEach(s => {
      const card = document.createElement("div");
      card.className = "p-4 border rounded flex flex-col items-center";
      card.innerHTML = `
        <img src="${s.img}" alt="${s.name}" class="w-28 h-28 object-cover rounded-full mb-2" />
        <h4 class="font-semibold">${s.name}</h4>
        <p class="text-sm text-gray-600">${s.role}</p>
      `;
      el.appendChild(card);
    });
  });
  