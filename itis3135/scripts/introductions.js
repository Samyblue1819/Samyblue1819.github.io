// Pulls every classmate's introduction from the API and builds a card for each one.
let people = [];

function buildName(data, username) {
  const first = data.firstName || "";
  const last = data.lastName || "";
  const full = (first + " " + last).trim();
  return full || username;
}

function makeCard(person) {
  const data = person.data;
  const card = document.createElement("article");
  card.className = "intro-card";

  if (data.img && String(data.img).startsWith("data:image")) {
    const picture = document.createElement("img");
    picture.src = data.img;
    picture.alt = data.pictureAlt || ("Photo of " + person.name);
    picture.loading = "lazy";
    card.append(picture);
  }

  // Heading shows the name and mascot, with spaces on both sides of the divider
  const heading = document.createElement("h3");
  heading.className = "intro-name";
  const divider = data.prettyNameDivider || "~";
  const mascot = ((data.adjectives || "") + " " + (data.animal || "")).trim();
  heading.textContent = mascot ? person.name + " " + divider + " " + mascot : person.name;
  card.append(heading);

  if (data.quote) {
    const quote = document.createElement("blockquote");
    quote.textContent = "“" + data.quote + "”";
    card.append(quote);
    if (data.quoteAuthor) {
      const author = document.createElement("p");
      author.className = "intro-author";
      author.textContent = "— " + data.quoteAuthor;
      card.append(author);
    }
  }
  return card;
}

function render() {
  const grid = document.getElementById("intro-grid");
  const status = document.getElementById("intro-status");
  const search = document.getElementById("intro-search").value.trim().toLowerCase();
  const sort = document.getElementById("intro-sort").value;

  let list = people.filter(function (p) {
    const text = (p.name + " " + (p.data.animal || "") + " " + (p.data.adjectives || "")).toLowerCase();
    return text.includes(search);
  });

  if (sort === "name") {
    list.sort(function (a, b) { return a.name.localeCompare(b.name); });
  } else {
    list.sort(function (a, b) { return b.updated > a.updated ? 1 : (b.updated < a.updated ? -1 : 0); });
  }

  grid.replaceChildren();
  list.forEach(function (p) { grid.append(makeCard(p)); });
  status.textContent = "Showing " + list.length + " of " + people.length + " classmates.";
}

async function loadIntroductions() {
  const status = document.getElementById("intro-status");
  try {
    const response = await fetch("https://intro-form.tommyhost.ing/");
    const all = await response.json();
    for (const username in all) {
      const record = all[username];
      if (!record || !record.introductionData) {
        continue;
      }
      people.push({
        name: buildName(record.introductionData, username),
        data: record.introductionData,
        updated: record.lastUpdated || ""
      });
    }
    render();
  } catch (problem) {
    status.textContent = "Sorry, the introductions could not be loaded right now.";
  }
}

document.getElementById("intro-search").addEventListener("input", render);
document.getElementById("intro-sort").addEventListener("change", render);
document.getElementById("intro-controls").addEventListener("submit", function (event) { event.preventDefault(); });
loadIntroductions();
