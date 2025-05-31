#pragma once

# define MAX_CLIENTS 10
# define BUFFER_SIZE 1024

# include <sys/socket.h>
# include <sys/poll.h>
# include <arpa/inet.h>
# include <netdb.h>
# include <poll.h>
# include <string.h>
# include <unistd.h>
# include <fcntl.h>
# include <iostream>
# include <stdexcept>
# include <cerrno>
# include <string>
# include <algorithm>
# include <vector>
# include <map>

# include "Client.hpp"
# include "Channel.hpp"


class Server {
    private:
        int _port;
        std::string _password;
        int _server_fd;
        std::vector<Channel *>  _channels;
        std::map<int, Client *> _clients;
        struct pollfd _poll_fds[MAX_CLIENTS];

    public:
        Server(int port, std::string password);
        virtual ~Server();

        void start();
        void action();
        void acceptClient();
        void handleClientMessage(int client_fd);
        void removeClient(int client_fd);
        void newChannel(Channel *channel);
        void send_to_me(int client_fd, std::string message_to_send);
        void send_message(int client_fd, std::string message_to_send);
        void send_to_all(int client_fd, std::string message);
        int set_info_client(int client_fd, std::string message, size_t pos, Client *client);

        int commande(int client_fd, std::string message, size_t pos, Client *client);

        Channel &channelExists(std::string name);
        
        std::map<int, Client *> getClients();

        Client * getClient(int clienfd);
        Client * getClient(std::string username);

        std::string getName();
};
