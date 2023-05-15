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