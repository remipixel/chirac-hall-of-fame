import './App.scss';
import { Provider, connect } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import React from 'react';

// HELPERS
const getRandomNum = (max) => {
  return Math.floor(Math.random() * max);
}

/*const animateColor = () => {

  document.getElementsById("root").animate({ backgroundColor: animateColor, color: colors }, 1000);
  document.getElementsById("#tweet-quote").animate({ color: colors }, 1000);
}*/

// ACTIONS

const FETCH_QUOTE = "FETCH_QUOTE";
const NEW_QUOTE = "NEW_QUOTE";
const LOADING = "LOADING";

const fetchQuote = () => (dispatch) => {
  dispatch({ type: LOADING });
  fetch(
    /*"https://gist.github.com/remipixel/bc661fb9b43b6000cfe4fd085206ef6e"*/
    "./quotes.json"
  ).then((res) => res.json())
    .then((json) => {
      dispatch({ type: FETCH_QUOTE, list: json.quotes })
    })
}

const newQuote = (quoteIndex = 0, colorIndex = 0) => {
  return {
    type: NEW_QUOTE,
    quoteIndex: quoteIndex,
    colorIndex: colorIndex
  }
}

// REDUCER

const quoteReducer = (state = defaultState, action) => {
  switch (action.type) {
    case LOADING:
      return {
        ...state,
        loading: true
      }

    case FETCH_QUOTE:
      const quoteIndex = getRandomNum(action.list.length)
      const colorIndex = getRandomNum(state.colors.length)
      return {
        ...state,
        list: action.list,
        background: state.colors[colorIndex],
        current: action.list[quoteIndex],
        loading: false
      }

    case NEW_QUOTE:
      return {
        ...state,
        current: state.list[action.quoteIndex],
        background: state.colors[action.colorIndex]
      }

    default:
      return state

  }
}

// STORE 

const colors = [
  "#6cd2c5",
  "#16a085",
  "#27ae60",
  "#f39c12",
  "#a29bfe",
  "#FB6964",
  "#BDBB99",
  "#77B1A9",
  "#73A857",
  "#74b9ff",
  "#ffeaa7",
  "#ff9ff3",
  "#48dbfb",
  "#ffcccc",
  "#cd84f1",
  "#fffa65"
]

const defaultState = {
  colors: colors,
  background: colors[11],
  loading: false,
  list: [],
  current: { quote: "", author: "" }
}

const store = createStore(quoteReducer, applyMiddleware(thunk))

// APP

function App() {
  return (
    <Provider store={store}>
      <ChiracHallOfFameApp />
    </Provider>
  )
}

// QUOTE

const Quote = ({ quote = "...", author = "" }) => {
  return (
    <div className="quote">
      <div id="text">{quote}</div>
      <div id="author">{author}</div>
    </div>
  )
}

// QUOTE MACHINE

class QuoteMachine extends React.Component {
  componentDidMount() {
    this.props.fetchQuote()
  }

  getNewQuote = () => {
    const quoteIndex = getRandomNum(this.props.list.length)
    const colorIndex = getRandomNum(this.props.colors.length)
    this.props.newQuote(quoteIndex, colorIndex)
  }

  render() {
    const { current, loading, background } = this.props

    return (
      <div
        className="container"
        style={{ backgroundColor: background }}
      >
        <div className="quote-machine">
          <div id="quote-box" className="quote-box">
            <button id="new-quote" className="button" onClick={this.getNewQuote} style={{ color: background }}>Encore une !</button>
            {loading ? (<Quote />) : (<Quote quote={current.quote} author={current.author} />)}
            <a href="twitter.com/intent/tweet"
              style={{ color: background }}
              id="tweet-quote"
              className="tweet-quote"
              target="_blank">
              <i className="fab fa-twitter fa-lg"></i>
            </a>
          </div>
        </div>

        

      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    background: state.background,
    list: state.list,
    colors: state.colors,
    loading: state.loading,
    current: state.current
  }
}

const mapDispatchToProps = (dispatch) => ({
  fetchQuote: () => dispatch(fetchQuote()),
  newQuote: (quoteIndex, colorIndex) =>
    dispatch(newQuote(quoteIndex, colorIndex))
})

const ChiracHallOfFameApp = connect(
  mapStateToProps, 
  mapDispatchToProps
)(QuoteMachine)


// CURSOR CODE

/*let title = document.querySelector(".quote-machine")*/
/*let curs = document.querySelector(".cursor")

document.addEventListener("mouseleave", (e) => {
  let x = e.pageX;
  let y = e.pageY;
  curs.style.left = x - 22 + "px";
  curs.style.top = y - 22 + "px";
});*/


export default App;
