import React, { Component } from 'react';
import Homepage from './Homepage';
import TableOfContents from './TableOfContents';
import ReadingView from './ReadingView';
import { forEach, map } from 'lodash';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      booksOfBible: null,
      chapters: null,
      tocActive: false,
      selectedBook: 'Genesis',
      selectedChapter: 1,
      chapter: null,
      book: null,
      chapterText: null,
      readingViewActive: false
    }
  }
  toggleToc() {
    let prevState = !this.state.tocActive;
    this.setState({
      tocActive: prevState
    });
  }
  toggleReadingView() {
    this.setState({
      readingViewActive: !this.state.readingViewActive
    });
  }
  selectBook(book) {
    fetch(`/chapters/${book}`)
      .then(body => body.json())
      .then(json => this.setState({
        chapters: json,
        selectedBook: book,
        book,
      }));
  }
  selectChapter(chapter) {
    let url = `?book=${this.state.selectedBook}&chapter=${chapter}`

    fetch(`/bible/query${url}`)
      .then(body => body.json())
      .then(json => this.setState({
        chapter: json.chapter,
        book: json.book,
        selectedChapter: json.chapter,
        chapterText: json.chapterText,
        tocActive: !this.state.tocActive
      }))
      .then(() => this.activateReadingView({
        selectedBook: this.state.selectedBook,
        selectedChapter: this.state.selectedChapter
      }));
  }
  activateReadingView({ selectedBook, selectedChapter }) {
    this.props.history.push(`/read?book=${selectedBook}&chapter=${selectedChapter}`);
  }
  componentDidMount() {
    window.scrollTo(0, 0);
    if (this.props.location.search) {
      let url = this.props.location.search;
      fetch(`/bible/query${url}`)
        .then(body => body.json())
        .then(json => this.setState({
          chapter: json.chapter,
          book: json.book,
          chapterText: json.chapterText
        }));
    }
    fetch('/booksOfBible')
      .then(body => body.json())
      .then(json => this.setState({
        booksOfBible: json
      }));
  }
  render() {
    const {
      selectedChapter,
      selectedBook,
      tocActive,
      chapter,
      book,
      chapterText,
      booksOfBible,
      chapters,
      readingViewActive
    } = this.state;
    return (
      <div className="app">
        {
          this.state.tocActive ?
          <TableOfContents
            selectedChapter={selectedChapter}
            selectedBook={selectedBook}
            selectBook={this.selectBook.bind(this)}
            selectChapter={this.selectChapter.bind(this)}
            chapters={chapters}
            booksOfBible={booksOfBible}
          />
          : null
        }
        {
          this.props.location.pathname === '/read' ?
          <ReadingView
            tocActive={tocActive}
            toggleToc={this.toggleToc.bind(this)}
            readingViewActive={readingViewActive}
            toggleReadingView={this.toggleReadingView.bind(this)}
            selectedChapter={selectedChapter}
            selectedBook={selectedBook}
            chapter={chapter}
            book={book}
            chapterText={chapterText}
            activateReadingView={this.activateReadingView.bind(this)}
          />
          : <Homepage
            tocActive={tocActive}
            toggleToc={this.toggleToc.bind(this)}
            selectedChapter={selectedChapter}
            selectedBook={selectedBook}
            activateReadingView={this.activateReadingView.bind(this)}
          />
        }
      </div>
    );
  }
}

export default App;