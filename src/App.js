import React from 'react'
import { Route, Link } from 'react-router-dom'
import * as BooksAPI from './BooksAPI'
import BookShelf from './BookShelf'
import Book from './Book'
import './App.css'

class BooksApp extends React.Component {
  state = {
    books: [],
    searchResults: []
  }

  componentDidMount() {
    BooksAPI.getAll().then(books => this.setState({books}))
  }

  getShelf = shelf => this.state.books
    .filter(book => book.shelf === shelf)

  // QUESTION: This feels messy... is there a better way?
  onSearch(string) {
    BooksAPI.search(string).then(searchResults => {

      const resultsWithShelf = searchResults.map(result => {
        const stateBook = this.state.books.filter(book => book.id === result.id)
        if (stateBook.length) return stateBook[0]
        result.shelf = null
        return result
      })

      this.setState({ searchResults: resultsWithShelf })
    })
  }

  // QUESTION: The way I'm updating the state here feels a bit
  // messy. Is there a better way considering what the API returns
  // and the fact that I'm having to account for adding from searches?
  onSelectShelf = (e, book) => {
    const shelf = e.target.value
    BooksAPI.update(book, shelf)
      .then(() => {
      
        // If the book is already in the array, get it
        const bookInState = this.state.books.filter(b => b.id === book.id)
        
        let books
        // if it isn't in state, it's a new book so needs to be added
        if (!bookInState.length) {
          books = [...this.state.books, book]
        } else {
          books = this.state.books
        }

        // then go through the books to change the shelf property on the 
        // right object and set the new state
        this.setState({
          books: books.map(b => {
            if(b.id === book.id) b.shelf = shelf
            return b
          })
        })

      })
  }

  render() {
    const currentlyReading = this.getShelf('currentlyReading')
    const wantToRead = this.getShelf('wantToRead')
    const read = this.getShelf('read')
    return (
      <div className="app">
          
        <Route exact path="/" render={() => (
          <div className="list-books">
            <div className="list-books-title">
              <h1>MyReads</h1>
            </div>
            <div className="list-books-content">
              <div>
                <BookShelf name="Currently Reading" books={currentlyReading} onSelectShelf={this.onSelectShelf} />
                <BookShelf name="Want to Read" books={wantToRead} onSelectShelf={this.onSelectShelf} />
                <BookShelf name="Read" books={read} onSelectShelf={this.onSelectShelf} />
              </div>
            </div>
            <div className="open-search">
              <Link to="/search">Add a book</Link>
            </div>
          </div>
        )} />

        <Route exact path="/search" render={() => (
          <div className="search-books">
            <div className="search-books-bar">
              <Link className="close-search" to="/">Close</Link>
              <div className="search-books-input-wrapper">
                <input type="text" onChange={e => this.onSearch(e.target.value)} placeholder="Search by title or author"/>

              </div>
            </div>
            <div className="search-books-results">
              <ol className="books-grid">
                {this.state.searchResults.map(book => 
                  <Book book={book} key={book.id} onSelectShelf={this.onSelectShelf}  />
                )} 
              </ol>
            </div>
          </div>
        )} />

        

      </div>
    )
  }
}

export default BooksApp
