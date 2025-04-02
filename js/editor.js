/**
 * Monaco Editor implementation for Template Showcase
 * This file handles all code editor functionality
 */

let monacoEditor = null;

/**
 * Initialize the Monaco editor
 */
function initMonacoEditor() {
  // Create the container for Monaco editor
  const monacoContainer = document.createElement('div');
  monacoContainer.id = 'monacoContainer';
  monacoContainer.className = 'monaco-container';
  monacoContainer.innerHTML = '<div class="editor-loading">Loading code editor...</div>';
  
  // Find the textarea to replace
  const codeBlock = document.getElementById('codeBlock');
  if (!codeBlock) {
    console.error('Could not find code block element');
    return;
  }
  
  // Insert the container before the existing textarea
  codeBlock.parentNode.insertBefore(monacoContainer, codeBlock);
  
  // Hide the original textarea
  codeBlock.style.display = 'none';
  
  // Configure RequireJS for Monaco
  require.config({ 
    paths: { 
      'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.39.0/min/vs' 
    }
  });
  
  // Load Monaco editor
  require(['vs/editor/editor.main'], function() {
    // Clear loading indicator first
    monacoContainer.innerHTML = '';
    
    // Create the editor with appropriate settings
    monacoEditor = monaco.editor.create(document.getElementById('monacoContainer'), {
      value: codeBlock.value,
      language: 'html',
      theme: 'vs-dark',
      automaticLayout: true,
      fontSize: 14,
      lineNumbers: 'on',
      minimap: { enabled: true },
      scrollBeyondLastLine: false,
      folding: true,
      formatOnPaste: true,
      wordWrap: 'on',
      renderWhitespace: 'boundary',
      bracketPairColorization: { enabled: true },
      autoIndent: 'full',
      scrollbar: {
        verticalScrollbarSize: 12,
        horizontalScrollbarSize: 12,
        alwaysConsumeMouseWheel: false
      }
    });
    
    // Sync editor content back to textarea for compatibility
    monacoEditor.onDidChangeModelContent(function() {
      document.getElementById('codeBlock').value = monacoEditor.getValue();
    });
    
    // Add keyboard shortcuts
    monacoEditor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, function() {
      loadIframe(); // Ctrl+S to preview
    });
    
    // Toggle immersive mode with Ctrl+Shift+F
    monacoEditor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyF, function() {
      toggleImmersiveMode();
    });
    
    // Add resize handle
    addEditorResizeHandle(monacoContainer);
    
    // Add toolbar
    addEditorToolbar();
  });
}

/**
 * Add resize handle to the editor container
 * @param {HTMLElement} editorContainer - The container element
 */
function addEditorResizeHandle(editorContainer) {
  const resizeHandle = document.createElement('div');
  resizeHandle.className = 'editor-resize-handle';
  resizeHandle.innerHTML = '<span></span><span></span><span></span>';
  editorContainer.parentNode.insertBefore(resizeHandle, editorContainer.nextSibling);
  
  let startY, startHeight;
  
  resizeHandle.addEventListener('mousedown', function(e) {
    startY = e.clientY;
    startHeight = parseInt(document.defaultView.getComputedStyle(editorContainer).height, 10);
    document.documentElement.style.cursor = 'ns-resize';
    
    document.addEventListener('mousemove', resizeMove);
    document.addEventListener('mouseup', resizeEnd);
    
    e.preventDefault();
  });
  
  function resizeMove(e) {
    const newHeight = startHeight + e.clientY - startY;
    if (newHeight > 200) { // Minimum height
      editorContainer.style.height = newHeight + 'px';
      if (monacoEditor) monacoEditor.layout();
    }
  }
  
  function resizeEnd() {
    document.documentElement.style.cursor = '';
    document.removeEventListener('mousemove', resizeMove);
    document.removeEventListener('mouseup', resizeEnd);
  }
}

/**
 * Add custom toolbar for the editor
 */
