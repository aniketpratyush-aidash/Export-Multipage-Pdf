const launch = require('@serverless-chrome/lambda')

const handler = require('./mnqrfk73hu___getPdfContent.js')
const options = {"flags":[]}

module.exports.mergePDF = function ensureHeadlessChrome (
  event,
  context,
  callback
) {
  return (typeof launch === 'function' ? launch : launch.default)(options)
    .then(instance =>
      handler.mergePDF(event, context, callback, instance))
    .catch((error) => {
      console.error(
        'Error occured in serverless-plugin-chrome wrapper when trying to ' +
          'ensure Chrome for mergePDF() handler.',
        options,
        error
      )

      callback(error)
    })
}