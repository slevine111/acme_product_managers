import React from 'react'
import { connect } from 'react-redux'
import Product from './Product'

const ProductList = ({ managers, products }) => {
  return (
    <div>
      {products.map(product => (
        <Product key={product.id} product={product} managers={managers} />
      ))}
    </div>
  )
}

const mapStateToProps = state => state

export default connect(mapStateToProps)(ProductList)
