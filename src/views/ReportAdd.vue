<template>
  <el-card class="page-card">
    <template #header>
      <div class="card-header">
        <h3>{{ isEdit ? '编辑检验报告' : '新增检验报告' }}</h3>
      </div>
    </template>
    
    <el-form :model="form" :rules="rules" ref="formRef" label-position="top" style="max-width: 800px; margin: 0 auto">
      <el-form-item label="生产日期" prop="productionDate">
        <el-date-picker
          v-model="form.productionDate"
          type="date"
          placeholder="选择日期"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          style="width: 200px"
        ></el-date-picker>
      </el-form-item>
      
      <el-form-item label="报告类型" prop="reportType">
        <el-radio-group v-model="form.reportType">
          <el-radio label="单品报告">单品报告</el-radio>
          <el-radio label="综合报告">综合报告</el-radio>
        </el-radio-group>
      </el-form-item>
      
      <el-form-item label="检验报告" prop="files">
        <el-button type="primary" @click="openFileUploadDialog">上传报告</el-button>
        <div class="file-list" v-if="form.files.length > 0">
          <div v-for="(file, index) in form.files" :key="index" class="file-item">
            <a :href="'#'" @click.prevent="openFile(file)" class="file-link">{{ file.name || file }}</a>
            <el-button type="text" size="small" @click="removeFile(index)">删除</el-button>
          </div>
        </div>
      </el-form-item>
      
      <el-form-item label="合格证生成方式">
        <div class="certificate-generate">
          <el-radio-group v-model="form.合格证生成方式" disabled>
            <el-radio label="生成一份通用合格证">生成一份通用合格证</el-radio>
          </el-radio-group>
          <el-button type="primary" size="small" @click="openCertificatePreviewDialog">预览</el-button>
        </div>
      </el-form-item>
      
      <el-form-item>
        <div class="form-actions">
          <el-button @click="goBack">取消</el-button>
          <el-button type="primary" @click="handleSubmit">提交</el-button>
        </div>
      </el-form-item>
    </el-form>
  </el-card>
    
    <!-- 文件上传弹窗 -->
    <el-dialog
      v-model="fileUploadDialogVisible"
      title="上传报告"
      width="500px"
      @close="tempFiles = []"
    >
      <div class="upload-area">
        <el-upload
          class="upload-demo"
          action="#"
          :multiple="true"
          :auto-upload="false"
          :on-change="handleFileChange"
          accept=".png,.jpg,.jpeg,.pdf"
          :before-upload="beforeUpload"
          :show-file-list="false"
        >
          <div class="upload-box">
            <div class="upload-icon">
              <i class="el-icon-upload"></i>
            </div>
            <div class="upload-text">点击上传</div>
            <div class="upload-hint">支持上传 png，jpg，jpeg，pdf文件，最大不超过20M</div>
          </div>
        </el-upload>
        
        <!-- 已上传文件列表 -->
        <div class="uploaded-files" v-if="tempFiles.length > 0">
          <div v-for="(file, index) in tempFiles" :key="index" class="file-item">
            <span>{{ file.name }}</span>
            <el-button type="text" size="small" @click="removeTempFile(index)">
              <i class="el-icon-delete"></i>
            </el-button>
          </div>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="fileUploadDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveFiles">保存</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 合格证预览 -->
    <div v-if="showCertificateImage" class="certificate-image-overlay" @click="closeCertificateImage">
      <div class="certificate-image-container" @click.stop>
        <div class="certificate-wrapper">
          <div class="certificate-header">
            <h5>农产品承诺达标合格证</h5>
            <p class="certificate-number">编号：{{ reportCode }}</p>
          </div>
          <div class="certificate-divider"></div>
          <div class="certificate-content">
            <p class="certificate-promise">我承诺销售的食用农产品：</p>
            <ul class="certificate-list">
              <li>• ✓ 不使用禁用农药兽药、停用兽药和非法添加物</li>
              <li>• ✓ 常规农药兽药残留不超标</li>
              <li>• ✓ 对承诺的真实性负责</li>
            </ul>
            <p class="certificate-basis">承诺依据：</p>
            <ul class="certificate-basis-list">
              <li>• ✓ 质量安全控制符合要求</li>
              <li>• ✓ 自我检测合格</li>
              <li>• □ 委托检测合格</li>
            </ul>
            <div class="certificate-divider"></div>
            <div class="certificate-info">
              <p>农产品名称：木耳</p>
              <p>数量(重量)：51公斤</p>
              <p>产地：广西河池市天峨县</p>
              <p>生产者盖章或签名：索邦宜</p>
              <p>联系方式：13800138000</p>
            </div>
          </div>
        </div>
        <button class="close-button" @click="closeCertificateImage">
          <span class="close-icon">×</span>
        </button>
      </div>
    </div>

