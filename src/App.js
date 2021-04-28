import './App.scss';
import { useState, useRef, useEffect } from 'react';
import ReactTooltip from 'react-tooltip';
import cn from 'classnames';
import { getWords, postWord, updateWord } from './services/api';
import config from './config'

function App() {

  /// State

  const [words, setWords] = useState([])
  const [nativeInput, setNativeInput] = useState('')
  const [translate, setTranslate] = useState([])
  const langs = { from: config.nativeName, to: config.foreignName }
  const [isModalShow, setIsModalShow] = useState(false)
  const [newWordNative, setNewWordNative] = useState('')
  const [newWordForeign, setNewWordForeign] = useState('')

  const textInput = useRef(null);


  /// Methods

  const onChangeHadler = e => {
    e.preventDefault()
    setNativeInput(e.target.value)
  }

  const onTranslate = () => {
    const separators = /[\s!?.,—()]/
    const nativeWords = nativeInput
      .split(separators)
      .filter(word => word !== '')

    // TODO: think about how to return punctuation back into a their places

    if( !words.length ) return

    const foreignWords = nativeWords.map(nativeWord => {
      const isCapital = nativeWord[0].toLowerCase() !== nativeWord[0]
      const foreignIndex = words.findIndex(w => w.native.split(',').includes(nativeWord.toLowerCase()))

      let word
      if( foreignIndex > -1 ) {
        word = { 
          foreign: words[foreignIndex].foreign, 
          hint: nativeWord
        }
      } else {
        word = { 
          foreign: nativeWord, 
          untranslated: true 
        }
      }

      if( isCapital ) {
        word.foreign = word.foreign.charAt(0).toUpperCase() + word.foreign.slice(1)
      }

      return word
    })
    setTranslate(foreignWords)
  }

  const addWordHandler = (wordNative) => {
    setNewWordNative(wordNative)
    setIsModalShow(true)
  }

  const confirmAddWordHandler = async (e) => {
    e.preventDefault()
    const index = words.findIndex(word => word.foreign === newWordForeign)
    if( index > -1 ) {
      // Update a  word
      const word = words[index]
      const updatedWord = { foreign: word.foreign, native: word.native + "," + newWordNative }
      updateWord(word.id, updatedWord.native).then(updateWords)
    } else {
      // Add a new word
      const newWord = { native: newWordNative.toLowerCase(), foreign: newWordForeign.toLowerCase() }
      postWord(newWord).then(updateWords)
    }
    clearAndCloseModal()
  }

  const clearAndCloseModal = () => {
    setNewWordNative('')
    setNewWordForeign('')
    textInput.current.value = ''
    setIsModalShow(false)
  }

  const inputKeydownHandler = e => {
    if (e.key === "Escape") {
      clearAndCloseModal()
    }
  }

  const updateWords = async () => {
    setWords(await getWords())
  }


  /// Effects

  // On mount
  useEffect(() => {
    // TODO: Is it correct?
    function get() {
      updateWords()
    }
    get()
  }, [])

  // On enter text or change words
  useEffect((onTranslate), [nativeInput, words])

  // On mount
  useEffect(() => {
    textInput.current && textInput.current.focus()
  }, [isModalShow])


  // Render

  return (
    <div className="App">
      <header className="header">
        <h1>
          <span className="accent">{ langs.from } -&gt; { langs.to }</span>
        </h1>
        <p>
          <span className="accent">{ words.length || 0 }</span> { langs.to } words loaded
        </p>
      </header>
      <div className="body">
        <label htmlFor="native">{ langs.from }:</label>
        <textarea id="native" cols="30" rows="10" onChange={(e) => onChangeHadler(e)} value={nativeInput} />

        <label>{ langs.to } translate:</label>
        <div className="translate">
          { translate.map((word, index) => (
            <div 
              key={index} 
              className={ cn("word", {"untranslated": word.untranslated}) } 
              data-tip={ word.hint || (word.untranslated && 'You able to add a new translation') }
              onClick={() => word.untranslated && addWordHandler(word.foreign)}
            >
              { word.foreign }
              { (word.hint || word.untranslated) && <ReactTooltip place="bottom" type="light" effect="solid"/> }
              &nbsp;
            </div>
            )
          )}
        </div>
      </div>

      {isModalShow && <div className="modal">
        <div className="modal-content">
          <h2>
            New translation for <span className="accent">"{ newWordNative }"</span>
          </h2>
          <form onSubmit={e => confirmAddWordHandler(e)}>
            <input 
              type="text" 
              onChange={e => setNewWordForeign(e.target.value)} 
              onKeyDown={e => inputKeydownHandler(e)} 
              ref={textInput} 
            />
          </form>
          <p>
            Press <span className="accent">ENTER</span> to accept, <span className="accent">ESC</span> to cancel
          </p>
        </div>
      </div>}
    </div>
  );
}

export default App;
