function setDynamicViewport() {
    let vh = window.innerHeight * 0.01;
    let vw = window.innerWidth * 0.01;

    document.documentElement.style.setProperty('--vh', `${vh}px`);
    document.documentElement.style.setProperty('--vw', `${vw}px`);

    const headerElement = document.querySelector('.header');
    headerElement.innerHTML = String(vw) + ", " + String(vh);
}

window.addEventListener('resize', setDynamicViewport);
window.addEventListener('load', setDynamicViewport);

function testAddBooks(bookArray) {

}

function Book(name, author, pages, haveRead) {
    this.name = name;
    this.author = author;
    this.pages = pages;
    this.haveRead = haveRead;
}

const bookArray = [];

