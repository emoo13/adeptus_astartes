'use strict';

document.addEventListener("DOMContentLoaded", function () {
    // Select all thumbs-up buttons
    const buttons = document.querySelectorAll(".thumbs-up-2");

    // Loop through each button and add an event listener
    buttons.forEach((button) => {
        button.addEventListener("click", async function () {
            const postId = this.dataset.postId; // Assuming buttons have a data attribute with the post ID

            if (!postId) {
                console.error("Post ID is missing for the button clicked.");
                return;
            }
            console.log(`Attempting to update like count for post ID: ${postId}`);

            try {
                // Send a request to update the like count in the database
                const response = await fetch(`/api/posts/${postId}/like`, {
                  method: 'PUT',
                  headers: {
                      'Content-Type': 'application/json'
                  }
              });

                if (response.ok) {
                    const data = await response.json();
                    // Update likes count on the front-end
                    const likesTextWrapper = this.closest(".like-rectangle").querySelector(".likes-text-wrapper");
                    if (likesTextWrapper) {
                        likesTextWrapper.textContent = data.likes_count;
                        console.log(`Button ${this.id} clicked: Liked!`);
                    } else {
                        console.error("likes-text-wrapper not found for button", this.id);
                    }
                } else {
                    console.error("Failed to update likes.");
                }
            } catch (error) {
                console.error("Error occurred while updating likes:", error);
            }
        });
    });
});
