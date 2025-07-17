#include <iostream>

class Brain
{
private:
    std::string ideas[100];
public:
    Brain();
    ~Brain();

    Brain &operator=(const Brain &op);
};

Brain &Brain::operator=(const Brain &op)
{
    if (&op == this)
        return *this;
    for (int i = 0; i < 100; i++)
        this->ideas[i] = op.ideas[i];
    return (*this);
}

Brain::Brain()
{
}

Brain::~Brain()
{
}
