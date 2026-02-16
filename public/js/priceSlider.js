export function initPriceSlider(products, onChangeCallback) {
  const minInput = document.getElementById("minPrice");
  const maxInput = document.getElementById("maxPrice");
  const label = document.getElementById("priceLabel");

  // задаём максимальное значение слайдера по товарам
  const maxPrice = Math.max(...products.map(p => p.price));
  maxInput.max = maxPrice;
  maxInput.value = maxPrice;

  function update() {
    let min = parseFloat(minInput.value);
    let max = parseFloat(maxInput.value);

    // защита: min не больше max
    if (min > max) {
      [min, max] = [max, min];
    }

    label.textContent = `${min} - ${max} грн`;

    onChangeCallback(min, max);
  }

  minInput.addEventListener("input", update);
  maxInput.addEventListener("input", update);

  // возвращаем функцию для получения текущего диапазона
  return () => ({
    min: parseFloat(minInput.value),
    max: parseFloat(maxInput.value)
  });
}
