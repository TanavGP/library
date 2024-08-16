function setDynamicViewport() {
    let vh = window.innerHeight * 0.01;
    let vw = window.innerWidth * 0.01;

    document.documentElement.style.setProperty('--vh', `${vh}px`);
    document.documentElement.style.setProperty('--vw', `${vw}px`);
}

window.addEventListener('resize', setDynamicViewport);
window.addEventListener('load', setDynamicViewport);
window.addEventListener('orientationchange', setDynamicViewport);

function Book(name, author, notes, haveRead, genre, pages, rating, id) {
    this.name = name;
    this.author = author;
    this.notes = notes;
    this.haveRead = haveRead;
    this.genre = genre;
    this.pages = pages;
    this.rating = rating;
    this.id = id;
}

const book1 = new Book(
    "The Name of the Wind",
    "Patrick Rothfuss",
    "A beautifully written tale of a young man's journey into legend.",
    true,
    "Horror",
    662,
    5,
    1
);

const book2 = new Book(
    "The Girl with the Dragon Tattoo",
    "Stieg Larsson",
    "A gripping thriller with complex characters and a dark plot.",
    true,
    "Thriller",
    465,
    4,
    2
);

const book3 = new Book(
    "Dune",
    "Frank Herbert",
    "A sci-fi epic set on a desert planet with political intrigue and adventure.",
    false,
    "Science Fiction",
    412,
    5,
    3
);

const book4 = new Book(
    "Lord of The Rings",
    "J.R.R Tolkien",
    "An epic journey through a richly detailed world of fantasy, friendship, and heroism. Tolkien's masterpiece is timeless and captivating.",
    true,
    "Epic Fantasy",
    252,
    5,
    4
);

let books = [book1, book2, book3, book4];
let idSelected = null;

function setSelectedBook(idToSelect)
{
    books.forEach(book => {
        if (idSelected !== null && book.id === idSelected) {
            const selectedBookElement = document.querySelector('#book-' + idSelected);
            selectedBookElement.classList.remove('selected');
        } 

        if (idToSelect === book.id) {
            const bookElementToSelect = document.querySelector('#book-' + idToSelect);
            bookElementToSelect.classList.add('selected');
        }
    })

    idSelected = idToSelect;
}


function addSelectionEventListener() {
    books.forEach(book => {
        const bookElement = document.querySelector('#book-' + book.id);
        bookElement.addEventListener('click', () => {
            setSelectedBook(book.id);
        })
    })
}

function removeBook() {
    if (idSelected === null) {
        return;
    }

    const bookElementToRemove = document.querySelector('.selected');
    bookElementToRemove.remove();

    books = books.filter(book => book.id !== idSelected);
    idSelected = null;
}

function addRemoveButtonEventListener() {
    const removeButtonElement = document.querySelector('.remove');
    removeButtonElement.addEventListener('click', removeBook);
}

function addAddButtonEventListener() {
    const addButtonElement = document.querySelector('.add');
    addButtonElement.addEventListener('click', loadAddBookContainer);
}

function swapColors(e) {
    const svgDiv = e.target.children[0];

    const svgColor = svgDiv.style.backgroundColor || window.getComputedStyle(svgDiv).backgroundColor;
    const targetColor = e.target.style.backgroundColor || window.getComputedStyle(e.target).backgroundColor;

    svgDiv.style.backgroundColor = targetColor;
    e.target.style.backgroundColor = svgColor;
}

function addControlHoverEventListener(controlElement) {
    controlElement.addEventListener('mouseenter', (e) => {
        swapColors(e);
        const textPara = e.target.children[1];
        textPara.style.color = "white";
    })

    controlElement.addEventListener('mouseleave', (e) => {
        swapColors(e);
        const textPara = e.target.children[1];
        textPara.style.color = "black";
    })
}

function addControlsHoverEventListener() {
    const removeButtonElement = document.querySelector('.remove');
    const addButtonElement = document.querySelector('.add');
    const editButtonElement = document.querySelector('.edit');

    [removeButtonElement, addButtonElement, editButtonElement].forEach(e => {
        addControlHoverEventListener(e);
    })
}

