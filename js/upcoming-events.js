const EVENTS = [
  {
    title: "WiCS Mixer",
    start: "2025-09-03T18:30:00",  
    end:   "2025-09-03T19:30:00",
    location: "Frank Walk Room",
    img: "/pictures/posters/25-26/0_Wixer.jpeg",
    desc: "Come meet new friends, grab some food and learn about other computer science-based clubs here at LSU!! ",
    links: {
      instagram: "https://www.instagram.com/p/DNoFuHkA6v-/"
    }
  },
  {
    title: "Professional Development Night",
    start: "2025-09-08T18:00:00",
    end:   "2025-09-08T20:00:00",
    location: "PFT 1200",
    img: "/pictures/posters/25-26/1_PDN.jpeg",
    desc: "WiCS LSU x SSL: Professional Development Night 💼🔧 Sponsored by Entergy!",
    links: {
      instagram: "https://www.instagram.com/p/DN7OF1hAGQe/"
    }
  }
];


// --- Utilities ---
function toDate(d) { return new Date(d); }

function formatRange(startStr, endStr) {
  const start = toDate(startStr);
  const end = endStr ? toDate(endStr) : null;

  const sameDay = end && start.toDateString() === end.toDateString();

  const optsDate = { weekday: "short", month: "short", day: "numeric", year: "numeric" };
  const optsTime = { hour: "numeric", minute: "2-digit" };

  const datePart = start.toLocaleDateString(undefined, optsDate);
  if (!end) return `${datePart} • ${start.toLocaleTimeString(undefined, optsTime)}`;

  if (sameDay) {
    return `${datePart} • ${start.toLocaleTimeString(undefined, optsTime)}–${end.toLocaleTimeString(undefined, optsTime)}`;
  } else {
    return `${datePart} ${start.toLocaleTimeString(undefined, optsTime)} → ${end.toLocaleDateString(undefined, optsDate)} ${end.toLocaleTimeString(undefined, optsTime)}`;
  }
}

function icsTime(dt) {
  const pad = n => String(n).padStart(2, "0");
  const y = dt.getFullYear();
  const m = pad(dt.getMonth() + 1);
  const d = pad(dt.getDate());
  const hh = pad(dt.getHours());
  const mm = pad(dt.getMinutes());
  const ss = pad(dt.getSeconds());
  // "Floating" local time (no Z / timezone). Works fine for personal calendars.
  return `${y}${m}${d}T${hh}${mm}${ss}`;
}

function downloadICS(ev) {
  const dtStart = toDate(ev.start);
  const dtEnd = ev.end ? toDate(ev.end) : new Date(dtStart.getTime() + 60*60*1000); // default 1h

  const ics =
`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//WiCS LSU//Upcoming Events//EN
BEGIN:VEVENT
UID:${Date.now()}@wicslsu
DTSTAMP:${icsTime(new Date())}
DTSTART:${icsTime(dtStart)}
DTEND:${icsTime(dtEnd)}
SUMMARY:${ev.title.replace(/\n/g, " ")}
LOCATION:${(ev.location || "").replace(/\n/g, " ")}
DESCRIPTION:${(ev.desc || "").replace(/\n/g, " ")}
END:VEVENT
END:VCALENDAR`;

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${ev.title.replace(/\s+/g, "_")}.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// --- Render cards ---
const wrapper = document.getElementById("upcoming-cards");
const emptyState = wrapper.querySelector(".empty-state");

const upcoming = EVENTS
  .filter(e => toDate(e.end || e.start) >= new Date())
  .sort((a, b) => toDate(a.start) - toDate(b.start));

if (upcoming.length === 0) {
  emptyState.style.display = "block";
} else {
  emptyState.style.display = "none";
  upcoming.forEach((ev, idx) => {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.index = idx;

    // card DOM (reuses your workshop card structure/classes)
    card.innerHTML = `
      <div class="image-content">
        <div class="card-image">
          <img src="${ev.img}" alt="${ev.title}" class="card-img" crossorigin="anonymous">
        </div>
        <div class="card-bg"></div>
        <div class="card-content">
          <h3>${ev.title}</h3>
          <p class="workshop-details">${formatRange(ev.start, ev.end)} | ${ev.location || "TBD"}</p>
          <p class="description">${ev.desc || ""}</p>
          <button class="button details-btn">More</button>
        </div>
      </div>
    `;

    // Optional: auto background from image dominant color
    const img = card.querySelector(".card-img");
    img.addEventListener("load", () => {
      if (window.ColorThief) {
        try {
          const ct = new ColorThief();
          const color = ct.getColor(img); // [r,g,b]
          const bg = card.querySelector(".card-bg");
          bg.style.background = `linear-gradient(135deg, rgba(${color[0]},${color[1]},${color[2]},0.20), rgba(0,0,0,0))`;
        } catch {}
      }
    });

    wrapper.appendChild(card);
  });
}

// --- Modal wiring ---
const modal = document.getElementById("popup-modal");
const closeBtn = modal.querySelector(".close-modal");
const calendarBtn = document.getElementById("calendar-button");
const rsvpBtn = document.getElementById("rsvp-button");
const instaBtn = document.getElementById("instagram-button");

let currentEvent = null;

wrapper.addEventListener("click", (e) => {
  const btn = e.target.closest(".details-btn");
  if (!btn) return;

  const card = e.target.closest(".card");
  const idx = Number(card?.dataset.index ?? -1);
  if (idx < 0) return;

  currentEvent = upcoming[idx];
  // Show/hide buttons based on links present
  rsvpBtn.style.display = currentEvent?.links?.rsvp ? "inline-block" : "none";
  instaBtn.style.display = currentEvent?.links?.instagram ? "inline-block" : "none";

  modal.style.display = "block";
  document.body.style.overflow = "hidden";
});

closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
  document.body.style.overflow = "";
});

window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
    document.body.style.overflow = "";
  }
});
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    modal.style.display = "none";
    document.body.style.overflow = "";
  }
});

calendarBtn.addEventListener("click", () => {
  if (currentEvent) downloadICS(currentEvent);
});

rsvpBtn.addEventListener("click", () => {
  if (currentEvent?.links?.rsvp) window.open(currentEvent.links.rsvp, "_blank");
});

instaBtn.addEventListener("click", () => {
  if (currentEvent?.links?.instagram) window.open(currentEvent.links.instagram, "_blank");
});
