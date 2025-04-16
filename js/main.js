document.addEventListener("DOMContentLoaded", function () {

    document.querySelectorAll('.accordion-header').forEach(button => {
      button.addEventListener('click', () => {
        const isActive = button.classList.contains('active');
  
        document.querySelectorAll('.accordion-header').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.accordion-body').forEach(body => body.style.maxHeight = null);
  
        if (!isActive) {
          button.classList.add('active');
          const body = button.nextElementSibling;
          body.style.maxHeight = body.scrollHeight + "px";
        }
      });
    });

    
  });
  