from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///library.db'
db = SQLAlchemy(app)

class BookModel(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    author = db.Column(db.String(100), nullable=False)
    isbn = db.Column(db.String(20), nullable=False, unique=True)
    file_format = db.Column(db.String(20))

    def __repr__(self):
        return f'<Book {self.title}>'

@app.route('/books', methods=['GET'])
def get_books():
    books = BookModel.query.all()
    output = []
    for book in books:
        book_data = {'title': book.title, 'author': book.author, 'isbn': book.isbn}
        if book.file_format:
            book_data['file_format'] = book.file_format
        output.append(book_data)
    return jsonify({'books': output})

@app.route('/books', methods=['POST'])
def add_book():
    data = request.get_json()
    new_book = BookModel(title=data['title'], author=data['author'], isbn=data['isbn'])
    if 'file_format' in data:
        new_book.file_format = data['file_format']
    db.session.add(new_book)
    db.session.commit()
    return jsonify({'message': 'Book added successfully!'})

@app.route('/books/<isbn>', methods=['DELETE'])
def delete_book(isbn):
    book = BookModel.query.filter_by(isbn=isbn).first()
    if not book:
        return jsonify({'error': 'Book not found!'}), 404
    db.session.delete(book)
    db.session.commit()
    return jsonify({'message': 'Book deleted successfully!'})

if __name__ == '__main__':
    db.create_all()
    app.run(debug=True)
