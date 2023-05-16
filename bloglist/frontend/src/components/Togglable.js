import { useState, useImperativeHandle, forwardRef } from 'react'
import PropTypes from 'prop-types'
import {
  Button
} from '@mui/material'

const Togglable = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(ref, () => {
    return {
      toggleVisibility
    }
  })

  return (
    <div>
      <div style={hideWhenVisible}>
        <Button variant="contained" color="primary" onClick={toggleVisibility}>
          {props.buttonLabel1}
        </Button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <Button variant="contained" color="primary" onClick={toggleVisibility}>
          {props.buttonLabel2}
        </Button>
      </div>
    </div>
  )
})

Togglable.propTypes = {
  buttonLabel1: PropTypes.string.isRequired,
  buttonLabel2: PropTypes.string.isRequired
}

Togglable.displayName = 'Togglable'

export default Togglable