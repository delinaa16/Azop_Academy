// Small helpers
const $ = (id) => document.getElementById(id);
const escapeHtml = (s = "") =>
  String(s).replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[m]));

async function apiFetch(path, options = {}) {
  const res = await fetch(path, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });

  let body = null;
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) body = await res.json();
  else body = await res.text();

  if (!res.ok) {
    const message = body?.message || (Array.isArray(body?.errors) ? body.errors.map((e) => e.msg).join(", ") : null) || "Request failed";
    const err = new Error(message);
    err.status = res.status;
    err.body = body;
    throw err;
  }
  return body;
}

function setNavActive(sectionId) {
  document.querySelectorAll("[data-section]").forEach((a) => {
    a.classList.toggle("active", a.dataset.section === sectionId);
  });
}

// Toggle sections
function showSection(id) {
  document.querySelectorAll(".section").forEach((sec) => sec.classList.add("d-none"));
  $(id)?.classList.remove("d-none");
  setNavActive(id);
  window.scrollTo({ top: 0, behavior: "smooth" });
}
window.showSection = showSection;

function imgUrl(filename) {
  if (!filename) return "";
  return `/uploads/images/${encodeURIComponent(filename)}`;
}

function setState(el, kind, message) {
  if (!el) return;
  if (!kind) {
    el.innerHTML = "";
    return;
  }
  const klass = kind === "error" ? "alert-danger" : kind === "info" ? "alert-info" : "alert-secondary";
  el.innerHTML = `<div class="alert ${klass} mb-0">${escapeHtml(message)}</div>`;
}

function skeletonCards(count = 6) {
  return Array.from({ length: count })
    .map(
      () => `
    <div class="col-md-6 col-lg-4">
      <div class="card">
        <div style="height:220px;background:linear-gradient(90deg,#f1f5f9,#e2e8f0,#f1f5f9);background-size:200% 100%;animation:shimmer 1.2s infinite;"></div>
        <div class="card-body">
          <div style="height:14px;width:60%;background:#e2e8f0;border-radius:8px;"></div>
          <div class="mt-2" style="height:10px;width:85%;background:#edf2f7;border-radius:8px;"></div>
          <div class="mt-2" style="height:10px;width:70%;background:#edf2f7;border-radius:8px;"></div>
        </div>
      </div>
    </div>`
    )
    .join("");
}

// Load Stats
async function loadStats() {
  try {
    const stats = await apiFetch("/api/stats");
    $("stat-teachers").textContent = stats.teachers ?? "—";
    $("stat-programs").textContent = stats.programs ?? "—";
    $("stat-gallery").textContent = stats.galleryEntries ?? "—";
  } catch {
    // Non-blocking
  }
}

// Load Teachers
let allTeachers = [];
async function loadTeachers() {
  const stateEl = $("teachers-state");
  const container = $("teachers-list");
  setState(stateEl, "info", "Loading teachers…");
  container.innerHTML = skeletonCards(6);

  try {
    const resp = await apiFetch("/api/teachers?limit=50");
    const data = Array.isArray(resp) ? resp : resp.data || [];
    allTeachers = data;
    renderTeachers();
    setState(stateEl, null);
  } catch (e) {
    container.innerHTML = "";
    setState(stateEl, "error", e.message);
  }
}

function renderTeachers() {
  const q = ($("teacher-search")?.value || "").trim().toLowerCase();
  const container = $("teachers-list");

  const filtered = allTeachers.filter((t) => {
    if (!q) return true;
    return `${t.name || ""} ${t.subject || ""}`.toLowerCase().includes(q);
  });

  if (filtered.length === 0) {
    container.innerHTML = `<div class="col-12"><div class="alert alert-secondary mb-0">No teachers found.</div></div>`;
    return;
  }

  container.innerHTML = filtered
    .map((teacher) => {
      const hasPhoto = teacher.photo;
      const photoSection = hasPhoto 
        ? `<img src="${imgUrl(teacher.photo)}" class="card-img-top" alt="${escapeHtml(teacher.name)}" loading="lazy">`
        : `<div class="card-img-top d-flex align-items-center justify-content-center" style="height: 220px; background: linear-gradient(135deg, #ff7a18, #af002d); color: white;">
            <i class="bi bi-person-circle" style="font-size: 80px;"></i>
          </div>`;
      return `
      <div class="col-md-6 col-lg-4">
        <div class="card h-100 fade-in">
          ${photoSection}
          <div class="card-body">
            <div class="d-flex align-items-start justify-content-between gap-2">
              <h5 class="card-title mb-1">${escapeHtml(teacher.name)}</h5>
              <span class="pill"><i class="bi bi-person-badge"></i> Teacher</span>
            </div>
            <div class="text-muted">Subject: ${escapeHtml(teacher.subject)}</div>
            ${teacher.experience ? `<div class="text-muted">Experience: ${escapeHtml(teacher.experience)}</div>` : ''}
            ${teacher.bio ? `<p class="card-text mt-2 small text-muted">${escapeHtml(teacher.bio)}</p>` : ''}
          </div>
        </div>
      </div>`;
    })
    .join("");
}