function addEditorToolbar() {
    const codeHeader = document.querySelector('.code-header');
    if (!codeHeader) return;
    
    // Clear existing header content
    codeHeader.innerHTML = '';
    
    // Create the new toolbar with better icon
    const toolbarItems = [
      { label: 'HTML Editor', type: 'title' },
      { label: 'Format', action: 'formatCode', icon: '⚙️' },
      { label: 'Copy', action: 'copyCode', icon: '📋' },
      { label: 'Preview', action: 'loadIframe', icon: '👁️' },
      { label: 'Fullscreen', action: 'toggleImmersiveMode', icon: '⛶' }, // Changed icon to fullscreen symbol
      { label: 'Shortcuts', action: 'showKeyboardShortcuts', icon: '⌨️' }
    ];
    
    toolbarItems.forEach(item => {
      if (item.type === 'title') {
        const title = document.createElement('span');
        title.className = 'editor-title';
        title.textContent = item.label;
        codeHeader.appendChild(title);
      } else {
        const button = document.createElement('button');
        button.className = `${item.action}-btn editor-btn`;
        button.innerHTML = `${item.icon} ${item.label}`;
        button.onclick = function() {
          window[item.action]();
        };
        codeHeader.appendChild(button);
      }
    });
  }

/**
 * Format code in the editor
 */
function formatCode() {
  if (monacoEditor) {
    monacoEditor.getAction('editor.action.formatDocument').run();
    showNotification("Code formatted", "success");
  }
}

/**
 * Copy code to clipboard
 */
function copyCode() {
  const code = monacoEditor 
    ? monacoEditor.getValue() 
    : document.getElementById("codeBlock").value;
    
  navigator.clipboard
    .writeText(code)
    .then(() => {
      showNotification("Code copied to clipboard!", "success");
    })
    .catch((err) => {
      console.error("Failed to copy: ", err);
      showNotification("Failed to copy code", "error");
    });
}

/**
 * Toggle immersive mode for the editor
 */
function toggleImmersiveMode() {
    const monacoContainer = document.getElementById('monacoContainer');
    const codeContainer = document.querySelector('.code-container');
    const body = document.body;
    const immersiveBtn = document.querySelector('.toggleImmersiveMode-btn');
    
    if (codeContainer.classList.contains('immersive-mode')) {
      // Exit immersive mode
      codeContainer.classList.remove('immersive-mode');
      body.classList.remove('editor-immersive');
      
      // Restore original height
      monacoContainer.style.height = localStorage.getItem('editorHeight') || '400px';
      
      // Update button text and icon
      if (immersiveBtn) {
        immersiveBtn.innerHTML = '⛶ Fullscreen';
      }
      
      // Update editor layout after size change
      if (monacoEditor) {
        setTimeout(() => {
          monacoEditor.layout();
        }, 300);
      }
      
      showNotification("Exited fullscreen mode", "info");
    } else {
      // Enter immersive mode
      
      // Store current height to restore later
      localStorage.setItem('editorHeight', monacoContainer.style.height || '400px');
      
      codeContainer.classList.add('immersive-mode');
      body.classList.add('editor-immersive');
      
      // Update button text and icon
      if (immersiveBtn) {
        immersiveBtn.innerHTML = '⮌ Exit Fullscreen';
      }
      
      // Recalculate editor dimensions
      if (monacoEditor) {
        setTimeout(() => {
          monacoEditor.layout();
        }, 300); // Wait for transition to complete
      }
      
      showNotification("Entered fullscreen mode - press ESC to exit", "success");
    }
  }

/**
 * Show keyboard shortcuts dialog
 */
