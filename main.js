window.addEventListener("scroll", onScroll);

onScroll();
function onScroll() {
  showNavOnScroll();
  showBackToTopButtonOnScroll();

  activateMenuAtCurrentSection(home);
  activateMenuAtCurrentSection(about);
  activateMenuAtCurrentSection(frameworks);
  activateMenuAtCurrentSection(contact);
}

function showNavOnScroll() {
  if (scrollY > 0) {
    navig.classList.add("scroll");
  } else {
    navig.classList.remove("scroll");
  }
}

function activateMenuAtCurrentSection(section) {
  // innherHeight is a number  that represents the size of the viewport
  const targetLine = scrollY + innerHeight / 2;

  const sectionTop = section.offsetTop;
  const sectionHeight = section.offsetHeight;

  const sectionTopReachOrPassedTargetLine = targetLine >= sectionTop;

  const sectionEndsAt = sectionTop + sectionHeight;

  const sectionEndPassedTargetLine = sectionEndsAt <= targetLine;

  const sectionBoundaries =
    sectionTopReachOrPassedTargetLine && !sectionEndPassedTargetLine;

  const sectionId = section.getAttribute("id");
  const menuElement = document.querySelector(`.menu a[href*=${sectionId}]`);

  menuElement.classList.remove("active");
  if (sectionBoundaries) {
    menuElement.classList.add("active");
  }
}

function showBackToTopButtonOnScroll() {
  if (scrollY > 550) {
    backToTopButton.classList.add("show");
  } else {
    backToTopButton.classList.remove("show");
  }
}

function openMenu() {
  document.body.classList.add("menu-expanded");
}

function closeMenu() {
  document.body.classList.remove("menu-expanded");
}

// Lib scrollReveal
ScrollReveal({
  origin: "top",
  distance: "30px",
  duration: 700,
}).reveal(`
  #home, 
  #home img, 
  #home .stats,
  #about,
  #about header,
  #about .content,
  #brands,
  #brands header,
  #brands .content`);

// =============== RANDOM THEME ============= //
// Available themes
const themes = ["", "theme-green", "theme-purple", "theme-orange"];
// Pick random theme for each user
const randomTheme = themes[Math.floor(Math.random() * themes.length)];
// Apply theme
document.documentElement.classList.add(randomTheme);
// =============== END RANDOM THEME ============= //

// =============== FETCH DOCTOR PROFILE ============= //

const API = "https://www.gethealthdiary.com/api/v1/doctor_profile/";
const STORAGE_BASE = "https://www.gethealthdiary.com/storage/";

const FALLBACK_DOCTOR = "https://img.freepik.com/premium-vector/online-doctor-consultation-technology-smartphone_203228-326.jpg";
const FALLBACK_ABOUT = "https://cdn.pixabay.com/photo/2021/11/21/06/16/female-6813278_1280.png";
const FALLBACK_ADDRESS = "https://img.freepik.com/free-vector/patients-visitors-walking-near-hospital-building-flat-illustration_74855-17091.jpg";

const COLORS = [
  "#7c9efc",
  "#56c7a2",
  "#f5a452",
  "#bb86fc",
  "#ff6b6b",
  "#4dd0e1",
];

setTimeout(() => {
      document.getElementById("pageLoader").style.display = "none";
      document.getElementById("pageContent").style.display = "block";
}, 300);

