import React, { Component, Fragment } from 'react'
import { fetchAllDataOfModel } from '../store'
import { connect } from 'react-redux'
import { HashRouter, Route } from 'react-router-dom'
import Navbar from './Navbar'
import ProductList from './ProductList'

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
          <Fragment>
            <Route render={({ location }) => <Navbar location={location} />} />
            <Route exact path="/" render={() => <h6>Welcome</h6>} />
            <Route path="/products" component={ProductList} />
          </Fragment>
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
