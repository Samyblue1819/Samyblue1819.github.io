// Home page slideshow: steps through shop photos with Previous and Next buttons.

// Each slide has a photo, alt text for screen readers, and a caption.
const slides = [
  { src: "images/hero-glossy-red-car.jpg", alt: "Glossy red car with a mirror-like paint finish", caption: "Fresh skin, same ride." },
  { src: "images/spray-booth-painting.jpg", alt: "Technician spray painting a car with a paint gun in a workshop", caption: "Color goes on in thin, even coats." },
  { src: "images/polished-car-reflection.jpg", alt: "Close up of polished car paint reflecting lights", caption: "Polished until it reflects like glass." },
  { src: "images/shop-owner-sanding.jpg", alt: "Close up of a car being polished by hand", caption: "Hands-on care on every panel." },
  { src: "images/garage-at-night.jpg", alt: "Car service shop lit up at night", caption: "Open late for after-work drop offs." }
];

let currentSlide = 0;

const slideImage = document.getElementById("slide-image");
const slideCaption = document.getElementById("slide-caption");
const slideCount = document.getElementById("slide-count");

// Shows the slide at the given position, wrapping around at either end.
function showSlide(position) {
  currentSlide = (position + slides.length) % slides.length;
  const slide = slides[currentSlide];
  slideImage.src = slide.src;
  slideImage.alt = slide.alt;
  slideCaption.textContent = slide.caption;
  slideCount.textContent = (currentSlide + 1) + " of " + slides.length;
}

document.getElementById("slide-prev").addEventListener("click", function () {
  showSlide(currentSlide - 1);
});

document.getElementById("slide-next").addEventListener("click", function () {
  showSlide(currentSlide + 1);
});
