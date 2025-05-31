#include "class/IMateriaSource.hpp"
#include "cpp/AMateria.cpp"
#include "cpp/MateriaSource.cpp"
#include "cpp/Ice.cpp"
#include "cpp/Cure.cpp"
#include "cpp/Character.cpp"

int main()
{
    	IMateriaSource* src = new MateriaSource();
		src->learnMateria(new Ice());
		src->learnMateria(new Cure());

		ICharacter* me = new Character("me");

		AMateria* tmp;
		tmp = src->createMateria("ice");
		me->equip(tmp);
		tmp = src->createMateria("cure");
		me->equip(tmp);

		ICharacter* bob = new Character("bob");
		tmp = src->createMateria("ice");
		bob->equip(tmp);

		me->use(0, *bob);
		me->use(1, *bob);
		bob->use(0, *me);

		me->unequip(1);
		me->equip(NULL);
		me->equip(src->createMateria("cure"));
		me->use(1, *bob);

		ICharacter* john = new Character("john");
		me->use(0, *john);
		john->use(0, *me);

		delete bob;
		delete me;
		delete src;
}