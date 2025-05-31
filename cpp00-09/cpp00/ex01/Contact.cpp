#include "Contact.hpp"
#include "iostream"

std::string Contact::getFirstName(void) const { return (_firstName); }

std::string Contact::getLastName(void) const { return (_lastName); }

std::string Contact::getNickname(void) const { return (_nickname); }

std::string Contact::getPhoneNumber(void) const { return (_phoneNumber); }

std::string Contact::getDarkestSecret(void) const { return (_darkestSecret); }

void Contact::setFirstName(std::string newFirstName) { _firstName = newFirstName; }

void Contact::setLastName(std::string newLastName) { _lastName = newLastName; }

void Contact::setNickname(std::string newNickname) { _nickname = newNickname; }

void Contact::setPhoneNumber(std::string newPhoneNumber) { _phoneNumber = newPhoneNumber; }

void Contact::setDarkestSecret(std::string newDarkestSecret) { _darkestSecret = newDarkestSecret; }

Contact::Contact()
{
    std::cout << "Contact constructor" << std::endl;
}

Contact::~Contact()
{
    std::cout << "Contact destructor" << std::endl;
}