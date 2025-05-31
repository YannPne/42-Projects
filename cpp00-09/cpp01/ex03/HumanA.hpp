#include <string>
#include "Weapon.hpp"

class HumanA {
private:
    std::string _name;
    Weapon& _weapon; 

public:
    HumanA(const std::string& name, Weapon& weapon); 
    ~HumanA();

    void attack() const; // Méthode const
    void setWeapon(const Weapon& weapon);
};
