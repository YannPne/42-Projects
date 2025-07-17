#include "ClapTrap.hpp"

class ScavTrap : public ClapTrap
{
    private:
        
    public:
        void init(void);

        ScavTrap();
        ScavTrap(std::string name);
        ScavTrap(const ScavTrap &op);
        ~ScavTrap();

        ScavTrap &operator=(ScavTrap &op);

        void attack(std::string const & target);
	    void guardGate();
};
