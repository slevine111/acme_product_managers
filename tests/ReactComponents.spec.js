import React from 'react'
import Enzyme, { shallow, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { App } from '../client/components/App'
import { Route, Link } from 'react-router-dom'
import { ProductList } from '../client/components/ProductList'
import Product from '../client/components/Product'
import Navbar from '../client/components/Navbar'

Enzyme.configure({ adapter: new Adapter() })

describe('React Components', () => {
  describe('App component', () => {
    let standardProps = {
      fetchAllDataOfModel: jest.fn(),
      managersWithProducts: [{ id: 1, name: 'larry' }],
      trueIfManagerOpenings: true
    }
    test('it has four different Route components', () => {
      const app = new mount(<App {...standardProps} />)
      expect(app.find(Route)).toHaveLength(4)
    })
    test('the message printed in the Home route is diferrent for when trueIfManagerOpenings prop is true or false', () => {
      const appTrue = new mount(<App {...standardProps} />)
      const messageWhenTrue = appTrue.find('h6').prop('children')
      standardProps.trueIfManagerOpenings = false
      const appFalse = new mount(<App {...standardProps} />)
      expect(appFalse.find('h6').prop('children')).not.toBe(messageWhenTrue)
    })
  })

  describe('ProductList component', () => {
    const propsTwo = {
      managers: [{ id: 1, name: 'larry' }],
      products: [
        { id: 1, name: 'bar', managerId: 1 },
        { id: 2, name: 'foo', managerId: 1 }
      ]
    }
    const productList = new shallow(<ProductList {...propsTwo} />)
    test('it generates a Product component for each element in the passed-in products array prop', () => {
      expect(productList.find(Product)).toHaveLength(2)
    })
    test('the Product component has product prop equal to element of products array of current index and managers prop equal to managers prop array', () => {
      const firstProduct = productList.find(Product).first()
      expect(firstProduct.prop('managers')).toEqual(propsTwo.managers)
      expect(firstProduct.prop('product')).toEqual(propsTwo.products[0])
    })
  })

  describe('Navbar component', () => {
    const props = {
      location: { pathname: '/products' },
      numberOfManagersWithProducts: 2
    }
    const navbar = shallow(<Navbar {...props} />)
    test('only the link with the TO props matching the pathname has the active class', () => {
      let count = 0
      let path = ''
      navbar.find(Link).forEach(node => {
        if (node.hasClass('active')) {
          path = node.prop('to')
          ++count
        }
      })
      expect(path).toBe(props.location.pathname)
      expect(count).toBe(1)
    })
  })

  require('./ReactComponents/Product.spec')
})
