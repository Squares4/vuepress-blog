# 基于VuePress的博客

本博客由[VuePress](https://vuepress.vuejs.org/zh/)搭建

## 自动生成导航栏和侧边栏

### 侧边栏

在默认主题配置的[侧边栏](https://vuepress.vuejs.org/zh/theme/default-theme-config.html#%E4%BE%A7%E8%BE%B9%E6%A0%8F)中，可以通过对象设置多个侧边栏，也能为不同的页面组来显示不同的侧边栏。

但是，如果一个个手写设置非常麻烦，所以我们添加一个根据目录自动生成侧边栏的模块。

#### 目录结构

```
├── docs
│   ├── .vuepress
│   │   └── ...
│   │   
│   ├── README.md
│   ├── node
│   │   └── README.md
│   │   
│   ├── projects
│   │   ├── ...
│   │   └── README.md
│   │   
```

sadssadsd