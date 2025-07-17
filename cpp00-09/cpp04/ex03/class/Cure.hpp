#include "AMateria.hpp"


class Cure  : public AMateria
{
    public:
        Cure();
        Cure(const Cure& other);
        ~Cure();
        
    	Cure& operator=(const Cure& rhs);

        AMateria* clone() const;
        void use(ICharacter& target);
};
