"use strict";
import { GoogleGenerativeAI } from "@google/generative-ai";
class View {
  constructor() {
    this.chatHistory = [];
    this.menu = document.getElementById("menu");
    this.history = document.getElementById("history");
    this.input_mass = document.getElementById("input_mass");
    this.send_mass = document.getElementById("send_mass");
    this.article_res = document.getElementById("article_res");
    this.erase = document.getElementById("erase");
    this.message = document.getElementById("message");
    this.history_body = document.getElementById("history_body");
    this.history_clear = document.getElementById("history_clear");

    console.log(this.history_body);
    // Show history
    this.menu.addEventListener("click", () => {
      this.history.classList.toggle("translate-x-0");
      this.history.classList.toggle("translate-x-[-410px]");
    });

    // Hide history when clicking outside of it
    document.addEventListener("mousedown", (event) => {
      if (!this.history.classList.contains("translate-x-[-410px]")) {
        if (
          !this.history.contains(event.target) &&
          !this.menu.contains(event.target)
        ) {
          this.history.classList.add("translate-x-[-410px]");
        }
      }
    });

    // Erase chat history
    this.erase.addEventListener("click", () => {
      this.history_body.innerHTML = "";
      this.article_res.innerHTML = "";
      localStorage.removeItem("chatHistory");
      localStorage.removeItem("article");
    });
    this.history_clear.addEventListener("click", () => {
      this.history_body.innerHTML = "";
      localStorage.removeItem("chatHistory");
      localStorage.removeItem("article");
    });
    // Hide history on input focus
    this.input_mass.addEventListener("focus", () => {
      this.history.classList.add("translate-x-[-410px]");
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
  //history logic
  saveChatHistory() {
    localStorage.setItem("chatHistory", JSON.stringify(this.chatHistory));
    localStorage.setItem("article", JSON.stringify(this.article_res));
  }
  updateHistoryMenu() {
    const historyList = this.history.querySelector("ul");
    historyList.innerHTML = "";

    const uniqueChatHistory = [...new Set(this.chatHistory)];

    uniqueChatHistory.forEach((entry) => {
      let li = document.createElement("p");
      li.classList.add("bg-gray-100", "p-2", "rounded-lg");
      li.textContent = entry.user;
      historyList.appendChild(li);
    });
  }

  async getAi() {
    const API_KEY = "AIzaSyAoJ49Zq_rSHmM7hCv0MX3xMdSMDi7L_II";
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = this.input_mass.value.trim();

    if (prompt === "") return;

    let AIDiv = document.createElement("div");
    AIDiv.classList.add("reply_main");
    let user = document.createElement("div");
    let loading = document.createElement("div");
    user.classList.add("user");

    loading.textContent = "loadind...";
    user.textContent = this.input_mass.value;
    this.input_mass.value = "";
    this.article_res.appendChild(user);
    this.article_res.appendChild(loading);

    try {
      switch (prompt.toLowerCase()) {
        case "who created you":
        case "leowave":
          let p = document.createElement("p");
          p.innerHTML =
            "I was created by Leonard Ebisi, also known as Leowave—a passionate and dedicated frontend developer with growing expertise in JavaScript, React, Node.js, and Python. With a deep love for JavaScript, Leowave is steadily advancing their skills in both frontend and backend development. They have a strong foundation in React, often working on projects that involve building responsive web applications using modern tools like Tailwind CSS and Vite.";
          AIDiv.appendChild(p);
          break;

        case "i need leowave":
        case "how can i connect":
        case "portfolio":
          let socialMediaP = document.createElement("p");
          socialMediaP.innerHTML = `
        Connect to Leowave on social media:
        <br/>
        <a href="https://www.linkedin.com/in/leo-wave-309637239/" target="_blank" rel="noopener noreferrer">
            <img src="https://img.shields.io/badge/LinkedIn-blue?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn Badge"/>
        </a>
        <a href="https://x.com/Momentum1962?t=gtxbxbdJC5P54Xmr05JvgA&s=09" target="_blank" rel="noopener noreferrer">
            <img src="https://img.shields.io/badge/Twitter-blue?style=for-the-badge&logo=twitter&logoColor=white" alt="Twitter Badge"/>
        </a>`;
          AIDiv.appendChild(socialMediaP);
          break;

        case "who goes you":
          let goes = document.createElement("p");
          goes.textContent = "This Aro askAi upon the ship wida"; // Fixed the text to avoid HTML line breaks issue
          AIDiv.appendChild(goes);
          break;

        // Render normal
        default:
          const result = await model.generateContentStream(prompt);
          for await (const chunk of result.stream) {
            let chunkText = await chunk.text();
            chunkText = chunkText.replace(/\*\*(.*?)\*\*/g, "");
            let p = document.createElement("p");
            p.textContent = chunkText;
            AIDiv.appendChild(p);

            this.chatHistory.push({ user: prompt, reply: chunkText });
            this.saveChatHistory();
          }
          break;
      }
    } catch (error) {
      let p = document.createElement("p");
      p.textContent = `error generating Ai ${error}`;
      AIDiv.console.error("Error :", error);
    } finally {
      loading.remove();
      this.updateHistoryMenu();
      this.article_res.appendChild(AIDiv);
    }
  }
}

// Initial
let Controller = new View();
