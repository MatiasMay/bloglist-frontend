import React from "react"

const blogForm = ({addNote, newTitle, newAuthor, newUrl, newLikes, handleTitleChange, handleAuthorChange, handleUrlChange, handleLikesChange}) => (
    <form onSubmit={addNote}>
      <p>Titulo: 
      <input
        value={newTitle}
        onChange={handleTitleChange}
      /></p>
      <p>Autor: 
      <input
        value={newAuthor}
        onChange={handleAuthorChange}
      /></p>
      <p>Url: 
      <input
        value={newUrl}
        onChange={handleUrlChange}
      /></p>
      <p>Likes: 
      <input type="number"
        value={newLikes}
        onChange={handleLikesChange}
      /></p>
      <button type="submit">save</button>
    </form>  
  )

export default blogForm