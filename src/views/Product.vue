<template>
  <el-card class="page-card">
    <template #header>
      <div class="card-header">
        <h3>商品管理</h3>
      </div>
    </template>
    
    <div class="search-bar">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="商品名称">
          <el-input
            v-model="searchForm.name"
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
            <el-option
              v-for="category in productStore.categories"
              :key="category.value"
              :label="category.label"
              :value="category.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            v-model="searchForm.status"
            placeholder="请选择状态"
            style="width: 120px"
          >
            <el-option label="全部" value="" />
            <el-option label="启用" value="active" />
            <el-option label="停用" value="inactive" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleAdd">新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    
    <el-table :data="filteredProducts" style="width: 100%">
      <el-table-column type="index" label="序号" width="80" />
      <el-table-column prop="code" label="商品编号" width="120" />
      <el-table-column label="主图" width="100">
          <template #default="scope">
            <el-image
              :src="scope.row.mainImage"
              :preview-src-list="[scope.row.mainImage]"
              fit="cover"
              style="width: 60px; height: 60px; cursor: pointer"
              :preview-teleported="true"
            />
          </template>
        </el-table-column>
      <el-table-column prop="name" label="商品名称" />
      <el-table-column prop="category" label="商品分类" />
      <el-table-column prop="brand" label="品牌" width="120" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="scope">
          <el-switch
            :model-value="scope.row?.status"
            active-value="active"
            inactive-value="inactive"
            @change="(val: string) => handleStatusChange(scope.row.id, val)"
            :disabled="!scope.row"
          />
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="180" />
      <el-table-column label="操作" width="200">
        <template #default="scope">
          <div class="operation-buttons">
            <el-button size="small" type="text" color="#409EFF" @click="handleDetail(scope.row)" style="margin-right: 5px">详情</el-button>
            <el-button size="small" type="text" color="#409EFF" @click="handleEdit(scope.row)" style="margin-right: 5px">编辑</el-button>
            <el-button size="small" type="text" color="#409EFF" @click="handleDelete(scope.row)">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    
    <div class="pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        layout="prev, pager, next, jumper, total, sizes"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        background
      />
    </div>
    
    <!-- 删除确认对话框 -->
    <el-dialog v-model="deleteDialogVisible" title="删除" width="300px" center>
      <p>是否确认删除"{{ deleteProduct?.code }}-{{ deleteProduct?.name }}"？</p>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="deleteDialogVisible = false">取消</el-button>
          <el-button type="danger" @click="confirmDelete">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProductStore } from '../store/product'
import { ElMessage } from 'element-plus'

const router = useRouter()
const productStore = useProductStore()

// 搜索表单
const searchForm = ref({
  name: '',
  category: '',
  status: ''
})

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 删除对话框
const deleteDialogVisible = ref(false)
const deleteProduct = ref<any>(null)

// 过滤后的商品列表
const filteredProducts = computed(() => {
  let result = productStore.sortedProducts
  
  // 按商品名称搜索
  if (searchForm.value.name) {
    result = result.filter(p => p.name.includes(searchForm.value.name))
  }
  
  // 按商品分类过滤
  if (searchForm.value.category) {
    result = result.filter(p => p.category === searchForm.value.category)
  }
  
  // 按状态过滤
  if (searchForm.value.status) {
    result = result.filter(p => {
      // 确保状态值的类型一致
      const productStatus = typeof p.status === 'number' ? (p.status === 1 ? 'active' : 'inactive') : p.status
      return productStatus === searchForm.value.status
    })
  }
  
  // 更新总数
  total.value = result.length
  
  // 分页
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return result.slice(start, end)
})

// 搜索
const handleSearch = () => {
  currentPage.value = 1
}

// 添加商品
const handleAdd = () => {
  router.push('/product/add')
}

// 编辑商品
const handleEdit = (row: any) => {
  router.push(`/product/edit/${row.id}`)
}

// 查看详情
const handleDetail = (row: any) => {
  router.push(`/product/detail/${row.id}`)
}

// 删除商品
const handleDelete = (row: any) => {
  deleteProduct.value = row
  deleteDialogVisible.value = true
}

// 确认删除
const confirmDelete = () => {
  if (deleteProduct.value) {
    productStore.deleteProduct(deleteProduct.value.id)
    deleteDialogVisible.value = false
    ElMessage.success('删除成功')
  }
}

// 切换状态
const handleStatusChange = (id: number, status: string) => {
  if (id && status) {
    productStore.toggleStatus(id)
    ElMessage.success(`商品已${status === 'active' ? '启用' : '停用'}`)
  }
}

// 分页
const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
}

const handleCurrentChange = (current: number) => {
  currentPage.value = current
}

// 初始化
onMounted(() => {
  // 加载商品列表
  console.log('加载商品列表')
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
  
  .search-bar {
    margin: 20px 0 10px 0;
    
    .search-form {
      display: flex;
      align-items: center;
    }
  }
  
  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
  
  .operation-buttons {
    display: flex;
    align-items: center;
    white-space: nowrap;
  }
  
  // 删除弹框样式
  :deep(.el-dialog__header) {
    .el-dialog__title {
      font-size: 14px;
      font-weight: 500;
    }
  }
  
  :deep(.el-dialog) {
    top: 40%;
    transform: translateY(-50%);
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
  
  // 图片查看器样式
  :deep(.el-image-viewer) {
    z-index: 9999 !important;
  }
  
  // 图片查看器关闭按钮样式
  :deep(.el-image-viewer__close) {
    z-index: 10000 !important;
  }
}
</style>