var templateJson;
var templateCode;
var selectedTemplateName;
var formValues = {};
var dynamicValues = {};
var tempName = '';

document.addEventListener("DOMContentLoaded", function () {

    const searchParams = new URLSearchParams("key1=value1&key2=value2");

    // Log the values
    searchParams.forEach((value, key) => {
      console.log(value, key);
    });

    const url = new URL(document.location).searchParams;
    console.log(url);
    var pageDict = {PageName:"In-App Template"};
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
  });
  

// Directly add new template names in this array
const templates = [

    { id: "e1", name: "Disappearing Inapp", function: fetchData },
    { id: "e2", name: "Footer Survey", function: fetchData },
    { id: "e3", name: "Footer Survey (Multiple)", function: fetchData },
    { id: "e4", name: "Video Gif", function: fetchData },
    { id: "e5", name: "Image Carousel", function: fetchData },
    { id: "e6", name: "Feedback Rating with PlayStore", function: fetchData },
    { id: "e7", name: "Dynamic PIP", function: fetchData },
    { id: "e8", name: "Stories V1", function: fetchData },
    { id: "e9", name: "Stories V2", function: fetchData },
    { id: "e10", name: "Scratch Card", function: fetchData },
    { id: "e11", name: "Copy Coupon Code", function: fetchData },
    { id: "e12", name: "Spin Wheel", function: fetchData },
    { id: "e13", name: "Memory Flip Game", function: fetchData }
    
];

function startLoader() {
  var bodyTag = document.querySelector("body");
  bodyTag.classList.add("blurbg");
  var loaderDiv = document.createElement("div");
  loaderDiv.setAttribute("class", "loader");
  loaderDiv.setAttribute("id", "processing");
  bodyTag.appendChild(loaderDiv);
}

function hideLoader() {
  var loaderDiv = document.getElementById("processing");
  if (loaderDiv) {
    loaderDiv.remove(); // Remove the loader div from the DOM
  }

  var bodyTag = document.querySelector("body");
  bodyTag.classList.remove("blurbg"); // Remove the blurbg class from the body
}

function populateDropdown() {
  const dropdownMenu = document.querySelector(".dropdown-menu");
  dropdownMenu.innerHTML = "";

  templates.forEach((template) => {
    const listItem = document.createElement("li");
    listItem.className = "dropdown-item";
    listItem.id = template.id;
    listItem.textContent = template.name;
    listItem.addEventListener("click", () => {
      document.querySelector(".dropdown-toggle").innerText = template.name;
      selectedTemplateName = template.name;
      template.function(selectedTemplateName);
    });
    dropdownMenu.appendChild(listItem);
  });
}

populateDropdown();

// function templateChange(templateName, templateJson) {
//   try {
//     switch (templateName) {
//       case "Disappearing Inapp":
//         DA();
//         break;

//       default:
//         break;
//     }
//   } catch (error) {
//     console.log(error);
//   }
// }

function formBuilder() {
  const form = document.getElementById("dynamicContent");
  form.innerHTML = "";

  // Add template description if available
  if (templateJson.json_content.description) {
    const descriptionContainer = document.createElement("div");
    descriptionContainer.className = "template-description mb-4 p-4";
    
    // Add icon and title in a flex container
    const titleRow = document.createElement("div");
    titleRow.className = "title-row";
    
    // Icon for description
    const icon = document.createElement("span");
    icon.innerHTML = "&#9432;"; // Information symbol
    icon.className = "info-icon";
    titleRow.appendChild(icon);
    
    // Template name as title
    const descriptionTitle = document.createElement("h4");
    descriptionTitle.className = "description-title";
    descriptionTitle.textContent = selectedTemplateName || "Template Description";
    titleRow.appendChild(descriptionTitle);
    
    descriptionContainer.appendChild(titleRow);
    
    // Process description text and bullets
    if (typeof templateJson.json_content.description === 'string') {
      // Legacy support for string descriptions
      const descriptionText = document.createElement("p");
      descriptionText.className = "description-text";
      descriptionText.textContent = templateJson.json_content.description;
      descriptionContainer.appendChild(descriptionText);
    } else {
      // Support for enhanced description with text and bullets
      if (templateJson.json_content.description.text) {
        const descriptionText = document.createElement("p");
        descriptionText.className = "description-text";
        descriptionText.textContent = templateJson.json_content.description.text;
        descriptionContainer.appendChild(descriptionText);
      }
      
      // Add bullet points if available
      if (templateJson.json_content.description.bullets && 
          templateJson.json_content.description.bullets.length) {
        const bulletList = document.createElement("ul");
        bulletList.className = "description-bullets";
        
        templateJson.json_content.description.bullets.forEach(bullet => {
          const bulletItem = document.createElement("li");
          bulletItem.textContent = bullet;
          bulletList.appendChild(bulletItem);
        });
        
        descriptionContainer.appendChild(bulletList);
      }
    }
    
    form.appendChild(descriptionContainer);
  }
  // Process static fields first (legacy support)
  if (templateJson.json_content) {
    var maxFields = templateJson.json_content.max;
    var fields = templateJson.json_content;
    for (let i = 0; i <= maxFields; i++) {
      const field = fields[i];
      if (!field) continue;

      createFormField(field, form);
    }
  }

  // Process dynamic content if available
  if (templateJson.json_content.dynamicContent) {
    processDynamicContent(templateJson.json_content.dynamicContent, form);
  }
}

