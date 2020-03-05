# 自动化部署-Jenkins

<a name="66064f35"></a>
## Jenkins + gitlab 搭建工作流

[Jenkins](https://jenkins.io/zh/)是一款业界流行的开源持续集成工具，广泛用于项目开发，具有自动化构建、测试和部署等功能。

Jenkins官网：[https://jenkins.io/](https://jenkins.io/)<br />中文：[https://jenkins.io/zh/](https://jenkins.io/zh/)

> 基于Jenkins的前端自动化工作流搭建的过程，搭建完这套工作流，我们只需要在**本地发起一个git提交，剩下的单元测试，打包构建，代码部署，邮件提醒等功能全部自动化完成**，让持续集成、持续交付、持续部署变得简单易操作，真正解决人工构建部署的诸多问题。


在这个教程中，我们将会直接把jenkins部署到远程服务器上，这里的远程服务器是阿里云的CentOS，其他linux服务器同理。之后命令我们都以linux服务器为例。

我们将会把一个React应用部署到服务器上，并实现React App的元测试，打包构建，代码部署，邮件提醒等功能。

本教程创建于2019年9月，后续版本更新可能会造成一系列配置问题。

<a name="88210852"></a>
### 准备工作

<a name="8b8a2831"></a>
#### 配置JAVA8环境

jenkins 是基于java8开发的，所以我们需要给原程服务器安装java8环境，检测服务器的java环境可以用

```bash
java -version
```

如果存在，应该会展示

```bash
openjdk version "1.8.0_212"
OpenJDK Runtime Environment (build 1.8.0_212-b04)
OpenJDK 64-Bit Server VM (build 25.212-b04, mixed mode)
```

否则

```bash
-bash: java: 未找到命令
```

我们使用yum来安装jdk(没有yum或出现命令`-bash: yum: command not found`则要去安装yum包)，这种方法的好处在于不需要我们手动配置java环境。<br />使用命令检查系统是否自带open-jdk

```bash
rpm -qa |grep java
rpm -qa |grep jdk
rpm -qa |grep gcj
```

若没有出现信息则是未安装，那么使用`yum search java`或者`yum list java*`来检索jdk列表，我们直接使用`yum list java-1.8*`来检索java8的版本

出现如下列表<br />![image.png](https://cdn.nlark.com/yuque/0/2019/png/309048/1568811758887-7bef106e-d051-43b3-8b5a-78bfedbe2b5a.png#align=left&display=inline&height=1312&name=image.png&originHeight=1312&originWidth=1230&size=623302&status=done&width=1230)

那么下载需要的java包即可，这里的x86_64后缀代表着64位系统

```bash
yum install java-1.8.0-openjdk.x86_64
```

重新使用`java -version`会出现相应的版本，则代表安装成功

<a name="27afa614"></a>
#### 安装jenkins

如果服务器没有git，也需要安装

```shell
yum install git
```

首先添加jenkins源

```bash
#添加Yum源
sudo wget -O /etc/yum.repos.d/jenkins.repo https://pkg.jenkins.io/redhat-stable/jenkins.repo

#导入密钥
sudo rpm --import https://pkg.jenkins.io/redhat-stable/jenkins.io.key
```

然后安装

```bash
yum install -y jenkins
```

安装完成后，可使用`rpm -ql jenkins`查找jenkins路径

然后就可以通过`java -jar /usr/lib/jenkins/jenkins.war --httpPort=8080`启动jenkins服务了

但是，如果用以上方式启动的话，关闭终端中止会话就会让jenkins服务停止，我们可以用以下命令加入后台执行<br />`nohup java -jar /usr/lib/jenkins/jenkins.war --httpPort=8080 &`<br />或者<br />`service jenkins start`

需要注意的是，这两种方式启动的不是同一jenkins服务，一方的配置在另一方里是无效的，个人建议使用nohup启动方式，修改端口地址更方便些。

<a name="62f9e5b1"></a>
### jenkins初始化

启动后，控制台会输出这样的信息

![image.png](https://cdn.nlark.com/yuque/0/2019/png/309048/1568811778210-c29ba4c0-dfe6-4258-8823-76a353d95bb1.png#align=left&display=inline&height=650&name=image.png&originHeight=650&originWidth=1470&size=65599&status=done&width=1470)

访问http://服务器名:8080/，进入jenkins首页<br />(如果是阿里云等限制了端口访问的服务器，需要到对应控制台的安全组中，打开8080端口，解除访问限制)

可以看到页面如下，输入刚才的密码即可进入。忘记密码则访问图片给出的路径<br />`cat /root/.jenkins/secrets/initialAdminPassword`

![image.png](https://cdn.nlark.com/yuque/0/2019/png/309048/1568811794694-b8d1b4b0-fe18-4712-bfd8-e8c323eef258.png#align=left&display=inline&height=1826&name=image.png&originHeight=1826&originWidth=1978&size=170230&status=done&width=1978)


选择**安装推荐的插件**，耐心等待完成即可，国内网络波动容易出错，多重试几次即可

![image.png](https://cdn.nlark.com/yuque/0/2019/png/309048/1568811808166-01134d80-56d5-4183-93e1-b1ff65780b24.png#align=left&display=inline&height=1822&name=image.png&originHeight=1822&originWidth=1974&size=251944&status=done&width=1974)


安装完成后，注册账户

![image.png](https://cdn.nlark.com/yuque/0/2019/png/309048/1568811819526-0fbe5b18-070d-469d-bac2-a3944b80d68f.png#align=left&display=inline&height=1822&name=image.png&originHeight=1822&originWidth=2000&size=128865&status=done&width=2000)

然后配置实例(域名)，一般来说默认即可

<a name="67193e74"></a>
### 搭建项目

<a name="47c24c9a"></a>
#### 安装必要插件

除了推荐安装的插件外，我们还需要安装另外一些必要的插件<br />点击 管理jenkins

![image.png](https://cdn.nlark.com/yuque/0/2019/png/309048/1568811889269-b831b85d-ff61-4960-bdfe-8fac28ffbfad.png#align=left&display=inline&height=1048&name=image.png&originHeight=1048&originWidth=692&size=100823&status=done&width=692)

进入管理插件

![image.png](https://cdn.nlark.com/yuque/0/2019/png/309048/1568811906158-a530956e-eca5-454c-a1df-d84cd3e7abaf.png#align=left&display=inline&height=1688&name=image.png&originHeight=1688&originWidth=1878&size=384319&status=done&width=1878)


主要安装这几项gitlab插件，安全风险请自行斟酌。

![image.png](https://cdn.nlark.com/yuque/0/2019/png/309048/1568811921220-50d00008-7b76-490f-a67e-02c64f5c3c3f.png#align=left&display=inline&height=1690&name=image.png&originHeight=1690&originWidth=2588&size=419236&status=done&width=2588)

<a name="39da6755"></a>
#### 创建项目

安装完成后，进入首页，点击创建一个新任务

![image.png](https://cdn.nlark.com/yuque/0/2019/png/309048/1568811933736-47fcfd6b-18c8-4d27-8748-45d8089ba0e1.png#align=left&display=inline&height=1236&name=image.png&originHeight=1236&originWidth=1508&size=164098&status=done&width=1508)

创建一个自由风格的项目

![image.png](https://cdn.nlark.com/yuque/0/2019/png/309048/1568811944018-332f11e1-f6f9-4827-a893-fe96467e0573.png#align=left&display=inline&height=1548&name=image.png&originHeight=1548&originWidth=1936&size=314432&status=done&width=1936)

在**General**中，根据需要添加项目描述

![image.png](https://cdn.nlark.com/yuque/0/2019/png/309048/1568811958729-f012b400-5300-4e83-b15f-404742c8808d.png#align=left&display=inline&height=940&name=image.png&originHeight=940&originWidth=1878&size=122960&status=done&width=1878)

在**源码管理**中，填写项目仓库和用户名（在这里是gitlab账号）<br />需要注意的是，URL必须是HTTP格式而不能是SSH格式

![image.png](https://cdn.nlark.com/yuque/0/2019/png/309048/1568811997431-ee380b23-00b3-48ba-9665-587ae68fef32.png#align=left&display=inline&height=1276&name=image.png&originHeight=1276&originWidth=1874&size=159284&status=done&width=1874)

**构建触发器**中，选择`Build when a change is pushed to GitLab.`点击按钮“高级”

![image.png](https://cdn.nlark.com/yuque/0/2019/png/309048/1568812053513-b8f68d10-4f32-46f5-a58a-1214a8d20246.png#align=left&display=inline&height=828&name=image.png&originHeight=828&originWidth=1882&size=133178&status=done&width=1882)


则可以看到以下选项，点击最下方的generate生成secret token

![image.png](https://cdn.nlark.com/yuque/0/2019/png/309048/1568812065810-c08068e0-d9d8-470b-bbe7-c8a9bf2c5cc8.png#align=left&display=inline&height=1840&name=image.png&originHeight=1840&originWidth=1886&size=307475&status=done&width=1886)

回到项目的gitlab页面，进入项目的**集成**或者存在设置web钩子(webhooks)的页面，将红框内的链接和secret token复制到gitlab相应的地方。根据需要设置触发情况，最后点击增加钩子。

![image.png](https://cdn.nlark.com/yuque/0/2019/png/309048/1568812078644-b9875e42-21a8-48e7-979c-53b2fc948275.png#align=left&display=inline&height=1768&name=image.png&originHeight=1768&originWidth=2870&size=385595&status=done&width=2870)


然后可以在下方测试钩子，如果出现状态码为200时，则创建成功

![image.png](https://cdn.nlark.com/yuque/0/2019/png/309048/1568812097103-1df79959-4917-49a1-95a1-4805e088af91.png#align=left&display=inline&height=286&name=image.png&originHeight=286&originWidth=1290&size=33251&status=done&width=1290)<br />![image.png](https://cdn.nlark.com/yuque/0/2019/png/309048/1568812118496-ffb2067c-9bb3-426e-8eec-6a69db08e3a9.png#align=left&display=inline&height=114&name=image.png&originHeight=114&originWidth=834&size=11276&status=done&width=834)

<a name="09f45109"></a>
#### 构建阶段

在**构建**中，点击**增加构建步骤**，选择`Execute shell`，在这里可以执行终端的命令

![image.png](https://cdn.nlark.com/yuque/0/2019/png/309048/1568812122497-25cd2906-101c-4a00-a789-decb8e3e70dc.png#align=left&display=inline&height=298&name=image.png&originHeight=596&originWidth=640&size=59182&status=done&width=320)


在这里我们输入我们需要的命令，接下来解释每一步命令的具体含义

![image.png](https://cdn.nlark.com/yuque/0/2019/png/309048/1568812132976-7f0e4252-0c06-4bf9-b28b-efcde528a66f.png#align=left&display=inline&height=706&name=image.png&originHeight=706&originWidth=1872&size=83283&status=done&width=1872)

第一步，执行`cnpm install`，安装所需要的依赖包；

第二步，执行`npm run test`，执行测试，这就是jenkins前端自动化测试的简单配置；

第三步，`rm -rf dist`是删除之前存在的dist包，如果webpack里面配置了cleanwebpackplugin则不需要执行这一步；

第四步，`npm run build`生产dist文件；

第五步和第六步，分别是进入dist将文件夹内所有内容压缩，生成压缩文件dist.tar.gz。这是为了之后的自动化部署做准备，也可以使用unzip等其他压缩方式；

<a name="4bd0d8d5"></a>
#### 自动化远程部署

再次进入插件管理，安装`Publish over shh`

![image.png](https://cdn.nlark.com/yuque/0/2019/png/309048/1568812167038-4c597cbe-fa0f-466d-9d6b-e5a8e5839f8b.png#align=left&display=inline&height=960&name=image.png&originHeight=960&originWidth=2630&size=257975&status=done&width=2630)

安装完成后，进入全局设置

![image.png](https://cdn.nlark.com/yuque/0/2019/png/309048/1568812174836-a684da91-92b4-4bb4-96e8-4d81a2984c67.png#align=left&display=inline&height=1240&name=image.png&originHeight=1240&originWidth=1784&size=319740&status=done&width=1784)


找到Publish Over SSH设置，新增SSH Server，填写相应内容

![image.png](https://cdn.nlark.com/yuque/0/2019/png/309048/1568812183785-9d380c18-1bb8-4bce-a648-433c221c67b7.png#align=left&display=inline&height=1488&name=image.png&originHeight=1488&originWidth=2646&size=294495&status=done&width=2646)

Publish Over SSH的另外一个好处在于，可以一次性将文件部署在多个服务器上

然后回到项目设置中，到**构建后选项**，选择`Send build artifacts over SSH`

然后，Name 选择刚刚创建的SSH Server，

下面的选项中，Source files代表抓取文件的路径，即jenkins当前项目文件中我们刚刚创建的压缩文件`dist.tar.gz`，这里的根路径是jenkins的当前项目路径

Exec command则代表需要执行的命令，我们这里用的是apache服务器，但是nginx服务器同理，都是将压缩后的文件移到静态服务器的相应路径下，解压缩并删除压缩包。这里不具体讲解每一行命令，请根据实际配置目录进行移动。

其他项则可以点击问号查看注释

同时，这里的命令不需要加上`&&`

![image.png](https://cdn.nlark.com/yuque/0/2019/png/309048/1568812197458-fd538dd3-2768-40d7-ab72-4ab25e6e880e.png#align=left&display=inline&height=1744&name=image.png&originHeight=1744&originWidth=1744&size=208223&status=done&width=1744)

最后保存设置，就可以开始自动化打包了。

<a name="ca08ccd6"></a>
#### 执行打包

执行`git push`等操作后，jenkins捕获到webhooks，就可以自动进行打包部署。<br />可以在构建队列中查看状态。

![image.png](https://cdn.nlark.com/yuque/0/2019/png/309048/1568812393857-bbbc3762-1f07-4f01-952f-d0c34635fabf.png#align=left&display=inline&height=1278&name=image.png&originHeight=1278&originWidth=1486&size=218311&status=done&width=1486)

好的情况下，我们会得到没有错误的环境

![image.png](https://cdn.nlark.com/yuque/0/2019/png/309048/1568812439988-a75abc1c-a250-4c1b-bd0f-ec21d12e1281.png#align=left&display=inline&height=128&name=image.png&originHeight=128&originWidth=688&size=14401&status=done&width=688)

但在执行失败的情况下，我们也则去控制台查看失败原因

![image.png](https://cdn.nlark.com/yuque/0/2019/png/309048/1568812451214-943742a1-94a8-45c7-b6bc-335e008e8c1f.png#align=left&display=inline&height=108&name=image.png&originHeight=108&originWidth=698&size=13901&status=done&width=698)

点击右箭头进入控制台输出查找原因

![image.png](https://cdn.nlark.com/yuque/0/2019/png/309048/1568812480572-535f265e-67c3-46eb-bd56-bf945eb51156.png#align=left&display=inline&height=394&name=image.png&originHeight=394&originWidth=348&size=50646&status=done&width=348)


至此，基本的jenkins自动化部署流程已经没有问题了。

<a name="3bc5e602"></a>
### 邮箱

占坑待填

<a name="0d98c747"></a>
### 其他

backup--建议安装backup插件，能够备份jenkins项目配置，防止意外情况导致配置文件丢失。

<a name="d17a0f0b"></a>
### 参考

[Linux下配置Jenkins+gitlab持续集成构建流程](https://juejin.im/post/5aab218e51882555627d06c5)

[Gitlab+Jenkins搭建持续集成系统]()

2019年9月18日
