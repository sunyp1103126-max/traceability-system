import { defineStore } from 'pinia'

export const useReportStore = defineStore('report', {
  state: () => ({
    reports: [],
    currentReport: null
  }),
  getters: {
    sortedReports: (state) => {
      return [...state.reports].sort((a, b) => {
        return new Date(b.createTime).getTime() - new Date(a.createTime).getTime()
      })
    }
  },
  actions: {
    generateBatchNo() {
      const today = new Date()
      const year = today.getFullYear()
      const month = String(today.getMonth() + 1).padStart(2, '0')
      const day = String(today.getDate()).padStart(2, '0')
      
      // 计算今天的报告数量，生成顺序数字
      const todayStr = `${year}${month}${day}`
      const todayReports = this.reports.filter(report => 
        report.batchNo.includes(todayStr)
      )
      const sequence = String(todayReports.length + 1).padStart(4, '0')
      
      return `RPT-${todayStr}-${sequence}`
    },
    addReport(report) {
      // 生成随机的时分秒
      const hours = String(Math.floor(Math.random() * 24)).padStart(2, '0')
      const minutes = String(Math.floor(Math.random() * 60)).padStart(2, '0')
      const seconds = String(Math.floor(Math.random() * 60)).padStart(2, '0')
      
      const now = new Date()
      now.setHours(parseInt(hours), parseInt(minutes), parseInt(seconds), 0)
      
      const newReport = {
        id: Date.now().toString(),
        batchNo: this.generateBatchNo(),
        isLinked: false,
        linkedProductCount: 0,
        createTime: now.toISOString(),
        ...report
      }
      this.reports.push(newReport)
      return newReport
    },
    getReport(batchNo) {
      return this.reports.find(report => report.batchNo === batchNo)
    },
    updateReport(batchNo, updates) {
      const index = this.reports.findIndex(report => report.batchNo === batchNo)
      if (index !== -1) {
        this.reports[index] = { ...this.reports[index], ...updates }
        return this.reports[index]
      }
      return null
    },
    linkProducts(batchNo, productCount) {
      return this.updateReport(batchNo, {
        isLinked: true,
        linkedProductCount: productCount
      })
    },
    deleteReport(batchNo) {
      const index = this.reports.findIndex(report => report.batchNo === batchNo)
      if (index !== -1) {
        this.reports.splice(index, 1)
        return true
      }
      return false
    },
    exportReports() {
      // 模拟导出功能
      console.log('导出检验报告')
    }
  }
})
