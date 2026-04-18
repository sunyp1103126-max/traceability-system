<template>
  <el-card class="page-card">
    <template #header>
      <div class="card-header">
        <h3>检验报告</h3>
      </div>
    </template>
    
    <!-- 查询条件 -->
    <div class="search-bar">
      <el-form :inline="true" :model="searchForm" class="search-form" style="width: 100%; display: flex; justify-content: flex-start;">
        <el-form-item label="报告批次号">
          <el-input v-model="searchForm.batchNo" placeholder="请输入报告批次号" style="width: 140px"></el-input>
        </el-form-item>
        <el-form-item label="生产日期">
          <el-date-picker
            v-model="searchForm.productionDate"
            type="date"
            placeholder="选择日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            style="width: 160px"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="报告类型">
          <el-select v-model="searchForm.reportType" placeholder="请选择报告类型" style="width: 160px">
            <el-option label="全部" value=""></el-option>
            <el-option label="综合报告" value="综合报告"></el-option>
            <el-option label="单品报告" value="单品报告"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否关联">
          <el-select v-model="searchForm.isLinked" placeholder="请选择是否关联" style="width: 120px">
            <el-option label="全部" value=""></el-option>
            <el-option label="是" value="true"></el-option>
            <el-option label="否" value="false"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="margin-left: 10px;">
          <el-button type="primary" @click="handleSearch">查询</el-button>
        </el-form-item>
        <el-form-item style="margin-left: 10px;">
          <el-button type="primary" @click="goToAdd">新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    
    <!-- 表格 -->
    <el-table :data="paginatedReports" style="width: 100%" border>
      <el-table-column type="index" label="序号" width="80" :index="indexMethod"></el-table-column>
      <el-table-column prop="batchNo" label="报告批次号" min-width="180"></el-table-column>
      <el-table-column prop="productionDate" label="生产日期"></el-table-column>
      <el-table-column prop="reportType" label="报告类型"></el-table-column>
      <el-table-column label="是否关联">
        <template #default="scope">
          {{ scope.row.isLinked ? '是' : '否' }}
        </template>
      </el-table-column>
      <el-table-column label="关联商品数">
        <template #default="scope">
          {{ scope.row.isLinked ? scope.row.linkedProductCount : '--' }}
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" min-width="180">
        <template #default="scope">
          {{ formatDate(scope.row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template #default="scope">
          <el-button type="text" @click="goToLink(scope.row.batchNo)">关联商品</el-button>
          <el-button type="text" :disabled="scope.row.isLinked" @click="goToEdit(scope.row.batchNo)">编辑</el-button>
          <el-button type="text" @click="handleDelete(scope.row.batchNo)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        layout="prev, pager, next, jumper, total, sizes"
        :total="filteredReports.length"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        prev-text="<"
        next-text=">"
        page-sizes-text="条/页"
        total-text="共 {total} 条"
        jump-text="到第 {page} 页"
      ></el-pagination>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useReportStore } from '../store/report'
import { useCodeStore } from '../store/code'

const router = useRouter()
const reportStore = useReportStore()
const codeStore = useCodeStore()

// 查询条件
const searchForm = ref({
  batchNo: '',
  productionDate: '',
  reportType: '',
  isLinked: ''
})

// 分页相关
const currentPage = ref(1)
const pageSize = ref(10)

// 计算过滤后的数据
const filteredReports = computed(() => {
  return reportStore.sortedReports.filter(report => {
    // 报告批次号过滤
    if (searchForm.value.batchNo && !report.batchNo.includes(searchForm.value.batchNo)) {
      return false
    }
    // 生产日期过滤
    if (searchForm.value.productionDate && report.productionDate !== searchForm.value.productionDate) {
      return false
    }
    // 报告类型过滤
    if (searchForm.value.reportType && report.reportType !== searchForm.value.reportType) {
      return false
    }
    // 是否关联过滤
    if (searchForm.value.isLinked) {
      const isLinked = searchForm.value.isLinked === 'true'
      if (report.isLinked !== isLinked) {
        return false
      }
    }
    return true
  })
})

// 计算分页后的数据
const paginatedReports = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredReports.value.slice(start, end)
})

