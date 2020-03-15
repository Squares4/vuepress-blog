# CSS以及动画效果相关

## CSS选择器

[MDN:CSS选择器](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Selectors)

### 为什么暂时没有能够选择 父元素、父元素的同级元素，或 父元素的同级元素的子元素 的选择器或者组合器

浏览器解析HTML文档是先渲染父元素，后渲染子元素的，如果CSS支持了父选择器，子元素会影响父元素，那就必须要页面所有子元素加载完毕才能渲染HTML文档，这样会延长首页渲染时间，在阻塞情况下访问性也会变的很低。

##  圣杯布局、双飞翼布局 

三栏布局：左右定宽，中间自适应

圣杯：

1. 首先把left、middle、right都放出来
2. 给它们三个设置上float: left, 脱离文档流；
3. 一定记得给container设置上overflow: hidden; 可以形成BFC撑开文档
4. left、right设置上各自的宽度
5. middle设置width: 100%;
6. 给left、middle、right设置position: relative;
7. left设置 left: -leftWidth, right设置 right: -rightWidth;
8. container设置padding: 0, rightWidth, 0, leftWidth;

双飞翼：

双飞翼布局和圣杯布局很类似，不过是在middle的div里又插入一个div，通过调整内部div的margin值，实现中间栏自适应，内容写到内部div中。

1. 首先把left、middle、right都放出来, middle中增加inner
2. 给它们三个设置上float: left, 脱离文档流；
3. 一定记得给container设置上overflow: hidden; 可以形成BFC撑开文档
4. left、right设置上各自的宽度
5. middle设置width: 100%;
6. left设置 margin-left: -100%, right设置 right: -rightWidth;
7. container设置padding: 0, rightWidth, 0, leftWidth;

https://juejin.im/post/5caf4043f265da039f0eff94

![](https://tva1.sinaimg.cn/large/00831rSTgy1gclwfsh7wqj30vv0hvmyj.jpg)

## 什么是BFC，作用有哪些？哪些情况下会触发BFC

BFC（块级格式化上下文），是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面元素，反之亦然。它与普通的块框类似，但不同之处在于:
（1）可以阻止元素被浮动元素覆盖。
（2）可以包含浮动元素。
（3）可以阻止margin重叠。
满足下列条件之一就可触发BFC：
【1】根元素，即HTML元素
【2】float的值不为none
【3】overflow的值不为visible
【4】display的值为inline-block、table-cell、table-caption
【5】position的值为absolute或fixed

##【CSS】 只用CSS怎样实现标签页的切换效果

利用锚点结合CSS的target伪类就可以了

## 如何实现缓入缓出

CSS3里的transition，允许你添加一个缓动特效参数，例如 linear, ease-in, ease-out，这个统称为[transition-timing-function](https://developer.mozilla.org/zh-CN/docs/Web/CSS/transition-timing-function)

Js实现，则使用系数的产生是线性的:time / duration进行控制，常见的控制实现是贝塞尔曲线

[贝塞尔曲线扫盲](http://www.html-js.com/article/1628)