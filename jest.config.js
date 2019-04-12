const path = require('path')

module.exports = {
  collectCoverage: true,
  coverageDirectory: path.join(__dirname, 'TestCoverageReport'),
  coverageReporters: ['text', 'html'],
  verbose: true
}
