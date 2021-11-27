const btn = document.querySelector('.modal-btn');
const modal = document.querySelector('.modal');
const body = document.querySelector("body")
btn.addEventListener('click', function() {
  modal.style.display = 'block';
  body.classList.add("body-fixed")
});

var closeBtn = document.querySelector('.close-button');

closeBtn.addEventListener('click', function() {
  modal.style.display = 'none';
  body.classList.remove("body-fixed")
})

const card = document.querySelectorAll(".card");
const front = document.querySelectorAll(".front");
const back = document.querySelectorAll(".back");
setTimeout(()=>{
  for(let i=0; i < front.length; i++){

    back[i].classList.add("back-rotate");
    front[i].classList.add("front-rotate");
  }

},200)




