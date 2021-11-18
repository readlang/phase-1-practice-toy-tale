let addToy = false;
let toyNumber = 1

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});

loadFromServer()

function loadFromServer() {
  fetch("http://localhost:3000/toys")
  .then(res => res.json())
  .then(data => {
    data.forEach(element => makeToyCard(element) )
    });
} 

function makeToyCard(object) {
  const card = document.createElement("div")
  card.className = ("card")
  card.innerHTML = 
    `<h2>${object.name}</h2> 
    <img src=${object.image} class="toy-avatar" />
    <p id=likes-${object.id} >${object.likes} Likes</p>
    <button class="like-btn" id=${object.id}>Like</button>`
  document.getElementById("toy-collection").append(card)
  toyNumber++;
  document.getElementById(object.id).addEventListener("click", () => incrementLikes(object.id))
}

function incrementLikes(id) {
  const target = document.getElementById(`likes-${id}`)
  const likes = parseInt( target.textContent.split(" ")[0] )
  fetch(`http://localhost:3000/toys/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({ "likes":(likes + 1)})
  })
  .then(res => res.json())
  .then(data => {
    target.textContent = `${data.likes} Likes`
  })
}

document.getElementsByClassName("add-toy-form")[0].addEventListener("submit", addNewToy)

function addNewToy(event) {
  event.preventDefault()
  const object = {
    id: toyNumber, 
    name: document.getElementsByClassName("add-toy-form")[0][0].value,
    image: document.getElementsByClassName("add-toy-form")[0][1].value,
    likes: 0
  }

  fetch(`http://localhost:3000/toys/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify( object )
  })
  .then(res => res.json())
  .then(data => { console.log(data) })
  
  makeToyCard(object)
}