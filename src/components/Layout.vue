<template>
  <div class="layout">
    <!-- 顶部栏 -->
    <el-header class="top-bar">
      <div class="top-bar-left">
        <div class="logo">
          <h1>溯源亮证管理系统</h1>
        </div>
      </div>
      <div class="top-bar-right">
        <el-dropdown>
          <span class="user-info">
            <el-avatar :size="32" :src="userStore.userInfo.avatar || ''"></el-avatar>
            <span class="user-name">{{ userStore.userInfo.name || '管理员' }}</span>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-header>
    
    <div class="layout-body">
      <!-- 侧边栏 -->
      <el-aside width="200px" class="layout-aside">
        <div class="menu-wrapper">
          <div
            v-for="menu in menuList"
            :key="menu.path"
            class="menu-group"
          >
            <div
              class="menu-parent"
              :class="{ active: isParentActive(menu), open: expandedMenus.includes(menu.path) }"
              @click="toggleMenu(menu.path)"
            >
              <el-icon><component :is="getIconComponent(menu.icon)" /></el-icon>
              <span>{{ menu.name }}</span>
              <el-icon class="arrow"><ArrowRight /></el-icon>
            </div>
            <div
              v-show="expandedMenus.includes(menu.path)"
              class="menu-children"
            >
              <div
                v-for="child in menu.children"
                :key="child.path"
                class="menu-child"
                :class="{ active: activeMenu === child.path }"
                @click="navigateTo(child.path)"
              >
                {{ child.name }}
              </div>
            </div>
          </div>
        </div>
      </el-aside>
      
      <!-- 主内容区 -->
      <div class="layout-main">
        <!-- 面包屑 -->
        <div class="breadcrumb">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{ currentRouteName }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        
        <!-- 内容区 -->
        <el-main class="layout-content">
          <router-view />
        </el-main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '../store/user'
import { House, Goods, Ticket, Document, ArrowRight } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const menuList = [
  {
    path: '/enterprise',
    name: '企业管理',
    icon: 'House',
    children: [
      { path: '/enterprise', name: '企业信息' }
    ]
  },
  {
    path: '/product',
    name: '商品管理',
    icon: 'Goods',
    children: [
      { path: '/product', name: '商品信息' }
    ]
  },
  {
    path: '/code',
    name: '商品码管理',
    icon: 'Ticket',
    children: [
      { path: '/code', name: '商品码信息' }
    ]
  },
  {
    path: '/report',
    name: '文件管理',
    icon: 'Document',
    children: [
      { path: '/report', name: '检验报告' }
    ]
  }
]

// 展开的菜单列表
const expandedMenus = ref<string[]>(['/enterprise'])

// 计算当前应该高亮的菜单
const activeMenu = computed(() => route.path)

const getIconComponent = (iconName: string) => {
  const icons: Record<string, any> = {
    House,
    Goods,
    Ticket,
    Document
  }
  return icons[iconName] || House
}

const isParentActive = (menu: any) => {
  // 只有当当前路径恰好等于一级菜单的路径时，才高亮显示一级菜单
  return activeMenu.value === menu.path
}

// 切换菜单展开状态
const toggleMenu = (path: string) => {
  const index = expandedMenus.value.indexOf(path)
  if (index > -1) {
    expandedMenus.value.splice(index, 1)
  } else {
    expandedMenus.value.push(path)
  }
}

const navigateTo = (path: string) => {
  router.push(path)
}

// 计算当前路由名称
const currentRouteName = computed(() => {
  const routeMap: Record<string, string> = {
    '/enterprise': '企业信息',
    '/product': '商品信息',
    '/product/add': '新增商品',
    '/product/edit/:id': '编辑商品',
    '/product/detail/:id': '商品详情',
    '/code': '商品码信息',
    '/report': '检验报告',
    '/report/add': '新增检验报告',
    '/report/edit/:batchNo': '编辑检验报告',
    '/report/link/:batchNo': '关联商品'
  }
  if (route.path.match(/^\/product\/edit\/\d+$/)) {
    return '编辑商品'
  }
  if (route.path.match(/^\/product\/detail\/\d+$/)) {
    return '商品详情'
  }
  if (route.path.match(/^\/report\/edit\/[A-Za-z0-9-]+$/)) {
    return '编辑检验报告'
  }
  if (route.path.match(/^\/report\/link\/[A-Za-z0-9-]+$/)) {
    return '关联商品'
  }
  return routeMap[route.path] || '首页'
})

// 退出登录
const logout = () => {
  userStore.logout()
  router.push('/login')
}
</script>

<style scoped lang="scss">
.layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  
  .top-bar {
    height: 60px;
    background-color: #001529;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    
    .top-bar-left {
      .logo {
          h1 {
            font-size: 18px;
            font-weight: 600;
            margin: 0;
            color: #fff;
          }
        }
    }
    
    .top-bar-right {
      .user-info {
        display: flex;
        align-items: center;
        cursor: pointer;
        color: #fff;
        
        .user-name {
          margin-left: 10px;
        }
      }
    }
  }
  
  .layout-body {
    display: flex;
    flex: 1;
    overflow: hidden;
    
    .layout-aside {
      background-color: #001529;
      color: #fff;
      height: 100%;
      overflow-y: auto;

      .menu-wrapper {
        padding: 10px 0;

        .menu-group {
          margin-bottom: 5px;

          .menu-parent {
            display: flex;
            align-items: center;
            padding: 12px 20px;
            cursor: pointer;
            color: #fff;
            transition: all 0.3s;
            border-left: 3px solid transparent;

            .el-icon {
              margin-right: 10px;
              font-size: 18px;
            }

            span {
              flex: 1;
              font-size: 14px;
            }

            .arrow {
              transition: transform 0.3s;
              font-size: 12px;
            }

            &.open {
              .arrow {
                transform: rotate(90deg);
              }
            }

            &:hover {
              background-color: rgba(255, 255, 255, 0.1);
            }

            &.active {
              background-color: rgba(64, 158, 255, 0.2);
              border-left-color: #409EFF;
              color: #409EFF;
            }
          }

          .menu-children {
            .menu-child {
              padding: 10px 20px 10px 50px;
              cursor: pointer;
              color: #ccc;
              font-size: 13px;
              transition: all 0.3s;
              border-left: 3px solid transparent;

              &:hover {
                background-color: rgba(255, 255, 255, 0.05);
                color: #fff;
              }

              &.active {
                background-color: rgba(64, 158, 255, 0.15);
                border-left-color: #409EFF;
                color: #409EFF;
              }
            }
          }
        }
      }
    }
    
    .layout-main {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      
      .breadcrumb {
        padding: 15px 20px;
        background-color: #fff;
        border-bottom: 1px solid #ebeef5;
      }
      
      .layout-content {
        flex: 1;
        overflow-y: auto;
        padding: 20px;
        background-color: #f0f2f5;
      }
    }
  }
}
</style>