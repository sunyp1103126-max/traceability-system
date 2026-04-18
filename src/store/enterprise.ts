import { defineStore } from 'pinia'

export const useEnterpriseStore = defineStore('enterprise', {
  state: () => ({
    enterpriseInfo: {
      name: '绿色农业科技有限公司',
      contact: '张三',
      address: '北京市朝阳区'
    },
    isEditing: false
  }),
  actions: {
    updateEnterpriseInfo(info) {
      this.enterpriseInfo = { ...info }
    },
    setEditing(status) {
      this.isEditing = status
    },
    // 模拟保存数据
    saveEnterpriseInfo(info) {
      // 模拟API请求延迟
      return new Promise((resolve) => {
        setTimeout(() => {
          this.updateEnterpriseInfo(info)
          this.setEditing(false)
          resolve(true)
        }, 500)
      })
    }
  }
})