function createFormField(field, parentElement, prefix = "") {
  const formGroup = document.createElement("div");
  formGroup.className = "form-group mb-3";

  const label = document.createElement("label");
  const fieldId = prefix ? `${prefix}.${field.id}` : field.id;
  label.setAttribute("for", fieldId);
  label.textContent = field.label;
  formGroup.appendChild(label);

  let input;

  switch (field.type) {
    case "Text":
      input = document.createElement("input");
      input.className = "form-control";
      input.setAttribute("id", fieldId);
      input.value = field.default || "";
      formGroup.appendChild(input);
      break;

    case "Number":
      input = document.createElement("input");
      input.className = "form-control";
      input.setAttribute("type", "number");
      input.setAttribute("id", fieldId);
      input.value = field.default || 0;
      formGroup.appendChild(input);
      break;

    case "Checkbox":
      input = document.createElement("input");
      input.className = "form-check-input ms-2";
      input.setAttribute("type", "checkbox");
      input.setAttribute("id", fieldId);
      if (field.default === true) {
        input.checked = true;
      }
      formGroup.appendChild(input);
      break;

    case "Select":
      input = document.createElement("select");
      input.className = "form-control";
      input.setAttribute("id", fieldId);

      if (field.options && Array.isArray(field.options)) {
        field.options.forEach((option) => {
          const optionEl = document.createElement("option");
          optionEl.value = option;
          optionEl.textContent = option;
          if (field.default === option) {
            optionEl.selected = true;
          }
          input.appendChild(optionEl);
        });
      }
      formGroup.appendChild(input);
      break;

    case "Image":
      input = document.createElement("input");
      input.className = "form-control";
      input.setAttribute("id", fieldId);
      input.value = field.default || "";
      formGroup.appendChild(input);

      const description = document.createElement("p");
      description.className = "form-text mt-2";
      description.textContent = field.description || "";
      formGroup.appendChild(description);
      break;

    case "ColorPicker":
      input = document.createElement("input");
      input.className = "col-sm-1 col-form-label";
      input.setAttribute("type", "color");
      input.setAttribute("id", fieldId);
      input.value = field.default || "#000000";
      formGroup.appendChild(input);

      const colorDesc = document.createElement("p");
      colorDesc.className = "form-text mt-2";
      colorDesc.textContent = field.description || "";
      formGroup.appendChild(colorDesc);
      break;

    case "DynamicArray":
      const arrayContainer = document.createElement("div");
      arrayContainer.className = "dynamic-array-container mb-2";
      arrayContainer.id = `${fieldId}-container`;

      // Initial items from default
      const defaultItems = field.default || [""];
      defaultItems.forEach((value, index) => {
        const itemWrapper = document.createElement("div");
        itemWrapper.className = "d-flex mb-2";

        const itemInput = document.createElement("input");
        itemInput.className = "form-control me-2";
        itemInput.setAttribute("type", "text");
        itemInput.setAttribute("id", `${fieldId}[${index}]`);
        itemInput.value = value;
        itemWrapper.appendChild(itemInput);

        if (index > 0 || defaultItems.length > 1) {
          const removeBtn = document.createElement("button");
          removeBtn.className = "btn btn-danger";
          removeBtn.textContent = "✕";
          removeBtn.onclick = function () {
            itemWrapper.remove();
          };
          itemWrapper.appendChild(removeBtn);
        }

        arrayContainer.appendChild(itemWrapper);
      });

      const addBtn = document.createElement("button");
      addBtn.className = "btn btn-secondary mt-2";
      addBtn.textContent = "Add Item";
      addBtn.onclick = function () {
        if (arrayContainer.children.length >= field.maxItems) {
          alert(`Maximum ${field.maxItems} items allowed`);
          return;
        }

        const index = arrayContainer.children.length;
        const itemWrapper = document.createElement("div");
        itemWrapper.className = "d-flex mb-2";

        const itemInput = document.createElement("input");
        itemInput.className = "form-control me-2";
        itemInput.setAttribute("type", "text");
        itemInput.setAttribute("id", `${fieldId}[${index}]`);
        itemWrapper.appendChild(itemInput);

        const removeBtn = document.createElement("button");
        removeBtn.className = "btn btn-danger";
        removeBtn.textContent = "✕";
        removeBtn.onclick = function () {
          itemWrapper.remove();
        };
        itemWrapper.appendChild(removeBtn);

        arrayContainer.appendChild(itemWrapper);
      };

      formGroup.appendChild(arrayContainer);
      formGroup.appendChild(addBtn);
      break;
  }

  if (
    field.description &&
    !["Image", "ColorPicker", "DynamicArray"].includes(field.type)
  ) {
    const description = document.createElement("p");
    description.className = "form-text mt-2";
    description.textContent = field.description;
    formGroup.appendChild(description);
  }

  parentElement.appendChild(formGroup);
}

let arrayTabsInfo = {};

