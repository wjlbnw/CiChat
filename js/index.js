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
/*
 *页面转换响应 
 * */
//mui.ready(function(){
//	mui("#tabBar").off('tap', '.mui-tab-item', function() {
//		mui.toast('tap');
//	});
//	
//});

/*
 
 * 
 * 
 * JQuery操作域
 * */
/*(function(){
	$(function(){
		$('.mui-bar-tab .mui-tab-item').bind('tap',function(e){
			
			$(this).removeClass("mui-active");
			mui.toast('yichu');
		});
	})
})(jQuery);*/
