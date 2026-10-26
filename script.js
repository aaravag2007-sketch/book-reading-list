const form = document.querySelector('#bookForm');
const titleInput = document.querySelector('#bookTitle');
const authorInput = document.querySelector('#bookAuthor');
const list = document.querySelector('#bookList');
const empty = document.querySelector('#empty');
const count = document.querySelector('#count');
const filterButtons = [...document.querySelectorAll('.filter')];
const STORAGE_KEY = 'aarav-reading-list-v1';
let books = loadBooks();
let activeFilter = 'all';
function loadBooks(){try{return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];}catch{return [];}}
function save(){localStorage.setItem(STORAGE_KEY, JSON.stringify(books)); render();}
function render(){
  list.replaceChildren();
  const shown = books.filter(book => activeFilter === 'all' || (activeFilter === 'read' ? book.read : !book.read));
  shown.forEach(book => {
    const item = document.createElement('li'); item.className = `book${book.read ? ' done' : ''}`;
    const check = document.createElement('input'); check.type = 'checkbox'; check.className = 'check'; check.checked = book.read; check.setAttribute('aria-label', `Mark ${book.title} as ${book.read ? 'unread' : 'read'}`); check.addEventListener('change', () => {book.read = check.checked; save();});
    const info = document.createElement('div'); info.className = 'book-info';
    const title = document.createElement('div'); title.className = 'book-title'; title.textContent = book.title;
    const author = document.createElement('div'); author.className = 'book-author'; author.textContent = book.author || 'Author not added'; info.append(title, author);
    const remove = document.createElement('button'); remove.type = 'button'; remove.className = 'remove'; remove.textContent = 'Remove'; remove.setAttribute('aria-label', `Remove ${book.title}`); remove.addEventListener('click', () => {books = books.filter(item => item.id !== book.id); save();});
    item.append(check, info, remove); list.append(item);
  });
  empty.hidden = shown.length > 0; empty.textContent = books.length ? 'No books in this filter.' : 'Your reading list is empty. Add your first book above.';
  count.textContent = `${books.length} book${books.length === 1 ? '' : 's'} · ${books.filter(b => b.read).length} finished`;
  filterButtons.forEach(button => button.classList.toggle('active', button.dataset.filter === activeFilter));
}
form.addEventListener('submit', event => {event.preventDefault(); const title = titleInput.value.trim(); if (!title) return; books.unshift({id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()), title, author: authorInput.value.trim(), read: false}); titleInput.value = ''; authorInput.value = ''; save(); titleInput.focus();});
filterButtons.forEach(button => button.addEventListener('click', () => {activeFilter = button.dataset.filter; render();}));
render();
