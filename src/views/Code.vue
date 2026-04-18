<template>
  <el-card class="page-card">
    <template #header>
      <div class="card-header">
        <h3>商品码信息</h3>
      </div>
    </template>
    
    <!-- 无数据提示 -->
    <div v-if="codeStore.sortedCodes.length === 0" class="no-data">
      <el-empty>
        <template #description>
          <div>
            <span>请先前往商品管理新增商品</span>
            <el-button type="primary" size="small" @click="goToProduct" style="margin-left: 10px">去新增</el-button>
          </div>
        </template>
      </el-empty>
    </div>
    
    <!-- 商品码列表 -->
    <div v-else class="code-list">
      <!-- 查询条件 -->
      <div class="search-bar">
        <el-form :inline="true" :model="searchForm" class="search-form">
          <el-form-item label="商品名称">
            <el-input
              v-model="searchForm.productName"
              placeholder="请输入商品名称"
              style="width: 200px"
            />
          </el-form-item>
          <el-form-item label="商品分类">
            <el-select
              v-model="searchForm.category"
              placeholder="请选择商品分类"
              style="width: 150px"
            >
              <el-option label="全部" value="" />
              <el-option label="蔬菜" value="蔬菜" />
              <el-option label="水果" value="水果" />
              <el-option label="茶鲜叶" value="茶鲜叶" />
              <el-option label="畜禽" value="畜禽" />
              <el-option label="禽蛋" value="禽蛋" />
              <el-option label="养殖水产品" value="养殖水产品" />
              <el-option label="其他" value="其他" />
            </el-select>
          </el-form-item>
          <el-form-item label="生成时间范围">
            <el-date-picker
              v-model="searchForm.dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 250px"
            />
          </el-form-item>
          <el-form-item>
            <el-button @click="handleSearch">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleExport">导出</el-button>
          </el-form-item>
        </el-form>
      </div>
      
      <el-table :data="paginatedCodes" style="width: 100%">
        <el-table-column prop="code" label="商品码编号" width="180" />
        <el-table-column prop="productName" label="商品名称" width="150" />
        <el-table-column prop="productCategory" label="商品分类" width="120" />
        <el-table-column label="二维码" width="100">
          <template #default="{ row }">
            <el-popover
              placement="top"
              :width="150"
              trigger="hover"
            >
              <template #reference>
                <el-image
                  :src="row.qrCode"
                  fit="cover"
                  style="width: 30px; height: 30px; cursor: pointer"
                  @click="downloadQrCode(row)"
                  @error="handleQrCodeError(row)"
                />
              </template>
              <el-image
                :src="row.qrCode"
                fit="cover"
                style="width: 120px; height: 120px; margin: 0 auto; display: block"
                @error="handleQrCodeError(row)"
              />
              <div style="text-align: center; margin-top: 10px">
                <el-button type="primary" size="small" @click="downloadQrCode(row)">下载</el-button>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="reportCount" label="关联报告数" width="120" />
        <el-table-column prop="createTime" label="生成时间" width="200">
          <template #default="{ row }">
            {{ formatDate(row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="更新时间" width="200">
          <template #default="{ row }">
            {{ formatDate(row.updateTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="{ row }">
            <el-button size="small" type="text" color="#409EFF" @click="previewCode(row)">预览</el-button>
            <el-button size="small" type="text" color="#409EFF" @click="showHistory(row)">历史记录</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页组件 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="prev, pager, next, jumper, total, sizes"
          :total="filteredCodes.length"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          background
        />
      </div>
    </div>
    
    <!-- 预览弹窗 -->
    <el-dialog
      v-model="previewDialogVisible"
      title="商品码预览"
      width="400px"
    >
      <div class="preview-container">
        <div class="phone-frame">
          <div class="phone-header">
            <div class="phone-camera"></div>
          </div>
          <div class="phone-content">
            <!-- 商品信息 -->
            <div class="product-info">
              <h3>产品溯源</h3>
              <!-- 商品主图 -->
              <div class="product-image">
                <el-image
                  :src="previewCodeData.mainImage"
                  fit="cover"
                  style="width: 100%; height: 150px"
                />
                <h4>{{ previewCodeData.productName }}</h4>
              </div>
              
              <!-- 原料采收 -->
              <div class="trace-section">
                <div class="section-header">
                  <span class="section-number">01</span>
                  <h5>原料采收</h5>
                </div>
                <el-image
                  :src="previewCodeData.rawMaterialImage"
                  fit="cover"
                  style="width: 100%; height: 120px; margin: 10px 0"
                />
                <p class="section-desc">{{ previewCodeData.rawMaterialDesc }}</p>
              </div>
              
              <!-- 生产加工 -->
              <div class="trace-section">
                <div class="section-header">
                  <span class="section-number">02</span>
                  <h5>生产加工</h5>
                </div>
                <el-image
                  :src="previewCodeData.productionImage"
                  fit="cover"
                  style="width: 100%; height: 120px; margin: 10px 0"
                />
                <p class="section-desc">{{ previewCodeData.productionDesc }}</p>
              </div>
              
              <!-- 基地介绍 -->
              <div class="trace-section">
                <div class="section-header">
                  <span class="section-number">03</span>
                  <h5>基地介绍</h5>
                </div>
                <el-image
                  :src="previewCodeData.baseImage"
                  fit="cover"
                  style="width: 100%; height: 120px; margin: 10px 0"
                />
                <p class="section-desc">{{ previewCodeData.baseDesc }}</p>
              </div>
              
              <!-- 生产日期选择 -->
              <div class="date-section">
                <h5>生产日期</h5>
                <el-date-picker
                  v-model="selectedDate"
                  type="date"
                  placeholder="选择生产日期"
                  style="width: 100%; margin: 10px 0"
                  @change="handleDateChange"
                />
                <div v-if="selectedDate" class="report-section">
                  <p class="report-tip">请选择生产日期后查询检验报告及承诺达标合格证</p>
                  <div class="report-item" v-for="(report, index) in previewCodeData.reports" :key="index">
                    <a href="javascript:void(0)" class="report-link">{{ report.name }}</a>
                  </div>
                </div>
              </div>
              
              <!-- 农产品承诺达标合格证 -->
              <div class="certificate-section">
                <div class="certificate-wrapper">
                  <div class="certificate-header">
                    <h5>农产品承诺达标合格证</h5>
                    <p class="certificate-number">编号：{{ previewCodeData.code }}</p>
                  </div>
                  <div class="certificate-content">
                    <p class="certificate-promise">我承诺销售的食用农产品：</p>
                    <ul class="certificate-list">
                      <li>✓ 不使用禁用农药兽药、停用兽药和非法添加物</li>
                      <li>✓ 常规农药兽药残留不超标</li>
                      <li>✓ 对承诺的真实性负责</li>
                    </ul>
                    <p class="certificate-basis">承诺依据：</p>
                    <ul class="certificate-basis-list">
                      <li>✓ 质量安全控制符合要求</li>
                      <li>✓ 自我检测合格</li>
                      <li>□ 委托检测合格</li>
                    </ul>
                    <div class="certificate-info">
                      <p>农产品名称：{{ previewCodeData.productName }}</p>
                      <p>数量(重量)：51公斤</p>
                      <p>产地：广西河池市天峨县</p>
                      <p>生产者盖章或签名：索邦宜</p>
                      <p>联系方式：{{ previewCodeData.contact }}</p>
                      <p>开具日期：{{ formatDate(new Date().toISOString()) }}</p>
                    </div>
                    <div class="certificate-footer">
                      <p>广西农产品质量安全追溯平台</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="phone-footer"></div>
        </div>
      </div>
    </el-dialog>
    
    <!-- 历史记录弹窗 -->
    <el-dialog
      v-model="historyDialogVisible"
      title="历史记录"
      width="800px"
    >
      <!-- 商品信息头部 -->
      <div class="history-header">
        <p>
          <span>商品码编号：{{ currentCode?.code }}</span>
          <span>商品名称：{{ currentCode?.productName }}</span>
          <span>商品分类：{{ currentCode?.productCategory }}</span>
        </p>
      </div>
      
      <!-- 历史记录表格 -->
      <div class="history-table-container">
        <div class="history-table-row">
          <div class="history-table-col">
            <table class="history-table">
              <thead>
                <tr>
                  <th>序号</th>
                  <th>更新时间</th>
                  <th>版本记录</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in leftHistoryData" :key="index">
                  <td>{{ index + 1 }}</td>
                  <td>{{ formatDate(item.timestamp) }}</td>
                  <td>
                    <a href="javascript:void(0)" class="preview-link" @click="previewHistory(item)">预览</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="history-table-col">
            <table class="history-table">
              <thead>
                <tr>
                  <th>序号</th>
                  <th>更新时间</th>
                  <th>版本记录</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in rightHistoryData" :key="index">
                  <td>{{ index + 6 }}</td>
                  <td>{{ formatDate(item.timestamp) }}</td>
                  <td>
                    <a href="javascript:void(0)" class="preview-link" @click="previewHistory(item)">预览</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <!-- 分页控件 -->
      <div class="history-pagination">
        <el-pagination
          v-model:current-page="historyCurrentPage"
          v-model:page-size="historyPageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="prev, pager, next, jumper, total, sizes"
          :total="historyData.length"
          @size-change="handleHistorySizeChange"
          @current-change="handleHistoryCurrentChange"
          background
        />
      </div>
    </el-dialog>
  </el-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCodeStore } from '../store/code'
import { useProductStore } from '../store/product'
import { ElMessage } from 'element-plus'

const router = useRouter()
const codeStore = useCodeStore()
const productStore = useProductStore()

// 预览弹窗
const previewDialogVisible = ref(false)
const previewCodeData = ref({
  productName: '',
  productCategory: '',
  qrCode: '',
  code: '',
  reportCount: 0,
  createTime: '',
  mainImage: '',
  rawMaterialImage: '',
  rawMaterialDesc: '',
  productionImage: '',
  productionDesc: '',
  baseImage: '',
  baseDesc: '',
  contact: '',
  reports: []
})
const selectedDate = ref(null as Date | null)

// 历史记录弹窗
const historyDialogVisible = ref(false)
const historyData = ref([])
const currentCode = ref(null)
const historyCurrentPage = ref(1)
const historyPageSize = ref(10)

// 查询条件
const searchForm = ref({
  productName: '',
  category: '',
  dateRange: null as [Date, Date] | null
})

// 分页相关
const currentPage = ref(1)
const pageSize = ref(10)

// 计算过滤后的数据
const filteredCodes = computed(() => {
  return codeStore.sortedCodes.filter(code => {
    // 商品名称过滤
    if (searchForm.value.productName && !code.productName.includes(searchForm.value.productName)) {
      return false
    }
    // 商品分类过滤
    if (searchForm.value.category && searchForm.value.category !== '' && code.productCategory !== searchForm.value.category) {
      return false
    }
    // 时间范围过滤
    if (searchForm.value.dateRange) {
      const [startDate, endDate] = searchForm.value.dateRange
      const codeDate = new Date(code.createTime)
      if (codeDate < startDate || codeDate > endDate) {
        return false
      }
    }
    return true
  })
})

// 计算分页后的数据
const paginatedCodes = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredCodes.value.slice(start, end)
})

// 处理每页显示条数变化
const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
}

// 处理页码变化
const handleCurrentChange = (current: number) => {
  currentPage.value = current
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

// 历史记录左右两列数据
const leftHistoryData = computed(() => {
  return historyData.value.slice(5, 10).reverse()
})

const rightHistoryData = computed(() => {
  return historyData.value.slice(0, 5).reverse()
})

// 处理历史记录分页
const handleHistorySizeChange = (size: number) => {
  historyPageSize.value = size
  historyCurrentPage.value = 1
}

const handleHistoryCurrentChange = (current: number) => {
  historyCurrentPage.value = current
}

// 处理查询
const handleSearch = () => {
  currentPage.value = 1 // 重置页码
}

// 处理生产日期选择
const handleDateChange = (date: Date) => {
  selectedDate.value = date
  // 这里可以根据选择的日期来更新检验报告
  console.log('选择的生产日期:', date)
}

// 预览历史记录
const previewHistory = (historyItem: any) => {
  // 预览历史版本
  console.log('预览历史版本:', historyItem)
  ElMessage.success('预览历史版本功能已触发')
}

// 跳转到商品管理
const goToProduct = () => {
  router.push('/product')
}

// 下载二维码
const downloadQrCode = (row: any) => {
  // 模拟下载功能
  ElMessage.success('二维码已下载')
  console.log('下载二维码:', row.qrCode)
}

// 处理二维码加载失败
const handleQrCodeError = (row: any) => {
  // 使用默认的二维码图片
  row.qrCode = 'https://picsum.photos/id/1/200/200'
  console.log('二维码加载失败，使用默认图片')
}

// 预览商品码
const previewCode = (row: any) => {
  // 使用商品码对象中保存的主图
  const mainImage = row.mainImage || 'https://picsum.photos/id/292/600/400'
  
  // 模拟原料采收图片
  const rawMaterialImages = [
    'https://picsum.photos/id/1059/600/400', // 农民采收蔬菜的图片
    'https://picsum.photos/id/1080/600/400',
    'https://picsum.photos/id/431/600/400'
  ]
  
  // 模拟生产加工图片
  const productionImages = [
    'https://picsum.photos/id/175/600/400', // 工厂的图片
    'https://picsum.photos/id/225/600/400',
    'https://picsum.photos/id/239/600/400'
  ]
  
  // 模拟基地介绍图片
  const baseImages = [
    'https://picsum.photos/id/106/600/400', // 大棚的图片
    'https://picsum.photos/id/1020/600/400',
    'https://picsum.photos/id/1039/600/400'
  ]
  
  // 根据商品分类选择对应的图片
  let categoryIndex = 0
  switch (row.productCategory) {
    case '蔬菜':
      categoryIndex = 0
      break
    case '水果':
      categoryIndex = 1
      break
    case '茶鲜叶':
      categoryIndex = 2
      break
    case '畜禽':
      categoryIndex = 0
      break
    case '禽蛋':
      categoryIndex = 0
      break
    case '养殖水产品':
      categoryIndex = 0
      break
    default:
      categoryIndex = 0
  }
  
  previewCodeData.value = {
    productName: row.productName,
    productCategory: row.productCategory,
    qrCode: row.qrCode,
    code: row.code,
    reportCount: row.reportCount,
    createTime: row.createTime,
    mainImage: mainImage,
    rawMaterialImage: rawMaterialImages[categoryIndex],
    rawMaterialDesc: '本产品采用优质原料，在最佳采收期进行采收，确保原料的新鲜度和营养价值。采收过程严格按照标准操作流程进行，保证原料的质量。',
    productionImage: productionImages[categoryIndex],
    productionDesc: '生产加工过程采用先进的技术和设备，严格控制生产环境和加工工艺，确保产品的品质和安全。加工过程全程监控，符合国家相关标准。',
    baseImage: baseImages[categoryIndex],
    baseDesc: '我们的生产基地位于环境优美、无污染的地区，拥有良好的生态环境和自然条件。基地采用科学的种植/养殖管理模式，确保产品的品质和安全。',
    contact: '13800138000',
    reports: [
      { name: '农药残留检测报告.pdf' },
      { name: '重金属检测报告.pdf' },
      { name: '营养成分检测报告.pdf' }
    ]
  }
  selectedDate.value = null
  previewDialogVisible.value = true
}

// 显示历史记录
const showHistory = (row: any) => {
  historyData.value = row.history
  currentCode.value = row
  historyDialogVisible.value = true
}

// 导出商品码
const handleExport = () => {
  codeStore.exportCodes()
  ElMessage.success('导出成功')
}

// 初始化
onMounted(() => {
  // 检查是否有商品，如果有商品但没有商品码，则生成商品码
  const products = productStore.products
  const codes = codeStore.codes
  
  if (products.length > 0 && codes.length === 0) {
    // 为每个商品生成商品码
    products.forEach(product => {
      codeStore.generateCode(product)
    })
  }
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
  
  .no-data {
    padding: 40px 0;
    text-align: center;
  }
  
  .search-bar {
    margin: 20px 0;
    
    .search-form {
      display: flex;
      align-items: center;
    }
  }
  
  .code-list {
    margin-top: 0;
    
    .pagination-container {
      margin-top: 20px;
      display: flex;
      justify-content: flex-end;
    }
  }
  
  .preview-container {
    display: flex;
    justify-content: center;
    
    .phone-frame {
      width: 375px;
      height: 667px;
      border: 10px solid #333;
      border-radius: 40px;
      overflow: hidden;
      background-color: #f9f9f9;
      
      .phone-header {
        height: 40px;
        background-color: #333;
        display: flex;
        justify-content: center;
        align-items: center;
        
        .phone-camera {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background-color: #666;
        }
      }
      
      .phone-content {
        height: 587px;
        overflow-y: auto;
        padding: 20px;
        background-color: #f9f9f9;
        
        .product-info {
              
              h3 {
                text-align: center;
                margin-bottom: 15px;
                color: #333;
                font-size: 16px;
                font-weight: 500;
                background-color: #f5f5f5;
                color: #333;
                padding: 12px;
                margin-top: 0;
                border-bottom: 1px solid #e4e7ed;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
              }
              
              .product-image {
                margin-bottom: 20px;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                transition: transform 0.3s ease;
                
                &:hover {
                  transform: translateY(-2px);
                }
                
                h4 {
                  text-align: center;
                  margin: 15px 0;
                  color: #333;
                  font-size: 18px;
                  font-weight: 600;
                  padding: 0 10px;
                }
              }
              
              .trace-section {
                margin-bottom: 25px;
                padding: 20px;
                background-color: white;
                border-radius: 12px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                transition: box-shadow 0.3s ease;
                
                &:hover {
                  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
                }
                
                .section-header {
                  display: flex;
                  align-items: center;
                  margin-bottom: 15px;
                  
                  .section-number {
                    display: inline-block;
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background-color: #409EFF;
                    color: white;
                    text-align: center;
                    line-height: 32px;
                    font-size: 14px;
                    font-weight: 600;
                    margin-right: 12px;
                    box-shadow: 0 2px 4px rgba(64, 158, 255, 0.3);
                  }
                  
                  h5 {
                    margin: 0;
                    color: #333;
                    font-size: 16px;
                    font-weight: 600;
                  }
                }
                
                .section-desc {
                  font-size: 14px;
                  line-height: 1.7;
                  color: #666;
                  margin-top: 10px;
                  padding: 0 5px;
                }
              }
              
              .date-section {
                margin-bottom: 25px;
                padding: 20px;
                background-color: white;
                border-radius: 12px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                
                h5 {
                  margin-bottom: 15px;
                  color: #333;
                  font-size: 16px;
                  font-weight: 600;
                  display: flex;
                  align-items: center;
                  
                  &::before {
                    content: "📅";
                    margin-right: 8px;
                  }
                }
                
                .report-section {
                  margin-top: 15px;
                  
                  .report-tip {
                    font-size: 14px;
                    color: #666;
                    margin-bottom: 15px;
                    padding: 10px;
                    background-color: #f8f9fa;
                    border-radius: 6px;
                  }
                  
                  .report-item {
                    margin-bottom: 10px;
                    padding: 12px;
                    background-color: #f0f8ff;
                    border-left: 4px solid #409EFF;
                    border-radius: 0 8px 8px 0;
                    transition: transform 0.2s ease;
                    
                    &:hover {
                      transform: translateX(5px);
                    }
                    
                    .report-link {
                      color: #409EFF;
                      text-decoration: none;
                      font-size: 14px;
                      font-weight: 500;
                      
                      &:hover {
                        text-decoration: underline;
                      }
                    }
                  }
                }
              }
              
              .certificate-section {
                margin-top: 25px;
                margin-bottom: 20px;
                
                .certificate-wrapper {
                  border: 2px solid #28a745;
                  border-radius: 12px;
                  padding: 20px;
                  background-color: #f8fff9;
                  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                  position: relative;
                  
                  .certificate-header {
                    text-align: center;
                    margin-bottom: 20px;
                    padding-bottom: 15px;
                    border-bottom: 2px dashed #28a745;
                    
                    h5 {
                      margin: 0 0 10px 0;
                      color: #28a745;
                      font-size: 18px;
                      font-weight: 600;
                    }
                    
                    .certificate-number {
                      margin: 0;
                      font-size: 14px;
                      color: #666;
                      font-weight: 500;
                    }
                  }
                  
                  .certificate-content {
                    font-size: 14px;
                    
                    .certificate-promise {
                      margin: 15px 0 10px 0;
                      font-weight: 600;
                      color: #333;
                    }
                    
                    .certificate-list {
                      margin: 0 0 15px 0;
                      padding-left: 20px;
                      
                      li {
                        margin: 10px 0;
                      }
                    }
                    
                    .certificate-basis {
                      font-weight: 600;
                      margin: 15px 0 10px 0;
                      color: #333;
                    }
                    
                    .certificate-basis-list {
                      margin: 0 0 15px 0;
                      padding-left: 20px;
                      
                      li {
                        margin: 10px 0;
                      }
                    }
                    
                    .certificate-info {
                      margin: 20px 0 0 0;
                      padding: 15px;
                      background-color: white;
                      border-radius: 8px;
                      border: 1px solid #e4e7ed;
                      
                      p {
                        margin: 10px 0;
                        font-size: 14px;
                        color: #333;
                        
                        &::before {
                          content: "•";
                          color: #28a745;
                          margin-right: 8px;
                          font-weight: bold;
                        }
                      }
                    }
                    
                    .certificate-footer {
                      margin-top: 20px;
                      text-align: center;
                      font-size: 14px;
                      color: #666;
                      padding-top: 15px;
                      border-top: 2px dashed #e4e7ed;
                      font-weight: 500;
                    }
                  }
                }
              }
            }
      }
      
      .phone-footer {
        height: 40px;
        background-color: #333;
      }
    }
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
  
  // 历史记录弹框样式
  .history-header {
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid #e4e7ed;
    
    p {
      margin: 0;
      
      span {
        margin-right: 20px;
      }
    }
  }
  
  .history-table-container {
    margin-bottom: 20px;
    
    .history-table-row {
      display: flex;
      justify-content: space-between;
      
      .history-table-col {
        flex: 1;
        margin-right: 20px;
        
        &:last-child {
          margin-right: 0;
        }
        
        .history-table {
          width: 100%;
          border-collapse: collapse;
          
          th, td {
            border: 1px solid #e4e7ed;
            padding: 10px;
            text-align: center;
          }
          
          th {
            background-color: #f5f7fa;
            font-weight: 500;
          }
          
          .preview-link {
            color: #409EFF;
            text-decoration: none;
            cursor: pointer;
            
            &:hover {
              text-decoration: underline;
            }
          }
        }
      }
    }
  }
  
  .history-pagination {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
  }
}
</style>
