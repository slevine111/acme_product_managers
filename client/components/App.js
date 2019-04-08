import React, { Component, Fragment } from 'react'
import { fetchAllDataOfModel } from '../store'
import { connect } from 'react-redux'
import { HashRouter, Route } from 'react-router-dom'
import Navbar from './Navbar'
import ProductList from './ProductList'
import ManagerPage from './ManagerPage'
import { getManagersWithProducts, managerOpenings } from '../helperfunctions'

class App extends Component {
  componentDidMount() {
    return Promise.all([
      this.props.fetchAllDataOfModel('managers'),
      this.props.fetchAllDataOfModel('products')
    ])
  }

  render() {
    const { managersWithProducts, trueIfManagerOpenings } = this.props
    return (
      <div className="container">
        <h2>Acme Product Managers</h2>
        <HashRouter>
          <Fragment>
            <Route
              render={({ location }) => (
                <Navbar
                  location={location}
                  numberOfManagersWithProducts={managersWithProducts.length}
                />
              )}
            />
            <Route
              exact
              path="/"
              render={() => (
                <h6>
                  {trueIfManagerOpenings
                    ? 'There are manager openings'
                    : 'All manager positions have been filled'}
                </h6>
              )}
            />
            <Route path="/products" component={ProductList} />
            <Route
              path="/managers"
              render={() => (
                <ManagerPage managersWithProducts={managersWithProducts} />
              )}
            />
          </Fragment>
        </HashRouter>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  managersWithProducts: getManagersWithProducts(state),
  trueIfManagerOpenings: managerOpenings(state)
})

const mapDispatchToProps = dispatch => {
  return {
    fetchAllDataOfModel: model => dispatch(fetchAllDataOfModel(model))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
