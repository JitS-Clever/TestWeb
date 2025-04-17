document.addEventListener("DOMContentLoaded", function () {

  const searchParams = new URLSearchParams("key1=value1&key2=value2");

  // Log the values
  searchParams.forEach((value, key) => {
    console.log(value, key);
  });

  const url = new URL(document.location).searchParams;
  console.log(url);
  var pageDict = {PageName:"Home"};
  url.forEach((value, key) => {
    pageDict[key] = value;
    console.log(value, key);
  });

  if(pageDict != null)
  {
    clevertap.event.push("Page Viewed", pageDict);
  }
  else{
    clevertap.event.push("Page Viewed");
  }

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

  // Slider JS Below

        let currentSlide = 0;
        const slides = document.querySelectorAll('.carousel-slide');
        const dots = document.querySelectorAll('.carousel-dot');
        let autoSlideInterval;
        
        // Start auto-sliding
        startAutoSlide();
        
        function startAutoSlide() {
            autoSlideInterval = setInterval(() => {
                moveSlide(1);
            }, 5000); // Change slide every 5 seconds
        }
        
        function resetAutoSlide() {
            clearInterval(autoSlideInterval);
            startAutoSlide();
        }
        
        function moveSlide(direction) {
            currentSlide = (currentSlide + direction + slides.length) % slides.length;
            updateSlides();
            resetAutoSlide();
        }
        
        function goToSlide(slideIndex) {
            currentSlide = slideIndex;
            updateSlides();
            resetAutoSlide();
        }
        
        function updateSlides() {
            slides.forEach((slide, index) => {
                slide.classList.toggle('active', index === currentSlide);
            });
            
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentSlide);
            });
        }
        
        function setPosition(positionClass) {
            const positions = ['content-top-left', 'content-bottom-left', 'content-bottom-right'];
            
            slides.forEach(slide => {
                // Remove all position classes
                positions.forEach(pos => {
                    slide.classList.remove(pos);
                });
                
                // Add the selected position class
                slide.classList.add(positionClass);
            });
        }
        
        // Pause auto-sliding when hovering over the carousel
        document.querySelector('.carousel-container').addEventListener('mouseenter', () => {
            clearInterval(autoSlideInterval);
        });
        
        // Resume auto-sliding when mouse leaves the carousel
        document.querySelector('.carousel-container').addEventListener('mouseleave', () => {
            startAutoSlide();
        });
        
        