// Services page estimate calculator: shows a price range for the chosen service and vehicle size.
// Prices are made up for this project.

// Base price range (low and high) in dollars for a small car.
const servicePrices = {
  correction: { name: "Paint Correction", low: 300, high: 600 },
  spot: { name: "Spot Repair", low: 250, high: 500 },
  clear: { name: "Clear Coat Restoration", low: 800, high: 1500 },
  respray: { name: "Full Respray", low: 3000, high: 6000 },
  ceramic: { name: "Ceramic Coating", low: 500, high: 1000 }
};

// Bigger vehicles have more surface to sand and paint, so the price goes up.
const sizeMultipliers = {
  small: 1,
  medium: 1.25,
  large: 1.5
};

// Rounds a price to the nearest 10 dollars and adds a dollar sign and commas.
function formatPrice(amount) {
  const rounded = Math.round(amount / 10) * 10;
  return "$" + rounded.toLocaleString("en-US");
}

document.getElementById("estimate-form").addEventListener("submit", function (event) {
  event.preventDefault(); // stay on the page instead of reloading

  const service = servicePrices[document.getElementById("service-choice").value];
  const multiplier = sizeMultipliers[document.getElementById("size-choice").value];

  const lowPrice = formatPrice(service.low * multiplier);
  const highPrice = formatPrice(service.high * multiplier);

  document.getElementById("estimate-result").textContent =
    service.name + ": about " + lowPrice + " to " + highPrice + ". Final price is set after a free inspection.";
});
