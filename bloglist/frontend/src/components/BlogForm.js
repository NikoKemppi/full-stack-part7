import { useState } from 'react'
import { useNotificationDispatch } from '../NotificationContext'
import {
  TextField,
  Button
} from '@mui/material'

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
          <TextField
            label="newblogtitle"
            value={title}
            onChange={event => setTitle(event.target.value)}
          />
        </div>
        <div>
          author:
          <TextField
            label="newblogauthor"
            value={author}
            onChange={event => setAuthor(event.target.value)}
          />
        </div>
        <div>
          url:
          <TextField
            label="newblogurl"
            value={url}
            onChange={event => setUrl(event.target.value)}
          />
        </div>
        <div>
          <Button variant="contained" color="secondary" type="submit">
            create
          </Button>
        </div>
      </form>
    </div>
  )
}

export default BlogForm