const fs = require('fs');
// 排除检查的文件
var excludes = ['.DS_Store']
// 排除检查的文件夹
var excludeFolder = ['.vuepress']

var fileHelper = {
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
  start: function(rPath) {
    var sidebarConfig = {}
    var folderNames = this.getAllFolder(rPath)
    var realFolderPath = folderNames.map(folder => (
      `${rPath}/${folder}`
    ))
    realFolderPath.forEach((folder, index) => {
      sidebarConfig[`/${folderNames[index]}/`] = this.getFileName(folder)
    })
    // console.log(sidebarConfig)
    return sidebarConfig
  },
  navBarStart: function (rPath, upper = false, limit = 0) {
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

export default fileHelper;