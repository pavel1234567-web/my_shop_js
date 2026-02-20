// Импорт массива товаров
import products from "./products.js";

// Импорт функции инициализации слайдера цены
import { initPriceSlider } from "./priceSlider.js";

// Импорт функции сортировки
import { initSortByPrice } from "./sortProducts.js";

// Контейнер, куда будут выводиться карточки товаров
const container = document.getElementById("products");

// Создаём контейнер для пагинации (кнопки страниц)
const paginationContainer = document.createElement("nav");
paginationContainer.className = "my-4";

// Добавляем блок пагинации после списка товаров
container.parentNode.appendChild(paginationContainer);

// ================= ПЕРЕМЕННЫЕ СОСТОЯНИЯ =================

// Текущий текст поиска
let currentSearch = "";

// Минимальная цена фильтра
let currentMin = 0;

// Максимальная цена фильтра
let currentMax = Infinity;

// Текущий тип сортировки (default / asc / desc)
let currentSort = "default";

// Текущая страница
let currentPage = 1;

// Количество товаров на странице (зависит от ширины экрана)
let itemsPerPage = getItemsPerPage();

// ================= ГЛАВНАЯ ФУНКЦИЯ ОБНОВЛЕНИЯ =================
function updateProducts() {
  // Фильтруем товары
  let result = products.filter((p) => {
    // Проверка по цене
    const matchesPrice = p.price >= currentMin && p.price <= currentMax;

    // Проверка по поиску (по названию или цене или артикулу)
    const matchesSearch =
      currentSearch === "" ||
      p.name.toLowerCase().includes(currentSearch) ||
      p.price.toString().includes(currentSearch) ||
      (p.article && p.article.toLowerCase().includes(currentSearch)); // поиск по артикулу

    const matchesCategory =
      !categoryFilter.value || p.category === categoryFilter.value;

    // Возвращаем только те товары, которые подходят под оба условия
    return matchesPrice && matchesSearch && matchesCategory;
  });

  // Сортировка по возрастанию цены
  if (currentSort === "asc") {
    result.sort((a, b) => a.price - b.price);
  }

  // Сортировка по убыванию цены
  if (currentSort === "desc") {
    result.sort((a, b) => b.price - a.price);
  }

  // Отрисовываем текущую страницу
  renderPage(currentPage, result);
}

// ================= АДАПТИВ (СКОЛЬКО ТОВАРОВ НА СТРАНИЦЕ) =================
function getItemsPerPage() {
  const width = window.innerWidth;

  // Маленькие телефоны
  if (width < 576) return 2;

  // Телефоны
  if (width < 768) return 2;

  // Планшеты
  if (width < 992) return 3;

  // Десктоп
  return 4;
}

// ================= СОЗДАНИЕ КАРТОЧКИ ТОВАРА =================
function createCard(p) {
  return `
    <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4 d-flex">
      <div class="card h-100 shadow-sm w-100">
        <img src="${p.image}" class="card-img-top img-fluid" alt="${p.name}">
        <div class="card-body">
          <h5 class="card-title">${p.name}</h5>
          <p class="card-text text-muted">Описание: ${p.description}</p>
          <p class="card-text text-muted">Артикул: ${p.article}</p>
          <p class="card-text text-success fw-bold">${p.price} грн</p>
          <p class="card-text text-success fw-bold">${p.category} </p>

        </div>
      </div>
    </div>
  `;
}

const categoryFilter = document.getElementById("categoryFilter");

// Получаем все уникальные категории из массива товаров
function initCategories() {
  const categories = [...new Set(products.map((p) => p.category))];
  categories.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });
}

// Добавляем фильтрацию по категории
categoryFilter.addEventListener("change", () => {
  currentPage = 1;
  updateProducts();
});

// ================= РЕНДЕР СТРАНИЦЫ =================
function renderPage(page, listData) {
  // Считаем общее количество страниц
  const totalPages = Math.ceil(listData.length / itemsPerPage);

  // Если текущая страница больше допустимой — сбрасываем на 1
  if (page > totalPages) currentPage = 1;

  // Определяем с какого элемента начинать
  const start = (currentPage - 1) * itemsPerPage;

  // До какого элемента показывать
  const end = start + itemsPerPage;

  // Вставляем нужную часть массива в HTML
  container.innerHTML = listData.slice(start, end).map(createCard).join("");

  // Обновляем пагинацию
  renderPagination(listData);
}

// ================= ПАГИНАЦИЯ =================
function renderPagination(listData) {
  const totalPages = Math.ceil(listData.length / itemsPerPage);

  // Если всего одна страница — пагинацию не показываем
  if (totalPages <= 1) {
    paginationContainer.innerHTML = "";
    return;
  }

  let html = '<ul class="pagination justify-content-center">';

  // ----- КНОПКА НАЗАД -----
  html += `
    <li class="page-item ${currentPage === 1 ? "disabled" : ""}">
      <a class="page-link" href="#" data-page="${currentPage - 1}">
        Назад
      </a>
    </li>
  `;

  // ----- НОМЕРА СТРАНИЦ -----
  for (let i = 1; i <= totalPages; i++) {
    html += `
      <li class="page-item ${i === currentPage ? "active" : ""}">
        <a class="page-link" href="#" data-page="${i}">${i}</a>
      </li>
    `;
  }

  // ----- КНОПКА ВПЕРЁД -----
  html += `
    <li class="page-item ${currentPage === totalPages ? "disabled" : ""}">
      <a class="page-link" href="#" data-page="${currentPage + 1}">
        Вперед
      </a>
    </li>
  `;

  html += "</ul>";

  paginationContainer.innerHTML = html;

  // Обработчик клика по страницам
  paginationContainer.querySelectorAll("a.page-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      const page = parseInt(link.dataset.page);

      // Проверяем корректность страницы
      if (page >= 1 && page <= totalPages) {
        currentPage = page;
        updateProducts();

        // Плавная прокрутка вверх
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  });
}

// ================= ПОИСК =================

// Создаём поле поиска динамически
const searchInput = document.createElement("input");
searchInput.type = "text";
searchInput.placeholder = "Поиск по названию, цене или артикулу...";
searchInput.className = "form-control mb-3 w-50 mx-auto";

// Вставляем поле перед списком товаров
container.parentNode.insertBefore(searchInput, container);

// Обработчик ввода
searchInput.addEventListener("input", () => {
  currentSearch = searchInput.value.toLowerCase().trim();
  currentPage = 1;
  updateProducts();
});

// ================= ИНИЦИАЛИЗАЦИЯ ФИЛЬТРОВ =================

// Слайдер цены
initPriceSlider(products, (min, max) => {
  currentMin = min;
  currentMax = max;
  currentPage = 1;
  updateProducts();
});

// Сортировка
initSortByPrice(products, () => {
  currentSort = document.getElementById("sortPrice").value;
  currentPage = 1;
  updateProducts();
});

// ================= ОТСЛЕЖИВАНИЕ ИЗМЕНЕНИЯ РАЗМЕРА ЭКРАНА =================
window.addEventListener("resize", () => {
  const newItems = getItemsPerPage();

  // Если количество карточек изменилось — перерисовываем
  if (newItems !== itemsPerPage) {
    itemsPerPage = newItems;
    currentPage = 1;
    updateProducts();
  }
});

// ================= ЗАПУСК ПРИ ЗАГРУЗКЕ =================
initCategories();
updateProducts();
