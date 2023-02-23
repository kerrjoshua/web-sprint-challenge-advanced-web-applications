import React, { useState } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import axios from 'axios'

import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'

import { axiosWithAuth } from '../axios'


const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState()
  const [spinnerOn, setSpinnerOn] = useState(false)

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()
  const redirectToLogin = () => { navigate('/') }
  const redirectToArticles = () => { navigate('articles') }

  const logout = () => {
    // ✨ implement
    if (localStorage.getItem('token')) localStorage.removeItem('token')
    setMessage('Goodbye!')
    redirectToLogin();
  }

  const login = ({ username, password }) => {
    // ✨ implement
    setMessage('');
    setSpinnerOn(true);
    axios.post(loginUrl, { username: username, password: password })
      .then(res => {
        setMessage(res.data.message);
        localStorage.setItem('token', res.data.token);
        navigate('articles')
      })
      .catch(err => setMessage(err.message))
      .finally(setSpinnerOn(false));

    // put the server success message in its proper state, and redirect
    // to the Articles screen. Don't forget to turn off the spinner!
  }

  const getArticles = () => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch an authenticated request to the proper endpoint.
    setMessage('');
    setSpinnerOn(true);
    axiosWithAuth().get('/articles')
      .then(res => {
        setArticles(res.data.articles);
        setMessage(res.data.message)
      })
      .catch(err => {console.error(err);
        if (err.response.statusText === 'Unauthorized') {
          redirectToLogin()
        }
      })
      .finally(setSpinnerOn(false))
    // On success, we should set the articles in their proper state and
    // put the server success message in its proper state.
    // If something goes wrong, check the status of the response:
    // if it's a 401 the token might have gone bad, and we should redirect to login.
    // Don't forget to turn off the spinner!
  }

  const postArticle = article => {
    // ✨ implement
    axiosWithAuth().post('/articles', article)
      .then(res => {
        const newArticle = res.data.article;
        setArticles([...articles, newArticle]);
        setMessage(res.data.message)

      })
      .catch(err => setMessage(err.response.message))
  }

  const updateArticle = ({article_id, article }) => {
    // ✨ implement
    axiosWithAuth().put(`/articles/${article_id}`, article)
      .then(res => {
        setMessage(res.data.message);

        const idx = articles.indexOf(articles.find(art => art.article_id === article_id));
        const newArticles = [...articles.slice(0,idx),res.data.article,...articles.slice(idx + 1)];
        setArticles(newArticles)
      })
      .catch(err => setMessage(err.response.message))
  }

  const deleteArticle = article_id => {
    // ✨ implement
    axiosWithAuth().delete(`/articles/${article_id}`, article_id)
      .then(res => {
        setMessage(res.data.message);
        const newArticles = articles.filter(art => art.article_id !== article_id);
        setArticles(newArticles)})
      .catch(err => {console.error('deleteArticle catch block: ', err)})
  }

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner on={spinnerOn} />
      <Message message={message} />
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login} />} />
          <Route path="articles" element={
            <>
              <ArticleForm
                postArticle={postArticle}
                updateArticle={updateArticle}
                setCurrentArticleId={setCurrentArticleId}
                currentArticle={articles.find(art => art.article_id === currentArticleId)}
              />
              <Articles 
                articles={articles} 
                deleteArticle={deleteArticle} 
                getArticles={getArticles} 
                setCurrentArticleId={setCurrentArticleId}
                currentArticleId={currentArticleId}
              />
            </>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </>
  )
}
