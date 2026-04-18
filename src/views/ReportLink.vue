<template>
  <el-card class="page-card">
    <template #header>
      <div class="card-header">
        <h3>关联商品</h3>
      </div>
    </template>
    
    <!-- 报告信息 -->
    <div class="report-info">
        <div class="info-row">
          <div class="info-item">
            <span class="label">*生产日期：</span>
            <span class="value">{{ report?.productionDate }}</span>
          </div>
          <div class="info-item">
            <span class="label">*报告类型：</span>
            <span class="value">{{ report?.reportType }}</span>
          </div>
          <div class="info-item">
            <span class="label">*检验报告：</span>
            <div class="file-list">
              <div v-if="report?.files && report.files.length > 0" class="files-container">
                <el-dropdown trigger="click">
                  <div class="file-dropdown-toggle">
                    <span class="file-count">{{ report.files.length }} 个文件</span>
                    <i class="el-icon-arrow-down"></i>
                  </div>
                  <template #dropdown>
                    <el-dropdown-menu class="file-dropdown-menu">
                      <el-dropdown-item 
                        v-for="(file, index) in report?.files" 
                        :key="index" 
                        @click="openFile(file)"
                        class="file-dropdown-item"
                      >
                        <span class="file-icon">
                          <i v-if="file.endsWith('.pdf')" class="el-icon-document"></i>
                          <i v-else-if="file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png')" class="el-icon-picture"></i>
                          <i v-else class="el-icon-document"></i>
                        </span>
                        <span class="file-name">{{ file }}</span>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
              <div v-else class="no-files">无文件</div>
            </div>
          </div>
          <div class="info-item">
            <span class="label">*承诺达标合格证：</span>
            <span class="certificate-link" @click="viewCertificate">查看</span>
          </div>
        </div>
      </div>
      
      <!-- 查询条件 -->
      <div class="search-bar">
        <el-form :inline="true" :model="searchForm" class="search-form">
          <el-form-item label="商品名称">
            <el-input v-model="searchForm.productName" placeholder="请输入商品名称" style="width: 200px"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-select v-model="searchForm.category" placeholder="请选择商品分类" style="width: 200px">
              <el-option label="全部" value=""></el-option>
              <el-option label="蔬菜" value="蔬菜"></el-option>
              <el-option label="水果" value="水果"></el-option>
              <el-option label="茶鲜叶" value="茶鲜叶"></el-option>
              <el-option label="畜禽" value="畜禽"></el-option>
              <el-option label="禽蛋" value="禽蛋"></el-option>
              <el-option label="养殖水产品" value="养殖水产品"></el-option>
              <el-option label="其他" value="其他"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      
      <!-- 批量关联按钮 -->
      <div class="batch-action">
        <el-button type="primary" @click="batchLink" :disabled="selectedProducts.length === 0">批量关联({{ selectedProducts.length }})</el-button>
      </div>
      
      <!-- 商品分组列表 -->
      <div class="product-groups">
        <div v-for="(group, index) in productGroups" :key="group.category" class="product-group">
          <div class="group-header" @click="toggleGroup(group.category)">
            <div class="group-info">
              <span class="group-index">{{ index + 1 }}</span>
              <span class="group-title">{{ group.category }}</span>
              <el-button type="text" size="small" class="toggle-button">
                {{ group.expanded ? '收起' : '展开' }}
              </el-button>
            </div>
          </div>
          <div v-show="group.expanded" class="group-content">
            <el-table :data="group.products" style="width: 100%" border @selection-change="handleSelectionChange" :row-class-name="row => row.isLinked ? 'is-linked' : ''">
              <el-table-column type="selection" width="55" :selectable="row => !row.isLinked"></el-table-column>
              <el-table-column prop="code" label="商品编号" min-width="120"></el-table-column>
              <el-table-column prop="name" label="商品名称" min-width="180"></el-table-column>
              <el-table-column label="关联状态" width="100">
                <template #default="scope">
                  <el-tag :type="scope.row.isLinked ? 'success' : 'info'">
                    {{ scope.row.isLinked ? '已关联' : '未关联' }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="100">
                <template #default="scope">
                  <el-button 
                    type="primary" 
                    size="small" 
                    @click="linkProduct(scope.row)"
                    :disabled="scope.row.isLinked"
                  >
                    关联
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </el-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useReportStore } from '../store/report'
import { useProductStore } from '../store/product'
import { useCodeStore } from '../store/code'

