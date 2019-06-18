const imageViewer = new mui.ImageViewer('.msg-content-image', {
			dbl: false
		});
		
let main= null;
let ui=null;
let msgList=new Vue({
	el:'#msg-list',
	data:{
		record:[
			{
					sender: 'zs',
					type: 'sound',
					content: 'http://192.168.3.12:8123/res/image/test.mp3'
				},
			{
					sender: 'zs',
					type: 'text',
					content: '没有保存本地记录'
				},
				{
					sender: 'zs',
					type: 'image',
					content: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1560447157668&di=aa9257054280012c14bd302f888860a0&imgtype=0&src=http%3A%2F%2Ff.hiphotos.baidu.com%2Fzhidao%2Fpic%2Fitem%2Fd788d43f8794a4c240e9466f0ef41bd5ac6e39af.jpg'
				},
				{
					sender: 'self',
					type: 'text',
					content: '没有保存本地记录'
				}]
	},
	methods:{
		getRecord:function(){
			return this.record;
		},
		tapItem:function(index,event){
			if (this.record[index].type == 'sound') {
				if(this.record[index].state == '正在播放...'){
					return;
				}
				let player = plus.audio.createPlayer(this.record[index].content);
				// let playState = msgItem.querySelector('.play-state');
				this.record[index].state = '正在播放...';
				mui.toast('播放');
				let _this=this;
				player.play(function() {
					_this.record[index].state = '点击播放';
				}, function(e) {
					_this.record[index].state = '点击播放';
				});
			}
		}
	},
	updated() {
		imageViewer.findAllImage();
		if(ui){
			ui.areaMsgList.scrollTop = ui.areaMsgList.scrollHeight + ui.areaMsgList.offsetHeight+1000;
		}
	}
});
// msgList.getRecord()[0].content="改变之后的content";

