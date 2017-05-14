import random from './index';

const animals = ["Dog", "Cat", "Goat", "Monkey", "Whale", "Shark", "Possum"];

function animal() {
	return random.choose(animals);
}

export default {
	animal: animal
}