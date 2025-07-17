#include "AAnimal.hpp"

class Dog : public AAnimal
{
private:
    Brain *_brain;
public:
    Dog();
    ~Dog();

    Dog &operator=(const Dog&op);

    void makeSound(void) const;

};
