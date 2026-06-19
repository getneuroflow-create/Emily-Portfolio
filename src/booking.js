/* ========================================
   BOOKING SYSTEM
   Calendar + Time Slots + Form
   ======================================== */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const SLOTS = [
  '10:00 AM', '11:00 AM', '12:00 PM',
  '1:00 PM',  '2:00 PM',  '3:00 PM',
];

const STORAGE_KEY   = 'emily_booked_slots';
const CLIENTS_KEY   = 'emily_booked_clients';

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];
const DAY_NAMES = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const SHORT_MONTH = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

let currentMonth, currentYear, selectedDate = null, selectedSlot = null;

/* ---- Demo seed data ---- */
const DEMO_CLIENTS = [
  { name: 'Sarah L.',     service: 'Balayage & Ombré',          avatar: 'SL' },
  { name: 'Jennifer M.',  service: 'Haircut & Styling',          avatar: 'JM' },
  { name: 'Rachel K.',    service: 'Color & Highlights',         avatar: 'RK' },
  { name: 'Ashley T.',    service: 'Bridal & Special Occasion',  avatar: 'AT' },
  { name: 'Madison R.',   service: 'Keratin Treatment',          avatar: 'MR' },
  { name: 'Emily C.',     service: 'Hair Extensions',            avatar: 'EC' },
  { name: 'Nicole P.',    service: 'Balayage & Ombré',          avatar: 'NP' },
  { name: 'Kayla B.',     service: 'Haircut & Styling',          avatar: 'KB' },
  { name: 'Brittany S.',  service: 'Color & Highlights',         avatar: 'BS' },
  { name: 'Diana L.',     service: 'Haircut & Styling',          avatar: 'DL' },
  { name: 'Sophia W.',    service: 'Hair Extensions',            avatar: 'SW' },
  { name: 'Isabella D.',  service: 'Balayage & Ombré',          avatar: 'ID' },
  { name: 'Olivia M.',    service: 'Color & Highlights',         avatar: 'OM' },
  { name: 'Chloe R.',     service: 'Bridal & Special Occasion',  avatar: 'CR' },
];

function seedDemoBookings() {
  const slots  = JSON.parse(localStorage.getItem(STORAGE_KEY)  || '{}');
  const clients = JSON.parse(localStorage.getItem(CLIENTS_KEY) || '{}');
  if (Object.keys(slots).length > 2) return; // Already seeded

  const today = new Date();
  today.setHours(0,0,0,0);

  // Appointments: [businessDaysAhead, slot, clientIndex]
  const plan = [
    [1,  '10:00 AM', 0],
    [1,  '1:00 PM',  1],
    [2,  '11:00 AM', 2],
    [2,  '2:00 PM',  3],
    [3,  '10:00 AM', 4],
    [3,  '12:00 PM', 5],
    [5,  '10:00 AM', 6],
    [5,  '3:00 PM',  7],
    [6,  '11:00 AM', 8],
    [6,  '1:00 PM',  9],
    [8,  '10:00 AM', 10],
    [9,  '2:00 PM',  11],
    [10, '11:00 AM', 12],
    [11, '3:00 PM',  13],
  ];

  plan.forEach(([bdays, slot, ci]) => {
    const d = addBusinessDays(new Date(today), bdays);
    const key = formatDate(d);
    if (!slots[key])   slots[key]   = [];
    if (!clients[key]) clients[key] = {};
    if (!slots[key].includes(slot)) {
      slots[key].push(slot);
      clients[key][slot] = DEMO_CLIENTS[ci];
    }
  });

  localStorage.setItem(STORAGE_KEY,  JSON.stringify(slots));
  localStorage.setItem(CLIENTS_KEY,  JSON.stringify(clients));
}

function addBusinessDays(date, n) {
  const d = new Date(date);
  let added = 0;
  while (added < n) {
    d.setDate(d.getDate() + 1);
    const dow = d.getDay();
    if (dow !== 0 && dow !== 6) added++;
  }
  return d;
}