(function($,doc){
	var MIN_SOUND_TIME = 800;
	$.init({
		gestureConfig: {
			tap: true, //默认为true
			doubletap: true, //默认为false
			longtap: true, //默认为false
			swipe: true, //默认为true
			drag: true, //默认为true
			hold: true, //默认为false，不监听
			release: true //默认为false，不监听
		}
	});
	
	if(mui.os.ios){
		// 解决在ios上fixed元素focusin时位置出现错误的问题 
		document.addEventListener('DOMContentLoaded',function(){
			var footerDom = document.querySelector('footer');
			
			document.addEventListener('focusin', function() {
				footerDom.style.position = 'absolute';
			});
			document.addEventListener('focusout', function() {
				footerDom.style.position = 'fixed';
			});
		});
	}
	
	$.plusReady(function(){
		/* 
		自适应窗口大小 
		 */
		doc.querySelector('#title').innerText='chat with '+plus.webview.currentWebview().facer_name;
		plus.webview.currentWebview().setStyle({
			softinputMode: "adjustResize"
		});
		
		main=plus.webview.getWebviewById('index');
		/* 
		ui控件获取
		 */
		ui = {
			body: doc.querySelector('body'),
			footer: doc.querySelector('footer'),
			footerRight: doc.querySelector('.footer-right'),
			footerLeft: doc.querySelector('.footer-left'),
			btnMsgType: doc.querySelector('#msg-type'),
			boxMsgText: doc.querySelector('#msg-text'),
			boxMsgSound: doc.querySelector('#msg-sound'),
			btnMsgImage: doc.querySelector('#msg-image'),
			areaMsgList: doc.querySelector('#msg-list'),
			boxSoundAlert: doc.querySelector('#sound-alert'),
			h: doc.querySelector('#h'),
			content: doc.querySelector('.mui-content')
		};
		ui.h.style.width = ui.boxMsgText.offsetWidth + 'px';
		/* 
		 动态显示设置
		 */
		let footerPadding = ui.footer.offsetHeight - ui.boxMsgText.offsetHeight;
		//滑到最底
		window.addEventListener('resize', function() {
			ui.areaMsgList.scrollTop = ui.areaMsgList.scrollHeight + ui.areaMsgList.offsetHeight;
		}, false);
		function msgTextFocus() {
				ui.boxMsgText.focus();
				setTimeout(function() {
					ui.boxMsgText.focus();
				}, 150);
			}
			//解决长按“发送”按钮，导致键盘关闭的问题；
		ui.footerRight.addEventListener('touchstart', function(event) {
			if (ui.btnMsgType.classList.contains('mui-icon-paperplane')) {
				msgTextFocus();
				event.preventDefault();
			}
		});
		//解决长按“发送”按钮，导致键盘关闭的问题；
		ui.footerRight.addEventListener('touchmove', function(event) {
			if (ui.btnMsgType.classList.contains('mui-icon-paperplane')) {
				msgTextFocus();
				event.preventDefault();
			}
		});
		ui.boxMsgText.addEventListener('input', function(event) {
			ui.btnMsgType.classList[ui.boxMsgText.value == '' ? 'remove' : 'add']('mui-icon-paperplane');
			ui.btnMsgType.setAttribute("for", ui.boxMsgText.value == '' ? '' : 'msg-text');
			ui.h.innerText = ui.boxMsgText.value.replace(new RegExp('\n', 'gm'), '\n-') || '-';
			ui.footer.style.height = (ui.h.offsetHeight + footerPadding) + 'px';
			ui.content.style.paddingBottom = ui.footer.style.height;
		});
		
		var setSoundAlertVisable=function(show){
			if(show){
				ui.boxSoundAlert.style.display = 'block';
				ui.boxSoundAlert.style.opacity = 1;
			}else{
				ui.boxSoundAlert.style.opacity = 0;
				//fadeOut 完成再真正隐藏
				setTimeout(function(){
					ui.boxSoundAlert.style.display = 'none';
				},200);
			}
		};
		/* 
		数据变动设置
		
		 */
		imageViewer.findAllImage();
		function pushMes(item){
			// mui.toast("push");
			if(!item) return ;
			item.state='点击播放';
			msgList.getRecord().push(item);
			// imageViewer.findAllImage();
			// ui.areaMsgList.scrollTop = ui.areaMsgList.scrollHeight + ui.areaMsgList.offsetHeight+100;
		}
		
		/* 
		发送信息
		
		
		
		 */
		function send(msg) {
			pushMes(msg);
			msg.receiver=plus.webview.currentWebview().facer_name;
			
			mui.fire(main,'send',msg);
			
			/* record.push(msg);
			bindMsgList();
			toRobot(msg.content); */
		};
		
		
		/* 
		处理动作
		 
		 */
		ui.footerLeft.addEventListener('tap', function(event) {
			var btnArray = [{
				title: "拍照"
			}, {
				title: "从相册选择"
			}];
			plus.nativeUI.actionSheet({
				title: "选择照片",
				cancel: "取消",
				buttons: btnArray
			}, function(e) {
				var index = e.index;
				switch (index) {
					case 0:
						break;
					case 1:
						var cmr = plus.camera.getCamera();
						cmr.captureImage(function(path) {
							send({
								sender: 'self',
								type: 'image',
								content: "file://" + plus.io.convertLocalFileSystemURL(path)
							});
						}, function(err) {});
						break;
					case 2:
						plus.gallery.pick(function(path) {
							
							send({
								sender: 'self',
								type: 'image',
								content: path
							});
						}, function(err) {}, null);
						break;
				}
			});
		}, false); 
		
		ui.footerRight.addEventListener('release', function(event) {
			if (ui.btnMsgType.classList.contains('mui-icon-paperplane')) {
				//showKeyboard();
				ui.boxMsgText.focus();
				setTimeout(function() {
					ui.boxMsgText.focus();
				}, 150);
				
				send({
					sender: 'self',
					type: 'text',
					content: ui.boxMsgText.value//.replace(new RegExp('\n', 'gm'), '<br/>')
				});
				ui.boxMsgText.value = '';
				$.trigger(ui.boxMsgText, 'input', null);
			} else if (ui.btnMsgType.classList.contains('mui-icon-mic')) {
				ui.btnMsgType.classList.add('mui-icon-compose');
				ui.btnMsgType.classList.remove('mui-icon-mic');
				ui.boxMsgText.style.display = 'none';
				ui.boxMsgSound.style.display = 'block';
				ui.boxMsgText.blur();
				document.body.focus();
			} else if (ui.btnMsgType.classList.contains('mui-icon-compose')) {
				ui.btnMsgType.classList.add('mui-icon-mic');
				ui.btnMsgType.classList.remove('mui-icon-compose');
				ui.boxMsgSound.style.display = 'none';
				ui.boxMsgText.style.display = 'block';
				ui.boxMsgText.focus();
				setTimeout(function() {
					ui.boxMsgText.focus();
				}, 150);
			}
		}, false);
		
		/* 
		消息录音 
		 
		 */
		let recordCancel = false;
		let recorder = null;
		let audio_tips = document.getElementById("audio_tips");
		let startTimestamp = null;
		let stopTimestamp = null;
		let stopTimer = null;
		
		
		ui.boxMsgSound.addEventListener('hold', function(event) {
			recordCancel = false;
			if(stopTimer)clearTimeout(stopTimer);
			audio_tips.innerHTML = "手指上划，取消发送";
			ui.boxSoundAlert.classList.remove('rprogress-sigh');
			setSoundAlertVisable(true);
			recorder = plus.audio.getRecorder();
			if (recorder == null) {
				plus.nativeUI.toast("不能获取录音对象");
				return;
			}
			startTimestamp = (new Date()).getTime();
			recorder.record({
				filename: "_doc/audio/"
			}, function(path) {
				if (recordCancel) return;
				send({
					sender: 'self',
					type: 'sound',
					content: path
				});
			}, function(e) {
				plus.nativeUI.toast("录音时出现异常: " + e.message);
			});
		}, false);
		ui.body.addEventListener('drag', function(event) {
			//console.log('drag');
			if (Math.abs(event.detail.deltaY) > 50) {
				if (!recordCancel) {
					recordCancel = true;
					if (!audio_tips.classList.contains("cancel")) {
						audio_tips.classList.add("cancel");
					}
					audio_tips.innerHTML = "松开手指，取消发送";
				}
			} else {
				if (recordCancel) {
					recordCancel = false;
					if (audio_tips.classList.contains("cancel")) {
						audio_tips.classList.remove("cancel");
					}
					audio_tips.innerHTML = "手指上划，取消发送";
				}
			}
		}, false);
		ui.boxMsgSound.addEventListener('release', function(event) {
			//console.log('release');
			if (audio_tips.classList.contains("cancel")) {
				audio_tips.classList.remove("cancel");
				audio_tips.innerHTML = "手指上划，取消发送";
			}
			//
			stopTimestamp = (new Date()).getTime();
			if (stopTimestamp - startTimestamp < MIN_SOUND_TIME) {
				audio_tips.innerHTML = "录音时间太短";
				ui.boxSoundAlert.classList.add('rprogress-sigh');
				recordCancel = true;
				stopTimer=setTimeout(function(){
					setSoundAlertVisable(false);
				},800);
			}else{
				setSoundAlertVisable(false);
			}
			recorder.stop();
		}, false);
		ui.boxMsgSound.addEventListener("touchstart", function(e) {
			//console.log("start....");
			e.preventDefault();
		});
		
		
		
	});
	
})(mui,document);
 window.addEventListener('receive',function(event){
	 console.log('触发事件，添加');
	msgList.getRecord().push(event.detail);
 });


	
