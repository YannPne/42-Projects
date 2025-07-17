#include "FragTrap.hpp"
#include <iostream>

FragTrap::FragTrap()
	: ClapTrap()
{
	std::cout << "FragTrap(void) constructor called" << std::endl;
	this->hit_points = 100;
	this->energy_points = 50;
	this->attack_damage = 20;
}

FragTrap::FragTrap(std::string name)
	: ClapTrap(name)
{
	std::cout << "FragTrap(\"" << name << "\") constructor called" << std::endl;
	this->hit_points = 100;
	this->energy_points = 50;
	this->attack_damage = 20;
}

FragTrap::FragTrap(const FragTrap& other)
	: ClapTrap(other)
{
	std::cout << "FragTrap copy constructor called on " << other.name << std::endl;
}

FragTrap& FragTrap::operator=(FragTrap& rhs)
{
	ClapTrap::operator=(rhs);
	return *this;
}

FragTrap::~FragTrap()
{
	std::cout << "FragTrap destructor called for " << this->name << std::endl;
}

void FragTrap::attack(std::string const & target)
{
	std::cout << "FragTrap " << this->name;
	if (this->energy_points > 0)
	{
		this->energy_points -= 5;
		std::cout << " attacked " << target << ", causing " << this->attack_damage << " points of damage!" << std::endl;
	}
	else
		std::cout << " has too little energy points to attack." << std::endl;
}

void FragTrap::highFivesGuys()
{
	std::cout << "FragTrap " << this->name << " has entered highFivesGuys mode!" << std::endl;
}