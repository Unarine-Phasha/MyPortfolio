const root = document.documentElement;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.getElementById("year").textContent = new Date().getFullYear();

// Theme (saved or system theme is applied by the inline script in <head>)
const themeButton = document.getElementById("theme-toggle");

function updateThemeButton() {
    const isDark = root.classList.contains("dark");
    themeButton.textContent = isDark ? "Light mode" : "Dark mode";
    themeButton.setAttribute("aria-pressed", String(isDark));
}

themeButton.addEventListener("click", () => {
    root.classList.toggle("dark");
    try {
        localStorage.setItem("theme", root.classList.contains("dark") ? "dark" : "light");
    } catch (e) { /* storage unavailable, theme just won't persist */ }
    updateThemeButton();
});

updateThemeButton();

// Scroll progress bar
const bar = document.querySelector(".progress");

function updateProgress() {
    const max = root.scrollHeight - window.innerHeight;
    bar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + "%";
}

window.addEventListener("scroll", updateProgress, { passive: true });
window.addEventListener("resize", updateProgress);
updateProgress();

// Run the SQL query in the hero card
const runButton = document.getElementById("run-query");
const queryOutput = document.getElementById("query-output");

runButton.addEventListener("click", () => {
    const wasOpen = runButton.getAttribute("aria-expanded") === "true";
    runButton.setAttribute("aria-expanded", String(!wasOpen));
    runButton.textContent = wasOpen ? "▶ Run query" : "↺ Reset";
    queryOutput.hidden = wasOpen;
});

// Heart counter with floating hearts
const heart = document.getElementById("heart");
const heartCount = document.getElementById("heart-count");
let hearts = 0;

heart.addEventListener("click", () => {
    hearts++;
    heartCount.textContent = hearts;
    heart.setAttribute("aria-label", `Send a heart (${hearts} sent)`);

    if (reduceMotion) return;

    const rect = heart.getBoundingClientRect();
    const floater = document.createElement("span");
    floater.className = "float-heart";
    floater.textContent = "♥";
    floater.setAttribute("aria-hidden", "true");
    floater.style.left = rect.left + rect.width / 2 + (Math.random() * 40 - 20) + "px";
    floater.style.top = rect.top + "px";
    document.body.appendChild(floater);
    floater.addEventListener("animationend", () => floater.remove());
});

// Skills filter
const filterButtons = document.querySelectorAll(".filters button");
const skillGroups = document.querySelectorAll(".skills-group");

filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        const filter = button.dataset.filter;
        filterButtons.forEach(b => b.setAttribute("aria-pressed", String(b === button)));
        skillGroups.forEach(group => {
            group.hidden = filter !== "all" && group.dataset.group !== filter;
        });
    });
});

// Highlight the nav link for the section in view
const navLinks = document.querySelectorAll("nav a");
const sections = [...navLinks].map(a => document.querySelector(a.getAttribute("href")));

if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            navLinks.forEach(a => {
                const active = a.getAttribute("href") === "#" + entry.target.id;
                if (active) a.setAttribute("aria-current", "true");
                else a.removeAttribute("aria-current");
            });
        });
    }, { rootMargin: "-40% 0px -55% 0px" });

    sections.forEach(s => s && observer.observe(s));
}