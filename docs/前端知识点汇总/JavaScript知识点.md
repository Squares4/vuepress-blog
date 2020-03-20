# JavaScript知识点

[typeof 和 instanceOf的区别](https://segmentfault.com/a/1190000000730982)

## 浮点数精度

**如何判断 0.1 + 0.2 与 0.3 相等？**

1. 非是 ECMAScript 独有
2. IEEE754 标准中 64 位的储存格式，比如 11 位存偏移值![img](https://tva1.sinaimg.cn/large/00831rSTgy1gd0da5wezkj30gi02o74o.jpg)
   - 符号位S：第 1 位是正负数符号位（sign），0代表正数，1代表负数
   - 指数位E：中间的 11 位存储指数（exponent），用来表示指数
   - 尾数位M：最后的 52 位是尾数（mantissa），超出的部分自动进一舍零
3. 其中涉及的三次精度丢失
   1. 浮点数转二进制
   2. 浮点数以科学计数法储存
   3. 浮点数运算

解决方案：

1. 转换为整数再计算
2. 转换为字符串计算
3. `console.log( Math.abs(0.1 + 0.2 - 0.3) <= Number.EPSILON);`

[JavaScript 浮点数陷阱及解法](https://github.com/camsong/blog/issues/9)

[JavaScript 深入之浮点数精度](https://github.com/mqyqingfeng/Blog/issues/155)

##V8 & 垃圾回收

V8采用了混合编译执行和解释执行（JIT）。解释执行的启动速度快，但是执行时的速度慢，而编译执行的启动速度慢，但是执行时的速度快。

V8 执行一段 JavaScript 代码所经历的主要流程

1. 初始化基础环境；
2. 解析源码生成 AST 和作用域；
3. 依据 AST 和作用域生成字节码；
4. 解释执行字节码；
5. 监听热点代码；
6. 优化热点代码为二进制的机器代码；
7. 反优化生成的二进制机器代码。

![img](https://tva1.sinaimg.cn/large/00831rSTgy1gd0djphuarj30vq0gsgqx.jpg)

**一段js代码如何执行的**

在执行一段代码时，JS 引擎会首先创建一个执行栈

然后JS引擎会创建一个全局执行上下文，并push到执行栈中, 这个过程JS引擎会为这段代码中所有变量分配内存并赋一个初始值（undefined），在创建完成后，JS引擎会进入执行阶段，这个过程JS引擎会逐行的执行代码，即为之前分配好内存的变量逐个赋值(真实值)。

如果这段代码中存在function的声明和调用，那么JS引擎会创建一个函数执行上下文，并push到执行栈中，其创建和执行过程跟全局执行上下文一样。但有特殊情况，即当函数中存在对其它函数的调用时，JS引擎会在父函数执行的过程中，将子函数的全局执行上下文push到执行栈，这也是为什么子函数能够访问到父函数内所声明的变量。

还有一种特殊情况是，在子函数执行的过程中，父函数已经return了，这种情况下，JS引擎会将父函数的上下文从执行栈中移除，与此同时，JS引擎会为还在执行的子函数上下文创建一个闭包，这个闭包里保存了父函数内声明的变量及其赋值，子函数仍然能够在其上下文中访问并使用这边变量/常量。当子函数执行完毕，JS引擎才会将子函数的上下文及闭包一并从执行栈中移除。

[V8 是怎么跑起来的 —— V8 的 JavaScript 执行管道](https://juejin.im/post/5dc4d823f265da4d4c202d3b#heading-10)

[The Ultimate Guide to Hoisting, Scopes, and Closures in JavaScript](https://tylermcginnis.com/ultimate-guide-to-execution-contexts-hoisting-scopes-and-closures-in-javascript/?spm=ata.13261165.0.0.2d8e16798YR8lw)

## JS基础

### 构造函数 & 原型 & 原型链 & 继承

**ES6 CLASS 和 ES5 Function 区别**

ES5 和 ES6 子类 `this` 生成顺序不同。ES5 的继承先生成了子类实例，再调用父类的构造函数修饰子类实例。

ES6 的继承先生成父类实例，再调用子类的构造函数修饰父类实例。这个差别使得 ES6 可以继承内置对象。

因为`this`生成顺序不同，所以需要在`constructor`中，需要使用`super()`才能调用父类

[JavaScript深入之创建对象的多种方式以及优缺点](https://github.com/mqyqingfeng/Blog/issues/15)

[JavaScript深入之继承的多种方式和优缺点](https://github.com/mqyqingfeng/Blog/issues/16)

[重新认识构造函数、原型和原型链](https://juejin.im/post/5c6a9c10f265da2db87b98f3)

[JavaScript常用八种继承方案](https://github.com/yygmind/blog/issues/7)

### 闭包

> ECMAScript中，闭包指的是：
>
> 1. 从理论角度：所有的函数。因为它们都在创建的时候就将上层上下文的数据保存起来了。哪怕是简单的全局变量也是如此，因为函数中访问全局变量就相当于是在访问自由变量，这个时候使用最外层的作用域
> 2. 从实践角度：以下函数才算是闭包：
>    1. 即使创建它的上下文已经销毁，它仍然存在（比如，内部函数从父函数中返回）
>    2. 在代码中引用了自由变量(自由变量：如果在某个作用域中使用了变量“a”，而变量“a”并未在该作用域中声明（在其它作用域中声明了），则该变量“a”即为自由变量。)

[JavaScript深入之闭包](https://github.com/mqyqingfeng/Blog/issues/9)

### 正则 

**驼峰与下划线相互转换**

### 防抖/节流 

[JavaScript专题之跟着underscore学防抖](https://github.com/mqyqingfeng/Blog/issues/22)

```js
function debounce(func, wait, immediate) {

    var timeout, result;

    var debounced = function () {
        var context = this;
        var args = arguments;

        if (timeout) clearTimeout(timeout);
        if (immediate) {
            // 如果已经执行过，不再执行
            var callNow = !timeout;
            timeout = setTimeout(function(){
                timeout = null;
            }, wait)
            if (callNow) result = func.apply(context, args)
        }
        else {
            timeout = setTimeout(function(){
                func.apply(context, args)
            }, wait);
        }
        return result;
    };

    debounced.cancel = function() {
        clearTimeout(timeout);
        timeout = null;
    };

    return debounced;
}
```

[JavaScript专题之跟着 underscore 学节流](https://github.com/mqyqingfeng/Blog/issues/26)

```js
function throttle(func, wait, options) {
    var timeout, context, args, result;
    var previous = 0;
    if (!options) options = {};

    var later = function() {
        previous = options.leading === false ? 0 : new Date().getTime();
        timeout = null;
        func.apply(context, args);
        if (!timeout) context = args = null;
    };

    var throttled = function() {
        var now = new Date().getTime();
        if (!previous && options.leading === false) previous = now;
        var remaining = wait - (now - previous);
        context = this;
        args = arguments;
        if (remaining <= 0 || remaining > wait) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            previous = now;
            func.apply(context, args);
            if (!timeout) context = args = null;
        } else if (!timeout && options.trailing !== false) {
            timeout = setTimeout(later, remaining);
        }
    };

    throttled.cancel = function() {
        clearTimeout(timeout);
        previous = 0;
        timeout = null;
    };

    return throttled;
}
```

### 深克隆

**正则**

通过[正则的扩展](http://es6.ruanyifeng.com/#docs/regex#flags-属性)了解到`flags`属性等等,因此我们需要实现一个提取flags的函数.

在 `JS` 中，目前共有 `6` 个修饰符：`g`、`i`、`m`、`s`、`u`、`y`。正则对象转化为字符串时，其修饰符排序是按字母排序的

```js
// 提取
const getRegExp = re => {
  var flags = '';
  if (re.global) flags += 'g';
  if (re.ignoreCase) flags += 'i';
  if (re.multiline) flags += 'm';
  return flags;
};
// 或者用
foo = new RegExp("bar", "imgyus");
foo.toString()       // 显示 "/bar/g"
foo.flags            // gimsuy

// 实现
// ...
else if (isType(parent, 'RegExp')) {
  // 对正则对象做特殊处理
  child = new RegExp(parent.source, getRegExp(parent));
  // 需要克隆其lastIndex
  if (parent.lastIndex) child.lastIndex = parent.lastIndex;
}
// ...
```

**Date**

```js
child = new Date(parent.getTime());
```

**数组**

```js
child = new Array(parent.length)
// 之后则遍历赋值

for (let i in parent) {
  // 递归
  child[i] = _clone(parent[i]);
}
```

**对象 & 函数**

```js
// 木易杨
// 主线代码
const isArr = Array.isArray(value)
const tag = getTag(value)
if (isArr) {
    ... // 数组情况，详见上面解析
} else {
    // 函数
    const isFunc = typeof value == 'function'

    // 如果是 Buffer 对象，拷贝并返回
    if (isBuffer(value)) {
        return cloneBuffer(value, isDeep)
    }
    
    // Object 对象、类数组、或者是函数但没有父对象
    if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
        // 拷贝原型链或者 value 是函数时，返回 {}，不然初始化对象
        result = (isFlat || isFunc) ? {} : initCloneObject(value)
        if (!isDeep) {
            return isFlat
                ? copySymbolsIn(value, copyObject(value, keysIn(value), result))
            	: copySymbols(value, Object.assign(result, value))
        }
    } else {
        // 在 cloneableTags 中，只有 error 和 weakmap 返回 false
        // 函数或者 error 或者 weakmap 时，
        if (isFunc || !cloneableTags[tag]) {
            // 存在父对象返回value，不然返回空对象 {}
            return object ? value : {}
        }
        // 初始化非常规类型
        result = initCloneByTag(value, tag, isDeep)
    }
}
```

通过上面代码可以发现，函数、`error` 和 `weakmap` 时返回空对象 {}，并不会真正拷贝函数。

`value` 类型是 `Object` 对象和类数组时，调用 `initCloneObject` 初始化对象，最终调用 `Object.create` 生成新对象。

```js
// 木易杨
function initCloneObject(object) {
    // 构造函数并且自己不在自己的原型链上
    return (typeof object.constructor == 'function' && !isPrototype(object))
        ? Object.create(Object.getPrototypeOf(object))
    	: {}
}

// 本质上实现了一个instanceof，用来测试自己是否在自己的原型链上
function isPrototype(value) {
    const Ctor = value && value.constructor
    // 寻找对应原型
    const proto = (typeof Ctor == 'function' && Ctor.prototype) || Object.prototype
    return value === proto
}
```

对于非常规类型对象（arrayBufferTag、Boolea...），通过各自类型分别进行初始化。

**循环引用**

构造了一个栈用来解决循环引用的问题。

```js
// 木易杨
// 主线代码
stack || (stack = new Stack)
const stacked = stack.get(value)
// 已存在
if (stacked) {
    return stacked
}
stack.set(value, result)

// 构造两个栈处理循环引用
const parents = [];
const children = [];
// 处理循环引用
const index = parents.indexOf(parent);

if (index != -1) {
  // 如果父数组存在本对象,说明之前已经被引用过,直接返回此对象
  return children[index];
}
parents.push(parent);
children.push(child);
```

如果当前需要拷贝的值已存在于栈中，说明有环，直接返回即可。栈中没有该值时保存到栈中，传入 `value` 和 `result`。这里的 `result` 是一个对象引用，后续对 `result` 的修改也会反应到栈中。

**不可枚举属性**

```js
function objectClone(targetObj,sourceObj){
  var names=Object.getOwnPropertyNames(sourceObj);
  for(var i=0;i<names.length;i++){
    var desc=Object.getOwnPropertyDescriptor(sourceObj,names[i]);
    if(typeof(desc.value)==="object" && desc.value!==null){
      var obj={};
      Object.defineProperty(targetObj,names[i],{
        configurable:desc.configurable,
        enumerable:desc.enumerable,
        writable:desc.writable,
        value:obj
      });
      objectClone(obj,desc.value);
    }else{
      Object.defineProperty(targetObj,names[i],desc)
    }
  }
  return targetObj;
}
```

利用`Object.getOwnPropertyNames`和`Object.defineProperty`遍历获取

[面试官:请你实现一个深克隆](https://juejin.im/post/5abb55ee6fb9a028e33b7e0a)

[Lodash是如何实现深拷贝的](https://github.com/yygmind/blog/issues/31)

[深拷贝的终极探索（90%的人都不知道）](https://juejin.im/post/5bc1ae9be51d450e8b140b0c#heading-2)

## ES6

[ES6 系列之 WeakMap](https://github.com/mqyqingfeng/Blog/issues/92)

### Promise & Generators & Async/Await

**中断或取消Promise链 & Async/Await 链**

```js
Promise.resolve()
    .then(() => {
        console.log('[onFulfilled_1]');
        throw 'throw on onFulfilled_1';
    })
    .then(() => {  // 中间的函数不会被调用
        console.log('[onFulfilled_2]');
    })
    .catch(err => {
        console.log('[catch]', err);
    });
// => [onFulfilled_1]
// => [catch] throw on onFulfilled_1
```

promise 的状态改变为 rejected 后，promise 就会跳过后面的 then 方法
然而，若链路中也对错误进行了捕获，则后续的函数可能会继续执行。

```js
Promise.resolve()
    .then(() => {
        console.log('[onFulfilled_1]');
        throw 'throw on onFulfilled_1';
    })
    .then(() => {
        console.log('[onFulfilled_2]');
    }, err => {     // 捕获错误
        console.log('[onRejected_2]', err);
    })
    .then(() => {   // 该函数将被调用
        console.log('[onFulfilled_3]');
    })
    .catch(err => {
        console.log('[catch]', err);
    });
// => [onFulfilled_1]
// => [onRejected_2] throw on onFulfilled_1
// => [onFulfilled_3]
```

Promise的then方法接收两个参数：
Promise.prototype.then(onFulfilled, onRejected)，若onFulfilled或onRejected是一个函数，当函数返回一个新Promise对象时，原Promise对象的状态将跟新对象保持一致

```js
Promise.resolve()
    .then(() => {
        console.log('[onFulfilled_1]');
        return new Promise(()=>{}); // 返回“pending”状态的Promise对象
    })
    .then(() => {                   // 后续的函数不会被调用
        console.log('[onFulfilled_2]');
    })
    .catch(err => {
        console.log('[catch]', err);
    });
// => [onFulfilled_1]
```

如果对象是Promise对象相互竞争，则可以使用[Promise.race](https://es6.ruanyifeng.com/#docs/promise#Promise-race)进行操作：
比如：
![4a70ce820eb0739da3851e0b6fd76bb3](/Users/zhaopengcheng/Downloads/MARKDOWN/面试问题记录.resources/4404E094-DE8C-4F4C-9380-A865A291065E.png)

[中断或取消Promise链的可行方案](https://blog.csdn.net/ambit_tsai/article/details/80635594)

### 宏任务&微任务

[微任务、宏任务与Event-Loop](https://segmentfault.com/a/1190000016022069)

---

[ES6 入门教程](https://es6.ruanyifeng.com/)

###模块化

[前端模块化：CommonJS,AMD,CMD,ES6](https://juejin.im/post/5aaa37c8f265da23945f365c)

[ES6 系列之模块加载方案](https://github.com/mqyqingfeng/Blog/issues/108)

## 【ES7/8/9/10/11新特性】

### ES7(2016)

* Array.prototype.includes()
* ** 运算

### ES8(2017)

* Async/Await
* Atomics？？？
* Object.values && Object.entries
  * Object.values() 方法返回一个给定对象自己的所有可枚举属性值的数组，值的顺序与使用for...in循环的顺序相同 ( 区别在于for-in循环枚举原型链中的属性 )
  * Object.entries 方法返回一个给定对象自身可遍历属性 [key, value] 的数组， 排序规则和 Object.values 一样。
* String padding 这几个函数的主要目的就是填补字符串的首部和尾部，为了使得到的结果字符串的长度能达到给定的长度
* Object.getOwnPropertyDescriptors 见如下

#### 【ES8】 了解ES8吗？说说getOwnPropertyDescriptors函数，对象自身属性描述符有哪些

getOwnPropertyDescriptors 方法返回指定对象所有自身属性的描述对象。属性描述对象是直接在对象上定义的，而不是继承于对象的原型。ES2017加入这个函数的主要动机在于方便将一个对象深度拷贝给另一个对象，同时可以将getter/setter拷贝。

**writable**

当且仅当属性的值可以被改变时为true。(仅针对数据属性描述有效)

**get**

获取该属性的访问器函数（getter）。如果没有访问器， 该值为undefined。(仅针对包含访问器或设置器的属性描述有效)

**set**

获取该属性的设置器函数（setter）。 如果没有设置器， 该值为undefined。(仅针对包含访问器或设置器的属性描述有效)

**configurable**

当且仅当指定对象的属性描述可以被改变或者属性可被删除时，为true。

**enumerable**

当且仅当指定对象的属性可以被枚举出时，为 `true`。

**`Object.defineProperty()`** 方法会直接在一个对象上定义一个新属性，或者修改一个对象的现有属性， 并返回这个对象。

### ES9(ES2018)

* 异步迭代
* Promise.finally()
* Rest/Spread 属性
* 正则相关

### ES10(ES2019)

- 行分隔符（U + 2028）和段分隔符（U + 2029）符号现在允许在字符串文字中，与JSON匹配
- 更加友好的 JSON.stringify
- 新增了Array的`flat()`方法和`flatMap()`方法
- 新增了String的`trimStart()`方法和`trimEnd()`方法
- Object.fromEntries()
- Symbol.prototype.description
- String.prototype.matchAll
- `Function.prototype.toString()`现在返回精确字符，包括空格和注释
- 简化`try {} catch {}`,修改 `catch` 绑定
  - 在 ES10 之前，我们必须通过语法为 catch 子句绑定异常变量，无论是否有必要。很多时候 catch 块是多余的。 ES10 提案使我们能够简单的把变量省略掉。
- globalThis
- Legacy RegEx
- 私有的实例方法和访问器

### ES11(ES2020)

* 可选链操作符 `let nestedProp = obj?.first?.second;`
* 空位合并操作符 `let c = a ?? b;` 
* Promise.allSettled
* Dynamic `import()`
* BigInt

[细解JavaScript ES7 ES8 ES9 新特性](https://segmentfault.com/a/1190000017174508)

[ES6、ES7、ES8、ES9、ES10新特性一览](https://juejin.im/post/5ca2e1935188254416288eb2#heading-54)

[What's new in ECMAScript 2020 (ES2020)](https://juejin.im/post/5e1bcaa1f265da3e140fa3ee)

## 设计模式

[【JavaScript】常用设计模式及编程技巧（ES6描述）](https://juejin.im/post/5bf6c7076fb9a049b2218532#heading-17)