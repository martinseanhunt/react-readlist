import React from 'react'
import { Link } from 'react-router-dom'
import BookShelf from './BookShelf'

export default function ListBooks(props) {
  return (
    <div className="list-books">
      <div className="list-books-title">
        <h1>MyReads</h1>
      </div>
      <div className="list-books-content">
        <div>
          <BookShelf name="Currently Reading" books={props.currentlyReading} onSelectShelf={props.onSelectShelf} />
          <BookShelf name="Want to Read" books={props.wantToRead} onSelectShelf={props.onSelectShelf} />
          <BookShelf name="Read" books={props.read} onSelectShelf={props.onSelectShelf} />
        </div>
      </div>
      <div className="open-search">
        <Link to="/search">Add a book</Link>
      </div>
    </div>
  )
}