/* ---- Init ---- */
export function initBooking() {
  const today = new Date();
  currentMonth = today.getMonth();
  currentYear  = today.getFullYear();

  seedDemoBookings();
  renderCalendar();
  setupCalendarNav();
  setupBookingForm();
  renderUpcoming();

  ScrollTrigger.create({
    trigger: '#booking',
    start: 'top 80%',
    once: true,
    onEnter: () => {
      gsap.to('#bookingCalendar', { opacity:1, x:0, duration:0.8, ease:'power3.out' });
      gsap.to('#bookingSlots',    { opacity:1, x:0, duration:0.8, ease:'power3.out', delay:0.2 });
      gsap.to('#upcomingPanel',   { opacity:1, y:0, duration:0.8, ease:'power3.out', delay:0.35 });
    }
  });
}

/* ---- Calendar ---- */
function renderCalendar() {
  const monthYear     = document.getElementById('calendarMonthYear');
  const daysContainer = document.getElementById('calendarDays');
  if (!monthYear || !daysContainer) return;

  monthYear.textContent = `${MONTH_NAMES[currentMonth]} ${currentYear}`;
  daysContainer.innerHTML = '';

  const firstDay    = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const today       = new Date();
  today.setHours(0,0,0,0);

  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement('button');
    empty.className = 'calendar-day empty';
    empty.disabled  = true;
    daysContainer.appendChild(empty);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const date      = new Date(currentYear, currentMonth, day);
    const btn       = document.createElement('button');
    btn.className   = 'calendar-day';
    btn.textContent = day;

    const dow       = date.getDay();
    const isWeekend = dow === 0 || dow === 6;
    const isPast    = date <= today;
    const isToday   = date.getTime() === today.getTime();

    if (isToday) {
      btn.classList.add('today', 'disabled');
      btn.title = 'Same-day booking not available';
    } else if (isWeekend) {
      btn.classList.add('weekend', 'disabled');
      btn.title = 'Closed on weekends';
    } else if (isPast) {
      btn.classList.add('disabled');
    } else {
      const dateStr = formatDate(date);
      const booked  = getBookedSlots(dateStr);
      const total   = SLOTS.length;
      const full    = booked.length >= total;
      const partial = booked.length > 0 && !full;

      if (full)    btn.classList.add('full-slots');
      else if (partial) btn.classList.add('partial-slots');
      else btn.classList.add('has-slots');

      btn.addEventListener('click', () => selectDate(date, btn));
    }

    if (isWeekend || isPast) btn.disabled = true;
    daysContainer.appendChild(btn);
  }
}

function selectDate(date, btn) {
  document.querySelectorAll('.calendar-day.selected').forEach(d => d.classList.remove('selected'));
  btn.classList.add('selected');
  selectedDate = date;
  selectedSlot = null;

  renderSlots(date);

  const formWrapper = document.getElementById('bookingFormWrapper');
  if (formWrapper) formWrapper.style.display = 'none';
  const success = document.getElementById('bookingSuccess');
  if (success) success.classList.remove('show');

  gsap.fromTo('#slotsContent .slot-btn',
    { opacity:0, y:12, scale:0.97 },
    { opacity:1, y:0, scale:1, duration:0.35, stagger:0.055, ease:'power2.out' }
  );
}

