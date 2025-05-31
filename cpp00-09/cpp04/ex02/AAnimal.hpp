#pragma once
#include <iostream>
#include "Brain.hpp"

class AAnimal
{
protected:
    std::string _type;
public:
    AAnimal();
    AAnimal(std::string);
    virtual ~AAnimal();

    AAnimal &operator=(const AAnimal &op);

    std::string getType(void) const;

    virtual void makeSound() const = 0;
};