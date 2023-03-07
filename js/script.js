//*-------------------* kahmah_-_all_-_rigths_-_reserved *--------------------*//

console.log("kahmah_-_pro");

window.addEventListener("load", function() {
    // -----Animate On Scroll -------//
    AOS.init();
});

window.addEventListener("scroll", function() {
    var header = document.querySelector("header")
    header.classList.toggle("sticky", window.scrollY > 0);
})

function toggleMenu() {
    var menuToggle = document.querySelector(".toggle");
    var menu = document.querySelector(".menu");
    menuToggle.classList.toggle("active");
    menu.classList.toggle("active");
}

const faqs = document.querySelectorAll(".faq");

faqs.forEach((faq) => {
    faq.addEventListener("click", () => {
        faq.classList.toggle("active");
    })
})