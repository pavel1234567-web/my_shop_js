export function initSortByPrice(products, onChangeCallback) {
  const sortSelect = document.getElementById("sortPrice");

  function update() {
    const value = sortSelect.value;
    let sorted = [...products];

    if (value === "asc") {
      sorted.sort((a, b) => a.price - b.price);
    }

    if (value === "desc") {
      sorted.sort((a, b) => b.price - a.price);
    }

    onChangeCallback(sorted);
  }

  sortSelect.addEventListener("change", update);

  return () => sortSelect.value;
}
