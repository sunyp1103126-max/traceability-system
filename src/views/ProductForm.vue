<template>
  <el-card class="page-card">
    <template #header>
      <div class="card-header">
        <h3>{{ isEdit ? '编辑商品' : '新增商品' }}</h3>
      </div>
    </template>
    
    <el-form
      :model="form"
      :rules="rules"
      ref="formRef"
      label-position="top"
      style="max-width: 800px; margin: 0 auto"
    >
      <!-- 基本信息 -->
      <div class="section basic-info-section">
        <h4>基本信息</h4>
        
        <el-form-item label="商品分类" prop="category">
          <el-select
            v-model="form.category"
            placeholder="请选择商品分类"
            style="width: 300px"
            @change="handleCategoryChange"
          >
            <el-option
              v-for="category in productStore.categories"
              :key="category.value"
              :label="category.label"
              :value="category.value"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="商品名称" prop="name">
          <el-input
            v-model="form.name"
            placeholder="请输入商品名称"
            maxlength="20"
            show-word-limit
            style="width: 300px"
          />
          <div v-if="nameError" class="error-message">{{ nameError }}</div>
        </el-form-item>
        
        <el-form-item label="品牌" prop="brand">
          <el-input
            v-model="form.brand"
            placeholder="请输入品牌"
            maxlength="20"
            show-word-limit
            style="width: 300px"
          />
        </el-form-item>
        
        <el-form-item label="主图" prop="mainImage">
          <el-upload
            class="upload-demo"
            :action="'#'"
            :on-change="handleMainImageChange"
            :auto-upload="false"
            :limit="1"
            :file-list="mainImageList"
          >
            <el-button type="primary">上传图片</el-button>
            <template #tip>
              <div class="el-upload__tip">
                支持jpg、png格式，最大不超过20MB
              </div>
            </template>
            <template #file-list>
              <div v-for="(file, index) in mainImageList" :key="index" class="upload-file">
                <img :src="file.url || 'https://via.placeholder.com/100'" :alt="file.name" class="upload-image" @click="previewImage(file)">
                <div class="upload-file-info">
                  <span>{{ file.name }}</span>
                  <el-button type="text" size="small" @click.stop="removeMainImage">删除</el-button>
                </div>
              </div>
            </template>
          </el-upload>
        </el-form-item>
      </div>
      
      <!-- 溯源信息 -->
      <div class="section traceability-section-container" style="margin-top: 30px">
        <h4>溯源信息</h4>
        
        <!-- 原料采收 -->
        <div class="traceability-section raw-material-section">
          <h5>原料采收</h5>
          <el-form-item prop="traceability.rawMaterial.images">
            <el-upload
              class="upload-demo"
              :action="'#'"
              :on-change="(file) => handleTraceabilityImageChange(file, 'rawMaterial')"
              :auto-upload="false"
              :limit="2"
              :file-list="form.traceability.rawMaterial.images"
            >
              <el-button type="primary">选择图片</el-button>
              <template #tip>
                <div class="el-upload__tip">
                  支持jpg、png格式，最大不超过10MB，最多2张
                </div>
              </template>
            </el-upload>
          </el-form-item>
          <el-form-item prop="traceability.rawMaterial.intro">
            <el-input
              v-model="form.traceability.rawMaterial.intro"
              type="textarea"
              placeholder="请输入原料采收介绍"
              maxlength="100"
              show-word-limit
              rows="3"
            />
          </el-form-item>
        </div>
        
        <!-- 生产加工 -->
        <div class="traceability-section production-section" style="margin-top: 20px">
          <h5>生产加工</h5>
          <el-form-item prop="traceability.production.images">
            <el-upload
              class="upload-demo"
              :action="'#'"
              :on-change="(file) => handleTraceabilityImageChange(file, 'production')"
              :auto-upload="false"
              :limit="2"
              :file-list="form.traceability.production.images"
            >
              <el-button type="primary">选择图片</el-button>
              <template #tip>
                <div class="el-upload__tip">
                  支持jpg、png格式，最大不超过10MB，最多2张
                </div>
              </template>
            </el-upload>
          </el-form-item>
          <el-form-item prop="traceability.production.intro">
            <el-input
              v-model="form.traceability.production.intro"
              type="textarea"
              placeholder="请输入生产加工介绍"
              maxlength="100"
              show-word-limit
              rows="3"
            />
          </el-form-item>
        </div>
        
        <!-- 基地介绍 -->
        <div class="traceability-section base-section" style="margin-top: 20px">
          <h5>基地介绍</h5>
          <el-form-item prop="traceability.base.images">
            <el-upload
              class="upload-demo"
              :action="'#'"
              :on-change="(file) => handleTraceabilityImageChange(file, 'base')"
              :auto-upload="false"
              :limit="2"
              :file-list="form.traceability.base.images"
            >
              <el-button type="primary">选择图片</el-button>
              <template #tip>
                <div class="el-upload__tip">
                  支持jpg、png格式，最大不超过10MB，最多2张
                </div>
              </template>
            </el-upload>
          </el-form-item>
          <el-form-item prop="traceability.base.intro">
            <el-input
              v-model="form.traceability.base.intro"
              type="textarea"
              placeholder="请输入基地介绍"
              maxlength="100"
              show-word-limit
              rows="3"
            />
          </el-form-item>
        </div>
      </div>
      
      <!-- 提交按钮 -->
      <div class="form-actions">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleSubmit">提交</el-button>
      </div>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useProductStore } from '../store/product'
