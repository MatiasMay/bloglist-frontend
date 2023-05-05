import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import loginService from './services/login'
import blogService from './services/blogs'
import Notification from './components/notification'
import BlogForm from './components/blogForm'
import LoginForm from './components/loginForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [message,setMessage] = useState(null)
  const [messageType,setMessageType] = useState(1)
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [newLikes, setNewLikes] = useState(0)

  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  //Metodo para desloggear
  const unlog = (event) => {
    window.localStorage.clear()
    window.location.reload(false);
  }

  //Funcion para manejar login
  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      console.log(username,password)
      const user = await loginService.login({
        username, password,
      })
      blogService.setToken(user.token)
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      setMessage(`Succesfully logged as ${username}`)
      setMessageType(2)
      setTimeout(() => {
        setMessage(null)
      }, 5000) 
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setMessage('Wrong credentials')
      setMessageType(1)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  //Funcion para añadir blogs
    const addBlog = (event) => {
      event.preventDefault()
      const blogObject = {
        title: newTitle,
        author: newAuthor,
        url: newUrl,
        likes: newLikes
      }
      blogService
        .create(blogObject)
        .then(response=>{
          setBlogs(blogs.concat(response))
          setMessage(`Succesfully posted ${newTitle} by ${newAuthor}`)
          setMessageType(2)
          setTimeout(() => {
          setMessage(null)
          }, 5000) 
          setNewTitle('')
          setNewAuthor('')
          setNewUrl('')
          setNewLikes(0)
        })
        .catch(error => {
          setMessageType(1)
          setMessage(error.response.data.error)
          setTimeout(()=>{
            setMessage(null)
          }, 5000)
        })
    }

    //Este metodo obtiene el valor del input
    const handleTitleChange = (event) => {
      //console.log(event.target.value)
      setNewTitle(event.target.value)
    }

    //Este metodo obtiene el valor del input
    const handleAuthorChange = (event) => {
      //console.log(event.target.value)
      setNewAuthor(event.target.value)
    }

    //Este metodo obtiene el valor del input
    const handleUrlChange = (event) => {
      //console.log(event.target.value)
      setNewUrl(event.target.value)
    }

    const handleLikesChange = (event) =>{
      setNewLikes(event.target.value)
    }

  return (
    <div>
      <Notification message={message} messageType={messageType}/>
      {!user &&
      <div>
      <h2>Log in to application</h2>
      <LoginForm handleLogin={handleLogin} username = {username} password={password} setUsername={setUsername} setPassword={setPassword}/>
      </div>}
        {user && <div>
        <h2>Blogs</h2>
        <p>{user.name} logged in <button type="button" onClick={unlog}>Logout</button></p>
        <h2>Create a new blog</h2>
        <BlogForm addNote={addBlog} newTitle={newTitle} handleTitleChange={handleTitleChange} newAuthor={newAuthor} handleAuthorChange={handleAuthorChange}
        newUrl={newUrl} handleUrlChange={handleUrlChange} newLikes={newLikes} handleLikesChange={handleLikesChange}/>
        <h2>Blogs created</h2>
        {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
        )}
        </div>}
    </div>
  )
}

export default App