#pragma once

#include <string>

class Contact {
  private:
    std::string _firstName;
    std::string _lastName;
    std::string _nickname;
    std::string _phoneNumber;
    std::string _darkestSecret;

  public:

    Contact();
    ~Contact();
    
    std::string getFirstName(void) const;
    std::string getLastName(void) const;
    std::string getNickname(void) const;
    std::string getPhoneNumber(void) const;
    std::string getDarkestSecret(void) const;

    void setFirstName(std::string newFirstName);
    void setLastName(std::string newLastName);
    void setNickname(std::string newNickname);
    void setPhoneNumber(std::string newPhoneNumber);
    void setDarkestSecret(std::string newDarkestSecret);
};
