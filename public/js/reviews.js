import { reviews } from "./reviewsData.js";

const track = document.getElementById("carouselTrack");
const dotsContainer = document.getElementById("carouselDots");
const prevBtn = document.getElementById("prevReview");
const nextBtn = document.getElementById("nextReview");

let currentIndex = 0;
let autoSlide;
let perView = getPerView(); // теперь динамический

// 🔥 Определяем количество карточек
function getPerView() {
  if (window.innerWidth >= 992) return 3; // desktop
  if (window.innerWidth >= 600) return 2; // tablet
  return 1; // mobile
}

function renderReviews() {
  track.innerHTML = "";

  for (let i = 0; i < perView; i++) {
    // если индекс выходит за массив — берём с начала
    const review = reviews[(currentIndex + i) % reviews.length];

    const card = document.createElement("div");
    card.className = "review-card";

    // card.innerHTML = `
    //    ${review.photo ? `<img src="${review.photo}" alt="${review.name}">` : ""}
    //   <h4>${review.name || ""}</h4>
    //   ${review.username ? `<small>${review.username}</small>` : ""}
    //   <p>${review.text}</p>
    // `;

    card.innerHTML = `
    <h5>${review.username }</h5>
      <p>${review.text}</p>

      
      
    `;

    track.appendChild(card);
  }
  renderDots(); // обновляем дотсы
}

// 🔹 Создание точек
function renderDots() {
  dotsContainer.innerHTML = "";
  for (let i = 0; i < reviews.length; i++) {
    const dot = document.createElement("span");
    dot.className = "dot";
    if (i === currentIndex) dot.classList.add("active");

    dot.addEventListener("click", () => {
      currentIndex = i;
      renderReviews();
      resetAutoSlide();
    });

    dotsContainer.appendChild(dot);
  }
}

// 🔹 Кнопки

function nextSlide() {
  currentIndex = (currentIndex + 1) % reviews.length;
  renderReviews();
}

function prevSlide() {
  currentIndex =
    (currentIndex - 1 + reviews.length) % reviews.length;
  renderReviews();
}

function startAutoSlide() {
  autoSlide = setInterval(nextSlide, 5000);
}

function resetAutoSlide() {
  clearInterval(autoSlide);
  startAutoSlide();
}

prevBtn.addEventListener("click", () => {
  prevSlide();
  resetAutoSlide();
});

nextBtn.addEventListener("click", () => {
  nextSlide();
  resetAutoSlide();
});

track.addEventListener("mouseenter", () => clearInterval(autoSlide));
track.addEventListener("mouseleave", startAutoSlide);

// 🔥 Перерисовка при изменении размера
window.addEventListener("resize", () => {
  const newPerView = getPerView();

  if (newPerView !== perView) {
    perView = newPerView;
    renderReviews();
  }
});

// INIT
renderReviews();
startAutoSlide();
