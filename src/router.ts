import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Layout from './components/Layout.vue'
import Login from './views/Login.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '',
        redirect: '/enterprise'
      },
      {
        path: 'enterprise',
        name: 'Enterprise',
        component: () => import('./views/Enterprise.vue')
      },
      {
        path: 'product',
        name: 'Product',
        component: () => import('./views/Product.vue')
      },
      {
        path: 'product/add',
        name: 'ProductAdd',
        component: () => import('./views/ProductForm.vue')
      },
      {
        path: 'product/edit/:id',
        name: 'ProductEdit',
        component: () => import('./views/ProductForm.vue')
      },
      {
        path: 'product/detail/:id',
        name: 'ProductDetail',
        component: () => import('./views/ProductDetail.vue')
      },
      {
        path: 'code',
        name: 'Code',
        component: () => import('./views/Code.vue')
      },
      {
        path: 'report',
        name: 'Report',
        component: () => import('./views/Report.vue')
      },
      {
        path: 'report/add',
        name: 'ReportAdd',
        component: () => import('./views/ReportAdd.vue')
      },
      {
        path: 'report/edit/:batchNo',
        name: 'ReportEdit',
        component: () => import('./views/ReportAdd.vue')
      },
      {
        path: 'report/link/:batchNo',
        name: 'ReportLink',
        component: () => import('./views/ReportLink.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  // 当没有token且不是登录页时，重定向到登录页
  if (to.path !== '/login' && !token) {
    next('/login')
  } else {
    next()
  }
})

export default router