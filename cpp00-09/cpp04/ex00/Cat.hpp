#include "Animal.hpp"

class Cat : public Animal
{
private:

public:
    Cat();
    ~Cat();

    void makeSound(void) const;

    std::string getType() const;
};
