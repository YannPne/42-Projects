# include "Weapon.hpp"

Weapon::Weapon(std::string type) : _type(type)
{
    std::cout << "Weapon constructor" << std::endl;
}

Weapon::~Weapon()
{
    std::cout << "Weapon destructor" << std::endl;
}

void        Weapon::setType(std::string type) { _type = type; }

std::string& Weapon::getType(void) { return (_type); }

