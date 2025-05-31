#include "PhoneBook.cpp"
#include "Contact.cpp"
#include <cstring>


std::string read_input()
{
    std::string input;

    while (!(std::cin >> input)) 
    {
        std::cin.clear();
        std::cout << "Invalid input";
    }
    return (input.c_str());
}

void new_contact(PhoneBook *book)
{

    std::cout << "Last name : " << std::flush;
    std::string last_name(read_input());

    std::cout << "first name : " << std::flush;
    std::string first_name(read_input());
    
    std::cout << "nickname : " << std::flush;
    std::string nickname(read_input());

    std::cout << "phone number : " << std::flush;
    std::string phone(read_input());

    std::cout << "Darkest secret : " << std::flush;
    std::string secret(read_input());

    book->ADD(last_name, first_name, nickname, phone, secret);
}

int main(void)
{
    PhoneBook book;
    const char *input;
    bool loop = true;

    book.help();
    while (loop)
    {
        input = read_input().c_str();
        if (!strcmp(input, "ADD"))
            new_contact(&book);
        else if (!strcmp(input, "SEARCH"))
        {
            book.SEARCH();
            std::cout << "ID : ";
            try
            {
				std::istringstream iss(read_input());
				int num;
				iss >> num;
				book.SEARCH(num);
            }
            catch(const std::exception& e)
            {
                std::cout << std::endl << "Choisir un nombre entre 0 et 7" << std::endl;
            }
        }
        else if (!strcmp(input, "EXIT"))
            loop = false;
        else
            std::cout << std::endl << "COMMANDE NOT FOUND" << std::endl;

        std::cout << std::endl;
        book.help();
        std::cout << std::endl;
    }

    return (0);
}