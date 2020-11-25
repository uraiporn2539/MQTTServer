# MQTT Server with Node.js
## MQTT Server
### MQTT คืออะไร
MQTT หรือ (Message Queueing Telementry Transport protocol) คือ โปรโตคอลที่ใช้สำหรับสื่อสารกันระหว่าง m2m หรือ machine to machine ซึ่งถูกออกแบบมาเพื่อรับส่งข้อมูลกันโดยจะมีตัวกลางในการรับส่งข้อมูลคือ **MQTT Broker** 
โดยภายในโปรโตคอลจะมีผู้ส่งคือ publisher และผู้รับคือ subscriber ในการทำงานนั้นผู้ส่งจะทำการส่งข้อความไปยัง topic ใด ๆ โดยผู้รับที่ติดตาม (subscribe) topic นั้น ๆ อยู่จะได้รับข้อความที่ผู้ส่งทำการส่งมา ซึ่งโปรโตคอลนี้มีขนาดเล็กและใช้ bandwidth ต่ำกว่าพวก http จึงทำให้ MQTT ถูกนำไปประยุกต์ใช้กับอุปกรณ์ IOT มากกว่า http

### Mosquitto MQTT Broker
Mosquitto คือ ​MQTT Broker อันดับต้น ๆ ที่ถูกใช้งานโดยใน repo นี้จะทำการติดตั้ง Mosquitto บน RaspberryPI3 ด้วยคำสั่ง

```
    sudo apt-get install mosquitto mosquitto-clients
```

เมื่อทำการติดตั้งเรียบร้อยแล้วสามารถทำการทดสอบได้โดยเปิด terminal ขึ้นมาจำนวน 2 terminal โดย terminal แรกจะทำหน้าที่เป็น subscriber โดยในที่นี้จะทำการ subscribe ไปยัง topic ที่มีชื่อว่า test ด้วยคำสั่ง
```
    mosquitto_sub -h localhost -t test
```

และใน terminal ที่สองจะทำหน้าที่เป็น publisher โดยในที่นี้จะทำการส่งข้อความว่า hello world ไปยัง topic test ด้วยคำสั่ง
```
    mosquitto_pub -h localhost -t test -m "hello world"
```
เมื่อเรียบร้อยแล้ว terminal แรกจะปรากฎข้อความ hello world ขึ้นมา ดังรูป

![result.png](https://github.com/uraiporn2539/MQTTServer/blob/main/img/result.png)

#### การกำหนด username และ password ในการเข้าใช้ MQTT
1. ทำการแก้ไขไฟล์ /etc/mosquitto/mosquitto.conf ให้เป็นดังนี้

![mosquitto.conf.png](https://github.com/uraiporn2539/MQTTServer/blob/main/img/mosquitto.conf.png)

2. เพิ่ม username ไปยัง /etc/mosquitto/pwfile ที่กำหนดไว้ในขั้นตอนที่ 1 โดยใช้คำสั่ง
```
    sudo mosquitto_passwd -c /etc/mosquitto/pwfile username

    Password: password
    Reenter password: password
```
3. ทำการ reboot RaspberryPI3 ด้วยคำสั่ง
```
    sudo reboot
```
4. ทดสอบการทำงานโดยเปิด terminal ขึ้นมาจำนวน 2 terminal 
    1. terminal ที่ทำหน้าที่เป็น subsciber จะ subscibe ไปยังยัง topic ที่มีชื่อว่า test โดยใช้คำสั่ง
    ```
        mosquitto_sub -h localhost -u username -P password -t test
    ``` 
    2. terminal ที่ทำหน้าที่เป็น publisher จะทำ publish ไปยัง topic ที่มีชื่อว่า test โดยใช้คำสั่ง
    ```
        mosquitto_pub -h localhost -u username -P password -t test -m "hello world"
    ```
    เมื่อเรียบร้อยแล้วใน terminal แรกจะปรากฎข้อความ  hello world
## MQTT.js
คือ library สำหรับ MQTT Protocol ที่ถูกเขียนในภาษา JavaScript สำหรับ Node.js สามารถทำการติดตั้งได้โดยเปลี่ยน directory ที่ทำงานไปยังตำแหน่งที่ต้องการและใช้คำสั่ง
``` 
    npm install mqtt --save
```
จากนั้นทำการเชื่อมต่อเข้าไปยัง MQTT Broker โดยในที่นี้จำทำหน้าที่เป็นทั้ง subscriber และ publisher  

- subscribe ไปยัง topic test 
- publish ข้อความ hello from NodeJS ไปยัง topic test 

ซึ่งสามารถทำได้โดยเพิ่มคำสั่งดังต่อไปนี้ไปยังไฟล์ .js ที่ต้องการ (ในที่นี้จะใช้ myMqtt.js)
```js
    var mqtt=require('mqtt');
    
    const MQTT_SERVER="localhost";
    const MQTT_PORT="1883";
    //if your server don't have username and password leave it blank
    const MQTT_USER="username";
    const MQTT_PASSWORD="password";

    var client=mqtt.connect({
        host: MQTT_SERVER,
        port: MQTT_PORT,
        username: MQTT_USER,
        password: MQTT_PASSWORD
    });

    client.on('connect',()=>{
        console.log("MQTT Connected");
        client.subscribe('test',(err){ //subscribe to 'test' topic
            if(err)console.log(err);
        });
    });

    client.on('message',(topic,message)=>{
        console.log(topic.toString()+" : "+message.toString());
    });

    setInterval(()=>{
        client.publish('test','hello from NodeJS'); //publish "hello from NodeJS" to "test" topic every 5 second
    },5000);
```
ทดสอบการทำงานโดยการใช้คำสั่ง 
```
    node myMqtt
```
จะปรากฎผลลัพธ์ดังรูป

![myMqtt.png](https://github.com/uraiporn2539/MQTTServer/blob/main/img/myMqtt.png)

และหากมี subscriber ทำการ subscribe มายัง topic ที่มีชื่อว่า test แล้ว subscriber นั้นจะได้รับข้อความเหมือนดังรูปข้างต้น

ในทางตรงกันข้ามหากมี publisher ทำการเชื่อมต่อมายัง topic test และทำการ publish ข้อความขึ้นมาแล้ว ข้อความดังกล่าวจะปรากฎในหน้า console เช่นเดียวกัน อันแสดงได้ดังรูป

![myMqtt_1.png](https://github.com/uraiporn2539/MQTTServer/blob/main/img/myMqtt_1.png)
