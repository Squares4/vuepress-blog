# 基于VuePress的博客

本博客由[VuePress](https://vuepress.vuejs.org/zh/)搭建

[项目Github](https://github.com/Squares4/vuepress-blog)

::: warning
持续搭建中
:::

## 为什么用VuePress

据[VuePress官网](https://vuepress.vuejs.org/zh/)介绍，这个项目的诞生初衷是尤大为了支持 Vue 及其子项目的文档需求，由一个极简静态网站生成器和为书写技术文档而优化的默认主题组成。

> 每一个由 VuePress 生成的页面都带有预渲染好的 HTML，也因此具有非常好的加载性能和搜索引擎优化（SEO）。同时，一旦页面被加载，Vue 将接管这些静态内容，并将其转换成一个完整的单页应用（SPA），其他的页面则会只在用户浏览到的时候才按需加载。

VuePress有很多舒适的特性

* **为技术文档而优化的内置 Markdown 拓展**
* **在Markdown中使用Vue组件**
* **Vue驱动的自定义主题系统，同时默认主题也包含很多Markdown拓展功能**
* **自动生成Service Worker(支持PWA)**
* **Google Analytics集成**
* **基于Git的"最后更新时间插件**
* **多语言支持**

## 搭建以及优化事项

基本搭建的话详见官方文档或者文末给出的参考链接，这里主要放出的是搭建过程中我遇到的问题与解决方法。

### 目录结构

> VuePress 遵循 **“约定优于配置”** 的原则，推荐的目录结构如下：

```
.
├── docs
│   ├── .vuepress (可选的)
│   │   ├── components (可选的)
│   │   ├── theme (可选的)
│   │   │   └── Layout.vue
│   │   ├── public (可选的)
│   │   ├── styles (可选的)
│   │   │   ├── index.styl
│   │   │   └── palette.styl
│   │   ├── templates (可选的, 谨慎配置)
│   │   │   ├── dev.html
│   │   │   └── ssr.html
│   │   ├── config.js (可选的)
│   │   └── enhanceApp.js (可选的)
│   │ 
│   ├── README.md
│   ├── guide
│   │   └── README.md
│   └── config.md
│ 
└── package.json
```

`docs/.vuepress`文件夹用于存放全局的配置、组件、静态资源等，其下包含组件、主题、拓展等配置

`docs/README.md`是首页的Markdown入口，默认主题提供可以由Front Matter定制的Homepage布局

`docs/guide`则是存放Markdown的文档目录，VuePress要求每个md文档目录下都有一个README.md作为入口

### 自动生成导航栏和侧边栏

默认主题为我们提供了侧边栏、导航栏和搜索框，你可以在[默认主题配置]([https://v1.vuepress.vuejs.org/zh/theme/default-theme-config.html#%E9%A6%96%E9%A1%B5](https://v1.vuepress.vuejs.org/zh/theme/default-theme-config.html#首页))中找到相关介绍。

多个链接的导航栏

```js
// .vuepress/config.js
module.exports = {
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },               // 主页 内部链接
      { text: 'Guide', link: '/guide/' },        // guide的README.md页 内部链接
      { text: 'External', link: 'https://google.com' }, // 外部链接 VuePress会自动做相应的处理
      {
        text: 'Languages',
        ariaLabel: 'Language Menu',
        items: [
          { text: 'Chinese', link: '/language/chinese/' },
          { text: 'Japanese', link: '/language/japanese/' }
        ]
      } // 当你提供了一个 items 数组而不是一个单一的 link 时，它将显示为一个下拉列表， 也可以嵌套列表
    ]
  }
}
```

为不同的页面组来显示不同的侧边栏

```javascript
// .vuepress/config.js
module.exports = {
  themeConfig: {
    sidebar: {
      '/foo/': [
        '',     /* /foo/ */
        'one',  /* /foo/one.html */
        'two'   /* /foo/two.html */
      ],

      '/bar/': [
        '',      /* /bar/ */
        'three', /* /bar/three.html */
        'four'   /* /bar/four.html */
      ],

      // fallback
      '/': [
        '',        /* / */
        'contact', /* /contact.html */
        'about'    /* /about.html */
      ]
    }
  }
}
// 确保 fallback 侧边栏被最后定义。VuePress 会按顺序遍历侧边栏配置来寻找匹配的配置。
```

在我们书写了多个目录多个文档时，对旗下页面组设置多个导航栏和侧边栏的信息的工作就具有很高的重复性，我们可以调用node模块帮我们执行这些重复性的的工作，使其自动生成侧边栏和导航栏，代码如下。

```javascript
// docs/.vuepress/utils/getFileNames.js
const fs = require('fs');

// 排除检查的文件
const excludes = ['.DS_Store']
// 排除检查的文件夹
const excludeFolder = ['.vuepress']

const fileHelper = {
  /**
   * 获取路径下的除开跳过检查的所有文件
   * @param {string} rPath docs目录
   */
  getFileName: function (rPath) {
    let filenames = [];
    fs.readdirSync(rPath).forEach(file => {
      if (excludes.indexOf(file) < 0) {
        fullPath = rPath + "/" + file
        var fileInfo = fs.statSync(fullPath)
        if (fileInfo.isFile()) {
          if (file === 'README.md') {
            file = '';
          } else {
            file = file.replace('.md', '');
          }
          filenames.push(file);
        }
      }
    })
    filenames.sort();
    return filenames;
  },
  /**
   * 获取路径下的除开跳过检查的所有文件夹
   * @param {string} rPath 
   */
  getAllFolder: function(rPath) {
    let folderNames = [];
    fs.readdirSync(rPath).forEach(folder => {
      if (excludeFolder.indexOf(folder) < 0) {
        fullPath = rPath + "/" + folder
        var folderInfo = fs.statSync(fullPath)
        if (folderInfo.isDirectory()) {
          if (folder === 'index') {
            folder = '';
          } else {
            folder = folder.replace('.md', '');
          }
          folderNames.push(folder);
        }
      }
    })
    folderNames.sort();
    return folderNames;
  },
  /**
   * 递归获得docs下的markdown目录及其内部 一层 的文件，并将其转换成适合themeConfig.sidebar的形式
   * @param {string} rPath docs目录
   */
  toGetSidebar: function(rPath) {
    var sidebarConfig = {}
    var folderNames = this.getAllFolder(rPath)
    var realFolderPath = folderNames.map(folder => (
      `${rPath}/${folder}`
    ))
    realFolderPath.forEach((folder, index) => {
      sidebarConfig[`/${folderNames[index]}/`] = this.getFileName(folder)
    })
    return sidebarConfig
  },
  /**
   * 递归获得docs下的markdown目录及其内部 一层 的文件，并将其转换成适合themeConfig.nav的形式
   * @param {string} rPath docs目录
   * @param {boolean} upper 是否将首字母大写，默认为 false
   * @param {number} limit 是否限制获取到的目录长度，默认为 0，即不限制
   */
  toGetNav: function (rPath, upper = false, limit = 0) {
    var navConfig = []
    var folderNames = this.getAllFolder(rPath)
    // 限制长度，如果导航栏太长则不美观
    if (limit > 0) {
      folderNames.length = limit
    }
    // 文件夹首字母大写
    if (upper) {
      folderNames = folderNames.map(folder => {
        const [first, ...rest] = folder
        return first.toLocaleUpperCase() + rest.join('')
      })
    }
    folderNames.map(folder => {
      var obj = {};
      obj['text'] = folder;
      obj['link'] = `/${folder}/`
      navConfig.push(obj);
    })
    return navConfig
  }
}

module.exports = fileHelper;
```

接着，我们在`.vuepress/config.js`调用其代码，`webpack`会自动调用其模块

```javascript
// .vuepress/config.js
const path = require("path")
const rootPath = path.dirname(__dirname) // docs目录

const fileHelper = require('./utils/getFileNames') // 获取获取文件

const markdownSidebarConfig = fileHelper.toGetSidebar(rootPath)
// 首页导航依赖于config.js中传入的数据，而且每个页面均能访问
const markdownNavConfig = fileHelper.toGetNav(rootPath, true)

// 我们可以对获取到的路径进行一定的修改
const navConfig = [
  // {
  //   text: 'Home',
  //   link: '/'
  // },
  ...markdownNavConfig,
  // {
  //   text: 'Github',
  //   link: 'https://github.com/Squares4/vuepress-blog'
  // }
]

const sideBarConfig = [
  // ...
  ...markdownNavConfig
  // ...
]

//
module.exports = {
  themeConfig: {
    lastUpdated: '上次更新', // 基于git的文章更新时间插件
    nav: navConfig,
    sidebar: markdownSidebarConfig
  },
}
```

这样我们创建新的文档组和添加新的文档时，VuePress会自动创建相应的链接

需要注意的是，这里我们书写的结构只能读取`docs/[文档名]`内部一层的文档，请你按需对多层文档进行导航和路由的修改配置。

### 使用中文站点

VuePress的默认站点的lang标签为英文，我们简单设置即可

```javascript
module.exports = {
locales: {
    // 键名是该语言所属的子路径
    // 作为特例，默认语言可以使用 '/' 作为其路径。
    '/': {
      lang: 'zh-CN', // 将会被设置为 <html> 的 lang 属性
      title: 'Square的小站',
      description: 'Vue-powered Static Site Generator'
    },
  }
}
```

### 有关默认主题

一般而言，默认主题已经足够满足很多需求，但是我们想对默认主题进行进一步的定制，则可以使用2个方法

#### eject

使用`vuepress eject`命令，将默认主题复制到 `.vuepress/theme` 目录，以供自定义。

我首页的导航栏便是基于对VuePress默认主题的修改定制而成的，这个可以方便的对默认主题进行个人化定制，但是缺点在于这样不能使用其他人继承默认主题后的自定义主题，VuePress目前不支持多次继承。

0.x版本中主题的入口只需要一个 `Layout.vue`，我们可以对`docs/.vuepress/theme/layouts`下文件进行包装来进行个人化的定制。

#### 继承主题

可以继承默认主题，在自定义的主题中的`index.js`使用

```js
// docs/.vuepress/theme/index.js
module.exports = {
  extend: '@vuepress/theme-default'
}
```

随后在自定义主题中即可继承父主题，并加以包装修改

```js
// docs/.vuepress/theme/layouts/Layout.vue
<template>
  <ParentLayout />
</template>

<script>
import ParentLayout from '@parent-theme/layouts/Layout.vue'

export default {
  components: {
    ParentLayout
  },
  data() {
    return {
      // ...
    }
  },
  computed: {
    // ...
  }
}
</script>
```

### 深夜模式（搭建中）

深夜模式其实算是主题切换的一种，目前大多是全局替换CSS

目前针对想法是使用`CSS变量`方便书写多个主题，同时使用CSS新特性`prefers-color-scheme`，它可以检测Win10或者Mac OS的黑夜模式，对网页进行主题色替换。

### 评论系统（搭建中）

目前有两种方案，一种是基于Github的Issues的GitTalk，其缺点是评论者必须登陆github账户，但是对评论的维护工作主要在Github上处理。

另一种是[Valine](https://valine.js.org/)，其不需要开发者提供后台服务器和后台代码，也不需要用户登陆额外账户，同时支持支持阅读量统计等等功能。它是基于`LeanCloud`服务的，需要登录`Leancloud应用`对评论内容进行管理。

### 参考链接和推荐主题

[一步步搭建 VuePress 及优化【初始化到发布】](https://juejin.im/post/5c9efe596fb9a05e122c73f1#heading-10) 包含视频流程

[what-i-learned-from-analysis-vuepress](https://juejin.im/post/5dc42ebb6fb9a04a9378381c) 有关VuePress的分析和社区实践推荐

[vuepress-theme-hope](https://github.com/Mister-Hope/vuepress-theme-hope) 继承于默认主题，添加了很多功能