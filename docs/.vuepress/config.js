const path = require("path")
const rootPath = path.dirname(__dirname) // docs目录
const fileHelper = require('./theme/util/getFileNames') // 获取获取文件

const markdownSidebarConfig = fileHelper.toGetSidebar(rootPath)
const markdownNavConfig = fileHelper.toGetNav(rootPath, true)

const navConfig = [
  {
    text: 'Home',
    link: '/'
  },
  ...markdownNavConfig,
  {
    text: 'Github',
    link: 'https://github.com/Squares4/vuepress-blog'
  }
]

module.exports = {
  title: '个人主页',
  description: 'zpc的博客',
  themeConfig: {
    lastUpdated: '上次更新', // 基于git的
    nav: navConfig,
    sidebar: markdownSidebarConfig
  },
  plugins: ['@vuepress/back-to-top']
}