</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useReportStore } from '../store/report'
import { useEnterpriseStore } from '../store/enterprise'

const router = useRouter()
const route = useRoute()
const reportStore = useReportStore()
const enterpriseStore = useEnterpriseStore()

const formRef = ref()
const fileUploadDialogVisible = ref(false)
const tempFiles = ref([])
const certificateImageUrl = ref('')
const showCertificateImage = ref(false)
const imageLoading = ref(false)

// 企业信息
const enterpriseName = computed(() => enterpriseStore.enterpriseInfo?.name || '企业名称')
const enterpriseContact = computed(() => enterpriseStore.enterpriseInfo?.contact || '联系方式')

// 当前日期
const currentDate = computed(() => {
  const date = new Date()
  return date.toISOString().split('T')[0]
})

// 报告编号
const reportCode = computed(() => {
  return 'GC' + Date.now().toString().slice(-8)
})

// 表单数据
const form = ref({
  productionDate: '',
  reportType: '综合报告',
  files: [],
  合格证生成方式: '生成一份通用合格证'
})

// 表单验证规则
const rules = {
  productionDate: [
    { required: true, message: '请选择生产日期', trigger: 'change' }
  ],
  reportType: [
    { required: true, message: '请选择报告类型', trigger: 'change' }
  ],
  files: [
    { required: true, message: '请上传检验报告', trigger: 'change' }
  ]
}

// 是否为编辑模式
const isEdit = computed(() => {
  return route.path.includes('/edit/')
})

// 批次号
const batchNo = computed(() => {
  return route.params.batchNo as string
})

// 处理文件上传
const handleFileChange = (file) => {
  tempFiles.value.push(file)
}

// 文件上传前验证
const beforeUpload = (file) => {
  const fileSize = file.size / 1024 / 1024 // 转换为MB
  if (fileSize > 20) {
    ElMessage.error('单个文件大小不能超过20MB')
    return false
  }
  return true
}

// 移除临时文件
const removeTempFile = (index) => {
  tempFiles.value.splice(index, 1)
}

// 保存文件
const saveFiles = () => {
  const newFiles = tempFiles.value.map(file => file.name)
  form.value.files = [...form.value.files, ...newFiles]
  fileUploadDialogVisible.value = false
  tempFiles.value = []
  ElMessage.success('文件上传成功')
}

// 移除文件
const removeFile = (index) => {
  form.value.files.splice(index, 1)
}

// 打开文件
const openFile = (file) => {
  // 在新页签中打开文件
  // 由于这是模拟环境，我们可以创建一个模拟的 PDF 链接
  const fileName = typeof file === 'string' ? file : file.name
  const mockPdfUrl = `https://example.com/${fileName}`
  window.open(mockPdfUrl, '_blank')
}

// 打开文件上传弹窗
const openFileUploadDialog = () => {
  fileUploadDialogVisible.value = true
}

// 打开合格证预览
const openCertificatePreviewDialog = () => {
  // 直接显示HTML证书，不需要加载状态
  showCertificateImage.value = true
}

// 关闭合格证预览
const closeCertificateImage = () => {
  showCertificateImage.value = false
  certificateImageUrl.value = ''
}

// 处理提交
const handleSubmit = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      if (isEdit.value) {
        // 编辑模式
        const success = reportStore.updateReport(batchNo.value, form.value)
        if (success) {
          ElMessage.success('更新成功')
          goBack()
        } else {
          ElMessage.error('更新失败')
        }
      } else {
        // 新增模式
        const newReport = reportStore.addReport(form.value)
        if (newReport) {
          ElMessage.success('添加成功')
          goBack()
        } else {
          ElMessage.error('添加失败')
        }
      }
    } else {
      return false
    }
  })
}

// 取消
const goBack = () => {
  router.push('/report')
}

