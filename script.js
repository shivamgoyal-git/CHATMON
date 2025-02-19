document.addEventListener("DOMContentLoaded", () => {

    const messageInput = document.querySelector(".message-input");
    const chatBody = document.querySelector(".chat-body");
    const sendMessageButton = document.querySelector("#send-message");
    const fileInput = document.querySelector("#file-input");
    const fileUploadWrapper = document.querySelector(".file-upload-wrapper");
    const fileCancleButton = document.querySelector("#file-cancle");
    const chatbotToggler = document.querySelector("#chatbot-toggler");
    const closeChatbot = document.querySelector("#close-chatbot");


    // Api setup
    const API_KEY = "AIzaSyDm2eRCk9qr_qdxXI3JvL8nMdqRozN-sPI"
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

    let userData = {
        message: null,
        file: {
            data: null,
            mime_type: null
        }
    }
    const initialInputHeight = messageInput.scrollHeight;

    function createMessageDiv(content, classes) {
        const div = document.createElement('div')
        div.classList.add("message", classes)
        div.innerHTML = content
        return div
    }

    const generateBotResponse = async (incommingMessageDiv) => {

        const messageElement = incommingMessageDiv.querySelector(".message-text")

        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: userData.message }, (userData.file.data ? [{ inline_data: userData.file }] : [])]
                }]
            })
        }

        try {
            const response = await fetch(API_URL, requestOptions)
            const data = await response.json()
            if (!response.ok) throw new Error(data.error.message)

            const apiResponseText = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim()
            messageElement.textContent = apiResponseText


        } catch (error) {
            console.log(error)
            messageElement.textContent = `Something went wrong. Please try again.`
            messageElement.style.color = "red"

        } finally {
            userData.file = {}
            chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" })
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
        chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" })


        // Call the generateBotR esponse function
        generateBotResponse(incommingMessageDiv)

    }
//handle outgoing user message
    function handleOutgoingMessage(e) {
        e.preventDefault()
        userData.message = messageInput.value.trim()
        messageInput.value = ""
        fileUploadWrapper.classList.remove("file-uploaded");
        messageInput.dispatchEvent(new Event("input"))  


        //create and display user message
        const messageContent = `<div class="message-text"></div>
                               ${userData.file.data ? `<img src ="data:${userData.file.mime_type};base64,${userData.file.data}" class = "attachment" />` : ""}`;

        const outgoingMessageDiv = createMessageDiv(messageContent, "user-message");
        outgoingMessageDiv.querySelector(".message-text").textContent = userData.message;
        chatBody.appendChild(outgoingMessageDiv);
        chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" })

        setTimeout(() => {
            handleIncommingMessage()
        }, 600)
    }



    messageInput.addEventListener("keydown", (e) => {
        const userMessage = e.target.value.trim()
        if (e.key === 'Enter' && userMessage && !e.shiftKey && window.innerWidth >768) {
            handleOutgoingMessage(e)
        }
    })

// adjust input height dynamically
    messageInput.addEventListener("input", () =>{
        messageInput.style.height = `${initialInputHeight}px`;
        messageInput.style.height = `${messageInput.scrollHeight}px`;
        document.querySelector(".message-input").style.borderRadius = messageInput.scrollHeight > initialInputHeight ? "16px" : "32px"

    } )


    sendMessageButton.addEventListener("click", (e) => {
        handleOutgoingMessage(e)
    })


    fileInput.addEventListener("change", () => {
        const file = fileInput.files[0]
        if (!file) return;

        const reader = new FileReader()
        reader.onload = (e) => {
            fileUploadWrapper.querySelector("img").src = e.target.result;
            fileUploadWrapper.classList.add("file-uploaded");
            const base64String = e.target.result.split(",")[1];

            //store file data in user data
            userData.file = {
                data: base64String,
                mime_type: file.type
            }
            console.log(userData.file)
            fileInput.value = ""
        }

        reader.readAsDataURL(file)
    })

    fileCancleButton.addEventListener("click", () => {
        userData.file = {}
        fileUploadWrapper.classList.remove("file-uploaded");
    })

    document.querySelector("#file-upload").addEventListener("click", () => {
        fileInput.click()
    })


    const picker = new EmojiMart.Picker({
        theme: "light",
        skinTonePosition: "none",
        previewPosition: "none",
        onEmojiSelect: (emoji) => {
            const { selectionStart: start, selectionEnd: end } = messageInput;
            messageInput.setRangeText(emoji.native, start, end, "end");
            messageInput.focus();

        },
        onClickOutside: (e) => {
            if (e.target.id === "emoji-picker") {
                document.body.classList.toggle("show-emoji-picker")
            }
            else {
                document.body.classList.remove("show-emoji-picker")

            }
        }
    })

    document.querySelector(".chat-form").appendChild(picker);


    //toggle chatbot
    chatbotToggler.addEventListener("click",()=> document.body.classList.toggle("show-chatbot")) 

    //close chatbot
    closeChatbot.addEventListener("click",()=> document.body.classList.remove("show-chatbot"))




});