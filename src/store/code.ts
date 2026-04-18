import { defineStore } from 'pinia'

export const useCodeStore = defineStore('code', {
  state: () => ({
    codes: []
  }),
  getters: {
    sortedCodes: (state) => {
      return [...state.codes].sort((a, b) => {
        return new Date(b.createTime).getTime() - new Date(a.createTime).getTime()
      })
    }
  },
  actions: {
    generateCode(product) {
      if (!product || !product.code || !product.id || !product.name || !product.category) {
        console.error('Invalid product data:', product)
        return null
      }
      
      const codeId = this.codes.length + 1
      const productCode = product.code
      const randomNum = String(Math.floor(1000 + Math.random() * 9000))
      const code = productCode + randomNum
      
      // 使用商品的创建时间作为商品码的生成时间
      const productCreateTime = product.createTime ? new Date(product.createTime) : new Date()
      const createTime = productCreateTime.toISOString()
      
      // 生成10条历史记录
      const history = []
      for (let i = 10; i >= 1; i--) {
        const date = new Date(productCreateTime)
        date.setDate(date.getDate() - (10 - i))
        date.setHours(13, 38, 24, 0)
        history.push({
          version: i,
          timestamp: date.toISOString(),
          changes: i === 10 ? '商品码创建' : `更新版本 ${i}`
        })
      }
      
      // 使用更可靠的二维码生成服务
      const qrCodeUrl = `https://quickchart.io/qr?text=${encodeURIComponent(code)}&size=200x200`
      
      const newCode = {
        id: codeId,
        code,
        productId: product.id,
        productName: product.name,
        productCategory: product.category,
        qrCode: qrCodeUrl,
        mainImage: product.mainImage, // 保存商品主图
        reportCount: 0,
        reportBatchNo: '',
        createTime: createTime,
        updateTime: createTime,
        history
      }
      
      this.codes.push(newCode)
      return newCode
    },
    getLinkedProductCountByReportBatchNo(reportBatchNo) {
      return this.codes.filter(code => code.reportBatchNo === reportBatchNo).length
    },
    associateReport(codeId) {
      const code = this.codes.find(c => c.id === codeId)
      if (code) {
        code.reportCount++
        code.updateTime = new Date().toISOString()
        code.history.push({
          version: code.history.length + 1,
          timestamp: new Date().toISOString(),
          changes: `关联报告，当前报告数：${code.reportCount}`
        })
      }
    },
    getCodeById(id) {
      return this.codes.find(c => c.id === id)
    },
    exportCodes() {
      // 模拟导出功能
      console.log('导出商品码', this.codes)
      return this.codes
    },
    getCodeByProductId(productId) {
      return this.codes.find(code => code.productId === productId)
    },
    getCodeByCode(code) {
      return this.codes.find(c => c.code === code)
    },
    updateCode(code, updates) {
      const index = this.codes.findIndex(c => c.code === code)
      if (index !== -1) {
        this.codes[index] = { ...this.codes[index], ...updates }
        return this.codes[index]
      }
      return null
    },
    generateCodesForAllProducts(products) {
      if (!products || !Array.isArray(products)) {
        console.error('Invalid products data:', products)
        return
      }
      
      products.forEach(product => {
        // 检查是否已经为该商品生成了商品码，并且product对象有效
        if (product && product.id && !this.getCodeByProductId(product.id)) {
          this.generateCode(product)
        }
      })
    }
  }
})
