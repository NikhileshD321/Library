// index.js

document.addEventListener('DOMContentLoaded', function() {
    const booksList = document.getElementById('books-list');
    const addBookForm = document.getElementById('add-book-form');
    const deleteBookForm = document.getElementById('delete-book-form');

    // Function to fetch and display all books
    function fetchBooks() {
        fetch('/books')
            .then(response => response.json())
            .then(data => {
                booksList.innerHTML = ''; // Clear existing list
                data.books.forEach(book => {
                    const li = document.createElement('li');
                    li.textContent = `${book.title} by ${book.author} (ISBN: ${book.isbn})`;
                    if (book.file_format) {
                        li.textContent += ` - Format: ${book.file_format}`;
                    }
                    booksList.appendChild(li);
                });
            });
    }

    // Fetch books on page load
    fetchBooks();

    // Function to handle form submission to add a book
    addBookForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(this);
        fetch('/books', {
            method: 'POST',
            body: JSON.stringify({
                title: formData.get('title'),
                author: formData.get('author'),
                isbn: formData.get('isbn'),
                file_format: formData.get('file_format')
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            fetchBooks(); // Refresh the books list
        });
    });

    // Function to handle form submission to delete a book
    deleteBookForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const isbn = this.querySelector('input[name="isbn"]').value;
        fetch(`/books/${isbn}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Failed to delete book.');
            }
        })
        .then(data => {
            alert(data.message);
            fetchBooks(); // Refresh the books list
        })
        .catch(error => alert(error.message));
    });
});
