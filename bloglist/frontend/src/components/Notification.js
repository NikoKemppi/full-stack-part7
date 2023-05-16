import {
  Alert
} from '@mui/material'

const Notification = ({ message }) => {
  if (message === 'default text') {
    return null
  } else if (message.startsWith('Error')) {
    return (
      <Alert severity="error">
        {message}
      </Alert>
    )
  } else {
    return (
      <Alert severity="success">
        {message}
      </Alert>
    )
  }
}

export default Notification