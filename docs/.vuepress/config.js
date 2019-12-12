const path = require("path")
const rootPath = path.dirname(__dirname)
const fileHelper = require('./utils/getFileNames')

const sidebarConfig = fileHelper.start(rootPath)
const navConfig = [
  {
    text: 'Home',
    link: '/'
  },
  ...fileHelper.navBarStart(rootPath, true),
  {
    text: 'Github',
    link: 'https://github.com/Squares4'
  }
]

module.exports = {
  title: '个人主页',
  description: 'zpc的博客',
  themeConfig: {
    nav: navConfig,
    sidebar: sidebarConfig
  }
}