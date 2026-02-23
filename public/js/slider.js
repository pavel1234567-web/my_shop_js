import products from "./products.js";

document.addEventListener("DOMContentLoaded", () => {
  const carouselInner = document.getElementById("carousel-inner");
  const maxSlides = 3;

  const sliderProducts = products.filter((p) => p.image).slice(0, maxSlides);

  sliderProducts.forEach((product, index) => {
    const div = document.createElement("div");
    div.className = "carousel-item" + (index === 0 ? " active" : "");

    const img = document.createElement("img");
    img.src = product.image;
    img.className = "d-block w-50 mx-auto";
    img.alt = product.name;

    // задаём размер
    img.style.height = "500px";
    img.style.objectFit = "cover";

    div.appendChild(img);
    carouselInner.appendChild(div);
  });

  const carouselElement = document.querySelector("#carouselExample");
  const carousel = new bootstrap.Carousel(carouselElement, {
    interval: 3000,
    ride: "carousel",
  });
});
