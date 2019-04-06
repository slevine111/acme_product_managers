import React, { Component } from 'react'
import { fetchAllDataOfModel } from '../store'
import { connect } from 'react-redux'
import { HashRouter, Route } from 'react-router-dom'
import Navbar from './Navbar'

class App extends Component {
  componentDidMount() {
    return Promise.all([
      this.props.fetchAllDataOfModel('managers'),
      this.props.fetchAllDataOfModel('products')
    ])
  }

  render() {
    return (
      <div className="container">
        <h2>Acme Product Managers</h2>
        <HashRouter>
          <Route render={() => <Navbar />} />
        </HashRouter>
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchAllDataOfModel: model => dispatch(fetchAllDataOfModel(model))
  }
}

export default connect(
  null,
  mapDispatchToProps
)(App)
