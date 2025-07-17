# include <iostream>
# include "Weapon.cpp"
# include "HumanA.cpp"
# include "HumanB.cpp"


int main(void)
{
		Weapon arme = Weapon("bat");
		HumanA bob = HumanA("Bob", arme);

		bob.attack();
		arme.setType("cut");
		bob.attack();

		Weapon club = Weapon("Axe");
		HumanB jim("Jim");

		jim.setWeapon(club);
		jim.attack();
		club.setType("Pickaxe");
		jim.attack();
}