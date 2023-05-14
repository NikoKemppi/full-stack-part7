import { useState } from 'react'

const BlogForm = ({ createBlog, setMessage }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    try {
      createBlog({
        title: title,
        author: author,
        url: url
      })
      if (title !== '' && url !== '') {
        setMessage(`a new blog ${title} by ${author} added`)
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      }
      setTitle('')
      setAuthor('')
      setUrl('')
    } catch (exception) {
      setMessage('Error: could not add the blog')
      setTimeout(() => {
        setMessage(null)
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