function processDynamicContent(dynamicContent, form) {
  if (!dynamicContent || !Array.isArray(dynamicContent)) return;

  // Create tab container structure
  const tabContainer = document.createElement("div");
  tabContainer.className = "dynamic-content-tabs mb-4";

  // Create nav tabs with proper Bootstrap classes
  const tabNav = document.createElement("ul");
  tabNav.className = "nav nav-tabs mb-0";
  tabNav.setAttribute("role", "tablist");
  tabNav.id = "dynamicContentTabs";

  // Create tab content container
  const tabContent = document.createElement("div");
  tabContent.className = "tab-content p-3 border border-top-0 rounded-bottom";
  tabContent.id = "dynamicContentTabContent";

  // Initialize arrayTabsInfo as empty object
  arrayTabsInfo = {};

  // Process each content section as a tab
  dynamicContent.forEach((content, index) => {
    if (content.type === "array" || content.type === "survey") {
      // For array/survey types, create initial tab and track for adding more items later
      arrayTabsInfo[content.variableName] = {
        config: content,
        count: 1, // Start with 1 item
        maxItems: content.maxItems || 10,
        tabs: [] // Track tab IDs for better management
      };

      // Create the first item tab
      createDynamicContentTab(tabNav, tabContent, {
        id: `${content.variableName}-0`,
        title: `${content.variableName} 1`,
        isActive: index === 0,
        content: content,
        itemIndex: 0,
      });
      
      // Track the tab
      arrayTabsInfo[content.variableName].tabs.push(`${content.variableName}-0`);
    } else {
      // For non-array types (like config), create a single tab
      createDynamicContentTab(tabNav, tabContent, {
        id: content.variableName,
        title: content.variableName,
        isActive: index === 0,
        content: content,
      });
    }
  });

  // Add "Add Item" buttons for array type tabs
  for (const [tabName, info] of Object.entries(arrayTabsInfo)) {
    const addButtonLi = document.createElement("li");
    addButtonLi.className = "nav-item add-tab-button ms-2";

    const addButton = document.createElement("button");
    addButton.className = "btn btn-sm btn-success rounded-circle nav-add-btn";
    addButton.innerHTML = "<span>+</span>";
    addButton.title = `Add ${tabName} Item`;

    addButton.onclick = function () {
      if (info.count >= info.maxItems) {
        alert(`Maximum ${info.maxItems} items allowed for ${tabName}`);
        return;
      }

      // Create a new tab for this array item
      const newIndex = info.count;
      const tabId = `${tabName}-${newIndex}`;

      createDynamicContentTab(tabNav, tabContent, {
        id: tabId,
        title: `${tabName} ${newIndex + 1}`,
        isActive: false,
        content: info.config,
        itemIndex: newIndex,
        removable: true,
        parentInfo: info // Pass parent info for better tab management
      });

      // Track the new tab
      info.tabs.push(tabId);

      // Place the add button at the end again
      tabNav.appendChild(addButtonLi);

      // Activate the new tab
      const newTabButton = document.querySelector(`#tab-${tabId}-tab`);
      if (newTabButton) {
        const bsTab = new bootstrap.Tab(newTabButton);
        bsTab.show();
      }

      info.count++;
    };

    addButtonLi.appendChild(addButton);
    tabNav.appendChild(addButtonLi);
  }

  // Assemble the tab structure
  tabContainer.appendChild(tabNav);
  tabContainer.appendChild(tabContent);

  // Add a section title for dynamic content
  const dynamicContentHeader = document.createElement("h3");
  dynamicContentHeader.className = "mt-4 mb-3";
  dynamicContentHeader.textContent = "Dynamic Content";
  form.appendChild(dynamicContentHeader);

  // Add the tab container to the form
  form.appendChild(tabContainer);

  // Initialize all tabs with proper Bootstrap functionality
  const tabEls = tabNav.querySelectorAll('button[data-bs-toggle="tab"]');
  tabEls.forEach((tabEl) => {
    tabEl.addEventListener("click", function (event) {
      event.preventDefault();
      const bsTab = new bootstrap.Tab(tabEl);
      bsTab.show();
    });
  });
}


