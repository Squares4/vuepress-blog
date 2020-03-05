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
    // 限制长度
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