



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
      // Save the email value for later (using localStorage as an example)
      localStorage.setItem("userEmail", emailValue);
      
      // Remove the email input container (assumed to be the element with class "login-form")
      const loginForm = document.querySelector(".login-form");
      if (loginForm) {
        loginForm.remove();
        setTimeout(() => {
          const mainContainer = document.getElementById("main-container");
          const xpMeter = document.getElementById("xp-meter");
          if (mainContainer) {
            mainContainer.style.display = "block";
            // Force reflow to trigger the CSS transition
            void mainContainer.offsetWidth;
            mainContainer.classList.add("show");
            xpMeter.classList.add("show");
          }
        }, 1000);        
      }
    });
  });

  let currentXP = 0;
  function updateXP(points) {
    currentXP += points;
    const xpValueElem = document.querySelector('.xp-meter .xp-value');
    xpValueElem.textContent = 'XP: ' + currentXP;
    
    const xpChangeElem = document.getElementById('xp-change');
    xpChangeElem.textContent = (points > 0 ? '+' : '') + points + ' XP';
    xpChangeElem.classList.add('show');
    
    // Remove the animation class after 1 second
    setTimeout(() => {
      xpChangeElem.classList.remove('show');
    }, 1000);
  }
  
  document.querySelectorAll("#question-section .option").forEach(btn => {
    btn.addEventListener("click", function() {
      // Disable all options after selection
      document.querySelectorAll("#question-section .option").forEach(b => b.disabled = true);
      
      if (this.getAttribute("data-correct") === "true") {
        // Correct answer: turn button green and update XP
        this.style.backgroundColor = "green";
        updateXP(15); // awarding points
      } else {
        // Wrong answer: turn clicked button red
        this.style.backgroundColor = "red";
        // Highlight the correct button with a green border
        const correctBtn = document.querySelector('#question-section .option[data-correct="true"]');
        if (correctBtn) {
          correctBtn.classList.add("correct");
        }
      }
    });
  });
  
  function estimateCrackTime(password) {
    const length = password.length;
    if (length === 0) return 0;
    // Assume a keyspace of 94 printable ASCII characters for maximum complexity
    const combinations = Math.pow(94, length);
    // Assume an average cracking speed of 10 billion (1e10) guesses per second
    const guessesPerSecond = 1e10;
    return combinations / guessesPerSecond;
  }
  
  function formatTime(seconds) {
    if (seconds < 60) {
      return seconds.toFixed(0) + " seconds";
    }
    const minutes = seconds / 60;
    if (minutes < 60) {
      return minutes.toFixed(0) + " minutes";
    }
    const hours = minutes / 60;
    if (hours < 24) {
      return hours.toFixed(0) + " hours";
    }
    const days = hours / 24;
    if (days < 365) {
      return days.toFixed(0) + " days";
    }
    const years = days / 365;
    return years.toFixed(0) + " years";
  }
  
  document.getElementById("password-input").addEventListener("input", function() {
    const password = this.value;
    const seconds = estimateCrackTime(password);
    const formatted = formatTime(seconds);
    document.getElementById("crack-time").textContent = "Crack time: " + formatted;
  });
  