function addBookCard(book) 
{
    const booksContainer = document.querySelector('.books-container');
    const bookCard = document.createElement('div');
    bookCard.classList.add('book-card');
    bookCard.id = "book-" + book.id;

    const titleElement = document.createElement('div');
    titleElement.classList.add('title');
    const titlePElement = document.createElement('p');
    titlePElement.textContent = book.name;
    titleElement.appendChild(titlePElement);

    const haveReadButtonElement = document.createElement('button');
    if (book.haveRead) {
        haveReadButtonElement.classList.add('finished')
        const haveReadDiv = document.createElement('div');
        haveReadDiv.textContent = "Finished";
        const haveReadSVGDiv = document.createElement('div');
        haveReadSVGDiv.classList.add('svg', 'tick-svg');

        haveReadButtonElement.appendChild(haveReadDiv);
        haveReadButtonElement.appendChild(haveReadSVGDiv);
    } else {
        haveReadButtonElement.classList.add('unfinished');
        const haveReadDiv = document.createElement('div');
        haveReadDiv.textContent = "Ongoing";
        const haveReadSVGDiv = document.createElement('div');
        haveReadSVGDiv.classList.add('svg', 'cross-svg');

        haveReadButtonElement.appendChild(haveReadDiv);
        haveReadButtonElement.appendChild(haveReadSVGDiv);
    }
    titleElement.appendChild(haveReadButtonElement); // title element done

    const authorDivElement = document.createElement('div');
    authorDivElement.classList.add('author');
    authorDivElement.textContent = book.author; // author element done

    const notesElement = document.createElement('div');
    notesElement.classList.add('notes', 'non-selectable');
    notesElement.textContent = book.notes; // notes element done

    const extraInfoElement = document.createElement('div');
    extraInfoElement.classList.add('extra-info', 'non-selectable');

    const genreElement = document.createElement('div');
    genreElement.classList.add('genre');
    const genreSVGElement = document.createElement('div');
    genreSVGElement.classList.add('svg', book.genre.replace(/ /g, '-').toLowerCase() + '-svg');
    const genrePElement = document.createElement('p');
    genrePElement.textContent = book.genre;
    genreElement.appendChild(genreSVGElement);
    genreElement.appendChild(genrePElement);
    extraInfoElement.appendChild(genreElement);

    const pagesElement = document.createElement('div');
    pagesElement.classList.add('pages');
    const pagesSVGElement = document.createElement('div');
    pagesSVGElement.classList.add('svg', 'pages-svg');
    const pagesDivElement = document.createElement('div');
    pagesDivElement.classList.add('number');
    pagesDivElement.textContent = book.pages;
    pagesElement.appendChild(pagesSVGElement);
    pagesElement.appendChild(pagesDivElement);
    extraInfoElement.appendChild(pagesElement);

    const ratingElement = document.createElement('div');
    ratingElement.classList.add('rating');

    for (let i = 1; i <= book.rating; i++) {
        const starElement = document.createElement('div');
        starElement.classList.add('svg', 'star-svg');
        ratingElement.appendChild(starElement);
    }

    for (let i = 1; i <= 5 - book.rating; i++) {
        const starElement = document.createElement('div');
        starElement.classList.add('svg', 'empty-star-svg');
        ratingElement.appendChild(starElement);
    }
    extraInfoElement.appendChild(ratingElement); // extra-info element done

    bookCard.appendChild(titleElement);
    bookCard.appendChild(authorDivElement);
    bookCard.appendChild(notesElement);
    bookCard.appendChild(extraInfoElement); // Book card element done

    booksContainer.appendChild(bookCard); // Book Added
}

function loadBooks() {
    books.forEach(book => {
        addBookCard(book);
    });
}

function addControlButton(type) {
    const controlContainer = document.querySelector('.controls');

    const removeButtonElement = document.createElement('button');
    removeButtonElement.classList.add(`${type}`);

    const svgDiv = document.createElement('div');
    svgDiv.classList.add('svg', `${type}-svg`);
    const h5Element = document.createElement('h5');
    h5Element.textContent = type.toUpperCase();

    removeButtonElement.appendChild(svgDiv);
    removeButtonElement.appendChild(h5Element);

    controlContainer.appendChild(removeButtonElement);
}

function addControlButtons() {
    for (let i = 0; i < arguments.length; i++) {
        addControlButton(arguments[i]);
    }
}

function setContainerHeading(heading) {
    document.querySelector('.container-header').children[1].textContent = heading;
}

function unloadContainer() {
    const booksContainer = document.querySelector('.books-container');
    const controlsElement = document.querySelector('.controls');

    booksContainer.replaceChildren();
    controlsElement.replaceChildren();
}

function loadBookContainer() {
    unloadContainer();
    loadBooks();
    setContainerHeading('My Books');
    addControlButtons('remove', 'add', 'edit');
    addSelectionEventListener();
    addRemoveButtonEventListener();
    addAddButtonEventListener();
    addControlsHoverEventListener();
}

function loadAddBookContainer() {
    unloadContainer();
    setContainerHeading('Add Book');
    addControlButtons('cancel', 'confirm');
}


loadBookContainer();