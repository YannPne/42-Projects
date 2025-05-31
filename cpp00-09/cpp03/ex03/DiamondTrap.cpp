#include "DiamondTrap.hpp"

DiamondTrap::DiamondTrap() : ClapTrap("default_clap_name"), ScavTrap(), FragTrap(), _name("Default")
{
    std::cout << "Default constructor DiamondTrap" << std::endl;
    this->attack_damage = 30;
    this->energy_points = 50;
    this->hit_points = 100;
}

DiamondTrap::DiamondTrap(std::string name) : ClapTrap(name + "_clap_name"), ScavTrap(name), FragTrap(name)
{
	std::cout << "DiamondTrap(\"" << name << "\") constructor called" << std::endl;
    this->attack_damage = 30;
    this->energy_points = 50;
    this->hit_points = 100;
}

DiamondTrap& DiamondTrap::operator=(const DiamondTrap& rhs)
{
	ClapTrap::operator=(rhs);
	ScavTrap();
	FragTrap();
	return *this;
}

DiamondTrap::~DiamondTrap()
{
	std::cout << "DiamondTrap destructor called for " << this->_name << std::endl;
}

void DiamondTrap::attack(std::string const & target)
{
    this->FragTrap::attack(target);
}

void DiamondTrap::whoAmI()
{
    std::cout << "whoAmI(): I am DiamondTrap " << this->_name << " and my ClapTrap name is " << this->ClapTrap::name << std::endl;
}