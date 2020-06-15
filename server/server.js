//nodejs 服务器
const express = require('express')
const Vue = require('vue')
const fs = require('fs')

//创建express实例和vue实例
const app = express();
//创建渲染器
const { createBundleRenderer } = require('vue-server-renderer')
const serverBundle = require('../dist/server/vue-ssr-server-bundle.json')
//客户端清单
const clientManifest = require('../dist/client/vue-ssr-client-manifest.json')

const renderer = createBundleRenderer(serverBundle,{
	runInNewContext:false,
	//下面是必备选项
	//这里文件地址最好写绝对地址 
	template:fs.readFileSync('../public/index.temp.html','utf-8'),//引入模板文件 
	clientManifest
}) 

//中间件处理静态文件请求
//设置client目录为静态目录
//index:false 关闭默认在dist目录下找index.html ,如果不关闭就会访问到spa页面
app.use(express.static('../dist/client',{index:false}))

//*将所有的路由交给vue  renderer
app.get('*', async (req,res)  => {
	try{
		//创建上下文context
		const context = {
			url:req.url,//用户请求地址
			title:'ssr test' 
		}
		//渲染上下文renderToString
		const html = await renderer.renderToString(context);
		console.log(html)
		res.send(html)
	}catch(err){
		//TODO handle the exception
		res.status(500).send('服务器内部错误')
		console.log(err) 
	} 
})


app.listen(3000,()=>{
	console.log('服务器启动成功')
})


















