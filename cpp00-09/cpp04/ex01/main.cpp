#include "Animal.cpp"
#include "Cat.cpp"
#include "Dog.cpp"


int main()
{
	const Animal *tab[20];

	for (int i = 0; i < 20; i++)
		i < 10 ? tab[i] = new Dog() : tab[i] = new Cat();
	for (int i = 0; i < 20; i++)
		delete (tab[i]);

	return (0);
}