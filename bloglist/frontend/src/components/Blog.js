import { useState } from 'react'

const Blog = ({ blog, username, updateBlog, deleteBlog }) => {
  const [showDetails, setShowDetails] = useState(false)
  const [buttonText, setButtonText] = useState('view')
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const detailForm = () => {
    // console.log(blog)
    return (
      <div>
        <p>{blog.url}</p>
        <div>
          likes {blog.likes}
          <button id='like-button' onClick={handleLikeClick}>like</button>
        </div>
        <p>{blog.user.name}</p>
        {username === blog.user.name && <button id='remove-button' onClick={handleRemove}>remove</button>}
      </div>)
  }

  const handleButtonClick = () => {
    if (buttonText === 'view') {
      setButtonText('hide')
    } else {
      setButtonText('view')
    }
    setShowDetails(!showDetails)
  }

  const handleLikeClick = (event) => {
    event.preventDefault()
    updateBlog(blog)
  }

  const handleRemove = (event) => {
    event.preventDefault()
    deleteBlog(blog)
  }

  return (
    <div style={blogStyle} className='blog'>
      {blog.title} {blog.author}
      <button onClick={handleButtonClick}>{buttonText}</button>
      {showDetails && detailForm()}
    </div>
  )
}

export default Blog