function showKeyboardShortcuts() {
  const shortcuts = [
    { key: 'Ctrl+S', action: 'Preview code in iframe' },
    { key: 'Ctrl+Shift+F', action: 'Toggle immersive mode' },
    { key: 'ESC', action: 'Exit immersive mode' },
    { key: 'Ctrl+F', action: 'Find in editor' },
    { key: 'Alt+F1', action: 'Show editor commands' }
  ];
  
  let shortcutsHTML = '<div class="shortcuts-container">';
  shortcutsHTML += '<h3>Keyboard Shortcuts</h3>';
  shortcutsHTML += '<table class="shortcuts-table">';
  shortcutsHTML += '<tr><th>Shortcut</th><th>Action</th></tr>';
  
  shortcuts.forEach(shortcut => {
    shortcutsHTML += `<tr><td><kbd>${shortcut.key}</kbd></td><td>${shortcut.action}</td></tr>`;
  });
  
  shortcutsHTML += '</table></div>';
  
  // Create modal-like display
  const modal = document.createElement('div');
  modal.className = 'shortcuts-modal';
  modal.innerHTML = shortcutsHTML;
  
  // Add close button
  const closeBtn = document.createElement('button');
  closeBtn.className = 'shortcuts-close-btn';
  closeBtn.textContent = '×';
  closeBtn.onclick = function() {
    modal.remove();
  };
  modal.querySelector('.shortcuts-container').appendChild(closeBtn);
  
  // Add to body
  document.body.appendChild(modal);
  
  // Close on click outside
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      modal.remove();
    }
  });
  
  // Close on ESC
  document.addEventListener('keydown', function closeOnEsc(e) {
    if (e.key === 'Escape') {
      modal.remove();
      document.removeEventListener('keydown', closeOnEsc);
    }
  });
}

/**
 * Display notification
 * @param {string} message - The notification message
 * @param {string} type - The notification type (success, error, info)
 */
function showNotification(message, type = 'info') {
  // Remove any existing notifications
  const existingNotifications = document.querySelectorAll('.code-notification');
  existingNotifications.forEach(notification => {
    notification.remove();
  });
  
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `code-notification ${type}`;
  notification.innerHTML = `<span>${message}</span>`;
  
  // Add to document
  document.body.appendChild(notification);
  
  // Animate in
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  
  // Remove after delay
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}

/**
 * Update editor with new content
 * @param {string} code - The code to set in the editor
 */
function updateEditorContent(code) {
  if (monacoEditor) {
    monacoEditor.setValue(code);
  }
}

/**
 * Get the current editor content
 * @returns {string} The current editor content
 */
function getEditorContent() {
  return monacoEditor ? monacoEditor.getValue() : document.getElementById("codeBlock").value;
}

/**
 * Enhanced loadIframe using editor content
 * @param {string} template - Optional template to load
 */
function loadIframe(template) {
  // Get from editor if no template is provided
  if (!template && monacoEditor) {
    template = monacoEditor.getValue();
  }
  
  // Get reference to the existing iframe
  const iframe = document.getElementById("codeIframe");
  if (!iframe) return;
  
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
  
  // Show success notification
  showNotification("Preview updated", "info");
  
  // Scale the content
  setTimeout(() => {
    scaleIframeContent(newIframe, iframeDoc);
  }, 100);
}

/**
 * Scale iframe content to fit within its container
 * @param {HTMLElement} iframe - The iframe element
 * @param {Document} iframeDoc - The iframe document
 */
function scaleIframeContent(iframe, iframeDoc) {
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
}

// Initialize event listeners
document.addEventListener('DOMContentLoaded', function() {
  // Initialize Monaco Editor
  initMonacoEditor();
  
  // Add keyboard shortcut to exit immersive mode
  document.addEventListener('keydown', function(e) {
    const codeContainer = document.querySelector('.code-container');
    
    // ESC key to exit immersive mode
    if (e.key === 'Escape' && codeContainer && codeContainer.classList.contains('immersive-mode')) {
      toggleImmersiveMode();
    }
  });
});

// Export functions for use in other files
window.monacoEditor = monacoEditor;
window.formatCode = formatCode;
window.copyCode = copyCode;
window.loadIframe = loadIframe;
window.toggleImmersiveMode = toggleImmersiveMode;
window.showKeyboardShortcuts = showKeyboardShortcuts;
window.updateEditorContent = updateEditorContent;
window.getEditorContent = getEditorContent;