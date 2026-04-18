import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    userInfo: {
      name: '',
      avatar: ''
    }
  }),
  actions: {
    setToken(token: string) {
      this.token = token
      localStorage.setItem('token', token)
    },
    setUserInfo(info: any) {
      this.userInfo = info
    },
    logout() {
      this.token = ''
      this.userInfo = {
        name: '',
        avatar: ''
      }
      localStorage.removeItem('token')
    }
  }
})