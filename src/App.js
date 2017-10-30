import React from 'react'
import { Route } from 'react-router-dom'
import * as BooksAPI from './BooksAPI'
import ListBooks from './ListBooks'
import Search from './Search'
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
  onSearch = string => {
    BooksAPI.search(string).then(searchResults => {
      
      if (searchResults.error) return null;
      
      const resultsWithShelf = searchResults.map(result => {
        const stateBook = this.state.books.filter(book => book.id === result.id)
        if (stateBook.length) 
          return stateBook[0]
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
          <ListBooks 
            currentlyReading={currentlyReading}
            wantToRead={wantToRead}
            read={read}
            onSelectShelf={this.onSelectShelf}
          />
        )} />

        <Route exact path="/search" render={() => (
          <Search 
            onSearch={this.onSearch}
            searchResults={this.state.searchResults}
            onSelectShelf={this.onSelectShelf}
          />
        )} />

      </div>
    )
  }
}

export default BooksApp
