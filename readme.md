# tiny.compiled

[![Build Status](https://travis-ci.org/xuewuli/tiny.compiled.svg?branch=master)](https://travis-ci.org/xuewuli/tiny.compiled)
[![codebeat badge](https://codebeat.co/badges/3b9ee9b9-5bd1-4152-822d-4a06e5fe1b71)](https://codebeat.co/projects/github-com-xuewuli-tiny-compiled-master)
[![Dependency Status](https://david-dm.org/xuewuli/tiny.compiled/status.svg)](https://david-dm.org/xuewuli/tiny.compiled)

一个可以将`js`文件编译成v8 codecache并保存成`jsc`的工具。

对于复杂项目可以加快启动速度（待验证），删除原`js`仅保留`jsc`可实现混淆的目的。

    不同v8版本的codecache会不兼容，请确保编译和运行的node版本一致。


## 使用方法
  编译时需关闭v8的lazy compile，不然无法得到完整的codecache。

  通过`node`的`--nolazy`参数可禁用lazy compile
  
  运行编译出来的`jsc`需要指定同等的参数，各种`node`的`cli`也有对应的方法将参数传递给`node`
  
  如：
  - mocha --v8-nolazy
  - pm2 --node-args="--nolazy"
### 安装
  ```
    npm i tiny.compiled
  ```
### 编译js

  ```bash
  jsc *.js  # use glob pattern
  ```
  会在同位置生成后缀为`jsc`的二进制缓存文件
  
### 清空js
  ```bash
  js-erase *.js  # use glob pattern
  ```
  ️️`⚠️危险⚠️`操作，务必确认原`js`文件已经`提交`或`备份`


### 代码引用
  
  在应用启动的地方加上以下代码。
  ```javascript
  require('tiny.compiled');
  ```
  之后的`require`在加载新文件时会尝试检查是否有对应的`jsc`文件存在，有则加载`jsc`，无则加载原文件。

  