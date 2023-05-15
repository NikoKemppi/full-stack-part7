import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import { useNotificationValue, useNotificationDispatch } from './NotificationContext'
import { useQuery, useMutation, useQueryClient  } from 'react-query'
import { setToken, getBlogs, createBlog, updateBlog, removeBlog } from './requests'

const App = () => {
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
  const updateBlogMutation = useMutation(updateBlog, {
    onSuccess: () => {
      queryClient.invalidateQueries('blogs')
    },
  })
  const removeBlogMutation = useMutation(removeBlog, {
    onSuccess: () => {
      queryClient.invalidateQueries('blogs')
    },
  })

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
    blogFormRef.current.toggleVisibility()
    newBlogMutation.mutate(blogObject)
  }

  const voteBlog = async (blog) => {
    console.log(blog)
    const updatedBlogObject = {
      user: blog.user.id,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url
    }

    updateBlogMutation.mutate({ id: blog.id, updatedBlog: updatedBlogObject })
  }

  const deleteBlog = async (blog) => {
    const removedId = blog.id
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      removeBlogMutation.mutate(removedId)
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
          <Blog key={blog.id} blog={blog} username={user.name} updateBlog={voteBlog} deleteBlog={deleteBlog} />
        )}
      </div>
    </div>
  )
}

export default App