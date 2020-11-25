var mqtt=require("mqtt");

const MQTT_SERVER="localhost";
const MQTT_PORT="1883";

const MQTT_USER="mymqtt";
const MQTT_PASSWORD="myraspi";

var client=mqtt.connect({
	host: MQTT_SERVER,
	port: MQTT_PORT,
	username: MQTT_USER,
	password: MQTT_PASSWORD
});

client.on('connect',()=>{
	console.log("MQTT Connect");
	client.subscribe('test',(err)=>{
		if(err)console.log(err);
	});
});

client.on('message',(topic,message)=>{
	console.log(topic.toString()+" : "+message.toString());
});

setInterval(()=>{
	client.publish("test","hello from NodeJS");
},5000);