import { useCodeStore } from '../store/code'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const productStore = useProductStore()
const codeStore = useCodeStore()
const formRef = ref()

// 判断是否为编辑模式
const isEdit = computed(() => {
  return route.path.includes('/edit')
})

// 获取商品ID
const productId = computed(() => {
  return route.params.id ? Number(route.params.id) : null
})

// 表单数据
const form = reactive({
  category: '',
  name: '',
  brand: '',
  mainImage: '',
  traceability: {
    rawMaterial: {
      images: [],
      intro: ''
    },
    production: {
      images: [],
      intro: ''
    },
    base: {
      images: [],
      intro: ''
    }
  }
})

// 主图文件列表
const mainImageList = ref([])

// 商品名称错误信息
const nameError = ref('')

// 表单验证规则
const rules = {
  category: [
    { required: true, message: '请选择商品分类', trigger: 'change' }
  ],
  name: [
    { required: true, message: '请输入商品名称', trigger: 'blur' },
    { max: 20, message: '最多20个字符', trigger: 'blur' }
  ],
  mainImage: [
    { required: true, message: '请上传主图', trigger: 'change' }
  ]
}

// 监听商品名称变化，进行唯一性验证
watch(() => form.name, (newName) => {
  if (newName && form.category) {
    const isUnique = productStore.isProductNameUnique(newName, form.category, productId.value)
    if (!isUnique) {
      nameError.value = '所选分类下存在相同的商品名称'
    } else {
      nameError.value = ''
    }
  } else {
    nameError.value = ''
  }
})

// 监听商品分类变化，清空商品名称和品牌
const handleCategoryChange = () => {
  form.name = ''
  form.brand = ''
  nameError.value = ''
}

// 处理主图上传
const handleMainImageChange = (file: any) => {
  // 模拟上传，使用占位图
  form.mainImage = 'https://via.placeholder.com/200/1976D2/FFFFFF?text=商品主图'
  mainImageList.value = [{ name: file.name, url: form.mainImage }]
}

// 预览图片
const previewImage = (file: any) => {
  const imageUrl = file.url || form.mainImage
  window.open(imageUrl, '_blank')
}

// 删除主图
const removeMainImage = () => {
  form.mainImage = ''
  mainImageList.value = []
}

// 处理溯源信息图片上传
const handleTraceabilityImageChange = (file: any, section: string) => {
  // 模拟上传，使用占位图
  let imageUrl = ''
  let text = ''
  let color = ''
  
  switch (section) {
    case 'rawMaterial':
      text = '原料采收'
      color = '4CAF50'
      break
    case 'production':
      text = '生产加工'
      color = '2196F3'
      break
    case 'base':
      text = '基地介绍'
      color = 'FFC107'
      break
    default:
      text = '图片'
      color = '9E9E9E'
  }
  
  imageUrl = `https://via.placeholder.com/150/${color}/FFFFFF?text=${encodeURIComponent(text)}`
  
  form.traceability[section as keyof typeof form.traceability].images.push({
    name: file.name,
    url: imageUrl
  })
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    
    // 检查商品名称唯一性
    if (!productStore.isProductNameUnique(form.name, form.category, productId.value)) {
      ElMessage.error('所选分类下存在相同的商品名称')
      return
    }
    
    if (isEdit.value && productId.value) {
      // 编辑商品
      productStore.updateProduct(productId.value, form)
      ElMessage.success('编辑成功')
    } else {
      // 新增商品
      const newProduct = productStore.addProduct(form)
      // 生成商品码
      codeStore.generateCode(newProduct)
      ElMessage.success('新增成功')
    }
    
    // 返回列表页
    router.push('/product')
  } catch (error) {
    console.error('验证失败:', error)
  }
}

// 取消
const handleCancel = () => {
  router.push('/product')
}

// 初始化
onMounted(() => {
  if (isEdit.value && productId.value) {
    // 加载商品数据
    const product = productStore.getProductById(productId.value)
    if (product) {
      Object.assign(form, product)
      // 处理主图
      if (product.mainImage) {
        mainImageList.value = [{
          name: '主图',
          url: product.mainImage
        }]
      }
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
      padding-bottom: 10px;
      border-bottom: 1px solid #e4e7ed;
    }
  }
  
  .basic-info-section {
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 4px;
    margin-bottom: 20px;
  }
  
  .traceability-section-container {
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 4px;
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
  
  .form-actions {
    display: flex;
    justify-content: center;
    margin-top: 30px;
    
    .el-button {
      margin: 0 10px;
    }
  }
  
  .error-message {
    color: #f56c6c;
    font-size: 12px;
    line-height: 1;
    padding-top: 4px;
  }
  
  .upload-file {
    display: flex;
    align-items: center;
    margin-top: 10px;
    
    .upload-image {
      width: 100px;
      height: 100px;
      object-fit: cover;
      cursor: pointer;
      border: 1px solid #d9d9d9;
      border-radius: 4px;
      
      &:hover {
        border-color: #409eff;
      }
    }
    
    .upload-file-info {
      margin-left: 10px;
      display: flex;
      flex-direction: column;
      gap: 5px;
      
      span {
        font-size: 14px;
        color: #606266;
      }
    }
  }
}</style>