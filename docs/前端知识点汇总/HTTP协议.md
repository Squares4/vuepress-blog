# HTTP协议

## 缓存控制

### 缓存控制流程

1. 浏览器发起请求时，先会查询Cache-Control（Expires设置绝对过期时间，Cache-Control设置相对过期时间，以后者为主）判断过期，如果未过期，则直接读取浏览器缓存文件，不发送HTTP请求
2. 判断上次文件返回头中是否含有Etag信息，有则带上If-None-Match字段信息发送请求给服务器，服务器判断Etag未修改则返回304，如果修改则返回200，否则进入下一步
3. 在浏览器端判断上次文件返回头是否含有Last-Modified信息，有则带上If-Modified-Since字段发送请求，服务端判断Last-Modified失效则返回200，有效则返回304
4. Etag和Last-Modified都不存在则直接向服务器请求

### 304缓存，有了Last-Modified，为什么还要用ETag？有了Etag，为什么还要用Last-Modified？Etag一般怎么生成？

有了Last-Modified，为什么还要用ETag？
（1）因为如果在一秒钟之内对一个文件进行两次更改，Last-Modified就会不正确。
（2）某些服务器不能精确的得到文件的最后修改时间。
（3）一些文件也许会周期性的更改，但是他的内容并不改变(仅仅改变的修改时间)，这个时候我们并不希望客户端认为这个文件被修改了，而重新GET。
有了Etag，为什么还要用Last-Modified？
因为有些时候 ETag 可以弥补 Last-Modified 判断的缺陷，但是也有时候 Last-Modified 可以弥补 ETag 判断的缺陷，比如一些图片等静态文件的修改，如果每次扫描内容生成 ETag 来比较，显然要比直接比较修改时间慢很多。所有说这两种判断是相辅相成的。

ETag的值是服务端对文件的索引节，大小和最后修改时间进行Hash后得到的。

## 状态码

HTTP 响应状态代码指示特定 [HTTP](https://developer.mozilla.org/zh-cn/HTTP) 请求是否已成功完成。响应分为五类：信息响应(`100`–`199`)，成功响应(`200`–`299`)，重定向(`300`–`399`)，客户端错误(`400`–`499`)和服务器错误 (`500`–`599`)。状态代码由 [section 10 of RFC 2616](https://tools.ietf.org/html/rfc2616#section-10)定义

[MDN:HTTP 响应代码](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status)

##  HTTP 2 

1. 采用完全二进制的格式传输数据，而非HTTP 1.x 的默认文本格式 流式传输
2. 采用HPACK压缩传输，用于对HTTP头部做压缩
3. TCP多路复用 HTTP 1.1 也可以通过PipeLine实现，但是是串行传输，多个请求可能被阻塞
4. 支持传输流的优先级和流量控制机制
5. 支持服务端推送

## HTTP/3