// 序号方法（正序）
const indexMethod = (index: number) => {
  return (currentPage.value - 1) * pageSize.value + index + 1
}

// 处理每页显示条数变化
const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
}

// 处理页码变化
const handleCurrentChange = (current: number) => {
  currentPage.value = current
}

// 处理查询
const handleSearch = () => {
  currentPage.value = 1
}

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

// 跳转到新增页面
const goToAdd = () => {
  router.push('/report/add')
}

// 跳转到编辑页面
const goToEdit = (batchNo: string) => {
  router.push(`/report/edit/${batchNo}`)
}

// 跳转到关联商品页面
const goToLink = (batchNo: string) => {
  router.push(`/report/link/${batchNo}`)
}

// 处理删除
const handleDelete = (batchNo: string) => {
  ElMessageBox.confirm('确定要删除该检验报告吗？', '删除确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const success = reportStore.deleteReport(batchNo)
    if (success) {
      ElMessage.success('删除成功')
    } else {
      ElMessage.error('删除失败')
    }
  }).catch(() => {
    // 取消删除
  })
}

// 初始化
onMounted(() => {
  // 检查是否有报告数据，如果没有，生成一些模拟数据
  if (reportStore.reports.length === 0) {
    // 生成模拟数据
    const today = new Date()
    for (let i = 0; i < 7; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const productionDate = date.toISOString().split('T')[0]
      
      // 为每个报告生成不同的创建时间
      const createDate = new Date(today)
      createDate.setDate(createDate.getDate() - i)
      createDate.setHours(9 + i, 30 + i * 5, 0, 0)
      
      const newReport = reportStore.addReport({
        productionDate,
        reportType: i === 0 ? '单品报告' : '综合报告',
        files: [`报告文件${i+1}-1.pdf`, `报告文件${i+1}-2.pdf`],
        合格证生成方式: '生成一份通用合格证'
      })
      
      // 更新创建时间为计算的时间
      reportStore.updateReport(newReport.batchNo, {
        createTime: createDate.toISOString()
      })
    }
    
    // 关联一些报告
    reportStore.linkProducts(reportStore.reports[1].batchNo, 10)
    reportStore.linkProducts(reportStore.reports[2].batchNo, 10)
    reportStore.linkProducts(reportStore.reports[3].batchNo, 10)
    reportStore.linkProducts(reportStore.reports[4].batchNo, 10)
    reportStore.linkProducts(reportStore.reports[5].batchNo, 10)
    reportStore.linkProducts(reportStore.reports[6].batchNo, 1)
  }
  
  // 更新所有报告的关联商品数量
  updateLinkedProductCounts()
})

// 更新所有报告的关联商品数量
const updateLinkedProductCounts = () => {
  reportStore.reports.forEach(report => {
    const count = codeStore.getLinkedProductCountByReportBatchNo(report.batchNo)
    if (count > 0) {
      reportStore.updateReport(report.batchNo, {
        isLinked: true,
        linkedProductCount: count
      })
    } else {
      reportStore.updateReport(report.batchNo, {
        isLinked: false,
        linkedProductCount: 0
      })
    }
  })
}
</script>

<style scoped lang="scss">
.page-card {
  margin-bottom: 20px;
  
  :deep(.el-card__header) {
    padding: 20px;
    border-bottom: 1px solid #ebeef5;
  }
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
    }
  }
  
  .search-bar {
    margin: 20px 0;
    
    .search-form {
      width: 100%;
    }
  }
  
  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
  
  // 分页组件样式
  :deep(.el-pagination__jump) {
    .el-pagination__jump-text {
      display: none;
    }
    .el-pagination__jump-text::before {
      content: '到第';
    }
    .el-pagination__jump-input {
      margin: 0 4px;
    }
    .el-pagination__jump-input + span {
      display: none;
    }
    .el-pagination__jump-input + span::after {
      content: '页';
    }
  }
  :deep(.el-pagination__sizes) {
    .el-select .el-input__wrapper {
      .el-select__caret {
        order: 2;
      }
      .el-input__inner {
        order: 1;
      }
    }
  }
}
</style>
