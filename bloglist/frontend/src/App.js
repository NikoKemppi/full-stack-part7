import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import { useNotificationValue, useNotificationDispatch } from './NotificationContext'
import { useQuery, useMutation, useQueryClient  } from 'react-query'
import { setToken, getBlogs, createBlog } from './requests'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const queryClient = useQueryClient()
  const notification = useNotificationValue()
  const dispatch = useNotificationDispatch()
  const newBlogMutation = useMutation(createBlog, {
    onSuccess: (newBlog) => {
      const blogs = queryClient.getQueryData('blogs')
      queryClient.setQueryData('blogs', blogs.concat(newBlog))
    }
  })

  /*
  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])
  */

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
      setToken(user.token) // new version
    }
  }, [])

  const blogFormRef = useRef()

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setToken(user.token) // new version
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      dispatch({ type: 'ERROR', text: 'wrong username or password' })
      setTimeout(() => {
        dispatch({ type: 'REMOVE' })
      }, 5000)
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    try {
      window.localStorage.removeItem('loggedBlogAppUser')
      setUser(null)
      setUsername('')
      setPassword('')
    } catch (execption) {
      dispatch({ type: 'ERROR', text: 'log out failed' })
      setTimeout(() => {
        dispatch({ type: 'REMOVE' })
      }, 5000)
    }
  }

  const addBlog = async (blogObject) => {
    /*
    blogFormRef.current.toggleVisibility()
    const returnedBlog = await blogService.create(blogObject)
    returnedBlog.user = {
      id: user.id,
      name: user.name,
      username: user.username,
    }
    // console.log('modified blog: ', returnedBlog)
    setBlogs(blogs.concat(returnedBlog))
    */

    newBlogMutation.mutate(blogObject)
  }

  const updateBlog = async (blog) => {
    // console.log(blog)
    const updatedBlogObject = {
      user: blog.user.id,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url
    }
    // console.log(blog)
    const returnedBlog = await blogService.update(blog.id, updatedBlogObject)
    returnedBlog.user = blog.user
    // console.log('updated blog: ', returnedBlog)
    const updatedBlogs = blogs.map(b => b.id === blog.id ? returnedBlog : b)
    setBlogs(updatedBlogs)
  }

  const deleteBlog = async (blog) => {
    const removedId = blog.id
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      await blogService.remove(removedId)
      setBlogs(blogs.filter(b => b.id !== removedId))
    }
  }

  const result = useQuery(
    'blogs',
    getBlogs,
    {
      refetchOnWindowFocus: false
    }
  )

  if ( result.isLoading ) {
    return <div>loading data...</div>
  }

  const blogs2 = result.data
  console.log(blogs2)

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={notification} />
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              id='username'
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              id='password'
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button id="login-button" type="submit">login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <div>
        <h2>blogs</h2>
        <Notification message={notification} />
        {user.name} logged in
        <button onClick={handleLogout}>logout</button>
      </div>
      <div>
        <Togglable buttonLabel1="create new blog" buttonLabel2="cancel" ref={blogFormRef}>
          <BlogForm createBlog={addBlog} />
        </Togglable>
        {blogs2.sort((a, b) => b.likes - a.likes).map(blog =>
          <Blog key={blog.id} blog={blog} username={user.name} updateBlog={updateBlog} deleteBlog={deleteBlog} />
        )}
      </div>
    </div>
  )
}

export default App