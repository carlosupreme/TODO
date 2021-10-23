const d = document,
  $form = d.querySelector("form"),
  $table = d.querySelector("table"),
  $resetBtn = d.querySelector("#reset")

let list = [];
let id = 0;

document.addEventListener("DOMContentLoaded", ()=>{
  registerSW()
  showLS()
});

$resetBtn.addEventListener("click",e=>{
  list.forEach(el=>el.status = false)
  save()
})

$form.addEventListener("submit", (e) => {
  e.preventDefault();
  addItem({
    id: id++,
    name: $form.actividad.value,
    sets: $form.sets.value,
    reps: $form.reps.value,
    weight: $form.weight.value,
    status: false,
  });

  save();
  $form.reset();
  $form.name.focus();
});

// functions

function addItem({ id, name, sets, reps, weight, status }) {
  const item = {
    id,
    name,
    reps,
    sets,
    weight: `${weight} kg`,
    status,
  };

  list.push(item);
  return item;
}

function save(item) {
  localStorage.setItem("lista", JSON.stringify(list));
  showLS();
}

function showLS() {
  $table.querySelector("tbody").innerHTML = "";

  list = JSON.parse(localStorage.getItem("lista")) || [];

  if (list) {
    list.forEach((el) => {
      let row = $table.querySelector("tbody").insertRow();
      row.id = el.id;
      row.classList = el.status
        ? "text-center alert alert-success"
        : "text-center alert alert-danger";
      row.innerHTML = `
      <td>${el.name}</td>
      <td>${el.reps}</td>
      <td>${el.sets}</td>
      <td>${el.weight}</td>
      <td ></td>
      `;

      const $deleteBtn = document.createElement("button");
      $deleteBtn.classList = "btn btn-danger mx-1 fas fa-trash";
      const $editBtn = document.createElement("button");
      $editBtn.classList = "btn btn-success mx-1 fas fa-check";

      row.lastElementChild.appendChild($editBtn);
      row.lastElementChild.appendChild($deleteBtn);

      $deleteBtn.addEventListener("click", (e) =>
        remove(e.path[2].getAttribute("id"))
      );

      $editBtn.addEventListener("click", (e) =>
        edit(e.path[2].getAttribute("id"))
      );
    });
  }
}

function remove(rowID) {
  let index;
  list.forEach((el, i) => {
    if (el.id == rowID) index = i;
  });

  list.splice(index, 1);
  save();
}

function edit(rowID) {
  let index = list.findIndex((el) => el.id == rowID);

  list[index].status = true;
  save();
}

async function registerSW(){
  if("serviceWorker" in navigator){
    try {
      await navigator.serviceWorker.register("./sw.js");
    } catch (err) {
      console.log(err);
    }
  }
}