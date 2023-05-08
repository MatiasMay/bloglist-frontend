import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import BlogForm from './blogForm'

test('renders content', () => {
  const user = { username:'matias',name:'matias' }

  window.localStorage.setItem(
    'loggedBlogappUser', JSON.stringify(user)
  )

  const blog = {
    title: 'Some title for testing',
    author: 'Some author for testing',
    url: 'A made up URL',
    likes:0,
    user: { username:'matias',name:'matias' }
  }
  //render(<Blog blog={blog} />)
  const { container } = render(<Blog blog={blog} />)
  //screen.debug()

  const div = container.querySelector('.blog')
  expect(div).toHaveTextContent(
    'Some title for testing'
  )
  expect(div).toHaveTextContent(
    'Some author for testing'
  )
  const div2 = container.querySelector('.togglableDetails')
  expect(div2).toHaveStyle('display: none')
})

test('clicking the show button shows url and likes', async () => {
  const userInfo = { username:'matias',name:'matias' }
  window.localStorage.setItem(
    'loggedBlogappUser', JSON.stringify(userInfo)
  )

  const blog = {
    title: 'Some title for testing',
    author: 'Some author for testing',
    url: 'A made up URL',
    likes:0,
    user: { username:'matias',name:'matias' }
  }

  const { container } = render(<Blog blog={blog}/>)

  const user = userEvent.setup()
  let button = screen.getByText('Show')
  await user.click(button)

  const div2 = container.querySelector('.togglableDetails')
  expect(div2).toHaveStyle('display: block')

})

test('clicking the like button twice calls event handler twice', async () => {
  const userInfo = { username:'matias',name:'matias' }
  window.localStorage.setItem(
    'loggedBlogappUser', JSON.stringify(userInfo)
  )

  const blog = {
    title: 'Some title for testing',
    author: 'Some author for testing',
    url: 'A made up URL',
    likes:0,
    user: { username:'matias',name:'matias' }
  }

  const mockHandler = jest.fn()

  render(
    <Blog blog={blog} addLike={mockHandler} />
  )

  const user = userEvent.setup()
  let button = screen.getByText('Show')
  await user.click(button)

  button = screen.getByText('Like')
  await user.click(button)
  await user.click(button)

  expect(mockHandler.mock.calls).toHaveLength(2)

})

test('Creating a new blog uses the right props', async () => {

  const mockHandler = jest.fn()

  render(
    <BlogForm createBlog={mockHandler} />
  )

  const user = userEvent.setup()

  let button = screen.getByText('save')

  let input = screen.getByPlaceholderText('Put title here')
  await user.type(input, 'Some title for testing')

  input = screen.getByPlaceholderText('Put author here')
  await user.type(input, 'Some author for testing')

  input = screen.getByPlaceholderText('Put url here')
  await user.type(input, 'A made up URL')


  await user.click(button)

  console.log(mockHandler.mock.calls[0][0])

  expect(mockHandler.mock.calls).toHaveLength(1)
  expect(mockHandler.mock.calls[0][0]).toStrictEqual({
    title: 'Some title for testing',
    author: 'Some author for testing',
    url: 'A made up URL',
    likes:0 })

})