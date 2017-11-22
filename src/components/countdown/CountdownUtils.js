	// createGradient($('svg')[0],'MyGradient',[
//   {offset:'5%', 'stop-color':'#f60'},
//   {offset:'95%','stop-color':'#ff6'}
// ]);
// $('svg path').attr('fill','url(#MyGradient)');

// // svg:   the owning <svg> element
// // id:    an id="..." attribute for the gradient
// // stops: an array of objects with <stop> attributes
// function createGradient(svg,id,stops){
//   var svgNS = svg.namespaceURI;
//   var grad  = document.createElementNS(svgNS,'linearGradient');
//   grad.setAttribute('id',id);
//   for (var i=0;i<stops.length;i++){
//     var attrs = stops[i];
//     var stop = document.createElementNS(svgNS,'stop');
//     for (var attr in attrs){
//       if (attrs.hasOwnProperty(attr)) stop.setAttribute(attr,attrs[attr]);
//     }
//     grad.appendChild(stop);
//   }

//   var defs = svg.querySelector('defs') ||
//       svg.insertBefore( document.createElementNS(svgNS,'defs'), svg.firstChild);
//   return defs.appendChild(grad);

function addGradientToSvg() {

}

function getProgress(elapsedTTL, totalTTL) {
	return (totalTTL) ? parseFloat(parseFloat(elapsedTTL, 10) / parseFloat(totalTTL, 10)) : 1;	
}

function toMilis(ttl) {
	let secs = 0

	if (ttl !== 0) {
		const parts = ttl.split(':').map(part => parseInt(part, 10));

		if (parts.length === 2) {
			secs = parts[0] * 60 + parts[1];
		} else {
			secs = parts[0] * 3600 + parts[1] * 60 + parts[0];
		}
	}

	return secs * 1000;
}

export { addGradientToSvg, getProgress, toMilis };