/* ---- Slots ---- */
function renderSlots(date) {
  const content   = document.getElementById('slotsContent');
  const dateLabel = document.getElementById('slotsDate');
  if (!content) return;

  const dateStr   = formatDate(date);
  const booked    = getBookedSlots(dateStr);
  const clientMap = getClientMap(dateStr);

  if (dateLabel) {
    dateLabel.textContent = `${DAY_NAMES[date.getDay()]}, ${SHORT_MONTH[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  }

  content.innerHTML = `
    <div class="slots-grid">
      ${SLOTS.map(slot => {
        const isBooked = booked.includes(slot);
        const client   = clientMap[slot];
        return `
          <button class="slot-btn ${isBooked ? 'booked' : 'available-slot'}"
                  data-slot="${slot}"
                  ${isBooked ? 'disabled' : ''}>
            <span class="slot-time-icon">
              <i class="far fa-clock"></i>
            </span>
            <span class="slot-info">
              <span class="slot-time">${slot}</span>
              ${isBooked && client
                ? `<span class="slot-client">${client.name} · ${client.service}</span>`
                : isBooked
                  ? `<span class="slot-client">Booked</span>`
                  : `<span class="slot-client">Available</span>`}
            </span>
            <span class="slot-badge ${isBooked ? 'badge-booked' : 'badge-available'}">
              ${isBooked ? '<i class="fas fa-lock"></i>' : '<i class="fas fa-check"></i>'}
            </span>
          </button>
        `;
      }).join('')}
    </div>
    <div class="slots-legend">
      <span class="legend-item"><span class="legend-dot available"></span> Available</span>
      <span class="legend-item"><span class="legend-dot booked"></span> Booked</span>
      <span class="legend-item"><span class="legend-dot selected"></span> Selected</span>
    </div>
  `;

  content.querySelectorAll('.slot-btn:not(.booked)').forEach(b =>
    b.addEventListener('click', () => selectSlot(b))
  );
}

function selectSlot(btn) {
  document.querySelectorAll('.slot-btn.selected').forEach(s => s.classList.remove('selected'));
  btn.classList.add('selected');
  selectedSlot = btn.getAttribute('data-slot');

  const formWrapper = document.getElementById('bookingFormWrapper');
  if (formWrapper) {
    formWrapper.style.display = 'block';
    gsap.from(formWrapper, { opacity:0, y:20, duration:0.5, ease:'power2.out' });
    formWrapper.scrollIntoView({ behavior:'smooth', block:'center' });
  }
}

/* ---- Upcoming Panel ---- */
function renderUpcoming() {
  const panel = document.getElementById('upcomingPanel');
  if (!panel) return;

  const today = new Date();
  today.setHours(0,0,0,0);

  const allSlots   = JSON.parse(localStorage.getItem(STORAGE_KEY)  || '{}');
  const allClients = JSON.parse(localStorage.getItem(CLIENTS_KEY) || '{}');

  const upcoming = [];
  for (const [dateStr, slots] of Object.entries(allSlots)) {
    const d = new Date(dateStr + 'T00:00:00');
    if (d < today) continue;
    const clientMap = allClients[dateStr] || {};
    for (const slot of slots) {
      upcoming.push({ date: d, dateStr, slot, client: clientMap[slot] || null });
    }
  }

  upcoming.sort((a, b) => {
    if (a.date - b.date !== 0) return a.date - b.date;
    return SLOTS.indexOf(a.slot) - SLOTS.indexOf(b.slot);
  });

  const next8 = upcoming.slice(0, 8);

  if (next8.length === 0) {
    panel.innerHTML = `
      <div style="text-align:center;padding:2rem 1rem;color:rgba(0,0,0,0.3);">
        <i class="far fa-calendar-check" style="font-size:2rem;display:block;margin-bottom:0.8rem;"></i>
        <p style="font-size:0.82rem;margin:0;">No upcoming appointments</p>
      </div>`;
    return;
  }

  const DAY_ABR = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  panel.innerHTML = next8.map((appt, i) => {
    const d      = appt.date;
    const isNext = i === 0;
    const initials = appt.client ? appt.client.avatar : '?';
    const clientName = appt.client ? appt.client.name : 'Client';
    const service = appt.client ? appt.client.service : 'Appointment';
    const dateLabel = `${DAY_ABR[d.getDay()]}, ${SHORT_MONTH[d.getMonth()]} ${d.getDate()}`;

    return `
      <div class="upcoming-appt">
        ${isNext ? '<div class="upcoming-next-badge"><i class="fas fa-star"></i> Next</div>' : ''}
        <div class="upcoming-appt-date">${dateLabel}</div>
        <div class="upcoming-appt-time">
          <i class="far fa-clock"></i>
          ${appt.slot}
        </div>
        <div class="upcoming-appt-client">
          <div class="client-avatar">${initials}</div>
          <span class="client-name">${clientName}</span>
        </div>
        <p class="upcoming-appt-service">${service}</p>
      </div>
    `;
  }).join('');
}

/* ---- Nav ---- */
function setupCalendarNav() {
  document.getElementById('calendarPrev')?.addEventListener('click', () => {
    currentMonth--;
    if (currentMonth < 0) { currentMonth = 11; currentYear--; }
    renderCalendar();
  });
  document.getElementById('calendarNext')?.addEventListener('click', () => {
    currentMonth++;
    if (currentMonth > 11) { currentMonth = 0; currentYear++; }
    renderCalendar();
  });
}

/* ---- Form ---- */
function setupBookingForm() {
  const form = document.getElementById('bookingForm');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!selectedDate || !selectedSlot) {
      alert('Please select a date and time slot.');
      return;
    }

    const name    = document.getElementById('bookingName').value;
    const phone   = document.getElementById('bookingPhone').value;
    const email   = document.getElementById('bookingEmail').value;
    const service = document.getElementById('bookingService').value;
    const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2);

    const dateStr = formatDate(selectedDate);
    saveBookedSlot(dateStr, selectedSlot, { name, service: service || 'Appointment', avatar: initials });

    const formWrapper = document.getElementById('bookingFormWrapper');
    const success     = document.getElementById('bookingSuccess');
    const details     = document.getElementById('successDetails');

    if (formWrapper) formWrapper.style.display = 'none';
    if (success) {
      details.innerHTML = `
        <strong>${name}</strong>, your appointment is confirmed for<br/>
        <strong>${DAY_NAMES[selectedDate.getDay()]}, ${SHORT_MONTH[selectedDate.getMonth()]} ${selectedDate.getDate()}</strong>
        at <strong>${selectedSlot}</strong>.<br/>
        A confirmation will be sent to <strong>${email}</strong>.
      `;
      success.classList.add('show');
      gsap.from(success, { opacity:0, y:20, scale:0.95, duration:0.6, ease:'power2.out' });
      gsap.from(success.querySelector('.success-icon'), {
        scale:0, rotation:-180, duration:0.8, ease:'back.out(1.7)', delay:0.2
      });
    }

    renderSlots(selectedDate);
    renderCalendar();
    renderUpcoming();

    document.querySelectorAll('.calendar-day').forEach(day => {
      if (day.textContent == selectedDate.getDate() && !day.classList.contains('disabled'))
        day.classList.add('selected');
    });

    form.reset();
    selectedSlot = null;
  });
}

/* ---- Storage helpers ---- */
function getBookedSlots(dateStr) {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')[dateStr] || []; }
  catch { return []; }
}

function getClientMap(dateStr) {
  try { return JSON.parse(localStorage.getItem(CLIENTS_KEY) || '{}')[dateStr] || {}; }
  catch { return {}; }
}

function saveBookedSlot(dateStr, slot, clientInfo) {
  try {
    const slots   = JSON.parse(localStorage.getItem(STORAGE_KEY)  || '{}');
    const clients = JSON.parse(localStorage.getItem(CLIENTS_KEY) || '{}');
    if (!slots[dateStr])   slots[dateStr]   = [];
    if (!clients[dateStr]) clients[dateStr] = {};
    if (!slots[dateStr].includes(slot)) slots[dateStr].push(slot);
    clients[dateStr][slot] = clientInfo;
    localStorage.setItem(STORAGE_KEY,  JSON.stringify(slots));
    localStorage.setItem(CLIENTS_KEY,  JSON.stringify(clients));
  } catch { /* silent */ }
}

function formatDate(date) {
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
}
