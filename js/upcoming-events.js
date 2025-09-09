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
  },
  {
    title: "Chaos Engineering Workshop",
    start: "2025-09-11T18:00:00",
    end:   "2025-09-11T19:00:00",
    location: "PFT 1259",
    img: "/pictures/posters/25-26/2_chaos_Engineering.jpg",
    desc: "Want to learn how tech giants break their systems on purpose to make them stronger? Now’s your chance!",
    links: {
      instagram: "https://www.instagram.com/p/DOWP3KJgD5b/"
    }
  }
];


/* ---------- Helpers ---------- */
const toDate = (s) => new Date(s);
const oneHourMs = 60 * 60 * 1000;

const eventEnd = (ev) => ev.end ? toDate(ev.end) : new Date(toDate(ev.start).getTime() + oneHourMs);

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
  const pad = (n) => String(n).padStart(2, "0");
  return `${dt.getFullYear()}${pad(dt.getMonth()+1)}${pad(dt.getDate())}T${pad(dt.getHours())}${pad(dt.getMinutes())}${pad(dt.getSeconds())}`;
}

function downloadICS(ev) {
  const dtStart = toDate(ev.start);
  const dtEnd = eventEnd(ev);
  const ics =
`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//WiCS LSU//Events//EN
BEGIN:VEVENT
UID:${Date.now()}@wicslsu
DTSTAMP:${icsTime(new Date())}
DTSTART:${icsTime(dtStart)}
DTEND:${icsTime(dtEnd)}
SUMMARY:${ev.title.replace(/\n/g, " ")}
LOCATION:${(ev.location||"").replace(/\n/g, " ")}
DESCRIPTION:${(ev.desc||"").replace(/\n/g, " ")}
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


const rootUpcoming = document.getElementById("upcoming-cards");
const rootPast = document.getElementById("past-cards");
const emptyUpcoming = rootUpcoming?.querySelector(".empty-state");
const emptyPast = rootPast?.querySelector(".empty-past");

function buildCard(ev, idx) {
  const card = document.createElement("div");
  card.className = "card";
  card.dataset.idx = idx; 

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
      </div>
    </div>
  `;
  
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

  return card;
}


function clearCards(node) {
  node.querySelectorAll(".card").forEach(el => el.remove());
}

function renderAll() {
  if (!rootUpcoming || !rootPast) return;

  clearCards(rootUpcoming);
  clearCards(rootPast);

  const now = new Date();
  const withIdx = EVENTS.map((e, i) => ({ ...e, _idx: i }));

  const upcoming = withIdx
    .filter(e => eventEnd(e) >= now)
    .sort((a, b) => toDate(a.start) - toDate(b.start));

  const past = withIdx
    .filter(e => eventEnd(e) < now)
    .sort((a, b) => toDate(b.start) - toDate(a.start)); // newest past first

  if (emptyUpcoming) emptyUpcoming.style.display = upcoming.length ? "none" : "block";
  if (emptyPast) emptyPast.style.display = past.length ? "none" : "block";

  upcoming.forEach(ev => rootUpcoming.appendChild(buildCard(ev, ev._idx)));
  past.forEach(ev => rootPast.appendChild(buildCard(ev, ev._idx)));
}
 
renderAll();
setInterval(renderAll, 60_000);
