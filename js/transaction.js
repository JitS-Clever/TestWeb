document.addEventListener("DOMContentLoaded", function () {
    const feedbackbtn = document.getElementById('transactionFeedback');
    feedbackbtn.addEventListener('click', () => {
        clevertap.event.push("Feedback Request");
    });
});