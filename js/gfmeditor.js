// editor instance
var editor = new MiniEditor('.ss');
editor.build();

// variables
var x = document.querySelector('.multiline-editor');
var y = document.querySelector('.preview');
var editBtn = document.querySelector('.edit-btn');
var previewBtn = document.querySelector('.preview-btn');
var stat = document.querySelector('.editor-status-bar');

// functions
stat.children[0].innerText = `lines: 1`;
editor.editable_area.addEventListener('input',function(){
	stat.children[0].innerText = `lines: ${editor.lines()}`;
})
document.querySelector('#Indent-mode').onchange = function(){
	if(this.value == "Tabs"){
		//enable tab spaces
		editor.editable_area.onkeydown = function(e){
			if(e.keyCode == 9 || e.which == 9){
				e.preventDefault()
				var s = this.selectionStart;
				this.value = this.value.substring(0, this.selectionStart) + "\t" + this.value.substring(this.selectionEnd)
				this.selectionEnd = s+1;
			}
		}
	}else{
		editor.editable_area.onkeydown = function(e){
			// allow default behaviour
		}
	}
}
document.querySelector('#Indent-size').onchange = function(){
	editor.editable_area.style.tabSize = this.value;
	editor.editable_area.style.MozTabSize = this.value;
}


editBtn.onclick = function(){
	x.style.display = "block";
	y.style.display = "none";
	this.classList.add("active");
	previewBtn.classList.remove("active");
}
previewBtn.onclick = function(){
	x.style.display = "none";
	y.style.display = "block";
	this.classList.add("active");
	editBtn.classList.remove("active");
	y.innerHTML = "<div class='flex-layout'><span class='loader'></span><span class='loader-text'>loading...</span></div>";
	getHTMLCode(editor.editable_area);
}
editBtn.click();
function getHTMLCode(element){
	var content = element.value;
	fetch("https://api.github.com/markdown", {
		method: "POST",
		body: JSON.stringify({
			"text":content
		}),
		headers: {
			"Content-type": "application/json; charset=UTF-8",
			"Accept": "application/vnd.github.v3+json"
		}
	})
	.then(res => res.text())
	.then(ctx => {
		if(ctx == "") {
			y.innerHTML = "<div class='flex-layout secondary'><p>Nothing to preview</p></div>";
		}else {
			y.innerHTML = ctx;
		}
	})
	.catch(e => {
		y.innerHTML = "<div class='flex-layout secondary'><p>Unable preview content, <a href='#' onclick='previewBtn.click()'>try again</a></p></div>";
		
	})
}
document.querySelector('.download-btn').onclick = function(){
	modal.style.display = "block";
}

// modal box 
var modal = document.querySelector('.modal');
function closeModal(){
	modal.style.display = "none";
}
window.onclick = function(e){
	if(e.target == modal){
		modal.style.display = "none";
	}
}
document.querySelector('.modal .primary').onclick = function(){
	var value = document.querySelector('.modal input').value;
	console.log(value);
	if (value !== ""){
		var a = document.createElement('a');
		var blob = new Blob([editor.editable_area.value],{
			type: MimeType
		});
		var url = URL.createObjectURL(blob);
		a.setAttribute('href',url);
		a.setAttribute('download', value);
		modal.style.display = "none";
		a.click();
	}
}