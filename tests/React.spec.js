import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import mockAxios from 'axios'
import { App } from '../client/components/App'
import { HashRouter } from 'react-router-dom'

Enzyme.configure({ adapter: new Adapter() })
//jest.mock('axios')

//axios.get.mockResolvedValue({ data: { rt: 'gh' } })

let fetchAllDataOfModel = jest.fn()
let props = { fetchAllDataOfModel, managersWithProducts: ['larry'] }
console.log(props)
const app = new shallow(<App {...props} />)

describe('testing', () => {
  test('it goes', () => {
    console.log(app.find(HashRouter).length)
    return mockAxios.get('/rt').then(({ data }) => {
      console.log('data', data)
      expect(1).toBe(1)
    })
  })
})
