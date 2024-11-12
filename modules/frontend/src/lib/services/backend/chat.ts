import { axios } from "boot/axios"

export function getPublicChats(query = '') {
  return axios.get('/chat/public?search=' + query)
}
