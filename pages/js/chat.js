let listVue=new Vue({
	el:'#chatList',
	data:{
		chatList:[
		// {
		// 	name:'name2',
		// 	message:'能和心爱的人一起睡觉，是件幸福的事情；可是，打呼噜怎么办？',
		// 	mesnumber:2
		//  
		// }
		]
	},
	methods:{
		getDate:function(){
			return 30;
		},
		openChat(index){
			let item=this.chatList[index];
			mui.openWindow({
					url: '../chat.html',
					id: 'chatWindow-'+item.name,
					preload: true,
					show: {
						aniShow: 'pop-in'
					},
					styles: {
						popGesture: 'hide'
					},
					waiting: {
						autoShow: false
					},
					extras:{
						facer:item.id,
						facer_name:item.name
					}
				});
			
		},
		pushChat:function(item){
			this.chatList.push(item);
		},
		initChat:function(list){
			this.chatList=[];
			this.chatList=list;
		},
		claerChat:function(){
			this.chatList=[];
		},
		incMessageN(mes){
			this.chatList.forEach((item, index)=>{
				if(item.name==mes.sender){
					item.mesnumber++;
				}
			})
		}
	}
});


window.addEventListener('initchatlist',function(event){
				console.log('触发加载好友');
				// let tempList=[];
				listVue.claerChat();
			 	for (let conor of event.detail) {
					console.log(conor.id);
					let item={};
					item.id=conor.id;
					console.log(item.id);
					item.name=conor.user_name;
					item.type=conor.type;;
					item.message='我需要更多时间';
					item.mesnumber=0;
					listVue.pushChat(item);
					// tempList.push(item);	
				}
				
 });

  window.addEventListener('receive',function(event){
		listVue.incMessageN(event.detail);
 });
 