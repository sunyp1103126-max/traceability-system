<template>
  <div class="products">
    <a-card class="card">
      <template #header>
        <div class="card-header">
          <span>商品信息</span>
          <a-button type="primary" @click="handleAddProduct">
            <a-icon icon="icon-plus" />
            新增
          </a-button>
        </div>
      </template>
      <div class="search-bar">
        <a-form :inline="true" :model="searchForm">
          <a-form-item label="商品名称">
            <a-input v-model:value="searchForm.name" placeholder="请输入商品名称" style="width: 200px" />
          </a-form-item>
          <a-form-item label="商品分类">
            <a-select v-model:value="searchForm.category" placeholder="请选择商品分类" style="width: 150px">
              <a-option v-for="category in categories" :key="category.value" :label="category.label" :value="category.value" />
            </a-select>
          </a-form-item>
          <a-form-item label="状态">
            <a-select v-model:value="searchForm.status" placeholder="请选择状态" style="width: 150px">
              <a-option label="启用" value="1" />
              <a-option label="停用" value="0" />
            </a-select>
          </a-form-item>
          <a-form-item>
            <a-button type="primary" @click="handleSearch">查询</a-button>
          </a-form-item>
        </a-form>
      </div>
      <a-spin :spinning="loading">
        <a-table :data="products" :columns="columns" style="width: 100%" />
      </a-spin>
      <div class="pagination">
        <a-pagination
          v-model:current="pagination.currentPage"
          v-model:page-size="pagination.pageSize"
          :page-size-options="['10', '20', '50', '100']"
          :total="pagination.total"
          show-total
          show-jumper
          @change="handleCurrentChange"
          @page-size-change="handleSizeChange"
        />
      </div>
    </a-card>

    <!-- 删除确认对话框 -->
    <a-modal
      v-model:visible="deleteDialogVisible"
      title="删除"
      width="400px"
    >
      <div class="delete-dialog-content">
        <p>是否确认删除编号：<span class="delete-info">{{ deleteProduct?.code }}</span> 商品名称：<span class="delete-info">{{ deleteProduct?.name }}</span>？</p>
        <p class="delete-warning">删除商品后，该商品不可再被恢复</p>
      </div>
      <template #footer>
        <a-button @click="deleteDialogVisible = false">取消</a-button>
        <a-button type="primary" @click="confirmDelete">确认</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, h } from 'vue'
import { Button, Switch, Image } from '@arco-design/web-vue'

interface Product {
  id: number
  code: string
  name: string
  image: string
  category: string
  status: string
}

const columns = [
  {
    title: '序号',
    width: 80,
    render: (_, record: Product, index: number) => index + 1
  },
  {
    title: '商品编号',
    dataIndex: 'code',
    width: 120
  },
  {
    title: '商品图片',
    width: 100,
    render: (_, record: Product) => h(Image, {
      src: record.image,
      'preview-src-list': [record.image],
      style: { width: '40px', height: '40px' }
    })
  },
  {
    title: '商品名称',
    dataIndex: 'name',
    width: 150
  },
  {
    title: '商品分类',
    dataIndex: 'category',
    width: 150
  },
  {
    title: '状态',
    width: 100,
    render: (_, record: Product) => h(Switch, {
      checked: record.status === '1',
      onChange: (checked: boolean) => handleStatusChange(record, checked)
    })
  },
  {
    title: '操作',
    width: 150,
    render: (_, record: Product) => [
      h(Button, {
        size: 'small',
        onClick: () => handleDetail(record)
      }, () => '详情'),
      h(Button, {
        size: 'small',
        type: 'primary',
        onClick: () => handleEdit(record)
      }, () => '编辑'),
      h(Button, {
        size: 'small',
        type: 'danger',
        onClick: () => handleDelete(record)
      }, () => '删除')
    ]
  }
]

interface SearchForm {
  name: string
  category: string | null
  status: string | null
}

interface Pagination {
  currentPage: number
  pageSize: number
  total: number
}

interface Category {
  label: string
  value: string
}

const products = ref<Product[]>([])
const loading = ref(false)
const deleteDialogVisible = ref(false)
const deleteProduct = ref<Product | null>(null)

const searchForm = ref<SearchForm>({
  name: '',
  category: null,
  status: null
})

