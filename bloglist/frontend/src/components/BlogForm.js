import { useState } from 'react'
import { useNotificationDispatch } from '../NotificationContext'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const dispatch = useNotificationDispatch()

  const addBlog = async (event) => {
    event.preventDefault()
    try {
      createBlog({
        title: title,
        author: author,
        url: url
      })
      if (title !== '' && url !== '') {
        dispatch({ type: 'ADD', text: `${title} by ${author}` })
        setTimeout(() => {
          dispatch({ type: 'REMOVE' })
        }, 5000)
      }
      setTitle('')
      setAuthor('')
      setUrl('')
    } catch (exception) {
      dispatch({ type: 'ERROR', text: 'could not add the blog' })
      setTimeout(() => {
        dispatch({ type: 'REMOVE' })
      }, 5000)
    }
  }

  return (
    <div className='blogform'>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>
          title:
          <input
            id="newblogtitle"
            className='newblogtitle'
            value={title}
            onChange={event => setTitle(event.target.value)}
            placeholder='new blog title'
          />
        </div>
        <div>
          author:
          <input
            id="newblogauthor"
            className='newblogauthor'
            value={author}
            onChange={event => setAuthor(event.target.value)}
            placeholder='new blog author'
          />
        </div>
        <div>
          url:
          <input
            id="newblogurl"
            className='newblogurl'
            value={url}
            onChange={event => setUrl(event.target.value)}
            placeholder='new blog url'
          />
        </div>
        <button id="create-button" type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm