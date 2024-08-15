function setDynamicHeight() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    const headerElement = document.querySelector('.header');
    headerElement.innerHTML = 100 * vh;
}

window.addEventListener('resize', setDynamicHeight);
window.addEventListener('load', setDynamicHeight);

function testAddBooks(bookArray) {

}

function Book(name, author, pages, haveRead) {
    this.name = name;
    this.author = author;
    this.pages = pages;
    this.haveRead = haveRead;
}

const bookArray = [];

