const path = require("path")
const rootPath = path.dirname(__dirname) // docs目录

const fileHelper = require('./utils/getFileNames') // 获取获取文件

const markdownSidebarConfig = fileHelper.toGetSidebar(rootPath)
// 首页导航依赖于config.js中传入的数据，而且每个页面均能访问
const markdownNavConfig = fileHelper.toGetNav(rootPath, true)

const navConfig = [
  // {
  //   text: 'Home',
  //   link: '/'
  // },
  ...markdownNavConfig,
  {
    text: 'Github',
    link: 'https://github.com/Squares4/vuepress-blog'
  }
]

module.exports = {
  title: '个人主页',
  description: 'Square的小站',
  themeConfig: {
    lastUpdated: '上次更新', // 基于git的
    nav: navConfig,
    sidebar: markdownSidebarConfig,
    // defaultTheme: { dark: [18, 6] },
  },
  plugins: ['@vuepress/back-to-top'],
  // 额外监听修改的文件
  extraWatchFiles: [
    './utils/getFileNames.js'
  ],
  locales: {
    // 键名是该语言所属的子路径
    // 作为特例，默认语言可以使用 '/' 作为其路径。
    '/': {
      lang: 'zh-CN', // 将会被设置为 <html> 的 lang 属性
      title: 'Square的小站',
      description: 'Vue-powered Static Site Generator'
    },
  }
  // 也可以通过这个函数传入值，来加到$page上，不过
  // 这个函数将会在编译器为每个页面执行一次
  // extendPageData($page) {
  //   $page.aaa = navConfig
  // }
}