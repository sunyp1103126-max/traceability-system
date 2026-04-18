import { defineStore } from 'pinia'

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [
      // 蔬菜类
      {
        id: 1,
        code: '202603050001',
        name: '有机青菜',
        category: '蔬菜',
        brand: '绿源',
        mainImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=fresh%20organic%20green%20vegetables&image_size=square',
        status: 'active',
        createTime: '2024-01-01 09:15:30',
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
      },
      {
        id: 2,
        code: '202603050002',
        name: '西红柿',
        category: '蔬菜',
        brand: '农家',
        mainImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=fresh%20tomatoes&image_size=square',
        status: 'active',
        createTime: '2024-01-02 14:20:45',
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
      },
      {
        id: 3,
        code: '202603050003',
        name: '黄瓜',
        category: '蔬菜',
        brand: '绿源',
        mainImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=fresh%20cucumbers&image_size=square',
        status: 'active',
        createTime: '2024-01-03 10:45:12',
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
      },
      {
        id: 4,
        code: '202603050004',
        name: '茄子',
        category: '蔬菜',
        brand: '农家',
        mainImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=fresh%20eggplants&image_size=square',
        status: 'active',
        createTime: '2024-01-04 16:30:22',
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
      },
      // 水果类
      {
        id: 5,
        code: '202603050005',
        name: '香蕉',
        category: '水果',
        brand: '热带',
        mainImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=fresh%20bananas%20bunch&image_size=square',
        status: 'active',
        createTime: '2024-01-05 08:12:55',
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
      },
      {
        id: 6,
        code: '202603050006',
        name: '苹果',
        category: '水果',
        brand: '红富士',
        mainImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=fresh%20apples&image_size=square',
        status: 'active',
        createTime: '2024-01-06 11:25:18',
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
      },
      {
        id: 7,
        code: '202603050007',
        name: '橘子',
        category: '水果',
        brand: '蜜桔',
        mainImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=fresh%20oranges&image_size=square',
        status: 'active',
        createTime: '2024-01-07 13:40:05',
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
      },
      // 茶鲜叶类
      {
        id: 8,
        code: '202603050008',
        name: '绿茶',
        category: '茶鲜叶',
        brand: '高山',
        mainImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=fresh%20green%20tea%20leaves&image_size=square',
        status: 'active',
        createTime: '2024-01-08 07:30:40',
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
      },
      {
        id: 9,
        code: '202603050009',
        name: '红茶',
        category: '茶鲜叶',
        brand: '云雾',
        mainImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=fresh%20black%20tea%20leaves&image_size=square',
        status: 'active',
        createTime: '2024-01-09 15:10:33',
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
      },
      // 畜禽类
      {
        id: 10,
        code: '202603050010',
        name: '有机猪肉',
        category: '畜禽',
        brand: '生态猪',
        mainImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=fresh%20organic%20pork%20meat&image_size=square',
        status: 'active',
        createTime: '2024-01-10 09:55:27',
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
      },
      {
        id: 11,
        code: '202603050011',
        name: '鸡肉',
        category: '畜禽',
        brand: '散养',
        mainImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=fresh%20chicken%20meat&image_size=square',
        status: 'active',
        createTime: '2024-01-11 12:30:15',
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
      },
      // 禽蛋类
      {
        id: 12,
        code: '202603050012',
        name: '土鸡蛋',
        category: '禽蛋',
        brand: '农家',
        mainImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=fresh%20farm%20eggs%20in%20carton&image_size=square',
        status: 'active',
        createTime: '2024-01-12 10:15:45',
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
      },
      {
        id: 13,
        code: '202603050013',
        name: '鸭蛋',
        category: '禽蛋',
        brand: '水乡',
        mainImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=fresh%20duck%20eggs&image_size=square',
        status: 'active',
        createTime: '2024-01-13 14:50:20',
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
      },
      // 养殖水产品类
      {
        id: 14,
        code: '202603050014',
        name: '新鲜鱼',
        category: '养殖水产品',
        brand: '海之鲜',
        mainImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=fresh%20fish%20on%20ice&image_size=square',
        status: 'active',
        createTime: '2024-01-14 06:45:30',
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
      },
      {
        id: 15,
        code: '202603050015',
        name: '虾',
        category: '养殖水产品',
        brand: '海之鲜',
        mainImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=fresh%20shrimp&image_size=square',
        status: 'active',
        createTime: '2024-01-15 17:20:10',
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
      },
      // 其他类
      {
        id: 16,
        code: '202603050016',
        name: '有机大米',
        category: '其他',
        brand: '绿源',
        mainImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=organic%20rice&image_size=square',
        status: 'active',
        createTime: '2024-01-16 11:45:55',
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
      },
      {
        id: 17,
        code: '202603050017',
        name: '木耳',
        category: '其他',
        brand: '山珍',
        mainImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=dried%20black%20fungus%20mushrooms&image_size=square',
        status: 'active',
        createTime: '2024-01-17 15:30:40',
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
      }
    ],
    categories: [
      { label: '蔬菜', value: '蔬菜' },
      { label: '水果', value: '水果' },
      { label: '茶鲜叶', value: '茶鲜叶' },
      { label: '畜禽', value: '畜禽' },
      { label: '禽蛋', value: '禽蛋' },
      { label: '养殖水产品', value: '养殖水产品' },
      { label: '其他', value: '其他' }
    ]
  }),
  getters: {
    sortedProducts: (state) => {
      return [...state.products].sort((a, b) => {
        return new Date(b.createTime).getTime() - new Date(a.createTime).getTime()
      })
    },
    nextProductCode: (state) => {
      const maxId = Math.max(...state.products.map(p => p.id))
      const nextId = maxId + 1
      return `SP${String(nextId).padStart(6, '0')}`
    }
  },
  actions: {
    addProduct(product) {
      // 生成随机的时分秒
      const hours = String(Math.floor(Math.random() * 24)).padStart(2, '0')
      const minutes = String(Math.floor(Math.random() * 60)).padStart(2, '0')
      const seconds = String(Math.floor(Math.random() * 60)).padStart(2, '0')
      
      const newProduct = {
        id: this.products.length + 1,
        code: this.nextProductCode,
        status: 'active',
        createTime: new Date().toISOString().slice(0, 10) + ` ${hours}:${minutes}:${seconds}`,
        ...product
      }
      this.products.unshift(newProduct)
      return newProduct
    },
    updateProduct(id, product) {
      const index = this.products.findIndex(p => p.id === id)
      if (index !== -1) {
        this.products[index] = { ...this.products[index], ...product }
        return this.products[index]
      }
      return null
    },
    deleteProduct(id) {
      const index = this.products.findIndex(p => p.id === id)
      if (index !== -1) {
        this.products.splice(index, 1)
        return true
      }
      return false
    },
    toggleStatus(id) {
      const index = this.products.findIndex(p => p.id === id)
      if (index !== -1) {
        const currentStatus = this.products[index].status
        this.products[index].status = (currentStatus === 1 || currentStatus === 'active') ? 'inactive' : 'active'
        return this.products[index]
      }
      return null
    },
    getProductById(id) {
      return this.products.find(p => p.id === id)
    },
    isProductNameUnique(name, category, excludeId) {
      return !this.products.some(p => 
        p.name === name && 
        p.category === category && 
        p.id !== excludeId
      )
    }
  }
})