function createDynamicContentTab(tabNav, tabContent, options) {
    const { id, title, isActive, content, itemIndex, removable, parentInfo } = options;
  
    const tabId = `tab-${id}`;
  
    // Create tab nav item
    const tabNavItem = document.createElement("li");
    tabNavItem.className = "nav-item";
    tabNavItem.setAttribute("role", "presentation");
    tabNavItem.id = `nav-item-${id}`;
  
    // Create the tab button with properly styled text
    const tabButtonLink = document.createElement("button");
    tabButtonLink.className = `nav-link ${isActive ? "active" : ""}`;
    tabButtonLink.id = `${tabId}-tab`;
    tabButtonLink.setAttribute("data-bs-toggle", "tab");
    tabButtonLink.setAttribute("data-bs-target", `#${tabId}`);
    tabButtonLink.setAttribute("type", "button");
    tabButtonLink.setAttribute("role", "tab");
    tabButtonLink.setAttribute("aria-controls", tabId);
    tabButtonLink.setAttribute("aria-selected", isActive ? "true" : "false");
    tabButtonLink.textContent = title;
  
    // Add remove button if tab is removable
    if (removable) {
      const removeBtn = document.createElement("button");
      removeBtn.className = "btn btn-danger btn-sm remove-tab-btn";
      // removeBtn.innerHTML = "×";
      removeBtn.title = `Remove ${title}`;
      removeBtn.setAttribute("aria-label", `Remove ${title}`);
      removeBtn.onclick = function (e) {
        e.preventDefault();
        e.stopPropagation();
  
        // Get the variable name from the ID (format: variableName-index)
        const dashIndex = id.indexOf('-');
        const variableName = id.substring(0, dashIndex);
        
        // Find the next tab to activate
        const allTabs = tabNav.querySelectorAll('.nav-link');
        let nextTab = null;
  
        // Find current tab index and the next tab to activate
        for (let i = 0; i < allTabs.length; i++) {
          if (allTabs[i] === tabButtonLink) {
            if (i > 0) nextTab = allTabs[i - 1]; // Previous tab if available
            else if (allTabs[i + 1]) nextTab = allTabs[i + 1]; // Next tab if available
            break;
          }
        }
  
        // Remove from tracking
        if (arrayTabsInfo[variableName]) {
          // Remove the tab ID from the tabs array
          const tabIndex = arrayTabsInfo[variableName].tabs.indexOf(id);
          if (tabIndex !== -1) {
            arrayTabsInfo[variableName].tabs.splice(tabIndex, 1);
          }
          
          // Important: Decrease the count when removing a tab
          arrayTabsInfo[variableName].count = Math.max(1, arrayTabsInfo[variableName].count - 1);
          
          // Update the UI to show the new count
          console.log(`${variableName} count decreased to ${arrayTabsInfo[variableName].count}`);
        }
  
        // Remove tab content and nav item
        const tabContentPane = document.getElementById(tabId);
        if (tabContentPane) tabContentPane.remove();
        
        tabNavItem.remove();
  
        // Activate another tab if found
        if (nextTab) {
          const bsTab = new bootstrap.Tab(nextTab);
          bsTab.show();
        }
      };
  
      tabButtonLink.appendChild(removeBtn);
    }
  
    tabNavItem.appendChild(tabButtonLink);
    tabNav.appendChild(tabNavItem);
  
    // Create tab pane
    const tabPane = document.createElement("div");
    tabPane.className = `tab-pane fade ${isActive ? "show active" : ""}`;
    tabPane.id = tabId;
    tabPane.setAttribute("role", "tabpanel");
    tabPane.setAttribute("aria-labelledby", `${tabId}-tab`);
  
    // Create content inside tab pane
    const sectionContainer = document.createElement("div");
    sectionContainer.className = "dynamic-section";
  
    switch (content.type) {
      case "config":
        // Add a title for the config section
        const configTitle = document.createElement("h4");
        configTitle.className = "mb-3 text-dark";
        configTitle.textContent = "Configuration Settings";
        sectionContainer.appendChild(configTitle);
  
        content.fields.forEach((field) => {
          createFormField(field, sectionContainer, content.variableName);
        });
        break;
  
      case "array":
      case "survey":
        // For array/survey items, we render a single item's fields
        if (itemIndex !== undefined) {
          // Create a container for this specific array item
          const itemContainer = document.createElement("div");
          itemContainer.id = `${content.variableName}-item-${itemIndex}`;
          itemContainer.className = "array-item";
  
          // Add a title for the item
          const itemTitle = document.createElement("h4");
          itemTitle.className = "mb-3 text-dark";
          itemTitle.textContent =
            content.type === "survey"
              ? `Question ${itemIndex + 1}`
              : `${content.variableName} Item ${itemIndex + 1}`;
          itemContainer.appendChild(itemTitle);
  
          // Render the fields for this array item
          content.itemTemplate.fields.forEach((field) => {
            createFormField(
              field,
              itemContainer,
              `${content.variableName}[${itemIndex}]`
            );
          });
  
          sectionContainer.appendChild(itemContainer);
        }
        break;
    }
  
    tabPane.appendChild(sectionContainer);
    tabContent.appendChild(tabPane);
  
    return tabNavItem;
  }

function addDynamicItem(contentConfig, index, container) {
  const itemId = `${contentConfig.variableName}-item-${index}`;
  const itemDiv = document.createElement("div");
  itemDiv.className = "dynamic-item border-bottom pb-3 pt-3";
  itemDiv.id = itemId;

  // Item header with remove button
  const itemHeader = document.createElement("div");
  itemHeader.className =
    "d-flex justify-content-between align-items-center mb-3";

  const itemTitle = document.createElement("h5");
  itemTitle.textContent =
    contentConfig.type === "survey"
      ? `Question ${index + 1}`
      : `Item ${index + 1}`;
  itemHeader.appendChild(itemTitle);

  if (
    index > 0 ||
    document.querySelectorAll(`[id^="${contentConfig.variableName}-item-"]`)
      .length > 0
  ) {
    const removeBtn = document.createElement("button");
    removeBtn.className = "btn btn-sm btn-danger";
    removeBtn.textContent = "Remove";
    removeBtn.onclick = function () {
      itemDiv.remove();
    };
    itemHeader.appendChild(removeBtn);
  }

  itemDiv.appendChild(itemHeader);

  // Add fields
  contentConfig.itemTemplate.fields.forEach((field) => {
    createFormField(field, itemDiv, `${contentConfig.variableName}[${index}]`);
  });

  container.appendChild(itemDiv);
}

