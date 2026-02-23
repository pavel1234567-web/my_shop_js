// import products from "./products.js";

// const slider = document.getElementById("product-slider");
// const maxSlides = 7;

// // 1️⃣ Добавляем карточки
// const sliderProducts = products.filter(p => p.image).slice(0, maxSlides);

// sliderProducts.forEach(product => {
//   const div = document.createElement("div");

//   div.innerHTML = `
//     <div class="card mx-2 g-3">
//       <img src="${product.image}" 
//            class="card-img-top img-fluid" 
//            alt="${product.name}" 
//            style="height:250px; object-fit:cover;">
//       <div class="card-body text-center">
//         <h5 class="card-title">${product.name}</h5>
//         <p class="card-text">${product.price} грн</p>
//       </div>
//     </div>
//   `;

//   slider.appendChild(div);
// });

// // 2️⃣ Инициализация Slick (без document.ready)
// if (window.$) {
//   $('#product-slider').slick({
//     slidesToShow: 3,
//     slidesToScroll: 1,
//     autoplay: true,
//     autoplaySpeed: 2000,
//     dots: true,
//     arrows: true,
//     responsive: [
//       {
//         breakpoint: 992,
//         settings: { slidesToShow: 2 }
//       },
//       {
//         breakpoint: 576,
//         settings: { slidesToShow: 1 , arrows: false}
        
//       }
//     ]
//   });
// }




import products from "./products.js";

const slider = document.getElementById("product-slider");
const maxSlides = 7;

// Дождемся полной загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
  if (!slider) {
    console.error('Элемент #product-slider не найден');
    return;
  }
  
  // 1️⃣ Очищаем слайдер
  slider.innerHTML = '';
  
  // 2️⃣ Фильтруем товары (только с фото)
  const sliderProducts = products
    .filter(p => p && p.image)
    .slice(0, maxSlides);
  
  // 3️⃣ Добавляем карточки
  sliderProducts.forEach(product => {
    const div = document.createElement("div");
    
    // 🔥 Берем цену с учетом акции из объекта product
    const priceDisplay = product.is_sale 
      ? `
        <div class="d-flex flex-column">
          <span class="badge bg-danger mb-2">Акция ${product.sale_percent}%</span>
          <span class="fw-bold text-success fs-5">${product.sale_price} грн</span>
          <span class="text-danger text-decoration-line-through small">${product.price} грн</span>
        </div>
      `
      : `<span class="fw-bold text-success fs-5">${product.price} грн</span>`;
    
    div.innerHTML = `
      <div class="card mx-2 h-100">
        <img src="${product.image}" 
             class="card-img-top" 
             alt="${product.name}" 
             style="height:200px; object-fit:cover;"
             onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'">
        <div class="card-body text-center">
          <h5 class="card-title">${product.name}</h5>
          <div class="price-container mt-3">
            ${priceDisplay}
          </div>
        </div>
      </div>
    `;
    
    slider.appendChild(div);
  });
  
  // 4️⃣ Инициализация Slick
  if (window.$ && slider.children.length > 0) {
    setTimeout(() => {
      $('#product-slider').slick({
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        dots: true,
        arrows: true,
        responsive: [
          {
            breakpoint: 992,
            settings: { slidesToShow: 2 }
          },
          {
            breakpoint: 576,
            settings: { 
              slidesToShow: 1, 
              arrows: false,
              dots: true
            }
          }
        ]
      });
    }, 100);
  }
});