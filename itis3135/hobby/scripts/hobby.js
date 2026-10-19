// Shows one section at a time so the page works like a single-page app.
// The What section is the default page.

const siteName = "Motorcycling";
const sections = document.querySelectorAll("main section");
const navLinks = document.querySelectorAll("header nav a");

function showSection(id) {
    let found = false;

    sections.forEach(function (section) {
        if (section.id === id) {
            found = true;
        }
    });

    if (!found) {
        id = "what";
    }

    sections.forEach(function (section) {
        section.hidden = section.id !== id;

        if (section.id === id) {
            document.title = siteName + " ⚡ " + section.querySelector("h2").textContent;
        }
    });

    navLinks.forEach(function (link) {
        if (link.getAttribute("href") === "#" + id) {
            link.setAttribute("aria-current", "page");
        } else {
            link.removeAttribute("aria-current");
        }
    });

    window.scrollTo(0, 0);
}

// update the visible section when a nav link changes the #hash in the url
window.addEventListener("hashchange", function () {
    showSection(location.hash.slice(1));
});

showSection(location.hash.slice(1));