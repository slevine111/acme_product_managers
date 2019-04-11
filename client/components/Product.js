import React, { Component } from 'react'
import { connect } from 'react-redux'
import { updateProduct } from '../store'
//import PropTypes from 'prop-types'

export class Product extends Component {
  constructor(props) {
    super(props)
    this.state = { managerId: this.props.product.managerId || 0, error: '' }
    this.handleChange = this.handleChange.bind(this)
    this.handleSave = this.handleSave.bind(this)
  }

  handleChange({ target }) {
    return this.setState({
      [target.name]: Number(target.value)
    })
  }

  handleSave(product) {
    return this.props
      .updateProduct(product.id, {
        ...product,
        managerId: this.state.managerId
      })
      .then(() => this.setState({ error: '' }))
      .catch(({ response: { data } }) => {
        this.setState({ error: data })
      })
  }

  render() {
    const { product, managers } = this.props
    const { name, managerId } = product
    const { error } = this.state
    return (
      <div className="list-group-item">
        <div>
          <strong>{name}</strong>
        </div>
        <div className="form-group">
          <label htmlFor="productManagerDropdown">
            <i>Product Manager</i>
          </label>
          <select
            className="form-control"
            id="productManagerDropdown"
            name="managerId"
            onChange={this.handleChange}
            value={this.state.managerId}
          >
            <option value={0}>--none--</option>
            {managers.map(manager => (
              <option key={`${name}-${manager.id}`} value={manager.id}>
                {manager.name}
              </option>
            ))}
          </select>
        </div>
        {error && (
          <div className="alert alert-danger">
            {Array.isArray(error) ? (
              <ul>
                You have the following errors:
                {error.map((e, idx) => (
                  <li key={idx}>e</li>
                ))}
              </ul>
            ) : (
              error
            )}
          </div>
        )}
        <button
          type="button"
          className="btn btn-primary"
          disabled={this.state.managerId === (managerId || 0)}
          onClick={() => this.handleSave(product)}
        >
          Save
        </button>
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {
    updateProduct: (id, product) => dispatch(updateProduct(id, product))
  }
}

export default connect(
  null,
  mapDispatchToProps
)(Product)
