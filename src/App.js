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

  onSearch = string => {
    if (!string) return null

    BooksAPI.search(string).then(searchResults => {
      
      if (searchResults.error) return null;

      const hashTable = {}
      this.state.books.forEach( book => hashTable[book.id] = book.shelf )
      
      searchResults.forEach( result => result.shelf = hashTable[result.id]  || 'none')

      this.setState({ searchResults: searchResults })
      
    })
  }

  onSelectShelf = (e, book) => {
    const shelf = e.target.value
    BooksAPI.update(book, shelf).then(() => {

      // The API doesn't return the updated object so we need to do it manually
      book.shelf = shelf

      // If the book is already in state remove it 
      // after the book is removed (or not) add the book again with new details
      this.setState({
        books: this.state.books.filter(b => b.id !== book.id).concat(book) 
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
