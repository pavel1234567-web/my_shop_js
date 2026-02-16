import products from "./products.js";

const container = document.getElementById("products");
const paginationContainer = document.createElement("nav");
paginationContainer.className = "my-4";
container.parentNode.appendChild(paginationContainer);

let itemsPerPage = getItemsPerPage();
let currentPage = 1;

// --- адаптивное количество карточек ---
function getItemsPerPage() {
  const width = window.innerWidth;
  if (width < 576) return 2;
  if (width < 768) return 2;
  if (width < 992) return 3;
  return 4;
}

// --- создаём карточку ---
function createCard(p) {
  return `
    <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4 list-item d-flex">
      <div class="card h-100 shadow-sm w-100">
        <img src="${p.image}" class="card-img-top img-fluid" alt="${p.name}">
        <div class="card-body">
          <h5 class="card-title name">${p.name}</h5>
          <p class="card-text text-success fw-bold price" data-price="${p.price}">${p.price} грн</p>
        </div>
      </div>
    </div>
  `;
}


// --- рендер страницы ---
function renderPage(page, listData = products) {
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  container.innerHTML = listData.slice(start, end).map(createCard).join("");
  renderPagination(listData);
}

// --- пагинация ---
function renderPagination(listData = products) {
  const totalPages = Math.ceil(listData.length / itemsPerPage);
  let html = '<ul class="pagination justify-content-center">';

  html += `<li class="page-item ${currentPage === 1 ? "disabled" : ""}">
            <a class="page-link" href="#" data-page="${currentPage - 1}">Предыдущая</a>
          </li>`;

  for (let i = 1; i <= totalPages; i++) {
    html += `<li class="page-item ${i === currentPage ? "active" : ""}">
               <a class="page-link" href="#" data-page="${i}">${i}</a>
             </li>`;
  }

  html += `<li class="page-item ${currentPage === totalPages ? "disabled" : ""}">
            <a class="page-link" href="#" data-page="${currentPage + 1}">Следующая</a>
          </li>`;
  html += "</ul>";

  paginationContainer.innerHTML = html;

  paginationContainer.querySelectorAll("a.page-link").forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const page = parseInt(link.getAttribute("data-page"));
      if (page >= 1 && page <= totalPages) {
        currentPage = page;
        renderPage(currentPage, window.filteredProducts || products);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });
}

// --- resize ---
window.addEventListener("resize", () => {
  const newItemsPerPage = getItemsPerPage();
  if (newItemsPerPage !== itemsPerPage) {
    itemsPerPage = newItemsPerPage;
    currentPage = 1;
    renderPage(currentPage, window.filteredProducts || products);
  }
});

// --- поиск ---
const searchInput = document.createElement("input");
searchInput.type = "text";
searchInput.placeholder = "Поиск по названию или цене...";
searchInput.className = "form-control mb-3";
container.parentNode.insertBefore(searchInput, container);

window.filteredProducts = products; // глобальный фильтр для пагинации

searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();
  window.filteredProducts = products.filter(
    p => p.name.toLowerCase().includes(query) || p.price.toString().includes(query)
  );
  currentPage = 1;
  renderPage(currentPage, window.filteredProducts);
});

// --- стартовая отрисовка ---
renderPage(currentPage);
