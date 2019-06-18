const pageList=['./pages/chat.html','./pages/contact.html','./pages/search.html','./pages/userSetting.html'];
const pageIds=['chat','contact','search','setting'];

let pages=[];
let activePage={};
let pageStyle={
	top: '44px',
	bottom: '50px'
};
//mui.init();
//mui.plusReady();

document.addEventListener('plusready', function(){
		/*
		返回键重设
		**/
	    (function($){
	    	$.oldBack = mui.back;
	    	var backButtonPress = 0;
	    	$.back = function(event) {
	    		backButtonPress++;
	    		if (backButtonPress > 1) {
	    			plus.runtime.quit();
	    		} else {
	    			plus.nativeUI.toast('再按一次退出应用');
	    		}
	    		setTimeout(function() {
	    			backButtonPress = 0;
	    		}, 1000);
	    		return false;
	    	};
	    })(mui);
		
	/*
	返回键重设
	**/
	/*
	 初始化四个页面
	 * */
	let self=plus.webview.currentWebview();//获取当前页面窗体

	for (let i=0;i<4;i++) {
		pages[i]=plus.webview.create(pageList[i],pageIds[i],pageStyle);
		self.append(pages[i]);
		pages[i].hide();
	}
	activePage=pages[0];
	plus.webview.show(pages[0],);
	
	/* 建立连接 */
	function serURL(){
				let serverIP=localStorage.getItem('server-ip-config');
				let url=null;
				if(serverIP){
					serverIP=JSON.parse(serverIP);
					url='http://'+serverIP.add+':'+serverIP.port;
				}
				return url;
			}
	const socket=io.connect(serURL());
	
	socket.on('connect',function(){
		let user=JSON.parse(plus.storage.getItem('user_info'));
		// console.log(user.username);
		socket.emit('initChat',user.username);
	});
	socket.on('getConnectors',function(connectors){
		console.log(connectors[0].id);
		mui.toast('拉取好友列表');
		mui.fire(pages[1],'InitList',connectors);
		mui.fire(pages[0],'initchatlist',connectors);
	});
	socket.on('receive',function(message){
		console.log('收到消息，来自'+message.sender);
		let chating=plus.webview.getWebviewById('chatWindow-'+message.sender);
		console.log(JSON.stringify(message));
		if(chating){
			if(message.type=='sound'||message.type=='image'){
				message.content=serURL()+message.content;
				console.log(JSON.stringify(message.content));
			}
			mui.fire(chating,'receive',message);
		}
		mui.fire(pages[0],'receive',message);
	});
	window.addEventListener('send',function(event){
		let message=event.detail;
		let user=JSON.parse(plus.storage.getItem('user_info'));
		message.sender=user.username;
		
		if(message.type=='image'||message.type=='sound'){
			// console.log(111111111);
		    let task = plus.uploader.createUpload( serURL()+"/upload", 
		        { method:"POST",blocksize:204800,priority:100 },
		        function ( t, status ) {
		            // 上传完成
		            console.log(t);
		            if ( status == 200 ) { 
		                mui.toast( "Upload success: " + t.url );
		            } else {
		                mui.toast( "Upload failed: " + status );
		            }
		        }
		    );
		    task.addFile(message.content, {key:"file"} );
			task.addData('message',JSON.stringify(message));
		    task.start();
		}
		else{
			socket.emit('send',message);
		}
			
	});
/*
 * 
 * 
 * JQuery操作域
 * */
	(function(){
		$(function(){
			/*
			 切换页面
			 * **/
			$('.mui-bar-tab .mui-tab-item').bind('tap',function(e){
				let next=pages[$(this).index()];
				if(activePage==next){
					return ;
				}
				plus.webview.hide(activePage);
				activePage=next;
				plus.webview.show(activePage,'fade-in',600);
			});
		})
	})(jQuery);
	/*
	 JQuery作用域
	 * **/
	

},false); 






