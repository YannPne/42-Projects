#include "Harl.hpp"
#include <string>

Harl::Harl()
{

}

Harl::~Harl()
{

}

void	Harl::debug() const 
{
	std::cout << "[DEBUG] - I love having extra bacon for my 7XL-double-cheese-triple-pickle-specialketchup burger. I really do !" << std::endl;
}

void	Harl::info() const 
{
	std::cout << "[INFO] - I cannot believe adding extra bacon costs more money. You didn’t put enough bacon in my burger ! If you did, I wouldn’t be asking for more !" << std::endl;
}

void	Harl::warning() const 
{
	std::cout << "[WARNING] - I think I deserve to have some extra bacon for free. I’ve been coming for years whereas you started working here since last month." << std::endl;
}

void	Harl::error() const 
{
	std::cout << "[ERROR] - This is unacceptable ! I want to speak to the manager now.";
}

void    Harl::complain(std::string level)
{
	std::string arrayLevel[4] = {"debug", "info", "warning", "error"};
	int		    i = -1;

	while (++i < 4) 
		if (arrayLevel[i] == level)
			break;

	switch (i)
	{
	    case 0:
	    	this->debug();
            break ;
	    case 1:
	    	this->info();
            break ;
	    case 2:
	    	this->warning();
            break ;
	    case 3:
	    	this->error();
	    	break ;
	}
}