async function doctor_profile(id) {
  try {
    const res = await fetch(`${API}${encodeURIComponent(id)}`, {
      headers: { "Content-Type": "application/json" },
    });
    const json = await res.json();
    if (!json?.status || !json?.data) {
      console.warn("Unexpected API response:", json);
      return;
    }
    
    const d = json.data;

    // Top fields
    document.querySelectorAll(".doctorName").forEach((el) => {
      el.textContent = d.name;
    });

    setText("doctorSpeciality", d.speciality);
    setText("doctorTreatments", d.specialized_treatments);
    setText("doctorExperience", d.experience);
    setText("doctorBio", d.personal_bio);
    setText("doctorLanguages", d.consulting_languages);
    setText("doctorClinic", d.clinic_details);
    setText("doctorAcademic", d.academic_details);
    setText("doctorAwards", d.awards_publications);
    setText("doctorRating", d.doctor_rating);
    setText("doctorStatus", d.status);
    setText("patientsTreated", d.patients_treated);
    setText("email", d.email);
    setText("doctorWebsite", d.website_link);

    // photo (API gives only filename, so prefix STORAGE_BASE)
    function setImg(id, val, fallback) {
      const el = document.getElementById(id);
      if (!el) return;
      let url = !val
        ? fallback
        : /^https?:\/\//i.test(val)
        ? val.replace(/^http:\/\//i, "https://")
        : STORAGE_BASE + "doctor_photos/" + encodeURIComponent(val);
      el.src = url;
      el.onerror = () => (el.src = fallback);
    }

    // Usage
    setImg("doctorPhoto", d.photo, FALLBACK_DOCTOR);
    setImg("aboutPhoto", d.about_photo, FALLBACK_ABOUT);
    setImg("addressPhoto", d.address_photo, FALLBACK_ADDRESS);

    // Social links (split by ||| and create list items with icons)
   const links = (d.social_links || "").split("|||");

const getLink = (name) => links.find(u => u && u.includes(name)) || "";

document.querySelector(".social-links").innerHTML = `
  <li><a ${getLink("instagram") ? `href="${getLink("instagram")}" target="_blank"` : ""}><i class="fa-brands fa-square-instagram"></i></a></li>
  <li><a ${getLink("facebook")  ? `href="${getLink("facebook")}"  target="_blank"` : ""}><i class="fa-brands fa-square-facebook"></i></a></li>
  <li><a ${getLink("youtube")   ? `href="${getLink("youtube")}"   target="_blank"` : ""}><i class="fa-brands fa-youtube"></i></a></li>
`;


    // Frameworks
    renderFrameworks(
      Array.isArray(d.framework_details) ? d.framework_details : []
    );
  } catch (err) {
    console.error("Error fetching doctor profile:", err);
  }
}

// Set plain text in an element by id
function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value ?? "...";
}

// Render framework cards (simple + direct append)
function renderFrameworks(items) {
  const container = document.querySelector(".allFwCards");
  if (!container) {
    console.warn("Missing .allFwCards in HTML");
    return;
  }

  container.innerHTML = "";
  if (!items.length) {
    container.innerHTML = "<p>No frameworks available</p>";
    return;
  }

  items.forEach((fw, idx) => {
    const color = COLORS[idx % COLORS.length];
    const icon = (fw?.fw_icon ? String(fw.fw_icon) : "").replace(/^\/+/, "");
    const bgImage = icon ? `${STORAGE_BASE}${icon}` : FALLBACK_DOCTOR;

    const wrapper = document.createElement("div");
    wrapper.className = "fw-card";
    wrapper.innerHTML = `
      <div class="framework-wrapper">
        <div class="framework-card"
             style="background-image:url('${bgImage}'); border: 1px solid ${color};">
             <div class="fw-info" style="background:linear-gradient(to top,${color}, transparent);">
            </div>
        </div>
        <div class="fw-footer">
          <h5>${fw?.fw_name ?? ""}</h5>
        </div>
      </div>
    `;

    container.appendChild(wrapper);
  });
}

// ============== END FETCH DOCTOR PROFILE ============= //

// Read id from URL (?id=3) and load once
const urlParams = new URLSearchParams(window.location.search);
const docId = urlParams.get("id");

// === Theme selection based on doctor id === //
const themeIndex = parseInt(docId, 10) % 5;
document.documentElement.className = ""; // clear old theme
if (themeIndex === 1) document.documentElement.classList.add("theme-green");
if (themeIndex === 2) document.documentElement.classList.add("theme-purple");
if (themeIndex === 3) document.documentElement.classList.add("theme-orange");
if (themeIndex === 4) document.documentElement.classList.add("theme-4");

doctor_profile(docId);