function fetchFormData() {
  // Get static form values
  const form = document.getElementById("dynamicContent");
  const staticInputs = form.querySelectorAll(
    'input:not([id*="["]):not([id*="."]), select:not([id*="["]):not([id*="."])'
  );

  formValues = {};
  staticInputs.forEach((input) => {
    if (input.type === "checkbox") {
      formValues[input.id] = input.checked;
    } else {
      formValues[input.id] = input.value;
    }
  });

  // Process dynamic content
  dynamicValues = {};
  if (templateJson.json_content.dynamicContent) {
    processDynamicFormData(templateJson.json_content.dynamicContent);
  }

  console.log("Static values:", formValues);
  console.log("Dynamic values:", dynamicValues);

  codeBuilder();
}

function processDynamicFormData(dynamicContent) {
  if (!dynamicContent || !Array.isArray(dynamicContent)) return;

  dynamicContent.forEach((content) => {
    const variableName = content.variableName;

    switch (content.type) {
      case "config":
        dynamicValues[variableName] = {};
        content.fields.forEach((field) => {
          const inputId = `${variableName}.${field.id}`;
          const input = document.getElementById(inputId);
          if (input) {
            if (input.type === "checkbox") {
              dynamicValues[variableName][field.id] = input.checked;
            } else if (input.type === "number") {
              dynamicValues[variableName][field.id] = parseFloat(input.value);
            } else {
              dynamicValues[variableName][field.id] = input.value;
            }
          }
        });
        break;

      case "array":
      case "survey":
        dynamicValues[variableName] = [];
        const itemContainers = document.querySelectorAll(
          `[id^="${variableName}-item-"]`
        );

        itemContainers.forEach((container, index) => {
          const itemData = {};

          content.itemTemplate.fields.forEach((field) => {
            if (field.type === "DynamicArray") {
              // Handle dynamic arrays (e.g., answers in a survey question)
              const arrayInputs = document.querySelectorAll(
                `[id^="${variableName}[${index}].${field.id}["]`
              );
              const arrayValues = [];

              arrayInputs.forEach((input) => {
                if (input.value.trim()) {
                  arrayValues.push(input.value.trim());
                }
              });

              itemData[field.id] = arrayValues;
            } else {
              const inputId = `${variableName}[${index}].${field.id}`;
              const input = document.getElementById(inputId);
              if (input) {
                if (input.type === "checkbox") {
                  itemData[field.id] = input.checked;
                } else if (input.type === "number") {
                  itemData[field.id] = parseFloat(input.value);
                } else {
                  itemData[field.id] = input.value;
                }
              }
            }
          });

          dynamicValues[variableName].push(itemData);
        });
        break;
    }
  });
}

async function fetchData(templateName) {
  const url = `https://v5ffl5exja.execute-api.ap-south-1.amazonaws.com/prod?inappTemplate=${templateName}`;
  tempName = templateName;

  clevertap.event.push("Template Selected", {TemplateName:templateName});
  try {
    startLoader();
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Error in response");
    }

    templateJson = await response.json();
    templateCode = templateJson.html_content;
    //Preview the template
    if (!templateJson.json_content.dynamicContent) {
      loadIframe(templateCode);
    }else if (templateJson.json_content.sample) {
      // For dynamic templates with sample data, process and preview
      loadDynamicPreview();
    } 
    formBuilder();
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  } finally {
    hideLoader();
  }
}

function copyCode() {
  const codeBlock = document.getElementById("codeBlock");
  navigator.clipboard
    .writeText(codeBlock.value)
    .then(() => {
      alert("Code copied to clipboard!");
      clevertap.event.push("Template Selected", {
        "TemplateName":tempName,
        "Action":"Click",
        "Label":"Copy Button"
      });
    })
    .catch((err) => {
      console.error("Failed to copy: ", err);
    });
}

function loadDynamicPreview() {
  // Get sample data from the template
  const sampleValues = templateJson.json_content.sample;
  
  // Call codeBuilder in preview mode with sample data
  codeBuilder(true, sampleValues);
}

