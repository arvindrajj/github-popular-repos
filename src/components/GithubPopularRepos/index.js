import {Component} from 'react'
import Loader from 'react-loader-spinner'

import LanguageFilterItem from '../LanguageFilterItem'
import RepositoryItem from '../RepositoryItem'
import './index.css'

const languageFiltersData = [
  {id: 'ALL', language: 'All'},
  {id: 'JAVASCRIPT', language: 'Javascript'},
  {id: 'RUBY', language: 'Ruby'},
  {id: 'JAVA', language: 'Java'},
  {id: 'CSS', language: 'CSS'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}
class GithubPopularRepos extends Component {
  state = {
    languageDataType: languageFiltersData[0].id,
    languageData: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.fetchPopularRepos()
  }

  fetchPopularRepos = async () => {
    const {languageDataType} = this.state
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const apiUrl = `https://apis.ccbp.in/popular-repos?language=${languageDataType}`
    const response = await fetch(apiUrl)
    const data = await response.json()
    const formattedData = data.popular_repos.map(each => ({
      name: each.name,
      id: each.id,
      issuesCount: each.issues_count,
      forksCount: each.forks_count,
      starsCount: each.stars_count,
      avatarUrl: each.avatar_url,
    }))
    this.setState({languageData: formattedData})
    if (response.ok) {
      this.setState({apiStatus: apiStatusConstants.success})
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  setActiveLanguageFilterId = id => {
    this.setState({languageDataType: id}, this.fetchPopularRepos)
  }

  renderFilteredList = () => {
    const {languageDataType} = this.state
    return (
      <ul className="filters-list">
        {languageFiltersData.map(each => (
          <LanguageFilterItem
            key={each.id}
            languageFilterDetails={each}
            isActive={each.id === languageDataType}
            setActiveLanguageFilterId={this.setActiveLanguageFilterId}
          />
        ))}
      </ul>
    )
  }

  renderFailureView = () => (
    <div className="failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
        className="failure-view-image"
      />
      <h1 className="error-message">Something Went Wrong</h1>
    </div>
  )

  renderLoader = () => (
    <div testid="loader">
      <Loader color="#0284c7" height={80} type="ThreeDots" width={80} />
    </div>
  )

  renderRepositoriesList = () => {
    const {languageData} = this.state
    return (
      <ul className="repositories-list ">
        {languageData.map(each => (
          <RepositoryItem key={each.id} repositoryDetails={each} />
        ))}
      </ul>
    )
  }

  renderRepositories = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      case apiStatusConstants.success:
        return this.renderRepositoriesList()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <div>
        <div className="app-container">
          <div className="responsive-container">
            <h1 className="heading">Popular</h1>
            {this.renderFilteredList()}
            {this.renderRepositories()}
          </div>
        </div>
      </div>
    )
  }
}

export default GithubPopularRepos
