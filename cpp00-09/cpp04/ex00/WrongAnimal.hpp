#pragma once
#include <iostream>

class WrongAnimal
{
protected:
    std::string _type;
public:
    WrongAnimal();
    WrongAnimal(std::string);
    virtual ~WrongAnimal();

    std::string getType(void) const;

    void makeSound() const;
};