#include "../class/Character.hpp"
#include "../class/AMateria.hpp"

Character::Character(const std::string& name) : _name(name)
{
	for (int i = 0; i < 4; i++)
		this->_materia[i] = NULL;
}

Character::Character(const Character& other) : _name(other._name)
{
	for (int i = 0; i < 4; i++)
		this->_materia[i] = (other._materia[i]) ? other._materia[i]->clone() : NULL;
}

Character::~Character()
{
	for (int i = 0; i < 4; i++)
		if (this->_materia[i] != NULL)
			delete this->_materia[i];
}

Character& Character::operator=(Character& op)
{
	if (this != &op)
	{
		this->~Character();
		this->_name = op._name;
		for (int i = 0; i < 4; i++)
			this->_materia[i] = (op._materia[i]) ? op._materia[i]->clone() : NULL;
	}
	return *this;
}

std::string const & Character::getName(void) const
{
    return (this->_name);
}

void Character::equip(AMateria* m)
{
    if (m)
    {
        for (int i = 0; i < 4; i++)
        {
            if (!this->_materia[i])
            {
                this->_materia[i] = m; 
                return ;
            }
        }
    }
}
void Character::unequip(int idx)
{
    if (idx >= 0 && idx <= 3)
		this->_materia[idx] = NULL;
}
void Character::use(int idx, ICharacter& target)
{
    if (idx >= 0 && idx <= 3 && this->_materia[idx])
		this->_materia[idx]->use(target);
}