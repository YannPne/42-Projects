#include "ICharacter.hpp"


class Character : public ICharacter
{
    private:
        std::string _name;
	    AMateria* _materia[4];
    public:
        Character(const std::string& name);
	    Character(const Character& other);
        ~Character();

        Character & operator=(Character & op);

        std::string const & getName(void) const;
        void equip(AMateria* m);
        void unequip(int idx);
        void use(int idx, ICharacter& target);
};