function loadIframe(template) {
  // Get reference to the existing iframe
  const iframe = document.getElementById("codeIframe");
  
  // Create a unique name to prevent caching issues
  const uniqueName = 'iframe_' + Date.now();
  
  // Create a new iframe element
  const newIframe = document.createElement('iframe');
  newIframe.id = "codeIframe";
  newIframe.className = iframe.className;
  newIframe.style.cssText = iframe.style.cssText;
  
  // Replace the old iframe with the new one
  iframe.parentNode.replaceChild(newIframe, iframe);
  
  // Write content to the new iframe
  const iframeDoc = newIframe.contentDocument || newIframe.contentWindow.document;
  
  if (template) {
    iframeDoc.open();
    iframeDoc.write(template);
    iframeDoc.close();
  } else {
    // Otherwise use what's in the code block
    const codeBlock = document.getElementById("codeBlock");
    iframeDoc.open();
    iframeDoc.write(codeBlock.value);
    iframeDoc.close();
  }
  setTimeout(() => {
    // Calculate the scaling factor based on content size vs iframe size
    const content = iframeDoc.body;
    const contentWidth = content.scrollWidth;
    const contentHeight = content.scrollHeight;
    const frameWidth = iframe.clientWidth;
    const frameHeight = iframe.clientHeight;
    
    // Determine which dimension requires more scaling
    const scaleX = frameWidth / contentWidth;
    const scaleY = frameHeight / contentHeight;
    const scale = Math.min(scaleX, scaleY, 1); // Don't scale up, only down
    
    // Apply the transform
    iframe.style.transform = `scale(${scale})`;
    
    // If the content is smaller than the frame, center it
    if (scale === 1) {
      const xOffset = (frameWidth - contentWidth) / 2;
      const yOffset = (frameHeight - contentHeight) / 2;
      iframe.style.left = xOffset > 0 ? `${xOffset}px` : '0';
      iframe.style.top = yOffset > 0 ? `${yOffset}px` : '0';
    } else {
      iframe.style.left = '0';
      iframe.style.top = '0';
    }
  }, 100);
}

// Replace your codeBuilder function with this version to work with the external editor

function codeBuilder(isPreview = false, previewData = null) {
  let processedCode = templateCode;

  const dynamicDataToUse = isPreview ? previewData : dynamicValues;
  // Process static replacements (legacy support)
  if (templateJson.json_content) {
    var maxFields = templateJson.json_content.max;
    var fields = templateJson.json_content;

    for (let i = 0; i <= maxFields; i++) {
      var field = fields[i];
      if (!field) continue;

      var replaceText = field.replace;
      var replaceBy = formValues[field.id] || "";
      var replaceval = field.replaceVal;

      if (replaceval !== undefined) {
        replaceBy = replaceText.replace(replaceval, replaceBy);
      }
      processedCode = processedCode.replace(replaceText, replaceBy);
    }
  }

  // Process dynamic content
  if (dynamicDataToUse && Object.keys(dynamicDataToUse).length > 0) {
    for (const [variableName, value] of Object.entries(dynamicDataToUse)) {
      // Create a placeholder pattern that matches {{variableName}}
      const placeholderPattern = new RegExp(`\\{\\{${variableName}\\}\\}`, "g");

      // Replace all instances with the stringified value
      const jsonValue = JSON.stringify(value, null, 2);
      processedCode = processedCode.replace(placeholderPattern, jsonValue);
    }

    // Also add the variables as JavaScript declarations for any script that needs them
    let dynamicJsCode = "";
    for (const [variableName, value] of Object.entries(dynamicDataToUse)) {
      dynamicJsCode += `const ${variableName} = ${JSON.stringify(
        value,
        null,
        2
      )};\n\n`;
    }

    // Insert the declarations if there are no placeholders or for additional scripts
    const headClosePoint = processedCode.indexOf("</head>");
    if (headClosePoint !== -1) {
      processedCode =
        processedCode.slice(0, headClosePoint) +
        "\n<script>\n// Dynamic content configuration\n" +
        dynamicJsCode +
        "</script>\n" +
        processedCode.slice(headClosePoint);
    }
  }

  if (!isPreview) {
    const codeBlock = document.getElementById("codeBlock");
    codeBlock.value = processedCode;

    // Update Monaco editor using the external function if available
    if (window.updateEditorContent) {
      window.updateEditorContent(processedCode);
    }
  }
  
  // Use the external loadIframe function if available, otherwise fall back
  if (window.loadIframe) {
    window.loadIframe(processedCode);
  } else {
    loadIframeInternal(processedCode);
  }

  clevertap.event.push("Template Selected", {
    "TemplateName":tempName,
    "Action":"Click",
    "Label":"Apply Filter"
  });

}

// Keep a simple internal implementation as fallback
function loadIframeInternal(template) {
  // Basic fallback implementation...
  const iframe = document.getElementById("codeIframe");
  
  const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
  iframeDoc.open();
  iframeDoc.write(template || document.getElementById("codeBlock").value);
  iframeDoc.close();
}

// Update the document ready function 
document.addEventListener('DOMContentLoaded', function() {
  // Initialize float toggle functionality
  initFloatToggle();
  });
