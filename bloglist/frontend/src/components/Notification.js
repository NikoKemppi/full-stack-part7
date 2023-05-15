const Notification = ({ message }) => {
  if (message === 'default text') {
    return null
  } else if (message.startsWith('Error')) {
    return (
      <div className="error">
        {message}
      </div>
    )
  } else {
    return (
      <div className="success">
        {message}
      </div>
    )
  }
}

export default Notification