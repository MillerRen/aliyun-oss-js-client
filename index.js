const signUtils = require('oss-sign-utils')
const axios = require('axios')
const Xml2js = require('x2js')

const defaults = {
  region: 'oss-cn-hangzhou',
  crossdomain: true
}

function OSS (options) {
  this.options = Object.assign({}, defaults, options)
  this.client = axios.create({
    baseURL: `https://${this.options.bucket}.${this.options.region}.aliyuncs.com`,
    crossdomain: this.options.crossdomain
  })
}

OSS.client = axios.create()

OSS.prototype.list = function (params, options) {
  var config = Object.assign({
    method: 'GET',
    params: params
  }, options)
  return this.request(config)
    .then(function (res) {
      if (res.headers['content-type'] === 'application/xml') return res
      var parser = new Xml2js()
      res.data = parser.xml2js(res.data)
      return res
    })
}

OSS.prototype.head = function (name, options) {
  var config = Object.assign({
    method: 'HEAD',
    url: name
  }, options)
  return this.request(config)
}

OSS.prototype.get = function (name, options) {
  var config = Object.assign({
    method: 'GET',
    url: name
  }, options)
  return this.request(config)
}

OSS.prototype.put = function (name, file, options) {
  var config = Object.assign({
    method: 'PUT',
    url: name,
    data: file,
    headers: {}
  }, options)
  if (file && file.type) {
    config.headers['Content-Type'] = file.type
  }
  return this.request(config)
}

OSS.prototype.delete = function (name, options) {
  var config = Object.assign({
    method: 'DELETE',
    url: name
  }, options)
  return this.request(config)
}

OSS.prototype.request = function (config, subRes) {
  var options = this.options
  subRes = subRes || ''
  config.params = config.params || {}
  config.headers = config.headers || {}
  config.headers['x-oss-date'] = new Date().toUTCString()
  if (options.stsToken) {
    config.headers['x-oss-security-token'] = options.stsToken
  }
  var resourcePath = `/${options.bucket}/${config.url || ''}`
  var canonicalString = signUtils.buildCanonicalString(config.method, resourcePath, config.headers, subRes)
  config.headers.Authorization = signUtils.authorization(options.accessKeyId, options.accessKeySecret, canonicalString)

  return this.client.request(config)
}

module.exports = OSS