const router = useRouter()
const route = useRoute()
const reportStore = useReportStore()
const productStore = useProductStore()
const codeStore = useCodeStore()

// 批次号
const batchNo = computed(() => {
  return route.params.batchNo as string
})

// 报告信息
const report = ref(null)

// 打开文件
const openFile = (file) => {
  // 检查文件类型
  const isImage = /\.(png|jpg|jpeg)$/i.test(file)
  if (isImage) {
    // 图片文件在当前页面打开
    window.open(`/uploads/${file}`, '_blank')
  } else {
    // PDF文件在新页签打开
    window.open(`/uploads/${file}`, '_blank')
  }
}

// 查看合格证
const viewCertificate = () => {
  // 这里可以实现查看合格证的逻辑
  ElMessage.info('查看合格证功能')
}

// 查询条件
const searchForm = ref({
  productName: '',
  category: ''
})

// 商品分组
const productGroups = ref([
  { category: '蔬菜', products: [], expanded: false },
  { category: '水果', products: [], expanded: false },
  { category: '茶鲜叶', products: [], expanded: false },
  { category: '畜禽', products: [], expanded: false },
  { category: '禽蛋', products: [], expanded: false },
  { category: '养殖水产品', products: [], expanded: false },
  { category: '其他', products: [], expanded: false }
])

// 选中的商品
const selectedProducts = ref([])

// 处理查询
const handleSearch = () => {
  loadProducts()
  selectedProducts.value = []
}

// 加载商品数据
const loadProducts = () => {
  // 获取所有启用的商品
  const allProducts = productStore.products.filter(product => product.status === 1)
  
  // 过滤商品
  const filteredProducts = allProducts.filter(product => {
    // 商品名称过滤
    if (searchForm.value.productName && !product.name.includes(searchForm.value.productName)) {
      return false
    }
    // 商品分类过滤
    if (searchForm.value.category && product.category !== searchForm.value.category) {
      return false
    }
    return true
  })
  
  // 按分类分组，只更新每个分组的products属性，保留expanded状态
  productGroups.value = productGroups.value.map(group => {
    const groupProducts = filteredProducts.filter(product => product.category === group.category).map(product => {
      // 检查商品是否已关联
      const code = codeStore.getCodeByProductId(product.id)
      return {
        ...product,
        isLinked: code && code.reportBatchNo === batchNo.value
      }
    })
    // 只更新products属性，保留expanded状态
    return {
      ...group,
      products: groupProducts
    }
  })
}

// 切换分组展开/收起
const toggleGroup = (category) => {
  const group = productGroups.value.find(g => g.category === category)
  if (group) {
    group.expanded = !group.expanded
  }
}

// 处理商品选择
const handleSelectionChange = (selection) => {
  console.log('handleSelectionChange called, selection:', selection)
  // 过滤掉已关联的商品
  const validSelection = selection.filter(item => !item.isLinked)
  console.log('validSelection:', validSelection)
  // 使用Vue的响应式更新方式
  selectedProducts.value = [...validSelection]
  console.log('selectedProducts updated to:', selectedProducts.value)
}

// 关联单个商品
const linkProduct = (product) => {
  // 关联商品
  const code = codeStore.getCodeByProductId(product.id)
  if (code) {
    // 更新商品码信息
    codeStore.updateCode(code.code, {
      reportBatchNo: batchNo.value,
      reportCount: (code.reportCount || 0) + 1,
      updateTime: new Date().toISOString(),
      history: [...(code.history || []), {
        version: (code.history?.length || 0) + 1,
        timestamp: new Date().toISOString(),
        changes: '关联检验报告'
      }]
    })
    ElMessage.success('关联成功')
    // 重新加载商品数据
    loadProducts()
    // 更新报告关联状态
    const count = codeStore.getLinkedProductCountByReportBatchNo(batchNo.value)
    if (report.value) {
      reportStore.linkProducts(batchNo.value, count)
    }
  } else {
    ElMessage.error('商品码不存在')
  }
}

