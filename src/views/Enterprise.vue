<template>
  <el-card class="page-card">
    <template #header>
      <div class="card-header">
        <h3>企业信息管理</h3>
        <el-button v-if="!enterpriseStore.isEditing" type="primary" @click="handleEdit">编辑</el-button>
      </div>
    </template>
    
    <el-form
      :model="form"
      :rules="rules"
      ref="formRef"
      label-position="right"
      label-width="120px"
      style="max-width: 600px; margin: 0 auto"
    >
      <el-form-item label="企业名称" prop="name">
        <el-input
          v-model="form.name"
          :disabled="!enterpriseStore.isEditing"
          placeholder="请输入企业名称"
          maxlength="30"
        />
      </el-form-item>
      <el-form-item label="联系方式" prop="contact">
        <el-input
          v-model="form.contact"
          :disabled="!enterpriseStore.isEditing"
          placeholder="请输入联系方式"
          maxlength="20"
        />
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-input
          v-model="form.address"
          :disabled="!enterpriseStore.isEditing"
          placeholder="请输入地址"
          maxlength="100"
        />
      </el-form-item>
      <el-form-item v-if="enterpriseStore.isEditing">
        <div class="form-actions">
          <el-button type="primary" @click="handleSubmit">提交</el-button>
        </div>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useEnterpriseStore } from '../store/enterprise'
import { ElMessage } from 'element-plus'

const enterpriseStore = useEnterpriseStore()
const formRef = ref()

// 表单数据
const form = reactive({
  name: '',
  contact: '',
  address: ''
})

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入必填项', trigger: 'blur' },
    { max: 30, message: '最多30个字符', trigger: 'blur' }
  ],
  contact: [
    { required: true, message: '请输入必填项', trigger: 'blur' },
    { max: 20, message: '最多20个字符', trigger: 'blur' }
  ],
  address: [
    { max: 100, message: '最多100个字符', trigger: 'blur' }
  ]
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    // 保存数据
    await enterpriseStore.saveEnterpriseInfo(form)
    ElMessage.success('保存成功')
  } catch (error) {
    console.error('验证失败:', error)
  }
}

// 编辑
const handleEdit = () => {
  enterpriseStore.setEditing(true)
}

// 初始化
onMounted(() => {
  // 从store加载数据
  Object.assign(form, enterpriseStore.enterpriseInfo)
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
  
  .form-actions {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }
}
</style>