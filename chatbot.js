(() => {
  const style = document.createElement("style");
  style.textContent = `
    #chat-toggle {
      position: fixed; bottom: 24px; right: 24px; z-index: 9999;
      width: 56px; height: 56px; border-radius: 50%; border: none;
      background: #C45D3E; color: #fff; cursor: pointer;
      box-shadow: 0 4px 20px rgba(196,93,62,0.4);
      font-size: 24px; display: flex; align-items: center; justify-content: center;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    #chat-toggle:hover { transform: scale(1.08); box-shadow: 0 6px 28px rgba(196,93,62,0.5); }
    #chat-box {
      position: fixed; bottom: 92px; right: 24px; z-index: 9998;
      width: 370px; max-width: calc(100vw - 32px); height: 480px; max-height: 70vh;
      background: #FAFAF8; border-radius: 16px; border: 1px solid #E8E4DF;
      box-shadow: 0 20px 60px rgba(0,0,0,0.12);
      display: none; flex-direction: column; overflow: hidden;
      font-family: 'DM Sans', sans-serif;
    }
    #chat-box.open { display: flex; }
    #chat-header {
      background: #C45D3E; color: #fff; padding: 16px 20px;
      font-weight: 600; font-size: 15px; display: flex;
      align-items: center; gap: 10px;
    }
    #chat-header span { font-size: 20px; }
    #chat-messages {
      flex: 1; overflow-y: auto; padding: 16px; display: flex;
      flex-direction: column; gap: 10px;
    }
    .chat-msg {
      max-width: 85%; padding: 10px 14px; border-radius: 12px;
      font-size: 14px; line-height: 1.5; word-wrap: break-word;
    }
    .chat-msg.bot {
      background: #fff; color: #4A4A4A; align-self: flex-start;
      border: 1px solid #E8E4DF;
    }
    .chat-msg.user {
      background: #C45D3E; color: #fff; align-self: flex-end;
    }
    .chat-msg.typing { opacity: 0.6; font-style: italic; }
    #chat-input-row {
      display: flex; border-top: 1px solid #E8E4DF; background: #fff;
    }
    #chat-input {
      flex: 1; border: none; outline: none; padding: 14px 16px;
      font-size: 14px; font-family: 'DM Sans', sans-serif;
      background: transparent;
    }
    #chat-send {
      border: none; background: none; color: #C45D3E; padding: 14px 16px;
      cursor: pointer; font-size: 18px; font-weight: 700;
    }
    #chat-send:disabled { opacity: 0.4; cursor: default; }
  `;
  document.head.appendChild(style);

  const toggle = document.createElement("button");
  toggle.id = "chat-toggle";
  toggle.innerHTML = "💬";
  toggle.title = "Chat avec nous";

  const box = document.createElement("div");
  box.id = "chat-box";
  box.innerHTML = `
    <div id="chat-header"><span>🤖</span> Benul IA — Assistant</div>
    <div id="chat-messages"></div>
    <div id="chat-input-row">
      <input id="chat-input" placeholder="Posez votre question..." autocomplete="off">
      <button id="chat-send">➤</button>
    </div>
  `;

  document.body.appendChild(box);
  document.body.appendChild(toggle);

  const msgs = box.querySelector("#chat-messages");
  const input = box.querySelector("#chat-input");
  const sendBtn = box.querySelector("#chat-send");

  let history = [];
  let sending = false;

  function addMsg(text, role) {
    const div = document.createElement("div");
    div.className = `chat-msg ${role}`;
    div.textContent = text;
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
    return div;
  }

  // Welcome message
  function init() {
    addMsg("Bonjour ! Je suis l'assistant Benul IA. Comment puis-je vous aider avec nos formations ?", "bot");
  }

  toggle.addEventListener("click", () => {
    box.classList.toggle("open");
    if (box.classList.contains("open") && msgs.children.length === 0) init();
    if (box.classList.contains("open")) input.focus();
  });

  async function send() {
    const text = input.value.trim();
    if (!text || sending) return;

    addMsg(text, "user");
    history.push({ role: "user", content: text });
    input.value = "";
    sending = true;
    sendBtn.disabled = true;

    const typing = addMsg("En train d'écrire...", "bot typing");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });
      const data = await res.json();
      typing.remove();

      if (data.reply) {
        addMsg(data.reply, "bot");
        history.push({ role: "assistant", content: data.reply });
      } else {
        addMsg("Désolé, une erreur est survenue. Réessayez.", "bot");
      }
    } catch {
      typing.remove();
      addMsg("Erreur de connexion. Vérifiez votre connexion internet.", "bot");
    }

    sending = false;
    sendBtn.disabled = false;
    input.focus();
  }

  sendBtn.addEventListener("click", send);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") send();
  });
})();
