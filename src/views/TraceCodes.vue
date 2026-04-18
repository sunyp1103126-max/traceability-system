<template>
  <div class="trace-codes">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>溯源码管理</span>
          <el-button type="primary" @click="handleGenerateCodes">
            <el-icon><Plus /></el-icon>
            生成溯源码
          </el-button>
        </div>
      </template>
      <div class="search-bar">
        <el-form :inline="true" :model="searchForm">
          <el-form-item label="溯源码">
            <el-input v-model="searchForm.code" placeholder="请输入溯源码" style="width: 200px" />
          </el-form-item>
          <el-form-item label="产品">
            <el-select v-model="searchForm.productId" placeholder="请选择产品" style="width: 200px">
              <el-option v-for="product in products" :key="product.id" :label="product.name" :value="product.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="searchForm.status" placeholder="请选择状态" style="width: 150px">
              <el-option label="未使用" value="0" />
              <el-option label="已使用" value="1" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">
              <el-icon><Search /></el-icon>
              搜索
            </el-button>
            <el-button @click="resetForm">
              <el-icon><Refresh /></el-icon>
              重置
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table :data="traceCodes" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="code" label="溯源码" min-width="200" />
        <el-table-column prop="productName" label="产品名称" width="150" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 0 ? 'info' : 'success'">
              {{ scope.row.status === 0 ? '未使用' : '已使用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="180" />
        <el-table-column prop="usedAt" label="使用时间" width="180" />
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleView(scope.row)">
              <el-icon><View /></el-icon>
              查看
            </el-button>
            <el-button type="danger" size="small" @click="handleDelete(scope.row.id)">
              <el-icon><Delete /></el-icon>
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          v-model:current-page="pagination.currentPage"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 生成溯源码对话框 -->
    <el-dialog
      v-model="dialogVisible"
      title="生成溯源码"
      width="500px"
    >
      <el-form :model="generateForm" label-width="100px">
        <el-form-item label="产品">
          <el-select v-model="generateForm.productId" placeholder="请选择产品" style="width: 100%">
            <el-option v-for="product in products" :key="product.id" :label="product.name" :value="product.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="生成数量">
          <el-input v-model.number="generateForm.count" placeholder="请输入生成数量" style="width: 100%" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="generateCodes">生成</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Plus, Search, Refresh, View, Delete } from '@element-plus/icons-vue'

interface TraceCode {
  id: number
  code: string
  productName: string
  status: number
  createdAt: string
  usedAt: string | null
}

interface Product {
  id: number
  name: string
}

interface SearchForm {
  code: string
  productId: number | null
  status: number | null
}

interface GenerateForm {
  productId: number | null
  count: number
}

interface Pagination {
  currentPage: number
  pageSize: number
  total: number
}

const traceCodes = ref<TraceCode[]>([])
const products = ref<Product[]>([
  { id: 1, name: '苹果手机' },
  { id: 2, name: '华为手机' },
  { id: 3, name: '小米手机' }
])

const searchForm = ref<SearchForm>({
  code: '',
  productId: null,
  status: null
})

const generateForm = ref<GenerateForm>({
  productId: null,
  count: 10
})

const pagination = ref<Pagination>({
  currentPage: 1,
  pageSize: 10,
  total: 100
})

const dialogVisible = ref(false)

const handleSearch = () => {
  // 这里可以添加搜索逻辑
  console.log('搜索', searchForm.value)
}

const resetForm = () => {
  searchForm.value = {
    code: '',
    productId: null,
    status: null
  }
}

const handleGenerateCodes = () => {
  dialogVisible.value = true
}

const generateCodes = () => {
  // 这里可以添加生成溯源码的逻辑
  console.log('生成溯源码', generateForm.value)
  dialogVisible.value = false
}

const handleView = (row: TraceCode) => {
  // 这里可以添加查看溯源码详情的逻辑
  console.log('查看溯源码', row)
}

const handleDelete = (id: number) => {
  // 这里可以添加删除溯源码的逻辑
  console.log('删除溯源码', id)
}

const handleSizeChange = (size: number) => {
  pagination.value.pageSize = size
  // 这里可以添加分页逻辑
  console.log('每页条数改变', size)
}

const handleCurrentChange = (current: number) => {
  pagination.value.currentPage = current
  // 这里可以添加分页逻辑
  console.log('当前页码改变', current)
}

onMounted(() => {
  // 这里可以添加获取溯源码列表的API调用
  // 模拟数据
  traceCodes.value = Array.from({ length: 10 }, (_, index) => ({
    id: index + 1,
    code: `TRACE${10000 + index}`,
    productName: products.value[Math.floor(Math.random() * products.value.length)].name,
    status: Math.random() > 0.5 ? 1 : 0,
    createdAt: new Date().toISOString(),
    usedAt: Math.random() > 0.5 ? new Date().toISOString() : null
  }))
})
</script>

<style scoped lang="scss">
.trace-codes {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .search-bar {
    margin-bottom: 20px;
  }

  .pagination {
    margin-top: 20px;
    text-align: right;
  }
}
</style>