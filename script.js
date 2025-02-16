document.addEventListener("DOMContentLoaded", () => {

    const messageInput = document.querySelector(".message-input");
    const chatBody = document.querySelector(".chat-body");
    const sendMessageButton = document.querySelector("#send-message");

    // Api setup
    const API_KEY = "AIzaSyDm2eRCk9qr_qdxXI3JvL8nMdqRozN-sPI"
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

    let userData = {
        message: null
    }
    function createMessageDiv(content, classes) {
        const div = document.createElement('div')
        div.classList.add("message", classes)
        div.innerHTML = content
        return div
    }

    const  generateBotResponse = async (incommingMessageDiv) => {

            const messageElement = incommingMessageDiv.querySelector(".message-text")

            const requestOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: userData.message }]
                    }]
                })
            }

            try {
                const response = await fetch(API_URL, requestOptions)
                const data = await response.json()
                if (!response.ok) throw new Error(data.error.message)

                const apiResponseText = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g,"$1").trim()
                messageElement.textContent = apiResponseText    


            } catch (error) {
                console.log(error)
                messageElement.textContent = `Something went wrong. Please try again.`    
                messageElement.style.color =  "red"   

            }finally {
                chatBody.scrollTo({top: chatBody.scrollHeight, behavior: "smooth"})
            }

        }

    

    function handleIncommingMessage() {
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
        chatBody.scrollTo({top: chatBody.scrollHeight, behavior: "smooth"})


        // Call the generateBotResponse function
        generateBotResponse(incommingMessageDiv)

    }

    function handleOutgoingMessage(e) {
        e.preventDefault()
        userData.message = messageInput.value.trim()
        messageInput.value = ""
        const messageContent = `<div class="message-text"></div>`;
        const outgoingMessageDiv = createMessageDiv(messageContent, "user-message");
        outgoingMessageDiv.querySelector(".message-text").textContent = userData.message;
        chatBody.appendChild(outgoingMessageDiv);
        chatBody.scrollTo({top: chatBody.scrollHeight, behavior: "smooth"})

        setTimeout(() => {
            handleIncommingMessage()
        }, 600)
    }



    messageInput.addEventListener("keydown", (e) => {
        const userMessage = e.target.value.trim()
        if (e.key === 'Enter' && userMessage) {
            handleOutgoingMessage(e)
        }
    })

    sendMessageButton.addEventListener("click", (e) => {
        handleOutgoingMessage(e)
    })



});