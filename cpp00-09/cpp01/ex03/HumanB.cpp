# include "HumanB.hpp"


HumanB::HumanB(std::string name) : _name(name) 
{
    std::cout << "HumanB contructor" << std::endl;
}

HumanB::~HumanB()
{
    std::cout << "HumanB destructor" << std::endl;
}

void HumanB::setWeapon(Weapon& weapon) { _weapon = &weapon; }

void HumanB::attack(void) 
{
    std::cout << this->_name << " attacks with their ";
    if (this->_weapon != NULL)
        std::cout << this->_weapon->getType();
    std::cout << std::endl;
}
