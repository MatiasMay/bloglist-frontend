import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import loginService from './services/login'
import blogService from './services/blogs'
import Notification from './components/notification'
import BlogForm from './components/blogForm'
import LoginForm from './components/loginForm'
import Togglable from './components/Toggable'

const App = () => {
  const blogFormRef = useRef()
  const [blogs, setBlogs] = useState([])
  const [message,setMessage] = useState(null)
  const [messageType,setMessageType] = useState(1)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      //Aparecen ordenados de mayor número de likes a menor
      setBlogs(blogs.sort((a,b) => b.likes - a.likes))
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
  const unlog = () => {
    window.localStorage.clear()
    window.location.reload(false)
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
  const createBlog = (blogObject) => {
    blogService
      .create(blogObject)
      .then(response => {
        const userToCheck = JSON.parse(window.localStorage.getItem('loggedBlogappUser'))
        response.user = userToCheck
        setBlogs(blogs.concat(response))
        //Another way to do it below
        /*blogService.getAll().then(blogs =>
          setBlogs( blogs )
        )*/
        setMessage(`Succesfully posted ${blogObject.title} by ${blogObject.author}`)
        setMessageType(2)
        blogFormRef.current.toggleVisibility()
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      })
      .catch(error => {
        setMessageType(1)
        setMessage(error.response.data.error)
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      })
  }

  const addLike = (blog) => {
    blog.likes = blog.likes + 1
    blogService
      .update(blog.id,blog)
      .then(
        setBlogs(blogs.map(x => x.id !== blog.id ? x: blog))
      )
      .catch(() => {
        setMessageType(1)
        setMessage(`Information from ${blog.name} was already deleted from server`)
        setTimeout(() => {
          setMessage(null)
        }, 5000)
        setBlogs(blogs.filter(x => x.id !== blog.id))
      })
  }

  const deleteBlog = (blog) => {
    if (window.confirm(`Delete ${blog.title}?`)){
      blogService
        .anihilate(blog.id)
        .then(() => {
          setBlogs(blogs.filter(x => x.id !== blog.id))
          setMessageType(2)
          setMessage(`Blog: ${blog.title} by ${blog.author} deleted!`)
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        }
        ).catch(error => {
          setMessageType(1)
          setMessage(error.response.data.error)
          setTimeout(() => {
            setMessage(null)
          }, 5000)
          if(error.response.status !== 401){
            setBlogs(blogs.filter(x => x.id !== blog.id))
          }
        })
    }
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
        <Togglable buttonLabel='Create new blog' ref={blogFormRef}>
          <h2>Create a new blog</h2>
          <BlogForm createBlog={createBlog}/>
        </Togglable>
        <h2>Blogs created</h2>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} deleteBlog={deleteBlog} addLike={addLike}/>
        )}
      </div>}
    </div>
  )
}

export default App