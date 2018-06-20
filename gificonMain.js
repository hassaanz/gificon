document.head = document.head || document.getElementsByTagName('head')[0];

function clearNode(node) {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
}

function removeDragData(ev) {
  if (ev.dataTransfer.items) {
    // Use DataTransferItemList interface to remove the drag data
    ev.dataTransfer.items.clear();
  } else {
    // Use DataTransfer interface to remove the drag data
    ev.dataTransfer.clearData();
  }
}


function changeFavicon(src) {
  const link = document.createElement('link');
  const oldLink = document.getElementById('dynamic-favicon');
  link.id = 'dynamic-favicon';
  link.rel = 'shortcut icon';
  link.type = 'image/png';
  link.href = src;
  if (oldLink) {
    document.head.removeChild(oldLink);
  }
  document.head.appendChild(link);
}

function onReady() {
  function onImageChange(ev, image) {
    if ((!this && !this.files.length) && !image) {
      return;
    }
    let playing = false;
    const previewContainer = document.querySelector('.file-preview');
    const uploaded = ev ? ev.target.files[0] : image;
    if (!uploaded) {
      return;
    }
    const uploadedURL = window.URL.createObjectURL(uploaded);
    const imgPreview = document.createDocumentFragment();
    const img = document.createElement('img');
    img.src = uploadedURL;
    clearNode(previewContainer);
    imgPreview.appendChild(img);
    previewContainer.appendChild(imgPreview);

    const rub = new SuperGif({
      gif: img,
      loop_mode: true,
      auto_play: false,
      progressbar_height: 0,
      max_width: 200,
    });
    console.log(rub);
    rub.pause();
    rub.load(function onGifLoad(imgEl, cvs) {
      function step() {
        if (!previewContainer.children.length) {
          playing =  false;
        }
        rub.move_relative(1);
        const canvasScreenshotURI = canvas.toDataURL();
        changeFavicon(canvasScreenshotURI);
        if (playing) {
          window.requestAnimationFrame(step);
        }
      }
      const canvas = rub.get_canvas();
      // PLay / Pause GIF on click
      canvas.addEventListener('click', () => {
        playing = !playing;
        if (playing) {
          rub.play();
          step();
        } else {
          rub.pause();
        }
      });
      const canvasScreenshotURI = canvas.toDataURL();
      changeFavicon(canvasScreenshotURI);

      if (playing) {
        window.requestAnimationFrame(step);
      }
    });
  }

  function getFilesFromDrop(ev) {
    const files = [];
    if (!ev.dataTransfer.items) {
      // Use DataTransfer interface to access the file(s)
      return ev.dataTransfer.files;
    }
    // Use DataTransferItemList interface to access the file(s)
    for (var i = 0; i < ev.dataTransfer.items.length; i++) {
      // If dropped items aren't files, reject them
      if (ev.dataTransfer.items[i].kind === 'file') {
        var file = ev.dataTransfer.items[i].getAsFile();
        files.push(file);
      }
    }
    return files;
  }

  setTimeout(() => {
    const previewContainer = document.querySelector('.file-preview');
    const fileUploader = document.querySelector('input#gificon');
    const clearButton = document.querySelector('.clear-button');
    clearButton.addEventListener('click', () => clearNode(previewContainer), false);
    if (!previewContainer || !fileUploader) {
      return;
    }
    const defaultStyle = previewContainer.style;
    function onDragEnter() {
      previewContainer.style.opacity = 0.7;
      previewContainer.style.backgroundColor = '#ccc';
      previewContainer.style.border = 'dashed';
    }
    function onDragLeave() {
      previewContainer.style = defaultStyle;
    }
    function onDrop(ev) {
      ev.preventDefault();
      const files = getFilesFromDrop(ev);
      console.log(files);
      const filteredFiles = files.filter(file => file.type === 'image/gif');
      // Pass event to removeDragData for cleanup
      removeDragData(ev)
      previewContainer.style = defaultStyle;
      if (filteredFiles.length) {
        // set first gif as input field value
        onImageChange.call(null, null, filteredFiles[0]);
      }
    }
    previewContainer.addEventListener('dragenter', onDragEnter, false);
    previewContainer.addEventListener('dragleave', onDragLeave, false);
    previewContainer.addEventListener('drop', onDrop, false);
    previewContainer.ondragover = (ev) => {
      ev.preventDefault();
    }
    // previewContainer.addEventListener('dragover', onDrop, false);

    previewContainer.addEventListener('click', () => {
      if (fileUploader && !previewContainer.children.length) {
        fileUploader.click();
      }
    }, false);
    if (fileUploader) {
      fileUploader.addEventListener('change', onImageChange);
    }
  }, 200);

}

window.onload = onReady();
