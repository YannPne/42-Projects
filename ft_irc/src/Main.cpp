#include "../header/Server.hpp"
#include <csignal>
#include <memory>


int ft_check_port(char *str)
{
    if (atoi(str))
    {
        int number = atoi(str);
        if (!(number > 1024 && number < 40000))
            std::cerr << "Error : put port between 1024 & 40000" << std::endl, exit(EXIT_FAILURE);
    }
    else
        std::cerr << "Error : only digit for port" << std::endl, exit(EXIT_FAILURE);
    return (1);
}

void signalHandler(int signum)
{
    signum = signum;
    throw std::runtime_error("Arrêt du programme suite à un signal.");
}

int main(int argc, char **argv)
{
    std::signal(SIGINT, signalHandler);

    if (argc != 3)
        std::cerr << "Usage: ./ircserv <port> <password>" << std::endl, exit(EXIT_FAILURE);
    ft_check_port(argv[1]);
    Server server(atoi(argv[1]), argv[2]);
    try
    {
        server.start();
        return (0);
    }
    catch (const std::runtime_error& e) 
    {
        std::cerr << e.what() << std::endl;
        return EXIT_FAILURE;
    }
    catch (const std::exception& e)
    {
        std::cerr << e.what() << std::endl;
        return (1);
    }
}