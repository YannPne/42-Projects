#ifndef PHONE_BOOK_HPP
# define PHONE_BOOK_HPP

#include "Contact.hpp"
#include <iostream>
#include <string>

class PhoneBook
{
    private:
        Contact contacts[8];

        int pos;
    public:
        PhoneBook();
        ~PhoneBook();

        std::string write_contact(std::string mot);
        void ADD(std::string first, std::string last, std::string nick, std::string phone, std::string secret);
        void SEARCH(int id);
        void SEARCH(void);
        void EXIT();
        void help();    
};

#endif