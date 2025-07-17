#include "PhoneBook.hpp"
#include <sstream>

void PhoneBook::ADD(std::string first, std::string last, std::string nick, std::string phone, std::string secret) 
{    
    contacts[pos % 8].setFirstName(first);
    contacts[pos % 8].setLastName(last);
    contacts[pos % 8].setNickname(nick);
    contacts[pos % 8].setPhoneNumber(phone);
    contacts[pos % 8].setDarkestSecret(secret);
    PhoneBook::pos++;
}

std::string PhoneBook::write_contact(std::string str)
{
    size_t length = str.length();

    if (length < 10)
        str.append(10 - length, ' '); 
    else if (length > 10) 
    {
        str[9] = '.';
        str.resize(10);
    }
    return (str);
}

void PhoneBook::SEARCH(int id) 
{
    std::ostringstream id_str;
    id_str << id;

    if (id > 7 || id < 0)
    {
        std::cout << std::endl << "Choisir un nombre entre 0 et 7" << std::endl;
        return ;
    }
    else if (contacts[id].getFirstName().empty())
    {
        std::cout << std::endl << "Empty contact" << std::endl;
        return ;
    }
    std::cout << "┌────────────┬────────────┬────────────┬────────────┐" << std::endl;
    std::cout << "| " << "INDEX     " << " | " <<"FIRST NAME" << " | " << "LAST NAME " << " | " << "NICKNAME  " << " | " << std::endl;
    std::cout << "├────────────┼────────────┼────────────┼────────────┤" << std::endl;
    std::cout << "| " << write_contact(id_str.str()) << " | ";
    std::cout << write_contact(contacts[id].getFirstName()) << " | ";
    std::cout << write_contact(contacts[id].getLastName()) << " | ";
    std::cout << write_contact(contacts[id].getNickname()) << " | " << std::endl;
	std::cout << "└────────────┴────────────┴────────────┴────────────┘" << std::endl;
}

void PhoneBook::SEARCH() 
{
        std::cout << "┌────────────┬────────────┬────────────┬────────────┐" << std::endl;
        std::cout << "| " << "INDEX     " << " | " <<"FIRST NAME" << " | " << "LAST NAME " << " | " << "NICKNAME  " << " | " << std::endl;
        std::cout << "├────────────┼────────────┼────────────┼────────────┤" << std::endl;
        for (int id = 0; id < 8; id++)
        {
            if (contacts[id].getFirstName().empty())
                break ;
            std::ostringstream id_str;
            id_str << id;
            std::cout << "| " << write_contact(id_str.str()) << " | ";
            std::cout << write_contact(contacts[id].getFirstName()) << " | ";
            std::cout << write_contact(contacts[id].getLastName()) << " | ";
            std::cout << write_contact(contacts[id].getNickname()) << " | " << std::endl;
        }
	    std::cout << "└────────────┴────────────┴────────────┴────────────┘" << std::endl;
}

void PhoneBook::help()
{
    //std::cout << std::endl;
    //std::cout << "📞 Welcome to Your Awesome PhoneBook 📖" << std::endl;
    std::cout << std::endl;
    std::cout << "--------------USAGE---------------" << std::endl;
    std::cout << "ADD\t: To add a contact." << std::endl;
    std::cout << "SEARCH\t: To search for a contact." << std::endl;
    std::cout << "EXIT\t: to quite the PhoneBook." << std::endl;
    std::cout << "----------------------------------" << std::endl;
    std::cout << std::endl;
}

PhoneBook::PhoneBook() : pos(0)
{
    std::cout << "PhoneBook constructor" << std::endl;
}

PhoneBook::~PhoneBook()
{
    std::cout << "PhoneBook destructor" << std::endl;
}