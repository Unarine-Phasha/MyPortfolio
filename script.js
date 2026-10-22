
const themeButton = document.getElementById("theme-toggle");
const floatingShape = document.querySelector(".floating-shape");

// Restore the saved theme
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
    document.body.classList.add("dark");
}

function updateThemeButton() {
    if (document.body.classList.contains("dark")) {
        themeButton.textContent = "Light mode";
    } else {
        themeButton.textContent = "Dark mode";
    }
}

themeButton.addEventListener("click", function () {
    document.body.classList.toggle("dark");

    const theme = document.body.classList.contains("dark")
        ? "dark"
        : "light";

    localStorage.setItem("theme", theme);
    updateThemeButton();
});

if (floatingShape) {
    const updateFloatingShape = () => {
        const scrollOffset = window.scrollY || window.pageYOffset;
        const viewportHeight = window.innerHeight;
        const translateY = scrollOffset * 0.22;
        const translateX = Math.min(scrollOffset * 0.08, 30);
        const rotateY = scrollOffset * 0.18;
        const rotateZ = scrollOffset * 0.14;
        const depth = (scrollOffset / viewportHeight) * 35;

        floatingShape.style.transform = `translate3d(${translateX}px, ${translateY}px, 0) rotateX(${18 + depth}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`;
    };

    window.addEventListener("scroll", updateFloatingShape, { passive: true });
    window.addEventListener("resize", updateFloatingShape);
    updateFloatingShape();
}

updateThemeButton();
