import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'

describe('<Blog />', () => {
  let container
  const mockHandler1 = jest.fn()
  const mockHandler2 = jest.fn()
  const blog = {
    user: {
      username: 'Username',
      name:'Name',
      id: '123456789a',
    },
    likes: 10,
    author: 'John Doe',
    title: 'Stories about Cards',
    url: 'www.blogit.com/cards',
    id: 'abc123'
  }

  beforeEach(() => {
    container = render(
      <Blog blog={blog} username={blog.user.name} updateBlog={mockHandler1} deleteBlog={mockHandler2} />
    ).container
  })

  test('the default blog component renders title and author, but not URL nor number of likes', () => {
    const div = container.querySelector('.blog')
    expect(div).toHaveTextContent(blog.title)
    expect(div).toHaveTextContent(blog.author)
    expect(div).not.toHaveTextContent(blog.url)
    expect(div).not.toHaveTextContent(blog.likes)
  })

  test('the blog shows URL and number of likes after clicking view button', async () => {
    const div = container.querySelector('.blog')
    expect(div).toHaveTextContent(blog.title)
    expect(div).toHaveTextContent(blog.author)
    expect(div).not.toHaveTextContent(blog.url)
    expect(div).not.toHaveTextContent(blog.likes)

    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    screen.debug(div)
    expect(div).toHaveTextContent(blog.url)
    expect(div).toHaveTextContent(blog.likes)
  })

  test('ckicking the like button twice calls event handlers twice', async () => {
    const user = userEvent.setup()
    let button = screen.getByText('view')
    await user.click(button)
    button = screen.getByText('like')
    await user.click(button)
    await user.click(button)

    expect(mockHandler1.mock.calls).toHaveLength(2)
  })
})

describe('<BlogForm />', () => {
  const mockHandlerAdd = jest.fn()
  const mockHandlerMessage = jest.fn()

  beforeEach(() => {
    render(<BlogForm createBlog={mockHandlerAdd} setMessage={mockHandlerMessage} />)
  })

  test('the form calls the event handler it received when a blog is created', async () => {
    const user = userEvent.setup()
    const input1 = screen.getByPlaceholderText('new blog title')
    const input2 = screen.getByPlaceholderText('new blog author')
    const input3 = screen.getByPlaceholderText('new blog url')
    const button = screen.getByText('create')

    await userEvent.type(input1, 'Willie Watson')
    await userEvent.type(input2, 'Sherlock Holmes Fan Club')
    await userEvent.type(input3, 'www.blogit.com/sherlock')
    await user.click(button)

    console.log(mockHandlerAdd.mock)
    expect(mockHandlerAdd.mock.calls).toHaveLength(1) // details still needed
    expect(mockHandlerAdd.mock.lastCall).toEqual(
      [{
        title: 'Willie Watson',
        author: 'Sherlock Holmes Fan Club',
        url: 'www.blogit.com/sherlock'
      }]
    )
  })
})
