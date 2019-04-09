import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import axios from 'axios'

//action types
const GET_ALL_MANAGERS = Symbol('GET_ALL_MANAGERS')
const GET_ALL_PRODUCTS = Symbol('GET_ALL_PRODUCTS')
const GET_PRODUCTS_AFTER_UPDATE = Symbol('GET_PRODUCTS_AFTER_UPDATE')

//aaction creators
const getAllManagers = managers => ({
  type: GET_ALL_MANAGERS,
  managers
})
const getAllProducts = products => ({ type: GET_ALL_PRODUCTS, products })
const getProductsAfterUpdate = (id, changedProduct) => ({
  type: GET_PRODUCTS_AFTER_UPDATE,
  id,
  changedProduct
})

//thunks
const fetchAllDataOfModel = model => {
  const actionCreator = model === 'managers' ? getAllManagers : getAllProducts
  return dispatch => {
    return axios
      .get(`/api/${model}`)
      .then(({ data }) => dispatch(actionCreator(data)))
  }
}

const updateProduct = (id, product) => {
  const changedProduct = {
    ...product,
    managerId: product.managerId === 0 ? null : product.managerId
  }
  return dispatch => {
    return axios
      .put(`/api/products/${id}`, changedProduct)
      .then(({ data }) => dispatch(getProductsAfterUpdate(id, data)))
  }
}

//reducers
const managerReducer = (state = [], action) => {
  switch (action.type) {
    case GET_ALL_MANAGERS:
      return action.managers
    default:
      return state
  }
}

const productReducer = (state = [], action) => {
  switch (action.type) {
    case GET_ALL_PRODUCTS:
      return action.products
    case GET_PRODUCTS_AFTER_UPDATE:
      return state.map(product =>
        product.id === action.id ? action.changedProduct : product
      )
    default:
      return state
  }
}

const store = createStore(
  combineReducers({ managers: managerReducer, products: productReducer }),
  applyMiddleware(thunk)
)

export default store

export {
  fetchAllDataOfModel,
  updateProduct,
  getAllManagers,
  getAllProducts,
  getProductsAfterUpdate,
  GET_ALL_MANAGERS,
  GET_ALL_PRODUCTS,
  GET_PRODUCTS_AFTER_UPDATE,
  managerReducer,
  productReducer
}
