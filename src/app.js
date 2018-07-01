'use strict'
import React, { Component } from 'react'
import AppContent from './components/app-content'
import ajax from '@fdaciuk/ajax'

class App extends Component {
  constructor () {
    super()
    this.state = {
      userinfo: null,
      repos: [],
      starred: [],
      orgs: []
    }
  }

  handleSearch (e) {
    const value = e.target.value
    const keyCode = e.whic || e.keyCode
    const ENTER = 13

    if (keyCode === ENTER) {
      ajax().get(`https://api.github.com/users/${value}`)
        .then((result) => {
          this.setState({
            userinfo: {
              username: result.name,
              login: result.login,
              photo: result.avatar_url,
              repos: result.public_repos,
              followers: result.followers,
              following: result.following,
              starred: result.starred_url
            },
            repos: [],
            starred: [],
            orgs: []
          })
        })
    }
  }

  getRepos (type) {
    return (e) => {
      ajax().get(`https://api.github.com/users/${this.state.userinfo.login}/${type}`)
        .then((result) => {
          this.setState({
            [type]: result.map((repo) => {
              return {
                name: repo.name,
                link: repo.html_url
              }
            })
          })
        })
    }
  }

  getOrgs (type) {
    return (e) => {
      ajax().get(`https://api.github.com/users/${this.state.userinfo.login}/${type}`)
        .then((result) => {
          this.setState({
            [type]: result.map((org) => {
              return {
                name: org.login,
                link: org.url,
                avatar: org.avatar_url
              }
            })
          })
        })
    }
  }

  render () {
    return <AppContent
      userinfo={this.state.userinfo}
      repos={this.state.repos}
      starred={this.state.starred}
      orgs={this.state.orgs}
      handleSearch={(e) => this.handleSearch(e)}
      getRepos={this.getRepos('repos')}
      getStars={this.getRepos('starred')}
      getOrgs={this.getOrgs('orgs')}
    />
  }
}

export default App
