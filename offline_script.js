const $alert = document.createElement("div");
$alert.id = "offline";
$alert.classList = "alert alert-danger text-center h5";
$alert.textContent = "No connection";

window.addEventListener("offline", (e) => {
  document.querySelector("body").insertAdjacentElement("afterbegin", $alert);
});
window.addEventListener("online", (e) => {
  $alert.classList = "alert alert-success text-center h5";
  $alert.textContent = "Connected";
  setTimeout(() => {
    $alert.style.display = "none";
  }, 2000);
});
