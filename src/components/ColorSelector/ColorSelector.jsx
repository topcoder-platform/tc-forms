import React from 'react'
import PropTypes from 'prop-types'
import { SketchPicker } from 'react-color'
import { HOC as hoc } from 'formsy-react'
import {PROJECT_MAX_COLORS} from '../../config/constants'
import CloseIcon from  '../../assets/icons/icon-close.svg'
import AddColor from  '../../assets/icons/icon-add-color.svg'
import './ColorSelector.scss'


class ColorSelector extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      isPickerVisible: false,
      newColor: '#fff'
    }
  }

  render() {
    const {getValue, name, onChange, setValue, defaultColors } = this.props
    const value = getValue() || defaultColors
    const {isPickerVisible, newColor} = this.state

    const updateNewColorPalette = (palette) => {
      setValue(palette)
      onChange(name, palette)
    }

    const onColorToggle = (color) => {
      const index = value.indexOf(color)
      let newValue
      if (index === -1) {
        newValue = [...value, color]
      } else {
        const tmp = [...value]
        tmp.splice(index, 1)
        newValue = tmp
      }

      updateNewColorPalette(newValue)
    }

    return (
      <div className="colorSelector">
        {value.map((color) => (
          <a
            key={color}
            href="javascript:"
            onClick={() => onColorToggle(color)}
            className="color-card"
            style={{backgroundColor: color}}
          >
            <span className="remove-color">
              <CloseIcon />
            </span>
          </a>
        ))}

        {value.length < PROJECT_MAX_COLORS &&
          <a
            href="javascript:"
            onClick={() => this.setState({isPickerVisible: true})}
            className="color-card"
          >
            <AddColor className="icon-card-add" />
            {isPickerVisible &&
            <div className="picker-wrapper" onClick={(e) => e.stopPropagation()}>
              <SketchPicker
                color={newColor}
                onChange={(color) => {
                  this.setState({ newColor: color.hex })
                }}
              />
              <div className="buttons">
                <button type="button" className="tc-btn tc-btn-primary tc-btn-md"
                  onClick={() => {
                    this.setState({isPickerVisible: false})
                    const index = value.indexOf(this.state.newColor)
                    if (index === -1) {
                      const newValue = [ ...value, newColor ]
                      updateNewColorPalette(newValue)
                    }
                  }}
                >Add</button>
                <button
                  type="button"
                  className="tc-btn tc-btn-default tc-btn-md"
                  onClick={() => this.setState({isPickerVisible: false})}
                >
                  Cancel
                </button>
              </div>
            </div>
            }
          </a>}
      </div>
    )
  }

}

ColorSelector.propTypes = {
  defaultColors: PropTypes.array.isRequired
}

ColorSelector.defaultProps = {
  onChange: () => {},
  value: [],
  defaultColors: []
}

export default hoc(ColorSelector)
