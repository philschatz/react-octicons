const octicons = require('octicons')
const toPascalCase = require('to-pascal-case')
const fs = require('fs')

const SUFFIX = 'Icon'

Object.getOwnPropertyNames(octicons).forEach(function(iconName) {
  let {options, path: svgContents} = octicons[iconName]
  const {width, height, viewBox, class: className, 'aria-hidden': ariaHidden} = options

  svgContents = svgContents.replace(/fill-rule="/g, 'fillRule="')

  const componentName = `${toPascalCase(iconName)}${SUFFIX}`

  const jsxSource = `
import React, {Component} from 'react'
import PropTypes from 'prop-types'

const CLASS_NAME = '${className}'
class ${componentName} extends Component {
  render() {
    let defaults = {
      height: ${height},
      width: ${width},
      viewBox: '${viewBox}',
      'aria-hidden': ${ariaHidden}
    }

    let {className, size} = this.props
    if (className) {
      className = CLASS_NAME + ' ' + className
    } else {
      className = CLASS_NAME
    }

    if (size === 'mega') {
      defaults.height *= 2
      defaults.width *= 2
    }

    return (
      <svg {...defaults} {...this.props} className={className}>
        ${svgContents}
      </svg>
    )
  }
}
${componentName}.propTypes = {
  className: PropTypes.string
}
export default ${componentName}
`

  fs.writeFileSync(`./src/${iconName}.jsx`, jsxSource)
})


var allComponents = Object.getOwnPropertyNames(octicons).map(function(iconName) {
  const componentName = `${toPascalCase(iconName)}${SUFFIX}`
  return `
import ${componentName} from './${iconName}'
export {${componentName}}
`
})

const indexSource = allComponents.join('\n')

fs.writeFileSync('./src/index.js', indexSource)
