# pragma once

# include <iostream>

class Weapon
{

private:
    std::string _type;

public:

    Weapon(std::string type);
    ~Weapon();

    void    setType(std::string type);
    std::string& getType(void);
};


