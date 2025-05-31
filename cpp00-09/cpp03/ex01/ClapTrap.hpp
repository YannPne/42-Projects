#pragma once
#include <iostream>

class ClapTrap
{
    protected:
        std::string name;
        int hit_points;
        int energy_points;
        int attack_damage;

    public:
        ClapTrap();
        ClapTrap(std::string);
        ~ClapTrap();
        ClapTrap & operator=(const ClapTrap &op);
        void attack(const std::string& target);
        void takeDamage(unsigned int amount);
        void beRepaired(unsigned int amount);
};
