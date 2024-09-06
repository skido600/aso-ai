"use strict";
import { GoogleGenerativeAI } from "@google/generative-ai";

class View {
  constructor() {
    this.chatHistory = [];
    this.chatHistoryobj = {};
    this.aiIMG = ["2289_SkVNQSBGQU1PIDEwMjgtMTIy.jpg"];
    this.copy = ["copy.svg"];
    this.arrow = ["arrow_down.svg"];
    this.menu = document.getElementById("menu");
    this.history = document.getElementById("history");
    this.input_mass = document.getElementById("input_mass");
    this.send_mass = document.getElementById("send_mass");
    this.article_res = document.getElementById("article_res");
    this.erase = document.getElementById("erase");
    this.message = document.getElementById("message");
    this.history_body = document.getElementById("history_body");
    this.history_clear = document.getElementById("history_clear");
    this.history_ul = document.getElementById("history_ul");
    this.copeid = document.getElementById("copeid");
    // this.copeid.style.display = "none";
    // console.log(this.copeid);

    // Show history
    this.menu.addEventListener("click", () => {
      this.history.classList.toggle("translate-x-0");
      this.history.classList.toggle("translate-x-[-810px]");
    });

    // Hide history when clicking outside of it
    document.addEventListener("mousedown", (event) => {
      if (!this.history.classList.contains("translate-x-[-810px]")) {
        if (
          !this.history.contains(event.target) &&
          !this.menu.contains(event.target)
        ) {
          this.history.classList.add("translate-x-[-810px]");
        }
      }
    });

    // Erase chat history
    this.erase.addEventListener("click", () => {
      this.article_res.innerHTML = "";
    });
    this.history_clear.addEventListener("click", () => {
      this.history_ul.innerHTML = "";
      localStorage.removeItem("chatHistory");
    });

    this.input_mass.addEventListener("focus", () => {
      this.history.classList.add("translate-x-[-810px]");
    });

    // Send
    this.send_mass.addEventListener("click", () => this.getAi());
    document.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        this.getAi();
      }
    });
  }

  // History logic
  saveChatHistory() {
    localStorage.setItem("chatHistory", JSON.stringify(this.chatHistory));
  }

  updateHistoryMenu() {
    for (let v of Object.values(this.chatHistoryobj)) {
      let li = document.createElement("li");

      if (v.length > 20) {
        li.textContent = `${v.slice(0, 20)}...`;
      } else {
        li.textContent = v;
      }

      this.history_ul.appendChild(li);
      console.log(v);
    }
  }

  async getAi() {
    const API_KEY = "AIzaSyCKwRjx0WuHdnW6-sIxewirI1LoZBjf9zw";
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction:
        "Your name is Askai. Whenever you're asked about your creator, say: 'I was created by an amazing guy named Leowave. His real name is Leonard Ebisi, also known as Leo X.' replace all * or ** from your responses to bold text. Whenever you're asked, 'Did you know Leowave, or Ebisi Leonard, or Leo X?' answer: 'Ooh, of course! Leowave, also known as Leo X, created me. ",
    });
    const prompt = this.input_mass.value.trim();

    if (prompt === "") return;

    let AllAI = document.createElement("div");
    AllAI.classList.add("ai-response-container");

    // img
    let img = document.createElement("img");
    img.src = `/img/${this.aiIMG}`;
    img.alt = "AI Image";
    img.classList.add("ai-image");

    // copy
    let copy = document.createElement("img");
    copy.src = `/img/${this.copy}`;
    copy.alt = "AI_copy";
    copy.classList.add("ai-copy");

    let AIDiv = document.createElement("div");
    AIDiv.classList.add("reply_main");

    AIDiv.appendChild(copy);
    AllAI.appendChild(img);
    AllAI.appendChild(AIDiv);

    let user = document.createElement("div");
    let loading = document.createElement("div");
    user.classList.add("user");

    loading.classList.add("loader");
    user.textContent = this.input_mass.value;
    this.input_mass.value = "";
    this.article_res.appendChild(user);
    this.article_res.appendChild(loading);

    try {
      const result = await model.generateContentStream(prompt);
      let combinedText = "";

      for await (const chunk of result.stream) {
        let chunkText = await chunk.text();
        combinedText += chunkText;

        let p = document.createElement("div");

        p.textContent = chunkText;
        //if small text
        if (combinedText.length < 100) {
          copy.style.display = "none";
        } else {
          copy.style.display = "block";
        }
        AIDiv.appendChild(p);
      }

      // copy
      copy.addEventListener("click", () => {
        navigator.clipboard
          .writeText(combinedText)
          .then(() => {
            this.copeid.classList.add("come");
            setTimeout(() => {
              this.copeid.classList.remove("come");
            }, 2000);

            console.log("success");
          })
          .catch((error) => {
            console.log(error);
          });
      });

      this.chatHistoryobj.prompt = prompt;
      this.chatHistory.push({ user: prompt, reply: combinedText });
      this.saveChatHistory();
    } catch (error) {
      let p = document.createElement("p");
      p.textContent = `Error: ${error.message}`;
      AIDiv.appendChild(p);
    } finally {
      loading.remove();
      this.updateHistoryMenu();
      this.article_res.appendChild(AllAI);
    }
  }
}

// Initial
let Controller = new View();
