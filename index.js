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

let books = getBooksFromLocalStorage();
let idSelected = null;
let genres = [
    "Epic Fantasy",
    "Horror",
    "Science Fiction",
    "Drama",
    "Romance",
    "Action",
    "Comedy",
    "Thriller"
];

function saveBooksToLocalStorage() {
    const booksJSON = JSON.stringify(books);
    localStorage.setItem('books', booksJSON);
}

function getBooksFromLocalStorage() {
    const booksJSON = localStorage.getItem('books');
    return booksJSON ? JSON.parse(booksJSON) : [];
}

function setSelectedBook(idToSelect)
{
    if (idToSelect === idSelected) {
        deselectBook();
        return;
    }

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

function deselectBook() {
    if (idSelected === null) {
        return;
    }

    const selectedBookElement = document.querySelector('#book-' + idSelected);
    selectedBookElement.classList.remove('selected');
    idSelected = null;
}

function addSelectionEventListener() {
    books.forEach(book => {
        const bookElement = document.querySelector('#book-' + book.id);
        bookElement.addEventListener('click', (event) => {
            event.stopPropagation();
            setSelectedBook(book.id);
        })
    })
}

function addDocumentDeselectionEventListener() {
    document.addEventListener('click', () => {
        deselectBook();
    });
}

function normalizeIds() {
    for (let id = 1; id <= books.length; id++) {
        books[id - 1].id = id; 
    }
}

function removeBook() {
    if (idSelected === null) {
        return;
    }

    const bookElementToRemove = document.querySelector('.selected');
    bookElementToRemove.remove();

    books = books.filter(book => book.id !== idSelected);
    idSelected = null;

    normalizeIds();
    saveBooksToLocalStorage()
    loadBookContainer();
}

function addRemoveButtonEventListener() {
    const removeButtonElement = document.querySelector('.remove');
    removeButtonElement.addEventListener('click', removeBook);
}

function addAddButtonEventListener() {
    const addButtonElement = document.querySelector('.add');
    addButtonElement.addEventListener('click', loadAddBookContainer);
}

function addEditButtonEventListener() {
    const editButtonElement = document.querySelector('.edit');
    editButtonElement.addEventListener('click', loadEditBookContainer); 
}

function addCancelButtonEventListener() {
    const cancelButtonElement = document.querySelector('.cancel');
    cancelButtonElement.addEventListener('click', cancelAddBook);
}

function addConfirmButtonEventListener() {
    const confirmButtonElement = document.querySelector('.confirm');
    confirmButtonElement.addEventListener('click', addBook);
}

function addResetButtonEventListener() {
    const resetButtonElement = document.querySelector('.reset');
    resetButtonElement.addEventListener('click', resetAddBook);
}

function swapColors(e) {
    const svgDiv = e.target.children[0];
    const textPara = e.target.children[1];

    const svgColor = svgDiv.style.backgroundColor || window.getComputedStyle(svgDiv).backgroundColor;
    const targetColor = e.target.style.backgroundColor || window.getComputedStyle(e.target).backgroundColor;

    textPara.style.color = targetColor;
    svgDiv.style.backgroundColor = targetColor;
    e.target.style.backgroundColor = svgColor;
}

function addControlHoverEventListener(controlElement) {
    controlElement.addEventListener('mouseenter', (e) => {
        swapColors(e);
    })

    controlElement.addEventListener('mouseleave', (e) => {
        swapColors(e);
    })
}

function addControlsHoverEventListener() {
    const controlsArray = document.querySelector('.controls').children;
    Array.from(controlsArray).forEach(e => {
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

function loadFormContainer(id = 0) {
    let book;
    if (id === 0) {
        idSelected = null;
        book = new Book("", "", "", false, "", 0, 0, books.length + 1);
    }
    else {
        books.forEach(currBook => {
            if (currBook.id === id) {
                book = currBook;
            }
        })
    }

    const booksContainerElement = document.querySelector('.books-container');

    const formElement = document.createElement('form');

    const titleDiv = document.createElement('div');
    const titleLabel = document.createElement('label');
    titleLabel.setAttribute('for', 'title');
    titleLabel.textContent = 'Book Title';
    const titleInput = document.createElement('input');
    titleInput.setAttribute('type', 'text');
    titleInput.setAttribute('placeholder', 'The Green Mile');
    titleInput.setAttribute('id', 'title');
    titleDiv.appendChild(titleLabel);
    titleInput.value = book.name;
    titleDiv.appendChild(titleInput);                        // title finished

    const authorNameDiv = document.createElement('div');
    const authorNameLabel = document.createElement('label');
    authorNameLabel.setAttribute('for', 'author-name');
    authorNameLabel.textContent = 'Author Name';
    const authorNameInput = document.createElement('input');
    authorNameInput.setAttribute('type', 'text');
    authorNameInput.setAttribute('placeholder', 'Stephen King');
    authorNameInput.setAttribute('id', 'author-name');
    authorNameDiv.appendChild(authorNameLabel);
    authorNameInput.value = book.author;
    authorNameDiv.appendChild(authorNameInput);                  // author name finished

    const notesDiv = document.createElement('div');
    const notesLabel = document.createElement('label');
    notesLabel.setAttribute('for', 'notes');
    notesLabel.textContent = 'Notes';
    const notesTextArea = document.createElement('textarea');
    notesTextArea.setAttribute('placeholder', 'Very well written book, a must read!');
    notesTextArea.setAttribute('id', 'notes');
    notesDiv.appendChild(notesLabel);
    notesTextArea.value = book.notes;
    notesDiv.appendChild(notesTextArea);                    // notes finished

    const pagesDiv = document.createElement('div');
    const pagesLabel = document.createElement('label');
    pagesLabel.setAttribute('for', 'number');
    pagesLabel.textContent = 'Page Count';
    const pagesInput = document.createElement('input');
    pagesInput.setAttribute('type', 'number');
    pagesInput.setAttribute('placeholder', '200');
    pagesInput.setAttribute('id', 'number');
    pagesInput.setAttribute('min', '1');
    pagesDiv.appendChild(pagesLabel);
    if (book.pages !== 0)
        pagesInput.value = book.pages   
    pagesDiv.appendChild(pagesInput);                 // pages finished   

    const finishedFieldset = document.createElement('fieldset');
    const finishedLegend = document.createElement('legend');
    finishedLegend.textContent = "Finished?";
    const finishedContainer = document.createElement('div');
    finishedContainer.classList.add('finished-container');

    // "Finished" radio button
    const finishedRadio1 = document.createElement('div');
    finishedRadio1.classList.add('finished-radio');

    const finishedInput1 = document.createElement('input');
    finishedInput1.setAttribute('type', 'radio');
    finishedInput1.setAttribute('id', 'Finished');
    finishedInput1.setAttribute('name', 'finished');
    finishedInput1.setAttribute('value', 'true');
    if (book.haveRead) {
        finishedInput1.checked = true;
    } else {
        finishedInput1.checked = false;
    }

    const finishedLabel1 = document.createElement('label');
    finishedLabel1.setAttribute('for', 'Finished');

    const finishedSVGDiv1 = document.createElement('div');
    finishedSVGDiv1.classList.add('svg', 'tick-svg');

    const finishedText1 = document.createElement('div');
    finishedText1.textContent = "Finished";

    finishedLabel1.appendChild(finishedSVGDiv1);
    finishedLabel1.appendChild(finishedText1);
    finishedRadio1.appendChild(finishedInput1);
    finishedRadio1.appendChild(finishedLabel1);

    // "Ongoing" radio button
    const finishedRadio2 = document.createElement('div');
    finishedRadio2.classList.add('finished-radio');

    const finishedInput2 = document.createElement('input');
    finishedInput2.setAttribute('type', 'radio');
    finishedInput2.setAttribute('id', 'Ongoing');
    finishedInput2.setAttribute('name', 'finished');
    finishedInput2.setAttribute('value', 'false');
    if (!book.haveRead) {
        finishedInput2.checked = true;
    } else {
        finishedInput2.checked = false;
    }

    const finishedLabel2 = document.createElement('label');
    finishedLabel2.setAttribute('for', 'Ongoing');

    const finishedSVGDiv2 = document.createElement('div');
    finishedSVGDiv2.classList.add('svg', 'cross-svg');

    const finishedText2 = document.createElement('div');
    finishedText2.textContent = "Ongoing";

    finishedLabel2.appendChild(finishedSVGDiv2);
    finishedLabel2.appendChild(finishedText2);
    finishedRadio2.appendChild(finishedInput2);
    finishedRadio2.appendChild(finishedLabel2);

    finishedContainer.appendChild(finishedRadio1);
    finishedContainer.appendChild(finishedRadio2);

    finishedFieldset.appendChild(finishedLegend);
    finishedFieldset.appendChild(finishedContainer);

    // HAVE READ FINISHED ABOVE

    const genreFieldset = document.createElement('fieldset');
    const genreLegend = document.createElement('legend');
    genreLegend.textContent = "Genre";
    genreFieldset.appendChild(genreLegend);

    genres.forEach(genre => {
        const customRadio = document.createElement('div');
        customRadio.classList.add('custom-radio');
        const genreInput = document.createElement('input');
        genreInput.setAttribute('type', 'radio');
        genreInput.setAttribute('name', 'genre');
        genreInput.setAttribute('id', genre);
        genreInput.setAttribute('value', genre);
        if (book.genre === genre || (id === 0 && genre === genres[0])){
            genreInput.checked = true;
        } else {
            genreInput.checked = false;
        }

        const genreLabel = document.createElement('label');
        genreLabel.setAttribute('for', genre);
        const genreSVGDiv = document.createElement('div');
        genreSVGDiv.classList.add('svg', genre.replace(/ /g, '-').toLowerCase() + '-svg');
        const genreText = document.createElement('div');
        genreText.textContent = genre;
        genreLabel.appendChild(genreSVGDiv);
        genreLabel.appendChild(genreText);

        customRadio.appendChild(genreInput);
        customRadio.appendChild(genreLabel);
        genreFieldset.appendChild(customRadio);
    })                                                  // Genre finished

    const ratingFieldset = document.createElement('fieldset');
    ratingFieldset.classList.add('form-rating');
    const ratingLegend = document.createElement('legend');
    ratingLegend.textContent = "Rating";
    ratingFieldset.appendChild(ratingLegend);
    
    const ratingDiv = document.createElement('div');
    for (let i = 1; i <= 5; i++) {
        const ratingInput = document.createElement('input');
        ratingInput.setAttribute('type', 'checkbox');
        ratingInput.classList.add('svg', 'rating-checkbox');
        ratingInput.setAttribute('id', 'rating-' + i);
        ratingInput.setAttribute('value', i);
        if (i === 1 || book.rating >= i) {
            ratingInput.checked = true;
        } else {
            ratingInput.checked = false;
        }

        const ratingLabel = document.createElement('label');
        ratingLabel.classList.add('svg');
        ratingLabel.setAttribute('for', 'rating-' + i);

        ratingDiv.appendChild(ratingInput);
        ratingDiv.appendChild(ratingLabel);
    }
    ratingFieldset.appendChild(ratingDiv);                // Rating done

    formElement.appendChild(titleDiv);
    formElement.appendChild(authorNameDiv);
    formElement.appendChild(notesDiv);
    formElement.appendChild(pagesDiv);
    formElement.appendChild(finishedFieldset);
    formElement.appendChild(genreFieldset);
    formElement.appendChild(ratingFieldset);                // form element done

    booksContainerElement.appendChild(formElement);
}

function addNotesEventListener() {
    const textarea = document.querySelector('textarea');
    textarea.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = this.scrollHeight + 'px';
    });
}

function normalizeRatingButtons(value) {
    const ratingButtons = document.querySelectorAll('.rating-checkbox');
    ratingButtons.forEach(button => {
        if (button.value <= value) {
            button.checked = true;
        } else {
            button.checked = false;
        }
    })
}

function addRatingEventListener() {
    const ratingButtons = document.querySelectorAll('.rating-checkbox');
    ratingButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            normalizeRatingButtons(Number(button.value))
        })
    })
}

