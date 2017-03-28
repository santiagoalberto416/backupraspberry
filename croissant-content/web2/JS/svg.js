//write text
//parent : SVG element where the text will be added
//id : id of the element
//x, y : position of the element
//textAnchor : Aligment (start, middle, end)
//cssClass : css class to be assigned to the element
function writeText(parent, id, x, y, text, textAnchor, cssClass)
{
	//create element
	var t = document.createElementNS('http://www.w3.org/2000/svg', 'text'); //por que será con un NameSpace
	//id
	t.setAttribute('id', id);
	//position
	t.setAttribute('x', x); t.setAttribute('y', y);
	//text
	t.innerHTML = text;
	//text Anchor
	t.setAttribute('text-anchor', textAnchor);
	//css class
	t.setAttribute('class', cssClass);
	//add to parent
	parent.appendChild(t);
}
//draw line
//parent : SVG element where the text will be added
//id : id of the element
//x1, y1 : start position
//x2, y2 : end position
//textAnchor : Aligment (start, middle, end)
//cssClass : css class to be assigned to the element
function drawLine(parent, id, x1, y1, x2, y2, cssClass)
{
	var l = document.createElementNS('http://www.w3.org/2000/svg', 'line');
	//id
	l.setAttribute('id', id);
	//start position
	l.setAttribute('x1', x1); l.setAttribute('y1', y1);
	//end position
	l.setAttribute('x2', x2); l.setAttribute('y2', y2);
	//css class
	l.setAttribute('class', cssClass);
	//add to parent
	parent.appendChild(l);	
}
//draw rectangle
//parent : SVG element where the text will be added
//id : id of the element
//x, y : start position
//width, height : size
//cssClass : css class to be assigned to the element
function drawRect(parent, id, x, y, width, height, cssClass)
{
	//create element
	var r = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
	//id
	r.setAttribute('id', id);
	//start position
	r.setAttribute('x', x); r.setAttribute('y', y);
	//size
	r.setAttribute('width', width); r.setAttribute('height', height);
	//css class
	r.setAttribute('class', cssClass);
	//add to parent
	parent.appendChild(r);	
}