import { useState } from 'react'
const Blog = ({ blog, deleteBlog, addLike }) => {
  const [extraDetails, setExtraDetails] = useState(false)
  const loggedUserJSON = JSON.parse(window.localStorage.getItem('loggedBlogappUser'))
  const showDetails = { display: extraDetails ? '' : 'none' }
  const showDelete = { display: blog.user.username === loggedUserJSON.username ? '' : 'none' }
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  return(
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author} <button onClick={ () => setExtraDetails(!extraDetails)}>{extraDetails === true ? 'Hide' : 'Show'}</button>
        <div style={showDetails}>
          {blog.url}<br/> {blog.likes}<button onClick={() => addLike(blog)}>Like</button><br/> {blog.user.name}<br/><button style={showDelete} onClick={() => deleteBlog(blog)}>Delete</button>
        </div>
      </div>
    </div> )
}

export default Blog