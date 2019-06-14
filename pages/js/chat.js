let listVue=new Vue({
	el:'#chatList',
	data:{
		chatList:[{
			name:'name1',
			message:'能和心爱的人一起睡觉，是件幸福的事情；可是，打呼噜怎么办？',
			mesnumber:0
		},
		{
			name:'name2',
			message:'能和心爱的人一起睡觉，是件幸福的事情；可是，打呼噜怎么办？',
			mesnumber:2
		},
		{
			name:'name3',
			message:'能和心爱的人一起睡觉，是件幸福的事情；可是，打呼噜怎么办？',
			mesnumber:100
		}]
	},
	methods:{
		getDate:function(){
			return 30;
		},
		openChat(){
			
			mui.openWindow({
					url: '../chat.html',
					id: 'chatWindow',
					preload: true,
					show: {
						aniShow: 'pop-in'
					},
					styles: {
						popGesture: 'hide'
					},
					waiting: {
						autoShow: false
					}
				});
			
		}
	}
});
