import React from 'react'
import { Link } from 'react-router-dom'
import Book from './Book'

export default function Search(props) {  
  return(
    <div className="search-books">
      <div className="search-books-bar">
        <Link className="close-search" to="/">Close</Link>
        <div className="search-books-input-wrapper">
          <input type="text" onChange={e => props.onSearch(e.target.value)} placeholder="Search by title or author"/>
        </div>
      </div>
      <div className="search-books-results">
        <ol className="books-grid">
          {props.searchResults.map(book => 
            <Book book={book} key={book.id} onSelectShelf={props.onSelectShelf}  />
          )} 
        </ol>
      </div>
    </div>
  )
}