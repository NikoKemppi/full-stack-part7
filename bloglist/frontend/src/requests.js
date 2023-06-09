import axios from 'axios'
const baseUrl = 'http://localhost:3003/api'

let token = null

export const setToken = newToken => {
  token = `Bearer ${newToken}`
}

export const getBlogs = () =>
  axios.get(`${baseUrl}/blogs`).then(res => res.data)

export const createBlog = newBlog => {
  const config = {
    headers: { Authorization: token },
  }

  return axios.post(`${baseUrl}/blogs`, newBlog, config).then(res => res.data)
}

export const updateBlog = blog =>
  axios.put(`${ baseUrl }/blogs/${blog.id}`, blog.updatedBlog).then(res => res.data)

export const removeBlog = id => {
  const config = {
    headers: { Authorization: token },
  }

  return axios.delete(`${ baseUrl }/blogs/${id}`, config).then(res => res.data)
}

export const login = credentials =>
  axios.post(`${baseUrl}/login`, credentials).then(res => res.data)

export const addComment = x =>
  axios.post(`${baseUrl}/blogs/${x.blogid}/comments`, x).then(res => res.data)

export const getComments = () =>
  axios.get(`${baseUrl}/blogs/comments`).then(res => res.data)