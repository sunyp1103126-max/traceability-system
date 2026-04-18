<template>
  <div class="users">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>用户管理</span>
          <el-button type="primary" @click="handleAddUser">
            <el-icon><Plus /></el-icon>
            添加用户
          </el-button>
        </div>
      </template>
      <div class="search-bar">
        <el-form :inline="true" :model="searchForm">
          <el-form-item label="用户名">
            <el-input v-model="searchForm.username" placeholder="请输入用户名" style="width: 200px" />
          </el-form-item>
          <el-form-item label="角色">
            <el-select v-model="searchForm.role" placeholder="请选择角色" style="width: 150px">
              <el-option label="管理员" value="admin" />
              <el-option label="普通用户" value="user" />
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="searchForm.status" placeholder="请选择状态" style="width: 150px">
              <el-option label="启用" value="1" />
              <el-option label="禁用" value="0" />
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
      <el-table :data="users" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="username" label="用户名" width="150" />
        <el-table-column prop="name" label="姓名" width="120" />
        <el-table-column prop="role" label="角色" width="120">
          <template #default="scope">
            <el-tag :type="scope.row.role === 'admin' ? 'primary' : 'info'">
              {{ scope.row.role === 'admin' ? '管理员' : '普通用户' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">
              {{ scope.row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="180" />
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleEdit(scope.row)">
              <el-icon><Edit /></el-icon>
              编辑
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Plus, Search, Refresh, Edit, Delete } from '@element-plus/icons-vue'

interface User {
  id: number
  username: string
  name: string
  role: string
  status: number
  createdAt: string
}

interface SearchForm {
  username: string
  role: string | null
  status: number | null
}

interface Pagination {
  currentPage: number
  pageSize: number
  total: number
}

const users = ref<User[]>([])
const searchForm = ref<SearchForm>({
  username: '',
  role: null,
  status: null
})

const pagination = ref<Pagination>({
  currentPage: 1,
  pageSize: 10,
  total: 100
})

const handleSearch = () => {
  // 搜索逻辑
  console.log('搜索', searchForm.value)
}

const resetForm = () => {
  searchForm.value = {
    username: '',
    role: null,
    status: null
  }
}

const handleAddUser = () => {
  // 添加用户逻辑
  console.log('添加用户')
}

const handleEdit = (row: User) => {
  // 编辑用户逻辑
  console.log('编辑用户', row)
}

const handleDelete = (id: number) => {
  // 删除用户逻辑
  console.log('删除用户', id)
}

const handleSizeChange = (size: number) => {
  pagination.value.pageSize = size
  console.log('每页条数改变', size)
}

const handleCurrentChange = (current: number) => {
  pagination.value.currentPage = current
  console.log('当前页码改变', current)
}

onMounted(() => {
  // 模拟数据
  users.value = Array.from({ length: 10 }, (_, index) => ({
    id: index + 1,
    username: `user${index + 1}`,
    name: `用户${index + 1}`,
    role: index === 0 ? 'admin' : 'user',
    status: Math.random() > 0.5 ? 1 : 0,
    createdAt: new Date().toISOString()
  }))
})
</script>

<style scoped lang="scss">
.users {
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