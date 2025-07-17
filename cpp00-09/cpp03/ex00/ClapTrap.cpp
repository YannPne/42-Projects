#include "ClapTrap.hpp"

ClapTrap::ClapTrap(std::string name) : name(name) ,hit_points(10), energy_points(10), attack_damage(0)
{
    std::cout << "Constructor call" << std::endl;
}

ClapTrap::~ClapTrap()
{
    std::cout << "Destructor call" << std::endl;
}

ClapTrap & ClapTrap::operator=(const ClapTrap &op)
{
    std::cout << "ClapTrap copy constructor called on " << op.name << std::endl;
    if (&op == this)
        return *this;
    this->name = op.name;
    this->attack_damage = op.attack_damage;
    this->energy_points = op.energy_points;
    this->hit_points = op.hit_points;
    return (*this);
}

void ClapTrap::attack(const std::string& target)
{
    if (energy_points <= 0)
        return ;
    std::cout << "ClapTrap " << this->name;
    std::cout << " attacks " << target;
    std::cout <<  " causing " << this->attack_damage << " points of damage!" << std::endl;
    this->energy_points--;
}

void ClapTrap::takeDamage(unsigned int amount)
{
    std::cout << "ClapTrap " << this->name;
    std::cout << " take Damage : " << amount;
    this->hit_points -= amount;
    std::cout << " (" << this->hit_points << " left)"  << " !" << std::endl;
}
void ClapTrap::beRepaired(unsigned int amount)
{
    if (energy_points <= 0)
        return ;
    std::cout << "ClapTrap " << this->name;
    std::cout << " be Repaired : " << amount;
    this->hit_points += amount;
    std::cout << " (" << this->hit_points << " left)"  << " !" << std::endl;
    this->energy_points--;
}