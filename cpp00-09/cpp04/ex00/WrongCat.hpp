#include "WrongAnimal.hpp"

class WrongCat : public WrongAnimal
{
private:
    
public:
    WrongCat();
    ~WrongCat();

    void makeSound(void) const;

    std::string getType() const;
};
