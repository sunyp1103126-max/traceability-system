<template>
  <div class="dashboard">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card class="card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span>溯源码总数</span>
              <el-icon class="card-icon"><Document /></el-icon>
            </div>
          </template>
          <div class="card-content">
            <div class="card-value">{{ stats.totalCodes }}</div>
            <div class="card-desc">已生成溯源码数量</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span>产品数量</span>
              <el-icon class="card-icon"><ShoppingCart /></el-icon>
            </div>
          </template>
          <div class="card-content">
            <div class="card-value">{{ stats.totalProducts }}</div>
            <div class="card-desc">已注册产品数量</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span>用户数量</span>
              <el-icon class="card-icon"><User /></el-icon>
            </div>
          </template>
          <div class="card-content">
            <div class="card-value">{{ stats.totalUsers }}</div>
            <div class="card-desc">系统用户数量</div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="12">
        <el-card class="card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span>溯源码生成趋势</span>
              <el-icon class="card-icon"><TrendCharts /></el-icon>
            </div>
          </template>
          <div class="chart-container">
            <div class="chart-placeholder">
              <el-icon class="placeholder-icon"><DataAnalysis /></el-icon>
              <span>图表区域</span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span>最近操作</span>
              <el-icon class="card-icon"><Clock /></el-icon>
            </div>
          </template>
          <div class="recent-operations">
            <el-timeline>
              <el-timeline-item
                v-for="(item, index) in recentOperations"
                :key="index"
                :timestamp="item.time"
              >
                <el-card>
                  <div class="operation-content">{{ item.content }}</div>
                  <div class="operation-user">{{ item.user }}</div>
                </el-card>
              </el-timeline-item>
            </el-timeline>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Document, ShoppingCart, User, TrendCharts, DataAnalysis, Clock } from '@element-plus/icons-vue'

interface Stats {
  totalCodes: number
  totalProducts: number
  totalUsers: number
}

interface Operation {
  content: string
  user: string
  time: string
}

const stats = ref<Stats>({
  totalCodes: 1250,
  totalProducts: 86,
  totalUsers: 24
})

const recentOperations = ref<Operation[]>([
  {
    content: '生成了100个溯源码',
    user: '管理员',
    time: '2026-04-16 10:30'
  },
  {
    content: '添加了新产品：苹果手机',
    user: '管理员',
    time: '2026-04-16 09:15'
  },
  {
    content: '修改了用户权限',
    user: '管理员',
    time: '2026-04-15 16:45'
  },
  {
    content: '导出了溯源码数据',
    user: '管理员',
    time: '2026-04-15 14:20'
  }
])

onMounted(() => {
  // 这里可以添加获取统计数据的API调用
  console.log('Dashboard mounted')
})
</script>

<style scoped lang="scss">
.dashboard {
  .card {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .card-icon {
        font-size: 18px;
        color: #1890ff;
      }
    }

    .card-content {
      text-align: center;
      padding: 20px 0;

      .card-value {
        font-size: 36px;
        font-weight: bold;
        color: #1890ff;
        margin-bottom: 8px;
      }

      .card-desc {
        font-size: 14px;
        color: #999;
      }
    }

    .chart-container {
      height: 300px;
      display: flex;
      justify-content: center;
      align-items: center;

      .chart-placeholder {
        text-align: center;
        color: #999;

        .placeholder-icon {
          font-size: 48px;
          margin-bottom: 16px;
          display: block;
        }
      }
    }

    .recent-operations {
      max-height: 300px;
      overflow-y: auto;

      .operation-content {
        font-size: 14px;
        margin-bottom: 8px;
      }

      .operation-user {
        font-size: 12px;
        color: #999;
      }
    }
  }
}
</style>