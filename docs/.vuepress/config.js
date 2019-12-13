const path = require("path")
const rootPath = path.dirname(__dirname)
const fileHelper = require('./theme/util/getFileNames')

const sidebarConfig = fileHelper.start(rootPath)
const navBarConfig = fileHelper.navBarStart(rootPath, true)

const navConfig = [
  {
    text: 'Home',
    link: '/'
  },
  ...navBarConfig,
  {
    text: 'Github',
    link: 'https://github.com/Squares4/vuepress-blog-zpc'
  }
]

module.exports = {
  title: '个人主页',
  description: 'zpc的博客',
  themeConfig: {
    lastUpdated: '上次更新', // 基于git的
    nav: navConfig,
    sidebar: sidebarConfig
  },
  plugins: ['@vuepress/back-to-top']
}