// Load Programs
let allPrograms = [];
async function loadPrograms() {
  const stateEl = $("programs-state");
  const container = $("programs-list");
  setState(stateEl, "info", "Loading programs…");
  container.innerHTML = skeletonCards(6);

  try {
    const resp = await apiFetch("/api/programs?limit=50");
    const data = Array.isArray(resp) ? resp : resp.data || [];
    allPrograms = data;
    renderPrograms();
    setState(stateEl, null);
  } catch (e) {
    container.innerHTML = "";
    setState(stateEl, "error", e.message);
  }
}

function renderPrograms() {
  const q = ($("program-search")?.value || "").trim().toLowerCase();
  const container = $("programs-list");
  const filtered = allPrograms.filter((p) => {
    if (!q) return true;
    return `${p.title || ""} ${p.description || ""}`.toLowerCase().includes(q);
  });

  if (filtered.length === 0) {
    container.innerHTML = `<div class="col-12"><div class="alert alert-secondary mb-0">No programs found.</div></div>`;
    return;
  }

  container.innerHTML = filtered
    .map((program) => {
      const image = program.image ? imgUrl(program.image) : "https://placehold.co/800x600?text=Program";
      return `
      <div class="col-md-6 col-lg-4">
        <div class="card h-100 fade-in">
          <img src="${image}" class="card-img-top" alt="${escapeHtml(program.title)}" loading="lazy">
          <div class="card-body">
            <div class="d-flex align-items-start justify-content-between gap-2">
              <h5 class="card-title mb-1">${escapeHtml(program.title)}</h5>
              <span class="pill"><i class="bi bi-calendar3"></i> ${escapeHtml(program.duration || "Flexible")}</span>
            </div>
            <p class="card-text mt-2 mb-0">${escapeHtml(program.description || "A focused learning program designed for student growth.")}</p>
          </div>
        </div>
      </div>`;
    })
    .join("");
}

// Load Gallery
async function loadGallery() {
  const stateEl = $("gallery-state");
  const container = $("gallery-images");
  setState(stateEl, "info", "Loading gallery…");
  container.innerHTML = "";

  try {
    const data = await apiFetch("/api/gallery");
    const images = [];
    (data || []).forEach((item) => (item.images || []).forEach((img) => images.push(img)));

    if (images.length === 0) {
      setState(stateEl, "info", "No gallery images yet.");
      return;
    }

    setState(stateEl, null);
    // Show all images (no limit) - optimized for many student photos
    container.innerHTML = images
      .map((img, index) => {
        const src = imgUrl(img);
        const delay = (index % 12) * 30; // Staggered animation
        return `<div class="col-6 col-md-4 col-lg-3" style="animation-delay: ${delay}ms;"><img class="fade-in gallery-image" src="${src}" alt="Gallery image ${index + 1}" loading="lazy" data-lightbox="${src}"></div>`;
      })
      .join("");
  } catch (e) {
    setState(stateEl, "error", e.message);
  }
}

// Lightbox
function setupLightbox() {
  const modalEl = $("lightboxModal");
  if (!modalEl) return;
  const modal = new bootstrap.Modal(modalEl);
  const img = $("lightboxImg");

  document.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof Element)) return;
    const src = target.getAttribute("data-lightbox");
    if (!src) return;
    img.src = src;
    modal.show();
  });
}

// Contact form
$("contact-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const alertBox = $("contact-alert");
  const spinner = $("contact-spinner");
  const submit = $("contact-submit");

  const name = $("name").value;
  const email = $("email").value;
  const phone = $("phone").value;
  const subject = $("subject").value;
  const message = $("message").value;

  submit.disabled = true;
  spinner.classList.remove("d-none");
  alertBox.innerHTML = "";

  try {
    const data = await apiFetch("/api/contact", {
      method: "POST",
      body: JSON.stringify({ name, email, phone, subject, message }),
    });
    alertBox.innerHTML = `<div class="alert alert-success"><strong>Thank you!</strong> You've been added to our waitlist. We'll contact you soon when spots become available.</div>`;
    $("contact-form").reset();
  } catch (err) {
    alertBox.innerHTML = `<div class="alert alert-danger">${escapeHtml(err.message || "Failed to join waitlist. Please try again.")}</div>`;
  } finally {
    submit.disabled = false;
    spinner.classList.add("d-none");
  }
});

// Wire up UI events
function wireUi() {
  $("teacher-search")?.addEventListener("input", renderTeachers);
  $("program-search")?.addEventListener("input", renderPrograms);
  $("teacher-refresh")?.addEventListener("click", loadTeachers);
  $("program-refresh")?.addEventListener("click", loadPrograms);
  $("gallery-refresh")?.addEventListener("click", loadGallery);
}

// Initial load
wireUi();
setupLightbox();
showSection("home");
loadStats();
loadTeachers();
loadPrograms();
loadGallery();
