<template>
  <el-card class="page-card">
    <template #header>
      <div class="card-header">
        <h3>商品详情</h3>
        <el-button type="primary" @click="handleBack">返回列表</el-button>
      </div>
    </template>
    
    <div v-if="product" class="product-detail">
      <!-- 基本信息 -->
      <div class="section">
        <h4>基本信息</h4>
        
        <div class="detail-item">
          <span class="label">商品编号：</span>
          <span class="value">{{ product.code }}</span>
        </div>
        
        <div class="detail-item">
          <span class="label">商品名称：</span>
          <span class="value">{{ product.name }}</span>
        </div>
        
        <div class="detail-item">
          <span class="label">商品分类：</span>
          <span class="value">{{ product.category }}</span>
        </div>
        
        <div class="detail-item">
          <span class="label">品牌：</span>
          <span class="value">{{ product.brand || '无' }}</span>
        </div>
        
        <div class="detail-item">
          <span class="label">主图：</span>
          <el-image
            :src="product.mainImage"
            :preview-src-list="[product.mainImage]"
            fit="cover"
            style="width: 200px; height: 200px"
          />
        </div>
        
        <div class="detail-item">
          <span class="label">状态：</span>
          <el-tag :type="product.status === 'active' ? 'success' : 'danger'">
            {{ product.status === 'active' ? '启用' : '停用' }}
          </el-tag>
        </div>
        
        <div class="detail-item">
          <span class="label">创建时间：</span>
          <span class="value">{{ product.createTime }}</span>
        </div>
      </div>
      
      <!-- 溯源信息 -->
      <div class="section" style="margin-top: 30px">
        <h4>溯源信息</h4>
        
        <!-- 原料采收 -->
        <div class="traceability-section raw-material-section">
          <h5>原料采收</h5>
          <div class="detail-item">
            <span class="label">图片：</span>
            <div class="image-list">
              <el-image
                v-for="(image, index) in product.traceability.rawMaterial.images"
                :key="index"
                :src="image.url"
                :preview-src-list="product.traceability.rawMaterial.images.map((img: any) => img.url)"
                fit="cover"
                style="width: 150px; height: 150px; margin-right: 10px"
              />
              <span v-if="product.traceability.rawMaterial.images.length === 0" class="no-data">无图片</span>
            </div>
          </div>
          <div class="detail-item">
            <span class="label">介绍：</span>
            <span class="value">{{ product.traceability.rawMaterial.intro || '无介绍' }}</span>
          </div>
        </div>
        
        <!-- 生产加工 -->
        <div class="traceability-section production-section" style="margin-top: 20px">
          <h5>生产加工</h5>
          <div class="detail-item">
            <span class="label">图片：</span>
            <div class="image-list">
              <el-image
                v-for="(image, index) in product.traceability.production.images"
                :key="index"
                :src="image.url"
                :preview-src-list="product.traceability.production.images.map((img: any) => img.url)"
                fit="cover"
                style="width: 150px; height: 150px; margin-right: 10px"
              />
              <span v-if="product.traceability.production.images.length === 0" class="no-data">无图片</span>
            </div>
          </div>
          <div class="detail-item">
            <span class="label">介绍：</span>
            <span class="value">{{ product.traceability.production.intro || '无介绍' }}</span>
          </div>
        </div>
        
        <!-- 基地介绍 -->
        <div class="traceability-section base-section" style="margin-top: 20px">
          <h5>基地介绍</h5>
          <div class="detail-item">
            <span class="label">图片：</span>
            <div class="image-list">
              <el-image
                v-for="(image, index) in product.traceability.base.images"
                :key="index"
                :src="image.url"
                :preview-src-list="product.traceability.base.images.map((img: any) => img.url)"
                fit="cover"
                style="width: 150px; height: 150px; margin-right: 10px"
              />
              <span v-if="product.traceability.base.images.length === 0" class="no-data">无图片</span>
            </div>
          </div>
          <div class="detail-item">
            <span class="label">介绍：</span>
            <span class="value">{{ product.traceability.base.intro || '无介绍' }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else class="no-product">
      <el-empty description="商品不存在" />
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useProductStore } from '../store/product'

const router = useRouter()
const route = useRoute()
const productStore = useProductStore()

// 商品数据
const product = ref<any>(null)

// 获取商品ID
const productId = () => {
  return route.params.id ? Number(route.params.id) : null
}

// 返回列表
const handleBack = () => {
  router.push('/product')
}

// 初始化
onMounted(() => {
  const id = productId()
  if (id) {
    // 加载商品数据
    const productData = productStore.getProductById(id)
    if (productData) {
      // 直接设置模拟的溯源信息图片和介绍，确保图片能够正确显示
      productData.traceability.rawMaterial.images = [
        {
          url: 'https://picsum.photos/300/300?random=1'
        }
      ]
      productData.traceability.rawMaterial.intro = '本商品采用优质原料，从源头确保品质，通过严格的筛选和检测，保证每一份原料都符合标准。'
      
      productData.traceability.production.images = [
        {
          url: 'https://picsum.photos/300/300?random=2'
        }
      ]
      productData.traceability.production.intro = '生产过程采用现代化设备，严格按照工艺流程操作，确保产品质量稳定可靠。'
      
      productData.traceability.base.images = [
        {
          url: 'https://picsum.photos/300/300?random=3'
        }
      ]
      productData.traceability.base.intro = '生产基地环境优美，土壤肥沃，采用有机种植方式，不使用化学农药和化肥，确保产品天然健康。'
      
      product.value = productData
    }
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
  
  .section {
    h4 {
      margin: 0 0 20px 0;
      font-size: 16px;
      font-weight: 600;
      color: #333;
    }
  }
  
  .product-detail {
    .detail-item {
      display: flex;
      margin-bottom: 15px;
      align-items: flex-start;
      
      .label {
        width: 100px;
        font-weight: 500;
        color: #606266;
      }
      
      .value {
        flex: 1;
        color: #303133;
      }
      
      .image-list {
        flex: 1;
        display: flex;
        flex-wrap: wrap;
      }
      
      .no-data {
        color: #909399;
        font-style: italic;
      }
    }
    
    .traceability-section {
      padding: 15px;
      border: 1px solid #e4e7ed;
      border-radius: 4px;
      margin-top: 15px;
      
      h5 {
        margin: 0 0 15px 0;
        font-size: 14px;
        font-weight: 500;
        color: #333;
      }
    }
    
    .raw-material-section {
      background-color: #f8fff9;
      border-left: 4px solid #4CAF50;
    }
    
    .production-section {
      background-color: #f8faff;
      border-left: 4px solid #2196F3;
    }
    
    .base-section {
      background-color: #fff8f0;
      border-left: 4px solid #FFC107;
    }
  }
  
  .no-product {
    padding: 40px 0;
    text-align: center;
  }
}
</style>