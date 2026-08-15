document.getElementById("contactForm")
.addEventListener("submit", function(e){

e.preventDefault();

alert("Votre message a été envoyé avec succès.");

this.reset();

});

const observer = new IntersectionObserver(entries => {

entries.forEach(entry => {

if(entry.isIntersecting){
entry.target.classList.add("show");
}

});

});

document.querySelectorAll(".fade").forEach(el => {
observer.observe(el);
});