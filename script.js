// Get the button
let mybutton = document.getElementById("scrollToTopBtn");

// When the user scrolls down 200px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
    mybutton.style.display = "block";
    setTimeout(() => {
        mybutton.classList.add("show");
    }, 10); // A small delay to ensure the display property takes effect before the transition
  } else {
    mybutton.classList.remove("show");
    setTimeout(() => {
        mybutton.style.display = "none";
    }, 300); // Wait for the transition to finish before hiding
  }
}

// When the user clicks on the button, scroll to the top of the document with a smooth transition
mybutton.addEventListener('click', function() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});
