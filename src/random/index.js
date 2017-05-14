import animals from './animals';

function selectFrom(upperLimit) {
	return Math.floor(Math.random() * upperLimit);
}

function choose(array) {
	return array[selectFrom(array.length)]
}

export default {
	choose: choose,
	animal: animals.animal
}