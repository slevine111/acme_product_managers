import React, { Component } from 'react'
import { connect } from 'react-redux'

export class Product extends Component {
  constructor(props) {
    super(props)
    this.state = { managerId: this.props.product.managerId }
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange({ target }) {
    return this.setState(
      { [target.name]: target.value === null ? null : Number(target.value) },
      () => console.log(this.state)
    )
  }

  render() {
    const { product, managers } = this.props
    const { name, managerId } = product
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
            <option value={null}>--none--</option>
            {managers.map(manager => (
              <option key={`${name}-${manager.id}`} value={manager.id}>
                {manager.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          disabled={this.state.managerId === managerId}
        >
          Save
        </button>
      </div>
    )
  }
}

const mapStateToProps = state => ({})

const mapDispatchToProps = {}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Product)
