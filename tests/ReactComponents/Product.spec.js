import React from 'react'
import Enzyme, { shallow, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { Provider } from 'react-redux'
import mockAxios from 'axios'
import store, { fetchAllDataOfModel } from '../../client/store'
import Product, {
  Product as UnconnectedProduct
} from '../../client/components/Product'

Enzyme.configure({ adapter: new Adapter() })

describe('Product component', () => {
  const propsProduct = {
    managers: [{ id: 1, name: 'larry' }, { id: 2, name: 'Curly' }],
    product: { id: 1, name: 'bar', managerId: 1 },
    updateProduct: jest
      .fn()
      .mockResolvedValue({ data: { id: 2, name: 'chair', managerId: null } })
  }

  const product = shallow(<UnconnectedProduct {...propsProduct} />)
  const instance = product.instance()

  const setUpSpy = (instance, methodName) => {
    const actualMethod = instance[methodName]
    const handleEventSpy = jest.spyOn(instance, methodName)
    instance.forceUpdate()
    return { actualMethod, handleEventSpy }
  }

  beforeEach(() => {
    product.setState({ managerId: propsProduct.product.managerId })
  })
  test('initial state has managerId set to managerId of product prop and error set to empty string', () => {
    expect(product.state().managerId).toBe(propsProduct.product.managerId)
    expect(product.state().error).toBe('')
  })
  test('it generates a dropdown list with options for all the managers and an option for no manager', () => {
    expect(product.find('option')).toHaveLength(
      propsProduct.managers.length + 1
    )
  })
  test('the values for the dropdown list are the ids of the managers and zero for no manager', () => {
    const arrayOfValues = []
    product.find('option').forEach(node => {
      arrayOfValues.push(node.prop('value'))
    })
    expect(arrayOfValues).toEqual([0, ...propsProduct.managers.map(m => m.id)])
  })
  test('changing the dropdown item selected calls the handleChange method', () => {
    const { actualMethod, handleEventSpy } = setUpSpy(instance, 'handleChange')
    const selectElement = product.find('select')
    selectElement.simulate('change', {
      target: { name: 'managerId', value: 2 }
    })
    expect(handleEventSpy).toHaveBeenCalledTimes(1)
    instance.handleChange = actualMethod
  })
  test('changing the dropdown item selected changes the managerId value of state to the corresponding value of the item', () => {
    const selectElement = product.find('select')
    selectElement.simulate('change', {
      target: { name: 'managerId', value: 2 }
    })
    expect(product.state().managerId).toBe(2)
    selectElement.simulate('change', {
      target: { name: 'managerId', value: 0 }
    })
    expect(product.state().managerId).toBe(0)
  })
  test('clicking the save button causes the handleSave and updateProduct methods to be called with the proper arguments', () => {
    const { actualMethod, handleEventSpy } = setUpSpy(instance, 'handleSave')
    const { updateProduct } = propsProduct
    product.find('button').simulate('click', {})
    expect(handleEventSpy).toHaveBeenCalledTimes(1)
    expect(handleEventSpy).toHaveBeenCalledWith(propsProduct.product)
    expect(updateProduct).toHaveBeenCalledTimes(1)
    expect(updateProduct).toHaveBeenCalledWith(
      propsProduct.product.managerId,
      propsProduct.product
    )
    instance.handleChange = actualMethod
  })
})

describe('Connected product component', () => {
  const originalMockGet = mockAxios.get
  const originalMockPut = mockAxios.put
  const standardProps = {
    managers: [{ id: 1, name: 'larry' }, { id: 2, name: 'Curly' }],
    product: { id: 2, name: 'foo', managerId: 1 }
  }

  mockAxios.get = jest
    .fn()
    .mockResolvedValueOnce({
      data: [{ id: 1, name: 'larry' }, { id: 2, name: 'Curly' }]
    })
    .mockResolvedValueOnce({
      data: [
        { id: 1, name: 'bar', managerId: 1 },
        { id: 2, name: 'foo', managerId: 1 },
        { id: 3, name: 'bazz', managerId: 1 }
      ]
    })

  mockAxios.put = jest
    .fn()
    .mockResolvedValue({ data: { id: 2, name: 'foo', managerId: 2 } })
  const product = mount(
    <Provider store={store}>
      <Product {...standardProps} />
    </Provider>
  )
  test('testing lifecycle of connected component', () => {
    return store
      .dispatch(fetchAllDataOfModel('managers'))
      .then(() => store.dispatch(fetchAllDataOfModel('products')))
      .then(() => {
        mockAxios.get = originalMockGet
      })
      .then(() =>
        product.find('select').simulate('change', {
          target: { name: 'managerId', value: 2 }
        })
      )
      .then(() => product.find('button').simulate('click', {}))
      .then(() => {
        expect(store.getState()).toEqual({
          managers: [{ id: 1, name: 'larry' }, { id: 2, name: 'Curly' }],
          products: [
            { id: 1, name: 'bar', managerId: 1 },
            { id: 2, name: 'foo', managerId: 2 },
            { id: 3, name: 'bazz', managerId: 1 }
          ]
        })
        expect(product.find('select').prop('value')).toBe(2)
        expect(product.find(UnconnectedProduct).state()).toEqual({
          managerId: 2,
          error: ''
        })
      })
      .then(() => {
        mockAxios.get = originalMockGet
        mockAxios.put = originalMockPut
      })
  })
})
