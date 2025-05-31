#include "ClapTrap.hpp"

class FragTrap : public ClapTrap
{
    private:
        
    public:
        void init(void);

        FragTrap();
        FragTrap(std::string name);
        FragTrap(const FragTrap &op);
        ~FragTrap();

        FragTrap &operator=(FragTrap &op);

        void attack(std::string const & target);
	    void highFivesGuys(void);
};
