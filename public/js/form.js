
const form = document.getElementById("contact-form");
const status = document.getElementById("status");
const submitBtn = document.getElementById("submit-btn");

form.addEventListener("submit", async e => {
  e.preventDefault();
  submitBtn.disabled = true;
  submitBtn.innerText = "Отправка...";
  const formData = new FormData(form);

  try {
    const response = await fetch(form.action, {
      method: "POST",
      body: formData,
      headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {
      status.innerHTML = '<div class="alert alert-success fs-5">Сообщение отправлено! Спасибо за обращение! Скоро мы с Вами свяжемся.</div>';
      form.reset();
    } else {
      status.innerHTML = '<div class="alert alert-danger">Ошибка отправки. Попробуйте позже.</div>';
    }
  } catch (error) {
    status.innerHTML = '<div class="alert alert-danger">Ошибка сети. Попробуйте позже.</div>';
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerText = "Отправить";
  }
});
