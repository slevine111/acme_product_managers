import thunk from 'redux-thunk'
import * as storeImports from '../client/store'
import configureMockStore from 'redux-mock-store'
import { createStore, combineReducers, applyMiddleware } from 'redux'

describe('store action creators', () => {
  test('getAllManagers action should create an action to getAllManagers', () => {
    const managers = [{ name: 'Larry' }]
    expect(storeImports.getAllManagers(managers)).toEqual({
      type: storeImports.GET_ALL_MANAGERS,
      managers
    })
  })
  test('getAllProducts action should create an action to getAllProducts', () => {
    const products = [{ name: 'baz', managerId: 1 }]
    expect(storeImports.getAllProducts(products)).toEqual({
      type: storeImports.GET_ALL_PRODUCTS,
      products
    })
  })
  test('getProductsAfterUpdate action should create an action to get all products after one has been updated', () => {
    const changedProduct = [{ name: 'baz', managerId: 1 }]
    expect(storeImports.getProductsAfterUpdate(1, changedProduct)).toEqual({
      type: storeImports.GET_PRODUCTS_AFTER_UPDATE,
      id: 1,
      changedProduct
    })
  })
})

describe('store thunks', () => {
  const mockStore = configureMockStore([thunk])

  test('fetchAllDataModel with argument = "managers" should dispatch getAllManagers', () => {
    const store = mockStore({})
    const expectedActions = [
      {
        type: storeImports.GET_ALL_MANAGERS,
        managers: [{ id: 1, name: 'Larry' }]
      }
    ]
    return store
      .dispatch(storeImports.fetchAllDataOfModel('managers'))
      .then(() => expect(store.getActions()).toEqual(expectedActions))
  })
  test('fetchAllDataModel with argument = "products" should dispatch getAllProducts', () => {
    const store = mockStore({})
    const expectedActions = [
      {
        type: storeImports.GET_ALL_PRODUCTS,
        products: [{ id: 1, name: 'Larry' }]
      }
    ]
    return store
      .dispatch(storeImports.fetchAllDataOfModel('products'))
      .then(() => expect(store.getActions()).toEqual(expectedActions))
  })
  test('updateProduct should dispatch getProductsAfterUpdate', () => {
    const store = mockStore({})
    const expectedActions = [
      {
        type: storeImports.GET_PRODUCTS_AFTER_UPDATE,
        id: 2,
        changedProduct: { id: 2, name: 'chair', managerId: null }
      }
    ]
    return store
      .dispatch(
        storeImports.updateProduct(2, { id: 2, name: 'chair', managerId: 0 })
      )
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions)
      })
  })
})

describe('reducers', () => {
  test('managers reducer should handle GET_ALL_MANAGERS', () => {
    expect(
      storeImports.managerReducer([{ id: 1, name: 'Larry' }], {
        type: storeImports.GET_ALL_MANAGERS,
        managers: [{ id: 2, name: 'Moe' }]
      })
    ).toEqual([{ id: 2, name: 'Moe' }])
  })
  test('products reducer should handle GET_ALL_PRODUCTS', () => {
    expect(
      storeImports.productReducer([{ id: 2, name: 'baz', managerId: 3 }], {
        type: storeImports.GET_ALL_PRODUCTS,
        products: [{ id: 1, name: 'foo', managerId: 1 }]
      })
    ).toEqual([{ id: 1, name: 'foo', managerId: 1 }])
  })
  test('products reducer should handle GET_PRODUCTS_AFTER_UPDATE', () => {
    expect(
      storeImports.productReducer(
        [
          { id: 1, name: 'chair', managerId: 1 },
          { id: 2, name: 'baz', managerId: 3 }
        ],
        {
          type: storeImports.GET_PRODUCTS_AFTER_UPDATE,
          id: 2,
          changedProduct: { id: 2, name: 'baz', managerId: 1 }
        }
      )
    ).toEqual([
      { id: 1, name: 'chair', managerId: 1 },
      { id: 2, name: 'baz', managerId: 1 }
    ])
  })
})

describe('semi integration tests on store', () => {
  test('state of mockStore is correct when using a mock reducer and dispatching updateProducts', () => {
    const mockReducer = action => {
      switch (action[0].type) {
        case storeImports.GET_ALL_PRODUCTS:
          return action.products
        case storeImports.GET_PRODUCTS_AFTER_UPDATE:
          return [
            { id: 1, name: 'chair', managerId: 1 },
            { id: 2, name: 'chair', managerId: 3 }
          ].map(product =>
            product.id === action[0].id ? action[0].changedProduct : product
          )
        default:
          return [
            { id: 1, name: 'chair', managerId: 1 },
            { id: 2, name: 'chair', managerId: 3 }
          ]
      }
    }
    const store = configureMockStore([thunk])(mockReducer)
    return store
      .dispatch(
        storeImports.updateProduct(2, { id: 2, name: 'chair', managerId: 0 })
      )
      .then(() => {
        expect(store.getState()).toEqual([
          { id: 1, name: 'chair', managerId: 1 },
          { id: 2, name: 'chair', managerId: null }
        ])
      })
  })
  test('state of real store after calling thunk dispatch', () => {
    const store = createStore(
      combineReducers({
        managers: storeImports.managerReducer,
        products: storeImports.productReducer
      }),
      applyMiddleware(thunk)
    )
    return store
      .dispatch(storeImports.fetchAllDataOfModel('managers'))
      .then(() => store.dispatch(storeImports.fetchAllDataOfModel('products')))
      .then(() => {
        expect(store.getState()).toEqual({
          managers: [{ id: 1, name: 'Larry' }],
          products: [{ id: 1, name: 'Larry' }]
        })
      })
  })
})