// Update the initFloatToggle function
// Update the initFloatToggle function
// Update the initFloatToggle function
function initFloatToggle() {
  const toggleBtn = document.getElementById('floatToggleBtn');
  const phonePreview = document.getElementById('phonePreview');
  
  if (!toggleBtn || !phonePreview) return;
  
  // Create simple tooltip with enhanced wording
  const tooltip = document.createElement('div');
  tooltip.className = 'float-tooltip';
  tooltip.textContent = '✨ Click to float this preview';
  phonePreview.appendChild(tooltip);
  
  // Load saved state from localStorage if available
  const isFloating = localStorage.getItem('phonePreviewFloating') === 'true';
  const hasUsedFloatFeature = localStorage.getItem('hasUsedFloatFeature') === 'true';
  
  if (isFloating) {
    phonePreview.classList.add('phone-floating');
    toggleBtn.textContent = '📍';
    toggleBtn.title = 'Dock preview';
    tooltip.style.display = 'none'; // Hide tooltip when already floating
  } else if (hasUsedFloatFeature) {
    // Hide tooltip if user has used the feature before
    tooltip.style.display = 'none';
  } else {
    toggleBtn.textContent = '📌';
    toggleBtn.title = 'Float preview';
    // Show tooltip for new users
    tooltip.style.display = 'block';
    
    // Add a timeout to hide the tooltip after some time if not interacted with
    setTimeout(() => {
      // Only hide if still showing and not yet used
      if (!localStorage.getItem('hasUsedFloatFeature') === 'true') {
        // Fade out gracefully
        tooltip.style.opacity = '0';
        tooltip.style.transform = 'translateY(-10px)';
        // Remove completely after animation completes
        setTimeout(() => {
          tooltip.style.display = 'none';
        }, 300);
      }
    }, 10000); // Hide after 10 seconds if not used
  }
  
  toggleBtn.addEventListener('click', function() {
    phonePreview.classList.toggle('phone-floating');
    
    // Hide tooltip permanently after first use
    tooltip.style.display = 'none';
    localStorage.setItem('hasUsedFloatFeature', 'true');
    
    if (phonePreview.classList.contains('phone-floating')) {
      toggleBtn.textContent = '📍';
      toggleBtn.title = 'Dock preview';
      localStorage.setItem('phonePreviewFloating', 'true');
    } else {
      toggleBtn.textContent = '📌';
      toggleBtn.title = 'Float preview';
      localStorage.setItem('phonePreviewFloating', 'false');
    }
  });
}
// // Add this after your existing initFloatToggle function

// let monacoEditor = null;

// function initMonacoEditor() {
//   // Add a loading indicator
//   const monacoContainer = document.createElement('div');
//   monacoContainer.id = 'monacoContainer';
//   monacoContainer.className = 'monaco-container';
//   // monacoContainer.innerHTML = '<div class="editor-loading">Loading code editor...</div>';
  
//   // Insert the container before the existing textarea
//   const codeBlock = document.getElementById('codeBlock');
//   codeBlock.parentNode.insertBefore(monacoContainer, codeBlock);
  
//   // Hide the original textarea
//   codeBlock.style.display = 'none';
  
//   // Wait for Monaco to load
//   require.config({ 
//     paths: { 
//       'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.39.0/min/vs' 
//     }
//   });
  
//   require(['vs/editor/editor.main'], function() {
//     // Set up editor with HTML language support and comfortable settings
//     monacoEditor = monaco.editor.create(document.getElementById('monacoContainer'), {
//       value: codeBlock.value,
//       language: 'html',
//       theme: 'vs-dark',
//       automaticLayout: true,
//       fontSize: 14,
//       lineNumbers: 'on',
//       minimap: { enabled: true },
//       scrollBeyondLastLine: false,
//       folding: true,
//       formatOnPaste: true,
//       wordWrap: 'on',
//       renderWhitespace: 'boundary',
//       bracketPairColorization: { enabled: true },
//       autoIndent: 'full',
//       scrollbar: {
//         verticalScrollbarSize: 12,
//         horizontalScrollbarSize: 12,
//         alwaysConsumeMouseWheel: false
//       }
//     });
    
//     // When the editor content changes, update the hidden textarea
//     monacoEditor.onDidChangeModelContent(function() {
//       document.getElementById('codeBlock').value = monacoEditor.getValue();
//     });
    
//     // Add extra commands for better usability
//     monacoEditor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, function() {
//       loadIframe(); // Ctrl+S to preview
//     });
    
//     // Add resize handle for better UX
//     addEditorResizeHandle(monacoContainer);
//   });
// }

// // Allow users to resize the editor height
// function addEditorResizeHandle(editorContainer) {
//   const resizeHandle = document.createElement('div');
//   resizeHandle.className = 'editor-resize-handle';
//   resizeHandle.innerHTML = '<span></span><span></span><span></span>';
//   editorContainer.parentNode.insertBefore(resizeHandle, editorContainer.nextSibling);
  
//   let startY, startHeight;
  
//   resizeHandle.addEventListener('mousedown', function(e) {
//     startY = e.clientY;
//     startHeight = parseInt(document.defaultView.getComputedStyle(editorContainer).height, 10);
//     document.documentElement.style.cursor = 'ns-resize';
    
//     document.addEventListener('mousemove', resizeMove);
//     document.addEventListener('mouseup', resizeEnd);
    
//     e.preventDefault();
//   });
  
//   function resizeMove(e) {
//     const newHeight = startHeight + e.clientY - startY;
//     if (newHeight > 200) { // Minimum height
//       editorContainer.style.height = newHeight + 'px';
//       if (monacoEditor) monacoEditor.layout();
//     }
//   }
  
//   function resizeEnd() {
//     document.documentElement.style.cursor = '';
//     document.removeEventListener('mousemove', resizeMove);
//     document.removeEventListener('mouseup', resizeEnd);
//   }
// }

// // Enhanced copy function that uses the editor if available
// function copyCode() {
//   const code = monacoEditor 
//     ? monacoEditor.getValue() 
//     : document.getElementById("codeBlock").value;
    
