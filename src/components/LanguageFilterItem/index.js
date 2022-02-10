import './index.css'

const LanguageFilterItem = props => {
  const {languageFilterDetails, isActive, setActiveLanguageFilterId} = props
  const {id, language} = languageFilterDetails
  const isActiveClassName = isActive ? 'active-language-btn' : ''

  const changeLanguage = () => {
    setActiveLanguageFilterId(id)
  }

  return (
    <li>
      <button
        type="button"
        onClick={changeLanguage}
        className={`language-btn ${isActiveClassName}`}
      >
        {language}
      </button>
    </li>
  )
}

export default LanguageFilterItem
