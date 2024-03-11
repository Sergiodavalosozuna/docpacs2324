document.getElementById('increase').addEventListener('click', function() {
	let currentSize = parseFloat(window.getComputedStyle(document.getElementById('text')).fontSize);
	document.getElementById('text').style.fontSize = (currentSize + 1.2) + 'px';
  });
  
  document.getElementById('decrease').addEventListener('click', function() {
	let currentSize = parseFloat(window.getComputedStyle(document.getElementById('text')).fontSize);
	if (currentSize > 2) {
	  document.getElementById('text').style.fontSize = (currentSize - 1.2) + 'px';
	}
  });

  let increaseButton = document.getElementById('increase');
  increaseButton.addEventListener('click', function() {
	let currentSize = parseFloat(window.getComputedStyle(document.getElementById('text')).fontSize);
	document.getElementById('text').style.fontSize = (currentSize + 1.2) + 'px';
  });