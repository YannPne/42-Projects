#pragma once
#include <iostream>

class Animal
{
protected:
    std::string _type;
public:
    Animal();
    Animal(std::string);
    virtual ~Animal();

    std::string getType(void) const;

    virtual void makeSound() const;
};