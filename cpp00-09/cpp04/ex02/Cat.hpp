#include "AAnimal.hpp"

class Cat : public AAnimal
{
private:
    Brain *_brain;
public:
    Cat();
    ~Cat();

    Cat &operator=(const Cat&op);

    void makeSound(void) const;

    std::string getType() const;
};
