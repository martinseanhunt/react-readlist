import React from 'react'

export default function Book(props) {
  return(
    <li>
      <div className="book">
        <div className="book-top">
          <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: `url(${props.book.imageLinks.thumbnail})` }}></div>
          <div className="book-shelf-changer">
            <select defaultValue={props.book.shelf} onChange={e => props.onSelectShelf(e, props.book)}>
              {/* If the book.shelf is not set move to will be selected */}
              <option value="none" disabled={props.book.shelf}>Move to...</option>
              <option value="currentlyReading">Currently Reading</option>
              <option value="wantToRead">Want to Read</option>
              <option value="read">Read</option>
              <option value="none">None</option>
            </select>
          </div>
        </div>
        <div className="book-title">{props.book.title}</div>

        {/* I found one search result that doesn't have an author so check it's not empty first*/}
        <div className="book-authors">
          {props.book.authors && props.book.authors.join(', ')}
        </div>
      </div>
    </li>
    )
}