const pagination = ref<Pagination>({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

const categories = ref<Category[]>([
  { label: '蔬菜（人工种植的食用菌）', value: 'vegetable' },
  { label: '水果', value: 'fruit' },
  { label: '茶叶', value: 'tea' },
  { label: '畜禽', value: 'livestock' },
  { label: '禽蛋', value: 'egg' },
  { label: '养殖水产品', value: 'aquatic' },
  { label: '农业农村部规定的其他农产品', value: 'other' }
])

const handleSearch = () => {
  // 搜索逻辑
  console.log('搜索', searchForm.value)
  // 模拟搜索
  getProducts()
}

const handleAddProduct = () => {
  // 跳转到新增商品页面
  console.log('新增商品')
  // 这里可以添加路由跳转逻辑
  // router.push('/products/add')
}

const handleEdit = (row: Product) => {
  // 跳转到编辑商品页面
  console.log('编辑商品', row)
  // 这里可以添加路由跳转逻辑
  // router.push(`/products/edit/${row.id}`)
}

const handleDetail = (row: Product) => {
  // 跳转到商品详情页面
  console.log('商品详情', row)
  // 这里可以添加路由跳转逻辑
  // router.push(`/products/detail/${row.id}`)
}

const handleDelete = (row: Product) => {
  // 打开删除确认对话框
  deleteProduct.value = row
  deleteDialogVisible.value = true
}

const confirmDelete = () => {
  // 确认删除逻辑
  console.log('删除商品', deleteProduct.value)
  deleteDialogVisible.value = false
  // 从列表中移除
  if (deleteProduct.value) {
    const index = products.value.findIndex(p => p.id === deleteProduct.value?.id)
    if (index > -1) {
      products.value.splice(index, 1)
      pagination.value.total--
    }
  }
}

const handleStatusChange = (row: Product, checked: boolean) => {
  // 状态变更逻辑
  row.status = checked ? '1' : '0'
  console.log('状态变更', row)
}

const handleSizeChange = (size: number) => {
  pagination.value.pageSize = size
  getProducts()
}

const handleCurrentChange = (current: number) => {
  pagination.value.currentPage = current
  getProducts()
}

const getProducts = () => {
  loading.value = true
  // 模拟API调用
  setTimeout(() => {
    // 模拟数据
    products.value = [
      {
        id: 1,
        code: 'SP000007',
        name: '木耳',
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=black%20fungus%20mushroom&image_size=square',
        category: '蔬菜（人工种植的食用菌）',
        status: '1'
      },
      {
        id: 2,
        code: 'SP000006',
        name: '香蕉',
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=banana%20fruit&image_size=square',
        category: '水果',
        status: '1'
      },
      {
        id: 3,
        code: 'SP000005',
        name: 'XX',
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=agricultural%20product&image_size=square',
        category: '茶叶',
        status: '1'
      },
      {
        id: 4,
        code: 'SP000004',
        name: 'XX',
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=agricultural%20product&image_size=square',
        category: '畜禽',
        status: '1'
      },
      {
        id: 5,
        code: 'SP000003',
        name: 'XX',
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=agricultural%20product&image_size=square',
        category: '禽蛋',
        status: '1'
      },
      {
        id: 6,
        code: 'SP000002',
        name: 'XX',
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=agricultural%20product&image_size=square',
        category: '养殖水产品',
        status: '1'
      },
      {
        id: 7,
        code: 'SP000001',
        name: 'XX',
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=agricultural%20product&image_size=square',
        category: '农业农村部规定的其他农产品',
        status: '1'
      }
    ]
    pagination.value.total = products.value.length
    loading.value = false
  }, 500)
}

onMounted(() => {
  getProducts()
})
</script>

<style scoped lang="scss">
.products {
  .card {
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    border: none;
    overflow: hidden;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 24px;
    border-bottom: 1px solid #f0f0f0;
    background-color: #fafafa;
    border-radius: 8px 8px 0 0;

    span {
      font-size: 16px;
      font-weight: 600;
      color: #333333;
    }
  }

  .search-bar {
    margin: 24px;
    padding: 20px;
    background-color: #fafafa;
    border-radius: 8px;
    border: 1px solid #f0f0f0;
  }

  :deep(.arco-table) {
    border-radius: 0 0 8px 8px;
    overflow: hidden;

    .arco-table-header {
      background-color: #fafafa;

      th {
        background-color: #fafafa !important;
        font-weight: 600;
        color: #333333;
        border-bottom: 1px solid #f0f0f0;
      }
    }

    .arco-table-body {
      .arco-table-row {
        transition: all 0.3s ease;

        &:hover {
          background-color: #fafafa !important;
        }
      }

      .arco-table-cell {
        border-bottom: 1px solid #f0f0f0;
        color: #333333;
      }
    }
  }

  .pagination {
    margin: 24px;
    text-align: right;

    :deep(.arco-pagination) {
      .arco-pagination-sizes {
        margin-right: 16px;
      }

      .arco-pagination-jump {
        margin-left: 16px;
      }

      .arco-pagination-item {
        border-radius: 4px;
        transition: all 0.3s ease;

        &:hover {
          color: #1890ff;
          border-color: #1890ff;
        }
      }

      .arco-pagination-item-active {
        background-color: #1890ff;
        border-color: #1890ff;
      }
    }
  }

  .delete-dialog-content {
    padding: 24px;

    p {
      margin-bottom: 16px;
      color: #333333;
    }

    .delete-info {
      color: #1890ff;
      font-weight: 600;
    }

    .delete-warning {
      margin-top: 20px;
      color: #ff4d4f;
      font-size: 14px;
      line-height: 1.5;
    }
  }

  :deep(.arco-modal) {
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

    .arco-modal-header {
      padding: 20px 24px;
      border-bottom: 1px solid #f0f0f0;

      .arco-modal-title {
        font-size: 16px;
        font-weight: 600;
        color: #333333;
      }
    }

    .arco-modal-footer {
      padding: 20px 24px;
      border-top: 1px solid #f0f0f0;
    }
  }

  :deep(.arco-button) {
    border-radius: 6px;
    font-size: 14px;
    padding: 8px 16px;
    transition: all 0.3s ease;
  }

  :deep(.arco-button-primary) {
    background-color: #1890ff;
    border-color: #1890ff;

    &:hover {
      background-color: #40a9ff;
      border-color: #40a9ff;
    }
  }

  :deep(.arco-button-danger) {
    background-color: #ff4d4f;
    border-color: #ff4d4f;

    &:hover {
      background-color: #ff7875;
      border-color: #ff7875;
    }
  }

  :deep(.arco-input) {
    .arco-input-inner-wrapper {
      border-radius: 6px;
      box-shadow: none;

      &:hover {
        box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
      }

      &.arco-input-focus {
        box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
      }
    }
  }

  :deep(.arco-select) {
    .arco-select-view {
      border-radius: 6px;
      box-shadow: none;

      &:hover {
        box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
      }

      &.arco-select-view-focus {
        box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
      }
    }
  }

  :deep(.arco-switch) {
    .arco-switch-inner {
      border-radius: 10px;
    }
  }

  :deep(.arco-image) {
    border-radius: 4px;
    overflow: hidden;
  }
}
</style>