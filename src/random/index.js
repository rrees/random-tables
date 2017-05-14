
function selectFrom(upperLimit) {
	return Math.floor(Math.random() * upperLimit);
}

function choose(array) {
	return array[selectFrom(array.length)]
}

function animal() {

	const animals = ["Dog", "Cat", "Goat"];

	return choose(animals);
}

export default {
	animal: animal
}