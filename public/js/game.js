/* jshint esversion:6 */
function toggle(helpOption) {
	const button = document.querySelector('button[value =' + helpOption + ']');
	button.disabled = true;
}
