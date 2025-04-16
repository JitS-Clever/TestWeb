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
  