function loadBooks() {
    books.sort((a, b) => a.id - b.id);
    saveBooksToLocalStorage()
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

function cancelAddBook() {
    loadBookContainer();
}

function resetAddBook() {
    loadAddBookContainer();
}

function getRating() {
    const ratingArray = Array.from(document.querySelectorAll('.rating-checkbox'));
    return ratingArray.filter(rating => rating.checked).length;
}

function addBook(e) {
    const title = document.getElementById('title').value;
    const authorName = document.getElementById('author-name').value;
    const notes = document.getElementById('notes').value;
    const pageCount = document.getElementById('number').value;
    const genre = document.querySelector('input[name="genre"]:checked').value;
    const haveRead = (document.querySelector('input[name="finished"]:checked').value === "true");
    const rating = getRating();

    let book = new Book(title, authorName, notes, haveRead, genre,
        pageCount, rating, idSelected === null ? books.length + 1 : idSelected);

    books = books.filter(bookF => (idSelected === null || bookF.id !== idSelected))
    books.push(book);
    saveBooksToLocalStorage()
    loadBookContainer();
}

function loadBookContainer() {
    unloadContainer();
    loadBooks();
    setContainerHeading('My Books');
    addControlButtons('remove', 'add', 'edit');
    addSelectionEventListener();
    addDocumentDeselectionEventListener();
    addRemoveButtonEventListener();
    addAddButtonEventListener();
    addEditButtonEventListener();
    addControlsHoverEventListener();
}

function loadAddBookContainer(e, id = 0) {
    unloadContainer();
    setContainerHeading(id === 0 ? 'Add Book' : 'Edit Book');
    loadFormContainer(id);
    addNotesEventListener();
    addRatingEventListener();
    addControlButtons('cancel', 'confirm', 'reset');
    addCancelButtonEventListener();
    addConfirmButtonEventListener();
    addResetButtonEventListener();
    addControlsHoverEventListener();
}

function loadEditBookContainer() {
    if (idSelected !== null)
        loadAddBookContainer(null, idSelected);
}

loadBookContainer();