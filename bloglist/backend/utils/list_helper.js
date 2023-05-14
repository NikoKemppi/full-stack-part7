const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  let likes = 0

  for (let i in blogs) {
    likes += blogs[i].likes
  }

  return likes
}

const favoriteBlog = (blogs) => {
  let mostLikes = 0
  let favorite = {
    title: "",
    author: "",
    likes: 0
  }

  for (let i in blogs) {
    if (mostLikes <= blogs[i].likes) {
      favorite = {
        title: blogs[i].title,
        author: blogs[i].author,
        likes: blogs[i].likes
      }
      mostLikes = blogs[i].likes
    }
  }

  return favorite
}

const mostBlogs = (blogs) => {
  var dict = {}
  let mostBlogs = {
    author: "",
    blogs: 0
  }

  for (let i in blogs) {
    if (blogs[i].author in dict) {
      dict[blogs[i].author] = dict[blogs[i].author] + 1
    } else {
      dict[blogs[i].author] = 1
    }
  }
  for (var author in dict) {
    if (mostBlogs.blogs <= dict[author]) {
      mostBlogs.author = author
      mostBlogs.blogs = dict[author]
    }
  }

  return mostBlogs
}

const mostLikes = (blogs) => {
  var dict = {}
  let mostLikes = {
    author: "",
    likes: 0
  }

  for (let i in blogs) {
    if (blogs[i].author in dict) {
      dict[blogs[i].author] = dict[blogs[i].author] + blogs[i].likes
    } else {
      dict[blogs[i].author] = blogs[i].likes
    }
  }
  for (var author in dict) {
    if (mostLikes.likes <= dict[author]) {
      mostLikes.author = author
      mostLikes.likes = dict[author]
    }
  }

  return mostLikes
}

module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}