document.addEventListener("DOMContentLoaded", function() {
    // Show the "Press me!" tooltip after 8 seconds if no click occurs
    let tipTimeout = setTimeout(() => {
      document.getElementById("press-tip").classList.add("show");
    }, 8000);

    document.getElementById("logo").addEventListener("click", function(event) {
      clearTimeout(tipTimeout);
      document.getElementById("press-tip").classList.remove("show");

      const logoContainer = document.getElementById("logo-container");
      // Stop the pulse animation
      logoContainer.style.animation = 'none';

      // Animate circles from the click position
      const circles = document.getElementById("circles");
      circles.style.opacity = "1";
      const clickX = event.clientX - 13;
      const clickY = event.clientY - 13;
      const circleElements = document.querySelectorAll(".circle");
      circleElements.forEach((circle, index) => {
        circle.style.left = `${clickX}px`;
        circle.style.top = `${clickY}px`;
        const angle = (index * 120) - 60;
        const x = Math.cos(angle * (Math.PI / 180)) * 200;
        const y = Math.sin(angle * (Math.PI / 180)) * 200;
        setTimeout(() => {
          circle.style.transform = `translate(${x}px, ${y}px)`;
          circle.style.opacity = "0";
        }, 10);
      });

      // Fade out and remove the welcome message
      const welcomeMessage = document.getElementById("welcome-message");
      welcomeMessage.classList.add("fade-out");
      setTimeout(() => {
        if (welcomeMessage.parentNode) {
          welcomeMessage.parentNode.removeChild(welcomeMessage);
        }
      }, 2000);

      // Smoothly move the logo upward:
      // Capture its current position, set it to absolute, then animate.
      const rect = logoContainer.getBoundingClientRect();
      logoContainer.style.position = "absolute";
      logoContainer.style.top = rect.top + "px";
      logoContainer.style.left = rect.left + "px";
      logoContainer.style.width = rect.width + "px";
      // Force reflow to register the new position
      void logoContainer.offsetWidth;
      // Add the move-top class to animate to the top center
      logoContainer.classList.add("move-top");

      // Remove circles container after animation completes
      setTimeout(() => {
        const circlesContainer = document.getElementById("circles");
        if (circlesContainer && circlesContainer.parentNode) {
          circlesContainer.parentNode.removeChild(circlesContainer);
        }
      }, 2500);
      setTimeout(() => {
        const loginPage = document.getElementById("login-page");
        if (loginPage) {
          loginPage.style.display = "block";
          void loginPage.offsetWidth;
          loginPage.classList.add("fade-in");
        }
      }, 2500);
    });
    document.getElementById("next-btn").addEventListener("click", function(e) {
      e.preventDefault(); // Prevent the form from submitting if inside a form
      const emailInput = document.getElementById("email-input");
      const emailValue = emailInput ? emailInput.value : "";
      // Validate that the email contains "zain" in its domain
      if (!/@.*zain/i.test(emailValue)) { 
        alert("Please enter a valid Zain email address.");
        return;
      }
      // Save the email value for later (using localStorage as an example)
      localStorage.setItem("userEmail", emailValue);
      
      // Remove the email input container (assumed to be the element with class "login-form")
      const loginForm = document.querySelector(".login-form");
      if (loginForm) {
        loginForm.remove();
        setTimeout(() => {
          const mainContainer = document.getElementById("main-container");
          if (mainContainer) {
            mainContainer.style.display = "block";
            // Force reflow to trigger the CSS transition
            void mainContainer.offsetWidth;
            mainContainer.classList.add("show");
          }
        }, 1000);        
      }
    });
    document.getElementById("submit-password").addEventListener("click", function(e) {
      e.preventDefault();
      
      // Remove any existing message element
      const oldMsg = document.getElementById("password-message");
      if(oldMsg) oldMsg.remove();

      const password = document.getElementById("password-input").value;
      
      let bruteContainer = document.getElementById('brute-visual');
      if (!bruteContainer) {
          bruteContainer = document.createElement('div');
          bruteContainer.id = 'brute-visual';
          bruteContainer.style.fontFamily = 'monospace';
          bruteContainer.style.fontSize = '24px'; 
          bruteContainer.style.textAlign = 'center';
          bruteContainer.style.margin = '10px auto 0';
          document.getElementById("password-tester").appendChild(bruteContainer);
      }
      
      const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
      const length = password.length;
      const isStrong = password.length >= 10 && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password);
      
      if(!isStrong) {
          const revealed = Array(length).fill(false);
          const interval = setInterval(() => {
              const notRevealed = [];
              for(let i = 0; i < length; i++){
                  if(!revealed[i]) notRevealed.push(i);
              }
              if(notRevealed.length > 0) {
                  const randIndex = notRevealed[Math.floor(Math.random() * notRevealed.length)];
                  revealed[randIndex] = true;
              }
              let displayStr = "";
              for(let i = 0; i < length; i++){
                  displayStr += revealed[i] ? password[i] : chars[Math.floor(Math.random()*chars.length)];
              }
              bruteContainer.textContent = displayStr;
              if(revealed.every(v => v)) {
                  clearInterval(interval);
                  // Create a new element for the dynamic message below the displayed password:
                  setTimeout(() => {
                      let missing = [];
                      if(password.length < 10) missing.push("10+ characters");
                      if(!/[0-9]/.test(password)) missing.push("a number");
                      if(!/[^A-Za-z0-9]/.test(password)) missing.push("a symbol");
                      const messageEl = document.createElement("div");
                      messageEl.id = "password-message";
                      messageEl.style.marginTop = "10px";
                      messageEl.style.fontSize = "20px";
                      messageEl.textContent = "Your password needs: " + missing.join(", ") + "!";
                      document.getElementById("password-tester").appendChild(messageEl);
                  }, 500);
              }
          }, 100);
      } else {
          // Strong password branch:
          // Start the visual brute forcer (it runs indefinitely until module transition).
          const strongInterval = setInterval(() => {
              let displayStr = "";
              for (let i = 0; i < length; i++) {
                  displayStr += chars[Math.floor(Math.random()*chars.length)];
              }
              bruteContainer.textContent = displayStr;
          }, 50);
          // After 1 second, show success message and award XP.
          setTimeout(() => {
              const messageEl = document.createElement("div");
              messageEl.id = "password-message";
              messageEl.style.marginTop = "10px";
              messageEl.style.fontSize = "20px";
              messageEl.textContent = "This is a strong password!";
              document.getElementById("password-tester").appendChild(messageEl);
              // After an additional second, transition to the next module ("Device Secuirty")
              setTimeout(() => {
                  // Fade out the current module (module2)
                  const module2 = document.getElementById("module2");
                  module2.classList.add("fade-out");
                  setTimeout(() => {
                      module2.remove();
                      // Show module3 (assumed to be pre-defined with id "module3" and titled "Device Secuirty")
                      const module3 = document.getElementById("module3");
                      if(module3) {
                          module3.style.display = "block";
                          void module3.offsetWidth;
                          module3.classList.add("fade-in");
                      }
                      clearInterval(strongInterval);
                  }, 1000);
              }, 2000);
          }, 1000);
      }
  });

  // Game: Spot the Malware in module4
  // Wait until module4 is visible (assume a transition to module4 will occur)
  const zipFile = document.getElementById("zip-file");
  if(zipFile) {
    zipFile.addEventListener("click", function() {
      document.getElementById("zip-contents").style.display = "block";
    });
  }

  // Add listeners for the file items in the file container
  const fileItems = document.querySelectorAll("#file-container .file-item");
  fileItems.forEach(item => {
    item.addEventListener("click", function() {
      if(this.getAttribute("data-type") !== "zip") {
        alert("This file is safe.");
      }
    });
  });

  // Add listeners for items inside the zip container
  const zipFileItems = document.querySelectorAll(".zip-file-item");
  zipFileItems.forEach(item => {
    item.addEventListener("click", function() {
      if(this.getAttribute("data-type") === "malware") {
        alert("Correct! malware.exe is infected!");
        // Transition from module3 to module4:
        const module3 = document.getElementById("module3");
        module3.classList.add("fade-out");
        setTimeout(() => {
            module3.remove();
            // Show module4 (assumed pre-defined with id "module4")
            const module4 = document.getElementById("module4");
            if(module4) {
                module4.style.display = "block";
                void module4.offsetWidth;
                module4.classList.add("fade-in");
            }
        }, 1000);
      } else {
        alert("This file is safe. Try again!");
      }
    });
  });
  
  // Wi-Fi Networks Ordering Game - Module 5
  const checkOrderBtn = document.getElementById("check-order-btn");
  const wifiList = document.getElementById("wifi-list");
  let draggedItem = null;

  const wifiItems = document.querySelectorAll(".wifi-item");
  wifiItems.forEach(item => {
    let longPressTimer;

    // New: Start long-press timer to add pop-out animation
    item.addEventListener("mousedown", function(e) {
      longPressTimer = setTimeout(() => {
        this.classList.add("dragged-out");
      }, 300);
    });

    // Cancel long-press on mouseup or mouseleave
    item.addEventListener("mouseup", function(e) {
      clearTimeout(longPressTimer);
      this.classList.remove("dragged-out");
    });
    item.addEventListener("mouseleave", function(e) {
      clearTimeout(longPressTimer);
      this.classList.remove("dragged-out");
    });

    // Existing drag events
    item.addEventListener("dragstart", function(e) {
      draggedItem = this;
      this.classList.add("dragging");
      e.dataTransfer.effectAllowed = "move";
    });
    item.addEventListener("dragend", function(e) {
      this.classList.remove("dragging");
      // Remove any lingering pop-out animation class
      this.classList.remove("dragged-out");
    });
    item.addEventListener("dragover", function(e) {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
    });
    item.addEventListener("drop", function(e) {
      e.preventDefault();
      if (draggedItem && draggedItem !== this) {
        // Animate the dragged item out.
        draggedItem.classList.add("dragged-out");
        // Wait for the "disappear" animation to complete (shorter duration now)
        setTimeout(() => {
          let allItems = Array.from(wifiList.children);
          let draggedIndex = allItems.indexOf(draggedItem);
          let dropIndex = allItems.indexOf(this);
          if (draggedIndex < dropIndex) {
            wifiList.insertBefore(draggedItem, this.nextSibling);
          } else {
            wifiList.insertBefore(draggedItem, this);
          }
          draggedItem.classList.remove("dragged-out");
        }, 200); // Reduced timeout for faster removal
      }
    });
  });

  // Randomize the order of Wi‑Fi items using the Fisher–Yates shuffle
  function shuffleWiFiItems() {
    const items = Array.from(wifiList.children);
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      wifiList.insertBefore(items[j], items[i]);
    }
  }
  shuffleWiFiItems();

  // Remove previous "Check Order" code and use the Finish button for verification
  const finishBtn = document.getElementById("next-module-btn");
  finishBtn.innerText = "Finish";
  finishBtn.addEventListener("click", function(e) {
    e.preventDefault();
    // Expected correct order: descending data-security [4, 3, 2, 1]
    const items = Array.from(wifiList.querySelectorAll(".wifi-item"));
    const currentOrder = items.map(item => parseInt(item.getAttribute("data-security")));
    const correctOrder = [4, 3, 2, 1];
    let isCorrect = currentOrder.every((val, index) => val === correctOrder[index]);
    if (isCorrect) {
      // Fade out module4 and then create a full screen congrats page
      const module4 = document.getElementById("module4");
      module4.classList.add("fade-out");
      setTimeout(() => {
        module4.remove();
        const mainContainer = document.getElementById("main-container");
        const congratsPage = document.createElement("div");
        congratsPage.id = "congrats-page";
        congratsPage.className = "fade-in";
        congratsPage.style.position = "fixed";
        congratsPage.style.top = "0";
        congratsPage.style.left = "0";
        congratsPage.style.width = "100%";
        congratsPage.style.height = "100%";
        congratsPage.style.display = "flex";
        congratsPage.style.justifyContent = "center";
        congratsPage.style.alignItems = "center";
        congratsPage.style.backgroundColor = "#000";
        congratsPage.style.zIndex = "2000";
        // Show only the "Congratulations!" text with circle images behind it
        congratsPage.innerHTML = `
          <div style="position: relative; text-align: center;">
            <h2 style="font-size:48px; color:#fff; position: relative; z-index:2;">Congratulations!</h2>
            <div class="congrats-circles" style="position: absolute; top:0; left:0; width:100%; height:100%; z-index:1;">
              <img src="recource/ZN_Active_01-01.png" style="position: absolute; top:0%; left:-15%; width:100px; opacity:0; animation: popCircle 2s forwards 0.5s, rotate 10s linear infinite;">
              <img src="recource/ZN_Active_01-02.png" style="position: absolute; top:10%; right:10%; width:60px; opacity:0; animation: popCircle 2s forwards 0.8s, rotate 10s linear infinite;">
              <img src="recource/ZN_Active_01-05.png" style="position: absolute; bottom:0%; right:-10%; width:100px; opacity:0; animation: popCircle 2s forwards 1.1s, rotate 10s linear infinite;">
            </div>
          </div>`;
        mainContainer.appendChild(congratsPage);
        // Add event listener to heading to show small info message
        const congratsHeading = congratsPage.querySelector("h2");
        congratsHeading.addEventListener("click", function() {
          if (!congratsPage.querySelector(".small-info-text")) {
            const infoText = document.createElement("p");
            infoText.className = "small-info-text";
            // Absolutely position the info text below the heading without affecting layout.
            infoText.style.position = "absolute";
            infoText.style.top = "calc(100% + 10px)";
            infoText.style.left = "50%";
            infoText.style.transform = "translateX(-50%)";
            infoText.style.fontSize = "14px";
            infoText.style.color = "#fff";
            infoText.textContent = "Hey there! We conduct regular phishing tests, so keep an eye out for them—and don’t tell IT that I Told you that.";
            // Append to the parent container (which is position: relative)
            congratsPage.querySelector("div").appendChild(infoText);
          }
        });
      }, 1000);
    } else {
      finishBtn.style.border = "2px solid red";
      finishBtn.classList.add("shake");
      setTimeout(() => {
        finishBtn.classList.remove("shake");
        finishBtn.style.border = "2px solid #fff";
      }, 500);
    }
  });

  // Temporary Skip Button for Module 4 (testing only - remove later)
  const skipModule4 = document.getElementById("skip-module4");
  if(skipModule4) {
    skipModule4.addEventListener("click", function() {
      // Hide modules 1, 2, and 3 if they exist
      const module1 = document.getElementById("module1");
      if (module1) { module1.style.display = "none"; }
      const module2 = document.getElementById("module2");
      if (module2) { module2.style.display = "none"; }
      const module3 = document.getElementById("module3");
      if (module3) { module3.style.display = "none"; }
      // Show module 4
      const module4 = document.getElementById("module4");
      if(module4) {
        module4.style.display = "block";
        void module4.offsetWidth;
        module4.classList.add("fade-in");
      }
    });
  }
  
  });

  document.querySelectorAll("#question-section .option").forEach(btn => {
    btn.addEventListener("click", function() {
      // Disable all options after selection
      document.querySelectorAll("#question-section .option").forEach(b => b.disabled = true);
      
      if (this.getAttribute("data-correct") === "true") {
        // Correct answer: turn button green
        this.style.backgroundColor = "green";
      } else {
        // Wrong answer: turn clicked button red
        this.style.backgroundColor = "red";
        // Highlight the correct button with a green border
        const correctBtn = document.querySelector('#question-section .option[data-correct="true"]');
        if (correctBtn) {
          correctBtn.classList.add("correct");
        }
      }
      
      // After animations, automatically transition from module1 to module2
      setTimeout(() => {
          const module1 = document.getElementById("module1");
          module1.classList.add("fade-out");
          setTimeout(() => {
              module1.remove();
              const module2 = document.getElementById("module2");
              module2.style.display = "block";
              void module2.offsetWidth;
              module2.classList.add("fade-in");
          }, 1000);
      }, 1500);
    });
  });




