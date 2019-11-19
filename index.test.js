/* eslint-env node, mocha */
const expect = require('chai').expect
const OSS = require('./index')
const config = {
  accessKeyId: process.env.ACCESS_KEY_ID,
  accessKeySecret: process.env.ACCESS_KEY_SECRET,
  bucket: process.env.OSS_BUCKET,
  region: process.env.OSS_REGION
}
const prefix = 'null/'
const filename = prefix + 'test.txt'

describe('Object', () => {
  it('put', () => {
    var oss = new OSS(config)
    return oss.put(filename, Buffer.from('test'), {
      headers: {
        'Content-Type': 'text/plain'
      }
    })
  })

  it('head', () => {
    var oss = new OSS(config)
    return oss.head(filename)
  })

  it('get', () => {
    var oss = new OSS(config)
    return oss.get(filename)
  })

  it('list', () => {
    var oss = new OSS(config)
    return oss.list({
      prefix: prefix
    })
      .then((res) => {
        expect(res.data).to.be.an('object')
      })
  })

  it('delete', () => {
    var oss = new OSS(config)
    return oss.delete(filename)
  })
})
