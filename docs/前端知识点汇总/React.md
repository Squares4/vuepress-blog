# React 知识点

## JSX

JSX，是一个 JavaScript 的语法扩展。实际上，JSX 仅仅只是 `React.createElement(component, props, ...children)` 函数的语法糖，Babel 会把 JSX 转译成一个名为 `React.createElement()` 函数调用。

React DOM 在渲染所有输入内容之前，默认会进行转义。它可以确保在你的应用中，永远不会注入那些并非自己明确编写的内容。所有的内容在渲染之前都被转换成了字符串。这样可以**有效地防止 XSS攻击**。

[知乎：JSX有哪些缺陷](https://www.zhihu.com/question/48528161)

## React 生命周期

[深入React的生命周期(上)：出生阶段(Mount)](https://juejin.im/post/59fede45f265da430b7a9d9f)

[深入React的生命周期(下)：更新(Update)](https://juejin.im/post/5a0852325188255ea95b6f26)

### (在构造函数中)调用 super(props) 的目的是什么

在 super() 被调用之前，子类是不能使用 this 的，在 ES2015 中，子类必须在 constructor 中调用 super()。传递 props 给 super() 的原因则是便于(在子类中)能在 constructor 访问 this.props。

### setState() 机制

在React中，**如果是由React引发的事件处理（比如通过onClick引发的事件处理），调用setState不会同步更新this.state，除此之外的setState调用会同步执行this.state**。所谓“除此之外”，指的是绕过React通过addEventListener直接添加的事件处理函数，还有通过setTimeout/setInterval产生的异步调用。

在React的setState函数实现中，会根据一个变量isBatchingUpdates判断是直接更新this.state还是放到队列中回头再说，而isBatchingUpdates默认是false，也就表示setState会同步更新this.state，但是，**有一个函数batchedUpdates，这个函数会把isBatchingUpdates修改为true，而当React在调用事件处理函数之前就会调用这个batchedUpdates，造成的后果，就是由React控制的事件处理过程setState不会同步更新this.state，而是等到componentDidMount/Updated执行完后再更新**。
对于异步渲染，我们应在 `getSnapshotBeforeUpdate` 中读取 `state`、`props`, 而不是 `componentWillUpdate`。但调用`forceUpdate()` 强制 render 时，会导致组件跳过 `shouldComponentUpdate()`,直接调用 `render()`。

总结：

1. **`setState` 只在合成事件和钩子函数中是“异步”的，在原生事件和 `setTimeout` 中都是同步的。**

2. **`setState`的“异步”并不是说内部由异步代码实现，其实本身执行的过程和代码都是同步的，只是合成事件和钩子函数的调用顺序在更新之前，导致在合成事件和钩子函数中没法立马拿到更新后的值，形式了所谓的“异步”，当然可以通过第二个参数 setState(partialState, callback) 中的callback拿到更新后的结果。**

3. **`setState` 的批量更新优化也是建立在“异步”（合成事件、钩子函数）之上的，在原生事件和setTimeout 中不会批量更新，在“异步”中如果对同一个值进行多次 `setState` ， `setState` 的批量更新策略会对其进行覆盖，取最后一次的执行，如果是同时 `setState` 多个不同的值，在更新时会对其进行合并批量更新。**

[React 源码剖析系列 － 解密 setState](https://zhuanlan.zhihu.com/p/20328570)

[[React技术内幕] setState的秘密](https://juejin.im/post/599b8f066fb9a0247637d61b#heading-1)

[你真的理解setState吗？](https://juejin.im/post/5b45c57c51882519790c7441)

[React源码解析(三):详解事务与更新队列](https://juejin.im/post/59cc4c4bf265da0648446ce0)

## Virtual DOM 

### Diff算法 

> tree diff、component diff、element diff

[浅入浅出图解domDIff](https://juejin.im/post/5ad550f06fb9a028b4118d99)

[React 源码剖析系列 － 不可思议的 react diff]()

[让虚拟DOM和DOM-diff不再成为你的绊脚石](https://juejin.im/post/5c8e5e4951882545c109ae9c)

### React中Virtual Dom与真实Dom速度比较

React.js 相对于直接操作原生DOM有很大的性能优势， 背后的技术支撑是基于virtual DOM的batching 和diff.

[知乎：网上都说操作真实 DOM 慢，但测试结果却比 React 更快，为什么？](https://www.zhihu.com/question/31809713)

[Virtual Dom作者在StackOverflow的回答](https://stackoverflow.com/questions/21109361/why-is-reacts-concept-of-virtual-dom-said-to-be-more-performant-than-dirty-mode/23995928#23995928)

## 事件在 React 中的处理方式。

> 为了解决跨浏览器兼容性问题，您的 React 中的事件处理程序将传递 SyntheticEvent(合成事件) 的实例，它是 React 的浏览器本机事件的跨浏览器包装器。
>
> 这些 SyntheticEvent 与您习惯的原生事件具有相同的接口，除了它们在所有浏览器中都兼容。有趣的是，React 实际上并没有将事件附加到子节点本身。React 将使用单个事件监听器监听顶层的所有事件。这对于性能是有好处的，这也意味着在更新 DOM 时，React 不需要担心跟踪事件监听器。

React 为提高性能，有自己的一套事件处理机制，相当于将事件代理到全局进行处理，也就是说监听函数并未绑定到DOM元素上。因此，如果你禁止react事件冒泡`e.stopPropagation()`，你就无法阻止原生事件冒泡；你禁用原生事件冒泡`e.nativeEvent.stopPropagation()`，React的监听函数就调用不到了。

[React 中阻止事件冒泡的问题](https://www.cnblogs.com/Wayou/p/react_event_issue.html)

[React合成事件和DOM原生事件混用须知](https://juejin.im/post/59db6e7af265da431f4a02ef)

### 合成事件的冒泡处理

## pureComponent & Component

当组件更新时，如果组件的 props 和 state 都没发生改变，render 方法就不会触发，省去 Virtual DOM 的生成和比对过程，达到提升性能的目的。具体就是 React 自动帮我们做了一层浅比较：

```js
if (this._compositeType === CompositeTypes.PureClass) {
  shouldUpdate = !shallowEqual(prevProps, nextProps)
  || !shallowEqual(inst.state, nextState);
}
```

而 `shallowEqual` 又做了什么呢？会比较 `Object.keys(state | props)` 的长度是否一致，每一个 key是否两者都有，并且是否是一个引用，也就是只比较了第一层的值，确实很浅，所以深层的嵌套数据是对比不出来的。

PureComponent真正起作用的，只是在一些纯展示组件上，复杂组件用了也没关系，反正`shallowEqual`那一关就过不了，不过记得 `props` 和 `state` 不能使用同一个引用哦。

果 `PureComponent` 里有 `shouldComponentUpdate` 函数的话，直接使用 `shouldComponentUpdate` 的结果作为是否更新的依据，没有`shouldComponentUpdate` 函数的话，才会去判断是不是 `PureComponent` ，是的话再去做 `shallowEqual`浅比较

[React PureComponent 使用指南](https://wulv.site/2017-05-31/react-purecomponent.html)

##  React.memo()

React.memo 为高阶组件。它与 React.PureComponent 非常相似，但它适用于函数组件，但不适用于 class 组件。官网原文如下。

> React.memo only affects props changes. If your function component wrapped in React.memo has a useState or useContext Hook in its implementation, it will still rerender when state or context change.

因为memo只进行浅比较，可以自行实现函数进行比较

```js
function MyComponent(props) {
  /* render using props */
}
function areEqual(prevProps, nextProps) {
  /*
  return true if passing nextProps to render would return
  the same result as passing prevProps to render,
  otherwise return false
  */
}
export default React.memo(MyComponent, areEqual);
```

##  react.lazy & suspense 

可以不借助任何附加库就能通过代码分割（code splitting）延迟加载 react 组件。延迟加载是一种优先渲染必须或重要的用户界面项目，而将不重要的项目悄然载入的技术。先前有react-loadable实现。

```js
const OtherComponent = React.lazy(() => import('./OtherComponent'));

function MyComponent() {
  return (
    <div>
      <OtherComponent />
    </div>
  );
}
```

Suspense 是一个延迟函数所必须的组件，通常用来包裹住延迟加载组件。多个延迟加载的组件可被包在一个 suspense 组件中。它也提供了一个 fallback 属性，用来在组件的延迟加载过程中显式某些 react 元素。

同时最好使用一个边界异常捕获技术来处理错误

```js
const OtherComponent = React.lazy(() => import('./OtherComponent'));

function MyComponent() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <OtherComponent />
      </Suspense>
    </div>
  );
}
```

**有关SSR**

> React.lazy 和 Suspense 技术还不支持服务端渲染。如果你想要在使用服务端渲染的应用中使用，我们推荐 Loadable Components 这个库。

[深度理解 React Suspense](https://juejin.im/post/5c7d4a785188251b921f4e26)

##  Context 

Context 提供了一种在组件之间共享此类值的方式，而不必显式地通过组件树的逐层传递 props。比如Redux或者传递主题的属性。

他回导致组件复用性变差，使用前需要思考可否用组合组件或者传递组件来替代它

生产者消费者模式：`<Provider /> & <Consumer />`

除了实例的`context`属性(`this.context`)，React组件还有很多个地方可以直接访问父组件提供的`Context`

[聊一聊我对 React Context 的理解以及应用](https://juejin.im/post/5a90e0545188257a63112977)

## React Hooks 

## 【数据绑定】 Angular和Vue的双向数据绑定实现的原理？

> Angular的实现： AngularJS 采用“脏值检测”的方式，数据发生变更后，对于所有的数据和视图的绑定关系进行一次检测，识别是否有数据发生了改变，有变化进行处理，可能进一步引发其他数据的改变，所以这个过程可能会循环几次，一直到不再有数据变化发生后，将变更的数据发送到视图，更新页面展现。
> 只有当改变$scope的值、使用内置的$interval、$timeout的时候，才会进行“脏检测”。
> 如果是手动对 ViewModel 的数据进行变更，为确保变更同步到视图，需要手动触发一次“脏值检测”。
> Vue的实现：核心就是数据劫持+发布/订阅模式，VueJS 使用 ES5 提供的 Object.defineProperty() 方法，监控对数据的操作，从而可以自动触发数据同步。并且，由于是在不同的数据上触发同步，可以精确的将变更发送给绑定的视图，而不是对所有的数据都执行一次检测。

## React Fiber

[React Fiber架构](https://zhuanlan.zhihu.com/p/37095662)

[React系列——React Fiber 架构介绍资料汇总（翻译+中文资料）](https://segmentfault.com/a/1190000012834204)

[完全理解React Fiber](http://www.ayqy.net/blog/dive-into-react-fiber/)

#### Why DFS

1. BFS队列深度太深
2. Context
   * react15 中，context 是作为递归渲染与更新时的函数的一个参数层层携带的，比较尴尬的是如果 context 在项目中没用到，那么 react 也会将初始化的 context —— 空对象层层传递下去。
   * react16 中，用一个数组 contextStack 维护 `context`，只会在带有`getChildContext`的组件中 `contextStack.unshift`由 `getChildContext` 得到的 `context`，之后的子组件会将`contextStack[0]` 作为自己的 `context`，而深度优先遍历深度延续结束后，回到开始的 fiber 节点过程中，会再次访问深度遍历时访问的父节点，这时候再做 `contextStack.shift`() 操作，维护 `contextStack` 数组
3. 符合组件的生命周期

# Redux 知识点

## 纯函数 & reducer 

## 【Redux】 redux-thunk 作用以及原理 