// 批量关联商品
const batchLink = () => {
  console.log('batchLink called, selectedProducts:', selectedProducts.value)
  
  if (selectedProducts.value.length === 0) {
    ElMessage.warning('请先选择要关联的商品')
    return
  }
  
  let successCount = 0
  selectedProducts.value.forEach(product => {
    const code = codeStore.getCodeByProductId(product.id)
    if (code) {
      // 更新商品码信息
      codeStore.updateCode(code.code, {
        reportBatchNo: batchNo.value,
        reportCount: (code.reportCount || 0) + 1,
        updateTime: new Date().toISOString(),
        history: [...(code.history || []), {
          version: (code.history?.length || 0) + 1,
          timestamp: new Date().toISOString(),
          changes: '关联检验报告'
        }]
      })
      successCount++
    }
  })
  ElMessage.success(`成功关联 ${successCount} 个商品`)
  // 重新加载商品数据
  loadProducts()
  // 更新报告关联状态
  const count = codeStore.getLinkedProductCountByReportBatchNo(batchNo.value)
  if (report.value) {
    reportStore.linkProducts(batchNo.value, count)
  }
}

// 初始化
onMounted(() => {
  // 获取报告信息
  report.value = reportStore.getReport(batchNo.value)
  if (!report.value) {
    ElMessage.error('报告不存在')
    router.push('/report')
    return
  }
  
  // 加载商品数据
  loadProducts()
})
</script>

<style scoped lang="scss">
.page-card {
  margin-bottom: 20px;
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    h3 {
      margin: 0;
    }
  }
  
  .report-info {
    margin-bottom: 20px;
    padding: 15px;
    background-color: #f5f7fa;
    border-radius: 4px;
    
    .info-row {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      align-items: center;
      
      .info-item {
        display: flex;
        align-items: center;
        gap: 8px;
        
        .label {
          font-weight: 500;
        }
        
        .file-list {
          .files-container {
            display: inline-block;
            
            .file-dropdown-toggle {
              display: flex;
              align-items: center;
              gap: 5px;
              color: #409eff;
              cursor: pointer;
              padding: 5px 10px;
              border: 1px solid #dcdfe6;
              border-radius: 4px;
              background-color: #f5f7fa;
              transition: all 0.3s;
              
              &:hover {
                background-color: #ecf5ff;
                border-color: #c6e2ff;
              }
              
              .file-count {
                font-weight: 500;
              }
            }
            
            .file-dropdown-menu {
              min-width: 300px;
              
              .file-dropdown-item {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 8px 15px;
                
                .file-icon {
                  font-size: 16px;
                  color: #409eff;
                }
                
                .file-name {
                  flex: 1;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                }
                
                &:hover {
                  background-color: #ecf5ff;
                }
              }
            }
          }
          
          .no-files {
            color: #909399;
          }
        }
        
        .certificate-link {
          color: #409eff;
          cursor: pointer;
          
          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
  }
  
  .search-bar {
    margin: 20px 0 10px 0;
    
    .search-form {
      display: flex;
      align-items: center;
      width: 100%;
    }
  }
  
  .batch-action {
    margin-bottom: 20px;
  }
  
  .product-groups {
    .product-group {
      margin-bottom: 10px;
      border: 1px solid #e4e7ed;
      border-radius: 4px;
      
      .group-header {
        padding: 10px 15px;
        background-color: #f5f7fa;
        cursor: pointer;
        
        .group-info {
          display: flex;
          align-items: center;
          gap: 10px;
          
          .group-index {
            width: 20px;
            text-align: center;
          }
          
          .group-title {
            font-weight: 500;
          }
          
          .toggle-button {
            margin-left: auto;
          }
        }
      }
      
      .group-content {
        padding: 0;
        
        .el-table {
          margin-bottom: 0;
        }
        
        .el-table .el-table__row.is-linked {
          background-color: #f5f7fa !important;
          color: #909399 !important;
          
          .el-checkbox__input .el-checkbox__inner {
            background-color: #f5f7fa !important;
            border-color: #dcdfe6 !important;
            cursor: not-allowed !important;
          }
        }
      }
    }
  }
}


</style>
