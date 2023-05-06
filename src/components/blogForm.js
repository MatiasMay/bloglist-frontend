import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [newLikes, setNewLikes] = useState(0)


  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl,
      likes: newLikes
    })
    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
    setNewLikes(0)
  }
  return(
    <form onSubmit={addBlog}>
      <p>Titulo:
        <input
          value={newTitle}
          onChange={event => setNewTitle(event.target.value)}
        /> </p>
      <p>Autor:
        <input
          value={newAuthor}
          onChange={event => setNewAuthor(event.target.value)}
        /></p>
      <p>Url:
        <input
          value={newUrl}
          onChange={event => setNewUrl(event.target.value)}
        /></p>
      <p>Likes:
        <input type="number"
          value={newLikes}
          onChange={event => setNewLikes(event.target.value)}
        /></p>
      <button type="submit">save</button>
    </form>
  )
}

export default BlogForm