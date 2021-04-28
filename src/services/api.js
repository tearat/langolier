import axios from 'axios';

const endPoint = 'http://localhost:8001'

const getWords = () => axios.get(`${endPoint}/words`).then(res => res.data)

const post = ({url, data}) => {
  return axios({
    method: 'post',
    url: `${endPoint}${url}`,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data
  })
}

const postWord = (word) => {
  const { native, foreign } = word
  return post({
    url: `/words`,
    data: { native, foreign }
  })
}

const updateWord = (id, native) => {
  return post({
    url: `/words/${id}`,
    data: { id, native }
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
  postWord,
  updateWord,
  testRequest
}