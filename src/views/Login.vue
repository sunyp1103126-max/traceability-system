<template>
  <div class="login-container">
    <el-card class="login-card">
      <template #header>
        <div class="login-title">
          <h2>溯源亮证管理系统</h2>
          <p>请登录以继续</p>
        </div>
      </template>
      <el-form :model="loginForm" :rules="loginRules" ref="loginFormRef" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入用户名" prefix-icon="UserFilled" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" prefix-icon="Lock" show-password />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="login-button" @click="handleLogin" :loading="loading">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../store/user'
import { ElMessage } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()
const loginFormRef = ref()
const loading = ref(false)

const loginForm = reactive({
  username: 'admin',
  password: '123456'
})

const loginRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
}

const handleLogin = async () => {
  if (!loginFormRef.value) return
  
  try {
    await loginFormRef.value.validate()
    loading.value = true
    
    // 模拟登录请求
    setTimeout(() => {
      // 模拟登录成功
      userStore.setToken('mock-token-123456')
      userStore.setUserInfo({
        name: '管理员',
        avatar: ''
      })
      
      ElMessage.success('登录成功')
      router.push('/')
      loading.value = false
    }, 1000)
  } catch (error) {
    console.error('登录验证失败:', error)
  }
}
</script>

<style scoped lang="scss">
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #e6f7ff 0%, #b3d9ff 100%);
  background-size: cover;
  background-position: center;
  
  .login-card {
    width: 400px;
    border-radius: 12px;
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.18);
    padding: 40px;
    background-color: rgba(255, 255, 255, 0.9);
    
    .login-title {
      text-align: center;
      margin-bottom: 40px;
      display: flex;
      flex-direction: column;
      align-items: center;
      

      
      h2 {
        margin: 0 0 15px 0;
        color: #409EFF;
        font-weight: 600;
        font-size: 24px;
      }
      
      p {
        margin: 0;
        color: #909399;
        font-size: 14px;
      }
    }
    
    .login-button {
      width: 200px;
      height: 40px;
      font-size: 16px;
      font-weight: 500;
      margin-left: -40px;
    }
    
    .el-form {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    
    .el-form-item {
      margin-bottom: 20px;
      width: 100%;
      max-width: 360px;
      display: flex;
      align-items: center;
    }
    
    .el-form-item__label {
      text-align: left;
      font-weight: 500;
      width: 80px;
    }
    
    .el-input {
      width: 280px;
      height: 40px;
    }
    
    .el-form-item:last-child {
      display: flex;
      justify-content: center;
      margin-top: 40px;
      margin-bottom: 0;
      width: 100%;
      max-width: 280px;
    }
  }
}
</style>