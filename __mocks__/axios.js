const mockAxios = jest.genMockFromModule('axios')

mockAxios.get = jest
  .fn()
  .mockResolvedValue({ data: [{ id: 1, name: 'Larry' }] })

mockAxios.put = jest
  .fn()
  .mockResolvedValue({ data: { id: 2, name: 'chair', managerId: null } })

export default mockAxios
