// introduction.js: makes the Introduction Form work.
// It validates the form, adds and removes course fields, clears and resets the form,
// and on Submit replaces the form with an introduction built from what was entered.

const formElement = document.getElementById("form");
const coursesBox = document.getElementById("courses");
const addCourseButton = document.getElementById("add-course");
const clearButton = document.getElementById("clear");
const main = document.querySelector("main");
const formHeading = main.querySelector("h3");
const defaultImage = "images/intro-photo.jpg";

// Saved at load so Reset can bring back the original four courses.
const defaultCoursesHTML = coursesBox.innerHTML;
let originalFooterLinks = null;

// Prevents page refresh / default submit behavior.
formElement.addEventListener("submit", (e) => e.preventDefault());

// Stops the form from submitting without the required information.
// Fields that only contain spaces count as empty.
function validateForm() {
  formElement.querySelectorAll("[required]").forEach((field) => {
    if (field.value.trim() === "") {
      field.value = "";
    }
  });
  return formElement.reportValidity();
}

// Adds a delete button that removes the course it sits beside.
function addDeleteButton(course) {
  let button = course.querySelector(".delete-course");
  if (!button) {
    button = document.createElement("button");
    button.type = "button";
    button.className = "delete-course";
    button.textContent = "Delete";
    course.appendChild(button);
  }
  button.addEventListener("click", () => course.remove());
}

// Adds a new, empty set of course text boxes.
function addCourse() {
  const course = document.createElement("fieldset");
  course.className = "course";
  const fields = [
    ["department", "Department", "Department"],
    ["courseNumber", "Number", "Course number"],
    ["courseTitle", "Course name", "Course name"],
    ["reasonForTaking", "Why you're taking it", "Reason for taking"]
  ];
  fields.forEach(([name, placeholder, label]) => {
    const input = document.createElement("input");
    input.type = "text";
    input.name = name;
    input.placeholder = placeholder;
    input.setAttribute("aria-label", label);
    input.required = true;
    course.appendChild(input);
  });
  addDeleteButton(course);
  coursesBox.appendChild(course);
}

// Gives every course on the page a working delete button.
function setUpCourseButtons() {
  coursesBox.querySelectorAll(".course").forEach(addDeleteButton);
}

// Empties every field in the form.
function clearForm() {
  formElement.querySelectorAll("input, textarea").forEach((field) => {
    field.value = "";
  });
}

// Resets the form's progress: original values and the original four courses.
function resetForm() {
  coursesBox.innerHTML = defaultCoursesHTML;
  setUpCourseButtons();
}

// Shortcut for making an element with optional text.
function make(tag, text) {
  const el = document.createElement(tag);
  if (text !== undefined) {
    el.textContent = text;
  }
  return el;
}

// Makes a list item like: <strong>Label:</strong> value
function bullet(label, value) {
  const li = make("li");
  li.appendChild(make("strong", label + ":"));
  li.appendChild(document.createTextNode(" " + value));
  return li;
}

