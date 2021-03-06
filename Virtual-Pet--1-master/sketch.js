var dog,HappyDogImg,hungryDog,bedRoomImg,runningImg,gardenImg,washRoomImg,database;;
var foodObj;
var foodS,foodStock;
var fedTime,lastFed,feed,addFood;
var readState;
gameState="Hungry"


function preload()
{
  HappyDogImg=loadImage("virtual pet images/Happy.png")
  hungryDog=loadImage("images/dogImg.png")
  bedRoomImg=loadImage("virtual pet images/Bed Room.png")
  runningImg=loadImage("virtual pet images/running.png")
  gardenImg=loadImage("virtual pet images/Garden.png")
  washRoomImg=loadImage("virtual pet images/Wash Room.png")
  sleepingImg=loadImage("virtual pet images/Lazy.png")
}


function setup() {
  database=firebase.database();
  createCanvas(1000, 400);

  foodObj=new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock)

  dog=createSprite(800,200,150,150)
  dog.addImage(HappyDogImg)
  dog.scale=0.5

  feed=createButton("Feed The Dog")
  feed.position(700,95)
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food")
  addFood.position(800,95)
  addFood.mousePressed(addFoodS);

  readState=database.ref('gameState')
  readState.on("value",function(data){
    gameState=data.val()
  })


}


function draw() {  
  background(46,139,87)
  
  currentTime=hour()
  if(currentTime==(lastFed+1)){
    update("Playing")
    foodObj.garden()
  }else if(currentTime==(lastFed+2)){
    update("Sleeping")
    foodObj.bedroom()
  }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("Bathing")
    foodObj.washroom()
  }else{
    update("Hungry")
    foodObj.display();
  }
  
  fedTime=database.ref('FeedTime')
  fedTime.on("value",function(data){
    lastFed=data.val()
  })

  fill(255,255,254)
  textSize(15)
  if(lastFed>=12){
     text("Last Feed: "+lastFed%12+"PM",350,30)
  }else if(lastFed==0){
     text("Last Feed: 12AM ",350,30)
  }else{
    text("Last Feed:  "+lastFed +"AM",350,30)
  }

  if(gameState!="Hungry"){
    feed.hide();
    addFood.hide();
    dog.remove();
  }
  else {
    feed.show();
    addFood.show();
    dog.addImage(hungryDog);
  }
  function update(state){
    database.ref('/').update({
      gameState: state
    });
  }
    drawSprites();
  } 



function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS)
}

 function feedDog(){
   dog.addImage(HappyDogImg)

   foodObj.updateFoodStock(foodObj.getFoodStock()-1);
   database.ref('/').update({
     Food: foodObj.getFoodStock(),
     FeedTime : hour()
   })
 }

 function addFoodS(){
   foodS++;
   database.ref('/').update({
     Food: foodS
   })
 }