//   navigator.clipboard
//     .writeText(code)
//     .then(() => {
//       // Show a more elegant notification
//       showNotification("Code copied to clipboard!", "success");
//     })
//     .catch((err) => {
//       console.error("Failed to copy: ", err);
//       showNotification("Failed to copy code", "error");
//     });
// }

// // Format the code in the editor
// function formatCode() {
//   if (monacoEditor) {
//     monacoEditor.getAction('editor.action.formatDocument').run();
//     showNotification("Code formatted", "success");
//   }
// }

// // Enhanced loadIframe to use Monaco editor
// function loadIframe(template) {
//   // Get from editor if no template is provided
//   if (!template && monacoEditor) {
//     template = monacoEditor.getValue();
//   }
  
//   // Get reference to the existing iframe
//   const iframe = document.getElementById("codeIframe");
  
//   // Create a unique name to prevent caching issues
//   const uniqueName = 'iframe_' + Date.now();
  
//   // Create a new iframe element
//   const newIframe = document.createElement('iframe');
//   newIframe.id = "codeIframe";
//   newIframe.className = iframe.className;
//   newIframe.style.cssText = iframe.style.cssText;
  
//   // Replace the old iframe with the new one
//   iframe.parentNode.replaceChild(newIframe, iframe);
  
//   // Write content to the new iframe
//   const iframeDoc = newIframe.contentDocument || newIframe.contentWindow.document;
  
//   if (template) {
//     iframeDoc.open();
//     iframeDoc.write(template);
//     iframeDoc.close();
//   } else {
//     // Otherwise use what's in the code block
//     const codeBlock = document.getElementById("codeBlock");
//     iframeDoc.open();
//     iframeDoc.write(codeBlock.value);
//     iframeDoc.close();
//   }
  
//   // Show success notification
//   showNotification("Preview updated", "info");
  
//   // Rest of your existing code for iframe scaling...
//   setTimeout(() => {
//     // Calculate the scaling factor based on content size vs iframe size
//     const content = iframeDoc.body;
//     const contentWidth = content.scrollWidth;
//     const contentHeight = content.scrollHeight;
//     const frameWidth = iframe.clientWidth;
//     const frameHeight = iframe.clientHeight;
    
//     // Determine which dimension requires more scaling
//     const scaleX = frameWidth / contentWidth;
//     const scaleY = frameHeight / contentHeight;
//     const scale = Math.min(scaleX, scaleY, 1); // Don't scale up, only down
    
//     // Apply the transform
//     iframe.style.transform = `scale(${scale})`;
    
//     // If the content is smaller than the frame, center it
//     if (scale === 1) {
//       const xOffset = (frameWidth - contentWidth) / 2;
//       const yOffset = (frameHeight - contentHeight) / 2;
//       iframe.style.left = xOffset > 0 ? `${xOffset}px` : '0';
//       iframe.style.top = yOffset > 0 ? `${yOffset}px` : '0';
//     } else {
//       iframe.style.left = '0';
//       iframe.style.top = '0';
//     }
//   }, 100);
// }

// // Elegant notification system
// function showNotification(message, type = 'info') {
//   // Remove any existing notifications
//   const existingNotifications = document.querySelectorAll('.code-notification');
//   existingNotifications.forEach(notification => {
//     notification.remove();
//   });
  
//   // Create notification element
//   const notification = document.createElement('div');
//   notification.className = `code-notification ${type}`;
//   notification.innerHTML = `<span>${message}</span>`;
  
//   // Add to document
//   document.body.appendChild(notification);
  
//   // Animate in
//   setTimeout(() => {
//     notification.classList.add('show');
//   }, 10);
  
//   // Remove after delay
//   setTimeout(() => {
//     notification.classList.remove('show');
//     setTimeout(() => {
//       notification.remove();
//     }, 300);
//   }, 3000);
// }

// // Update the document ready function to initialize everything
// document.addEventListener('DOMContentLoaded', function() {
//   // Initialize float toggle functionality
//   initFloatToggle();
  
//   // Initialize Monaco Editor
//   initMonacoEditor();
  
//   // Add the editor toolbar
//   addEditorToolbar();
// });

// // Add a toolbar for the editor with useful operations
// function addEditorToolbar() {
//   const codeContainer = document.querySelector('.code-container');
//   const codeHeader = document.querySelector('.code-header');
  
//   // Clear existing header content
//   codeHeader.innerHTML = '';
  
//   // Create the new toolbar
//   const toolbarItems = [
//     { label: 'HTML Editor', type: 'title' },
//     { label: 'Format', action: 'formatCode', icon: '⚙️' },
//     { label: 'Copy', action: 'copyCode', icon: '📋' },
//     { label: 'Preview', action: 'loadIframe', icon: '👁️' }
//   ];
  
//   toolbarItems.forEach(item => {
//     if (item.type === 'title') {
//       const title = document.createElement('span');
//       title.className = 'editor-title';
//       title.textContent = item.label;
//       codeHeader.appendChild(title);
//     } else {
//       const button = document.createElement('button');
//       button.className = `${item.action}-btn editor-btn`;
//       button.innerHTML = `${item.icon} ${item.label}`;
//       button.onclick = function() {
//         window[item.action]();
//       };
//       codeHeader.appendChild(button);
//     }
//   });
// }