// Gathers the form data and shows the introduction in place of the form.
function showIntroduction() {
  const get = (name) => formElement.elements[name].value.trim();
  const output = [];

  // Name line, e.g. Sameer Sohail ~ Sandy Snake
  const nameParts = [get("firstName")];
  if (get("middleName")) {
    nameParts.push(get("middleName"));
  }
  if (get("nickname")) {
    nameParts.push("“" + get("nickname") + "”");
  }
  nameParts.push(get("lastName"));
  output.push(make("h6", nameParts.join(" ") + " " + get("prettyNameDivider") + " " +
    get("adjectives") + " " + get("animal")));

  // Picture: my picture unless the visitor uploaded their own.
  const figure = make("figure");
  const img = make("img");
  const upload = formElement.elements.img.files[0];
  if (upload) {
    img.src = URL.createObjectURL(upload);
  } else {
    img.src = defaultImage;
    img.width = 800;
    img.height = 1067;
  }
  img.alt = get("pictureAlt");
  figure.appendChild(img);
  figure.appendChild(make("figcaption", get("caption")));
  output.push(figure);

  output.push(make("p", get("statement")));

  // Main bullets
  const list = make("ul");
  list.appendChild(bullet("Personal Background", get("personalBackground")));
  list.appendChild(bullet("Professional Background", get("professionalBackground")));
  list.appendChild(bullet("Academic Background", get("academicBackground")));
  list.appendChild(bullet("Primary Work Computer", get("primaryWorkComputer")));
  list.appendChild(bullet("Primary Work Location", get("primaryWorkLocation")));
  list.appendChild(bullet("Alternate Computer & Location", get("alternateComputerLocation")));

  // Courses, with ITIS 3135 linking to the course contract like on my introduction page.
  const coursesItem = make("li");
  coursesItem.appendChild(make("strong", "Courses I'm Taking, & Why:"));
  const courseList = make("ol");
  coursesBox.querySelectorAll(".course").forEach((course) => {
    const value = (name) => course.querySelector(`[name="${name}"]`).value.trim();
    const li = make("li");
    const courseName = value("department") + " " + value("courseNumber") + " - " + value("courseTitle");
    if (value("department").toUpperCase() === "ITIS" && value("courseNumber") === "3135") {
      const link = make("a", courseName);
      link.href = "contract.html";
      li.appendChild(link);
    } else {
      li.appendChild(document.createTextNode(courseName));
    }
    li.appendChild(document.createTextNode(": " + value("reasonForTaking")));
    courseList.appendChild(li);
  });
  coursesItem.appendChild(courseList);
  list.appendChild(coursesItem);

  // Optional extras only show up when filled in.
  if (get("funnyItem")) {
    list.appendChild(bullet("Funny Thing", get("funnyItem")));
  }
  if (get("somethingToShare")) {
    list.appendChild(bullet("Something I'd Like to Share", get("somethingToShare")));
  }
  output.push(list);

  // Quote
  const quote = make("blockquote");
  quote.appendChild(make("p", "“" + get("quote") + "”"));
  quote.appendChild(make("p", "-" + get("quoteAuthor")));
  output.push(quote);

  // Reset link so the visitor can do it again.
  const resetParagraph = make("p");
  const resetLink = make("a", "Reset and fill out the form again");
  resetLink.href = "#";
  resetLink.addEventListener("click", (e) => {
    e.preventDefault();
    output.forEach((el) => el.remove());
    restoreFooterLinks();
    formHeading.hidden = false;
    formElement.hidden = false;
    formElement.reset();
  });
  resetParagraph.appendChild(resetLink);
  output.push(resetParagraph);

  updateFooterLinks();
  formHeading.hidden = true;
  formElement.hidden = true;
  output.forEach((el) => main.appendChild(el));
  window.scrollTo(0, 0);
}

// Puts the links from the form into the footer.
function updateFooterLinks() {
  const footerLinks = document.querySelectorAll("footer nav a");
  if (originalFooterLinks === null) {
    originalFooterLinks = Array.from(footerLinks).map((a) => a.href);
  }
  const fields = formElement.querySelectorAll('[name="footerLinks"]');
  footerLinks.forEach((a, i) => {
    if (fields[i] && fields[i].value.trim()) {
      a.href = fields[i].value.trim();
    }
  });
}

// Puts the footer links back the way they were.
function restoreFooterLinks() {
  if (originalFooterLinks === null) {
    return;
  }
  document.querySelectorAll("footer nav a").forEach((a, i) => {
    a.href = originalFooterLinks[i];
  });
}

formElement.addEventListener("submit", () => {
  if (validateForm()) {
    showIntroduction();
  }
});

// The Reset button restores the original values; this also brings back the original courses.
formElement.addEventListener("reset", resetForm);

addCourseButton.addEventListener("click", addCourse);
clearButton.addEventListener("click", clearForm);
setUpCourseButtons();
