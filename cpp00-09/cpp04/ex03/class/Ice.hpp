#include "AMateria.hpp"

class Ice : public AMateria
{ 
    public:
        Ice();
        Ice(const Ice& other);
        ~Ice();
        
    	Ice& operator=(const Ice& rhs);

        AMateria* clone() const;
        void use(ICharacter& target);
};
