#pragma once
#include <iostream>
#include "Brain.hpp"


class Animal
{
protected:
    std::string _type;
public:
    Animal();
    Animal(std::string);
    virtual ~Animal();

    Animal &operator=(const Animal &op);

    std::string getType(void) const;

    virtual void makeSound() const;
};