// 初始化
onMounted(() => {
  if (isEdit.value) {
    // 编辑模式，获取报告数据
    const report = reportStore.getReport(batchNo.value)
    if (report) {
      form.value = { ...report }
    } else {
      ElMessage.error('报告不存在')
      goBack()
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
  
  .form-actions {
    display: flex;
    justify-content: center;
    margin-top: 30px;
    
    .el-button {
      margin: 0 10px;
    }
  }
  
  .certificate-generate {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  

  
  .file-list {
    margin-top: 10px;
    
    .file-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 5px 10px;
      background-color: #f5f7fa;
      border-radius: 4px;
      margin-bottom: 5px;
      
      .file-link {
        color: #409eff;
        text-decoration: none;
        cursor: pointer;
        
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
}

/* 上传弹窗样式 */
:deep(.el-dialog__header) {
  text-align: center;
  padding: 20px;
}

:deep(.el-dialog__header .el-dialog__title) {
  font-size: 16px;
  font-weight: 500;
}

:deep(.el-dialog__body) {
  padding: 0 20px 20px;
}

:deep(.el-upload) {
  width: 100%;
  margin-bottom: 20px;
}

:deep(.upload-box) {
  border: 2px dashed #d9d9d9 !important;
  border-radius: 0 !important;
  padding: 30px 20px !important;
  text-align: center !important;
  background-color: #fafafa !important;
  cursor: pointer !important;
  transition: border-color 0.3s !important;
  
  &:hover {
    border-color: #409eff !important;
  }
  
  .upload-icon {
    margin-bottom: 10px;
    
    .el-icon-upload {
      font-size: 36px;
      color: #c0c4cc;
    }
  }
  
  .upload-text {
    font-size: 16px;
    color: #409eff;
    margin-bottom: 8px;
  }
  
  .upload-hint {
    font-size: 12px;
    color: #909399;
  }
}

:deep(.uploaded-files) {
  margin-top: 20px;
  
  .file-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    background-color: #f5f7fa;
    border-radius: 0;
    margin-bottom: 10px;
  }
}

:deep(.el-dialog__footer) {
  text-align: center;
  padding: 20px;
  border-top: 1px solid #ebeef5;
}

/* 证书图片预览样式 */
.certificate-image-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  
  .certificate-image-container {
    position: relative;
    max-width: 90%;
    max-height: 90%;
    
    .certificate-image {
      max-width: 100%;
      max-height: 80vh;
      object-fit: contain;
      border: 2px solid #ffffff;
      border-radius: 4px;
    }
    
    .close-button {
      position: absolute;
      top: -40px;
      right: 0;
      background-color: #409EFF;
      color: #ffffff;
      border: none;
      border-radius: 50%;
      width: 30px;
      height: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 20px;
      font-weight: bold;
      cursor: pointer;
      
      &:hover {
        background-color: #66b1ff;
      }
      
      .close-icon {
        line-height: 1;
      }
    }
    
    .certificate-wrapper {
      border: 2px solid #28a745;
      border-radius: 0;
      padding: 30px;
      background-color: #f8fff9;
      box-shadow: none;
      position: relative;
      max-width: 500px;
      
      .certificate-header {
        text-align: center;
        margin-bottom: 20px;
        
        h5 {
          margin: 0 0 15px 0;
          color: #28a745;
          font-size: 20px;
          font-weight: 600;
        }
        
        .certificate-number {
          margin: 0;
          font-size: 14px;
          color: #333333;
        }
      }
      
      .certificate-divider {
        border-top: 1px dashed #28a745;
        margin: 15px 0;
      }
      
      .certificate-content {
        font-size: 14px;
        line-height: 1.6;
        
        .certificate-promise {
          margin: 20px 0 15px 0;
          font-weight: 500;
          color: #333333;
        }
        
        .certificate-list {
          margin: 0 0 20px 0;
          padding-left: 0;
          list-style: none;
          
          li {
            margin: 10px 0;
            color: #333333;
          }
        }
        
        .certificate-basis {
          font-weight: 500;
          margin: 20px 0 15px 0;
          color: #333333;
        }
        
        .certificate-basis-list {
          margin: 0 0 20px 0;
          padding-left: 0;
          list-style: none;
          
          li {
            margin: 10px 0;
            color: #333333;
          }
        }
        
        .certificate-info {
          margin: 20px 0 0 0;
          
          p {
            margin: 10px 0;
            font-size: 14px;
            color: #333333;
          }
        }
      }
    }
  }
}
</style>
