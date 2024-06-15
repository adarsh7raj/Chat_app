const socket = io();


const notification=new Audio("./message-tone.mp3");

    const totalclients = document.getElementById("current_user");

    const message_container = document.querySelector(".message_container");
    const name_input = document.querySelector(".input");
    const message_form = document.querySelector(".input_data");
    const message_input = document.querySelector(".message_field");
    socket.on("total_client", (value) => {
      console.log(value);
      totalclients.innerHTML = "Total clients:" + value;
    });
    message_form.addEventListener("submit", function (event) {
        event.preventDefault();
        on_submit();
        console.log(message_input.value);
    });
    function on_submit() {
      if (message_input.value !== "") {
           let data = {
              name: name_input.value,
              message: message_input.value,
              date: new Date()
          };
          socket.emit("message_value", data);
          add_message(true, data);
          message_input.value = "";
      }
  }
  

    socket.on("message_data", (receivedData) => {
        // Check if the message is coming from the current client
        const isCurrentClient = receivedData.socketId === socket.id;

        // Only add the message if it's not from the current client
        if (!isCurrentClient) {
            add_message(false, receivedData);
        }
    });

    function add_message(own_message, messageData) {
        let element = `<li class="${own_message ? 'message_sent' : 'message_received'}"><p class="message">${messageData.message} </p><span class="status"> ${messageData.name}• ${moment(messageData.dateTime).fromNow()}</span></li>`;
        message_container.innerHTML += element;
        notification.play();
        scrollToBottom();
    }

    function scrollToBottom() {
      message_container.scrollTo(0, message_container.scrollHeight)
    }
    message_input.addEventListener("focus",function(e){
      let status=`<li class="status_typing"><p class="message">${name_input.value} is typing...</p></li>`
      socket.emit("feedback",status);
    });
//     message_input.addEventListener("keypress",function(e){
// let status=`<li class="status_typing"><p class="message">${name_input.value} is typing...</p></li>`

// socket.emit("feedback",status);

//    });
   
    message_input.addEventListener("blur",(event)=>{
      let status="";
      socket.emit("feedback",status);
    });
    socket.on("who_typing",(feedback)=>{     clear_data();
      message_container.innerHTML+=feedback;
    
    });
    function clear_data(){
      let status_message=document.querySelectorAll(".status_typing");
      status_message.forEach((elements) => {
      console.log(elements);
         console.log(message_container);
        message_container.removeChild(elements);
      });
    }
    