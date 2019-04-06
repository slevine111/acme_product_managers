import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import axios from 'axios'

//action types
const GET_ALL_MANAGERS = Symbol('GET_ALL_MANAGERS')
const GET_ALL_PRODUCTS = Symbol('GET_ALL_PRODUCTS')

//aaction creators
const getAllManagers = managers => ({ type: GET_ALL_MANAGERS, managers })
const getAllProducts = products => ({ type: GET_ALL_PRODUCTS, products })

//thunks
const fetchAllDataOfModel = model => {
  const actionCreator = model === 'managers' ? getAllManagers : getAllProducts
  return dispatch => {
    return axios
      .get(`/api/${model}`)
      .then(({ data }) => dispatch(actionCreator(data)))
  }
}

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
    default:
      return state
  }
}

const store = createStore(
  combineReducers({ managers: managerReducer, products: productReducer }),
  applyMiddleware(thunk)
)

export default store

export { fetchAllDataOfModel }
