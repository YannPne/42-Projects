#include "Animal.hpp"

class Dog : public Animal
{
private:
    Brain *_brain;
public:
    Dog();
    ~Dog();

    Dog &operator=(const Dog&op);

    void makeSound(void) const;

};
