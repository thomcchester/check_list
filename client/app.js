var oldInfo;
$(document).ready(function(){
  $('.oldDB').empty();
  pullOld();
  $('.Task-Submit').on("click",taskSubmit);
  $('.clear').on("click",showSureButton);
});

function taskSubmit(event){
  event.preventDefault();
  var tasks={};
  $.each($("#check-form").serializeArray(), function(i, field){
      tasks[field.name] = field.value;
    });
  tasks.Complete=false;
  $.ajax({
    type:"POST",
    url:"/task",
    data: tasks,
    success: function(data){
      pullOld();
    }
  });
}

function pullOld(){

  $.ajax({
    type:"GET",
    url:"/oldTask",
    success: function(data){
      oldInfo=data;
      postingOld(oldInfo);
      $('.changeToCompleted').on("click",changeToCompletedFunction);
      $('.changeToUncompleted').on("click",changeToUncompletedFunction);
      $('.sure').on("click",clearform);
    }
  });
}

function postingOld(data){
  $(".oldDB").empty();
  data.sort(function(a,b){
    return a.id>b.id; //THIS TOOK FOR EVER FOR ME FIGURE OUT!!!!!! otherwise it changed the order constantly.
  });
  for(i=0; i<data.length; i++){
    if (data[i].complete===true){
      $('.oldDB').append("<div><div class='container completed'><p class='completed'><span class='task'><span class='taskHead'>Task:</span> "+data[i].task+"</span>    <span class='description'><span class='taskHead'>Description:</span>   "+data[i].description+"    </span><button class='changeToUncompleted "+i+" btn btn-secondary'>oops do again</button></p></div><br/></div>");
    }
    else{
      $('.oldDB').append("<div><div class='container uncompleted'><p class='uncompleted'><span class='task'><span class='taskHead'>Task:</span> "+data[i].task+"</span>     <span class='description'><span class='taskHead'>Description:</span>    "+data[i].description+"    </span><button class='changeToCompleted "+i+" btn btn-secondary'>Completed!</button></p></div><br/></div>");

    }
  }
}


function changeToCompletedFunction(){
  var finder=$(this).attr("class").split(' ')[1];
  var classHold = oldInfo[finder];
  $.ajax({
    type:"POST",
    url:"/change_to_completed",
    data:classHold,
    success: function(data){
      pullOld();
    }
  });
}

function clearform(){
  $.ajax({
    type:"GET",
    url:"/clearform",
    success: function(data){
      pullOld();
    }
  });
  $(".sure").css("display","none");
  $(".clear").css("display","block");
}
function changeToUncompletedFunction(){
  var finder=$(this).attr("class").split(' ')[1];
  var classHold = oldInfo[finder];
  $.ajax({
    type:"POST",
    url:"/change_to_uncompleted",
    data:classHold,
    success: function(data){
      pullOld();
    }
  });
}

function showSureButton(){
  $(".sure").css("display","block");
  $(".clear").css("display","none");

}
