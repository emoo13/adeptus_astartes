'use strict';

document.addEventListener("DOMContentLoaded", function () {
    // Select all thumbs-up buttons
    const buttons = document.querySelectorAll(".thumbs-up-2");
  
    // Loop through each button and add an event listener
    buttons.forEach((button) => {
      button.addEventListener("click", function () {
        // Find the closest likes-text-wrapper for this button
        const likesTextWrapper = this.closest(".like-rectangle").querySelector(".likes-text-wrapper");
  
        // Ensure the likesTextWrapper exists
        if (likesTextWrapper) {
          // Toggle the likes count
          if (likesTextWrapper.textContent === "0") {
            likesTextWrapper.textContent = "1"; // Increment likes
            console.log(`Button ${this.id} clicked: Liked!`);
          } else {
            likesTextWrapper.textContent = "0"; // Reset likes
            console.log(`Button ${this.id} clicked: Unliked!`);
          }
        } else {
          console.error("likes-text-wrapper not found for button", this.id);
        }
      });
    });
  });