import { useEffect, useRef } from 'react'
import { useState } from 'react'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import { useNotificationValue, useNotificationDispatch } from './NotificationContext'
import { useUserValue, useUserDispatch } from './UserContext'
import { useQuery, useMutation, useQueryClient  } from 'react-query'
import { Routes, Route } from 'react-router-dom'
import { useMatch } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { setToken, getBlogs, createBlog, updateBlog, login, addComment, getComments } from './requests'
// import { removeBlog } from './requests'
import axios from 'axios'

const Menu = ({ name, handleLogout }) => {
  const padding = {
    paddingRight: 5
  }
  return (
    <div>
      <Link style={padding} to="/">blogs</Link>
      <Link style={padding} to="/users">users</Link>
      {name} logged in
      <button onClick={handleLogout}>logout</button>
    </div>
  )
}

const Home = ({ blogs, addBlog, blogFormRef }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div>
      <Togglable buttonLabel1="create new blog" buttonLabel2="cancel" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>
      {blogs.sort((a, b) => b.likes - a.likes).map(blog =>
        <div style={blogStyle} key={blog.id}>
          <Link to={`/blogs/${blog.id}`}>{blog.title} {blog.author}</Link>
        </div>
      )}
    </div>
  )
}

const Users = ({ users }) => {
  console.log('users:', users)

  return (
    <div>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user =>
            <tr key={user.id}>
              <td><Link to={`/users/${user.id}`}>{user.name}</Link></td>
              <td>{user.blogs.length}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

const User = ({ user }) => {
  console.log(user)
  if (!user) {
    return null
  }

  return (
    <div>
      <h2>{user.name}</h2>
      <h3>added blogs</h3>
      <ul>
        {user.blogs.map(blog =>
          <li key={blog.id}>{blog.title}</li>
        )}
      </ul>
    </div>
  )
}

const SingleBlog = ({ blog, voteBlog, comments, commentBlog }) => {
  console.log(blog)
  if (!blog) {
    return null
  }

  const [comment, setComment] = useState('')

  const notificationDispatch = useNotificationDispatch()

  const handleLikeClick = async (event) => {
    event.preventDefault()
    voteBlog(blog)
  }

  const addComment = async (event) => {
    event.preventDefault()
    try {
      commentBlog({ blogid: blog.id, content: comment })
      if (comment !== '') {
        notificationDispatch({ type: 'COMMENT', text: comment })
        setTimeout(() => {
          notificationDispatch({ type: 'REMOVE' })
        }, 5000)
      }
      setComment('')
    } catch (exception) {
      notificationDispatch({ type: 'ERROR', text: 'could not add the comment' })
      setTimeout(() => {
        notificationDispatch({ type: 'REMOVE' })
      }, 5000)
    }
  }

  const blogComments = comments.filter(c => c.blogid === blog.id)

  return (
    <div>
      <h2>{blog.title} {blog.author}</h2>
      <p><a href={blog.url}>{blog.url}</a></p>
      <div>
        {blog.likes} likes
        <button id='like-button' onClick={handleLikeClick}>like</button>
      </div>
      <p>added by {blog.user.name}</p>
      <div>
        <h3>comments</h3>
        <form onSubmit={addComment}>
          <div>
            <input
              value={comment}
              onChange={event => setComment(event.target.value)}
              placeholder='new comment'
            />
          </div>
          <button id="create-button" type="submit">add comment</button>
        </form>
        <ul>
          {blogComments.map(comment =>
            <li key={comment.id}>{comment.content}</li>
          )}
        </ul>
      </div>
    </div>
  )
}

const App = () => {
  const [users, setUsers] = useState([])

  const queryClient = useQueryClient()
  const notification = useNotificationValue()
  const notificationDispatch = useNotificationDispatch()
  const user2 = useUserValue()
  const userDispatch = useUserDispatch()

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
  /*
  const removeBlogMutation = useMutation(removeBlog, {
    onSuccess: () => {
      queryClient.invalidateQueries('blogs')
    },
  })
  */
  const newCommentMutation = useMutation(addComment, {
    onSuccess: (newComment) => {
      const comments = queryClient.getQueryData('comments')
      queryClient.setQueryData('comments', comments.concat(newComment))
    }
  })

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      // setUser(user)
      userDispatch({ type: 'SET_USER', user: user })
      // blogService.setToken(user.token)
      setToken(user.token) // new version
    }
  }, [])

  useEffect(() => {
    async function fetchData() {
      const response = await axios.get('http://localhost:3003/api/users')
      console.log('fetch:', response.data)
      setUsers(response.data)
    }
    fetchData()
  }, [])

  const blogFormRef = useRef()

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const username = user2.username
      const password = user2.password
      /*
      const user = await loginService.login({
        username, password,
      })
      */
      const user = await login({ username: username, password: password })
      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      )
      // blogService.setToken(user.token)
      setToken(user.token) // new version
      // setUser(user)
      // setUsername('')
      // setPassword('')
      userDispatch({ type: 'LOGIN', user: user })
    } catch (exception) {
      notificationDispatch({ type: 'ERROR', text: 'wrong username or password' })
      setTimeout(() => {
        notificationDispatch({ type: 'REMOVE' })
      }, 5000)
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    try {
      window.localStorage.removeItem('loggedBlogAppUser')
      // setUser(null)
      // setUsername('')
      // setPassword('')
      userDispatch({ type: 'LOGOUT' })
    } catch (execption) {
      notificationDispatch({ type: 'ERROR', text: 'log out failed' })
      setTimeout(() => {
        notificationDispatch({ type: 'REMOVE' })
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

  /*
  const deleteBlog = async (blog) => {
    const removedId = blog.id
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      removeBlogMutation.mutate(removedId)
    }
  }
  */

  const commentBlog = async (comment) => {
    console.log('comment:', comment)
    newCommentMutation.mutate({ blogid: comment.blogid, content: comment.content })
  }

  const result = useQuery(
    'blogs',
    getBlogs,
    {
      refetchOnWindowFocus: false
    }
  )
  const result2 = useQuery(
    'comments',
    getComments,
    {
      refetchOnWindowFocus: false
    }
  )

  const userMatch = useMatch('/users/:id')
  const blogMatch = useMatch('/blogs/:id')

  if ( result.isLoading || result2.isLoading ) {
    return <div>loading data...</div>
  }

  const blogs2 = result.data
  console.log('blogs2', blogs2)
  const comments = result2.data
  console.log('comments', comments)

  const user = userMatch ? users.find(a => a.id === userMatch.params.id) : null
  const blog = blogMatch ? blogs2.find(a => a.id === blogMatch.params.id) : null

  if (user2.user === null) {
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
              value={user2.username}
              name="Username"
              onChange={({ target }) => userDispatch({ type: 'SET_USERNAME', username: target.value }) /*setUsername(target.value)*/ }
            />
          </div>
          <div>
            password
            <input
              id='password'
              type="password"
              value={user2.password}
              name="Password"
              onChange={({ target }) => userDispatch({ type: 'SET_PASSWORD', password: target.value }) /*setPassword(target.value)*/ }
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
        <Menu name={user2.user.name} handleLogout={handleLogout} />
        <h2>blog app</h2>
        <Notification message={notification} />
      </div>
      <Routes>
        <Route path="/users/:id" element={<User user={user} />}/>
        <Route path="/blogs/:id" element={<SingleBlog blog={blog} voteBlog={voteBlog} comments={comments} commentBlog={commentBlog} />}/>
        <Route path="/" element={<Home blogs={blogs2} addBlog={addBlog} blogFormRef={blogFormRef} />} />
        <Route path="/users" element={<Users users={users} />} />
      </Routes>
    </div>
  )
}

export default App