#include "HumanA.hpp"
#include <iostream>

HumanA::HumanA(const std::string& name, Weapon& weapon) : _name(name), _weapon(weapon) {
    std::cout << "HumanA constructor" << std::endl;
}

HumanA::~HumanA() {
    std::cout << "HumanA destructor" << std::endl;
}

void HumanA::attack() const { // Méthode const
    std::cout << _name << " attacks with their " << _weapon.getType() << std::endl;
}

void HumanA::setWeapon(const Weapon& weapon) { // Utilisation de const Weapon&
    _weapon = weapon;
}
