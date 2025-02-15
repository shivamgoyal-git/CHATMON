document.addEventListener("DOMContentLoaded", () => {

    const messageInput = document.querySelector(".message-input");
    const chatBody = document.querySelector(".chat-body");
    const sendMessageButton = document.querySelector("#send-message");

    let userData = {
        message : null
    }

    function createMessageDiv(content ,classes) {
        const div = document.createElement('div')
        div.classList.add("message", classes)
        div.innerHTML = content
        return div
    }

    function handleIncommingMessage (){
        const messageContent = `<div class="message bot-message">
          <img
            src="/assets/chatmon-logo.svg"
            alt="chatmon-logo"
            style="
              height: 35px;
              border: 0.5px solid #0e5f6d;
              border-radius: 50%;
            "
          />
          <div class="message-text">
           <div class="thinking-indicator">
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
           </div>
          </div>
        </div>`;
        const incommingMessageDiv = createMessageDiv(messageContent, "bot-message");
        chatBody.appendChild(incommingMessageDiv);

    }

    function handleOutgoingMessage (e) {
        e.preventDefault()
        userData.message = messageInput.value.trim()
        messageInput.value = ""
        const messageContent = `<div class="message-text"></div>`;
        const outgoingMessageDiv = createMessageDiv(messageContent, "user-message");
        outgoingMessageDiv.querySelector(".message-text").textContent = userData.message;
        chatBody.appendChild(outgoingMessageDiv);

        setTimeout(()=>{
        handleIncommingMessage()
        }, 600)
    }



    messageInput.addEventListener("keydown", (e) => {
        const userMessage = e.target.value.trim()
        if (e.key === 'Enter' && userMessage) {
            handleOutgoingMessage(e)
        }
    })

    sendMessageButton.addEventListener("click",(e)=>{
        handleOutgoingMessage(e)
    })



});