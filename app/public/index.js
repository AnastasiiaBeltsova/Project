let menu_burger = document.querySelector('.menu__burger');
let menu_list = document.querySelector('.menu__list');
let close = document.querySelector('.menu__list-close') 

menu_burger.addEventListener("click", () => {
    menu_list.classList.add("menu__list--active");
})
close.addEventListener("click", () => {
    menu_list.classList.remove("menu__list--active");
})