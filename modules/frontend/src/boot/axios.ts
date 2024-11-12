import { boot } from "quasar/wrappers"
import axios, { AxiosInstance } from "axios"

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $api: AxiosInstance;
  }
}

const api = axios.create({
  baseURL: "http://localhost:3333"
})

export default boot(({ app, router }) => {
  // Boot setup code
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api

  api.interceptors.request.use(
    (config: any) => {
      const token = localStorage.getItem("token")
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error: any) => Promise.reject(error)
  )

  api.interceptors.response.use(
    (response: any) => response,
    async (error: any) => {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        if (router) {
          await router.push("/login")
        }
      }
      return Promise.reject(error)
    }
  )
})

export { axios, api }
