import axios from 'axios';

const endPoint = 'http://localhost:8001'

const getWords = () => axios.get(`${endPoint}/words`).then(res => {
  return res.data
})

const post = ({url, data, method}) => {
  return axios({
    url: `${endPoint}${url}`,
    method,
    data
  })
}

const createWord = (word) => {
  const { native, foreign } = word
  return post({
    url: `/words`,
    data: { native, foreign },
    method: "POST"
  })
}

const updateWord = (id, native) => {
  return post({
    url: `/words/${id}`,
    data: { native },
    method: "PUT"
  })
}

const deleteWord = (id) => {
  return post({
    url: `/words/${id}`,
    data: { id },
    method: "DELETE"
  })
}

// DEBUG
const testRequest = () => {
  axios({
    method: 'post',
    url: `${endPoint}/test`,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: {
      parameter: "hello"
    }
  })
}

export {
  getWords,
  createWord,
  updateWord,
  deleteWord,
  testRequest
}