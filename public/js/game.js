/* jshint esversion:6 */
function toggle(option) {
	const button = document.querySelector('button[value =' + option + ']');
	button.disabled = true;
}
