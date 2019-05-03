import React from 'react'
import PropTypes from 'prop-types'
import { defaultProps } from 'recompose'
import IconUIBoldAdd from  '../../assets/icons/icon-ui-bold-add.svg'
import IconUITrashSimple from  '../../assets/icons/icon-ui-trash-simple.svg'
import './Panel.scss'
import cn from 'classnames'

// main container
const Panel = ({children, className}) => (
  <div className={cn('panel', className)}>
    {children}
  </div>
)

Panel.propTypes = {
  children: PropTypes.any.isRequired,
  className: PropTypes.string
}

const Title = ({children}) => (
  <div className="panel-title">
    {children}
  </div>
)

Title.propTypes = {
  children: PropTypes.any.isRequired
}

const ActionBtn = ({children, onClick, type}) => (
  <a href="javascript:" onClick={onClick} className="btn-action" title={children}>
    { type === 'add' && <i className="plus"><IconUIBoldAdd /></i> }
    { type === 'remove' && <i className="remove"><IconUITrashSimple /></i> }
  </a>
)

ActionBtn.propTypes = {
  children: PropTypes.any,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['add', 'remove']).isRequired
}


const Body = ({children, active, className}) => (
  <div className={cn('panel-body', className, {active})}>
    {children}
  </div>
)

Body.propTypes = {
  children: PropTypes.any.isRequired,
  active: PropTypes.any
}

Panel.Title = Title
Panel.Body = Body
Panel.AddBtn = defaultProps({ type: 'add'})(ActionBtn)
Panel.DeleteBtn = defaultProps({ type: 'remove'})(ActionBtn)

export default Panel
