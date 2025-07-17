#include "../header/Server.hpp"


Server::Server(int port, std::string password) : _port(port), _password(password)
{
    _server_fd = socket(AF_INET, SOCK_STREAM, 0);
    if (_server_fd < 0)
    {
        std::cerr << "Error : create server socket" << std::endl;
        exit(EXIT_FAILURE);
    }

    struct sockaddr_in server_addr;
    memset(&server_addr, 0, sizeof(server_addr));
    server_addr.sin_family = AF_INET;
    server_addr.sin_addr.s_addr = INADDR_ANY;
    server_addr.sin_port = htons(_port);

    int opt = 1;
    if (setsockopt(_server_fd, SOL_SOCKET, SO_REUSEADDR, &opt, sizeof(opt)) < 0)
    {
        std::cerr << "Erreur : setsockopt a échoué." << std::endl;
        exit(EXIT_FAILURE);
    }


    /* bind sur _server_fd au prealablement ladresse de sockaddr_in structure de la lib <sys/socket.h> pour bind lui aussi le port ladresse ipv4 et le reseau sur sockaddr_in
    pour finalement bind  &server_addr avec sockaddr pour mettre en route le socket*/
    if (bind(_server_fd, (struct sockaddr*)&server_addr, sizeof(server_addr)) < 0)
    {
        close(_server_fd);
        std::cerr << "Error : bind adrr" << std::endl;
        exit(EXIT_FAILURE);
    }
    if (listen(_server_fd, MAX_CLIENTS) < 0) 
    {
        close(_server_fd);
        std::cerr << "Error : listen" << std::endl;
        exit(EXIT_FAILURE);
    }
    _poll_fds[0].fd = _server_fd;
    _poll_fds[0].events = POLLIN;
    for (int i = 1; i < MAX_CLIENTS; ++i)
        _poll_fds[i].fd = -1;
    for (int i = 1; i < MAX_CLIENTS; ++i)
        _poll_fds[i].events = -1;
    for (int i = 1; i < MAX_CLIENTS; ++i)
        _poll_fds[i].revents = -1;
}

Server::~Server()
{
    close(_server_fd);
    for (std::map<int, Client *>::iterator it = _clients.begin(); it != _clients.end(); ++it)
        delete it->second;
    _clients.clear();
    for (size_t i = 0; i < _channels.size(); ++i)
        delete _channels[i];
    _channels.clear();
}

// revents : keski c passer wtf
// event : event a ecouter
// POLLIN or PULLOUT or PULLERR : verif pour le event ou reevents
// _poll_fds[i].fd tableau de nos clients 
void Server::start()
{
    std::cout << "Serveur started on : " << _port << std::endl;
    
    while (true)
    {
        int poll_count = poll(_poll_fds, MAX_CLIENTS, -1);
        if (poll_count < 0)
        {
            std::cerr << "Error : poll failed :(" << std::endl;
            exit(EXIT_FAILURE);
        }
        for (int i = 0; i < MAX_CLIENTS; i++)
        {
            if (_poll_fds[i].revents & POLLIN)
            {
                if (_poll_fds[i].fd == _server_fd)
                    acceptClient();
                else
                    handleClientMessage(_poll_fds[i].fd);
            } 
        }
    }
}

void Server::acceptClient()
{
    int client_fd = accept(_server_fd, NULL, NULL);
    if (client_fd < 0)
    {
        std::cerr << "Error: accept failed" << std::endl;
        exit(EXIT_FAILURE);
    }
    for (int i = 1; i < MAX_CLIENTS; i++)
    {
        if (_poll_fds[i].fd == -1)
        {
            _poll_fds[i].fd = client_fd;
            _poll_fds[i].events = POLLIN;
            std::cout << "Client added to poll_fds" << std::endl;
            break ;
        }
    }
    Client *client = new Client;
    this->_clients[client_fd] = client;
    std::cout << "Client connected fd : " << client_fd << std::endl;
    send(client_fd, "Server password : ", 18, 0);
    client->setFD(client_fd);
}

int Server::commande(int client_fd, std::string message, size_t pos, Client *client)
{
    if (this->getClient(client_fd)->hasPermission()) 
    {
        if (message.substr(0, pos) == "KICK")
            return (client->getChannel()->kick(*this, client_fd, message.substr(pos + 1)), 1);
        if (message.substr(0, pos) == "INVITE")
            return (client->getChannel()->invite(*this, client_fd, message.substr(pos + 1)), 1);
        if (message.substr(0, pos) == "MODE")
            return (client->getChannel()->mode(*this, client_fd, message.substr(pos + 1)), 1);
    }
    if (message.substr(0, pos) == "TOPIC")
            return (client->getChannel()->topic(*this, client_fd, message.substr(pos + 1)), 1);
    return (0);
}

void Server::send_to_me(int client_fd, std::string message_to_send)
{
    send(client_fd, message_to_send.c_str(), message_to_send.size(), 0);

}

void Server::send_message(int client_fd, std::string message_to_send)
{
    for (std::map<int, Client *>::iterator it = _clients.begin(); it != _clients.end(); ++it) 
    {
        if (it->first != client_fd)
        {
            if (getClient(client_fd)->getChannel() && getClient(it->first)->getChannel())
            {
                if (getClient(client_fd)->getChannel()->getName() == getClient(it->first)->getChannel()->getName())
                {
                    send(it->first, getClient(client_fd)->getUsername().c_str(), getClient(client_fd)->getUsername().length(), 0);
                    send(it->first, ": ", 2, 0);
                    send(it->first, message_to_send.c_str(), message_to_send.size(), 0);
                }
            }
        }
    }
}

void Server::send_to_all(int client_fd, std::string message)
{
    for (std::map<int, Client *>::iterator it = _clients.begin(); it != _clients.end(); ++it) 
    {
        if (getClient(client_fd)->getChannel() && getClient(it->first)->getChannel())
            if (getClient(client_fd)->getChannel() == getClient(it->first)->getChannel())
                send(it->first, message.c_str(), message.size(), 0);
    }
}

int Server::set_info_client(int client_fd, std::string message, size_t pos, Client *client)
{
    if (message.substr(0, pos) == "USERNAME")
    {
        if (getClient(message.substr(pos + 1)))
            return (send_to_me(client_fd, "\nUsername already use\n\n"), 1);
        return (client->setUsername(message.substr(pos + 1)), 1);
    }
    if (message.substr(0, pos) == "NICKNAME")
            return (client->setNickname(message.substr(pos + 1)), 1);
    if (client->getUsername().empty() ) //|| client->getNickname().empty())
    {
        send(client_fd, "\nYou need to set your profile :\nUSERNAME <username>\nNICKNAME <nickname>\n      \n", 80, 0);
        return (1);
    }
    if (message.substr(0, pos) == "JOIN")
        return (client->joinChannel(*this, message.substr(pos + 1), client_fd, 0), void(0), 1);
    return (0);
}

// check chaque action du nos users
void Server::handleClientMessage(int client_fd) 
{
    char buffer[BUFFER_SIZE];
    memset(buffer, 0, BUFFER_SIZE);
    int bytes_received = recv(client_fd, buffer, BUFFER_SIZE - 1, 0);
    
    if (bytes_received <= 0) 
    {
        std::cout << "Client disconnected : " << client_fd << std::endl;
        removeClient(client_fd);
    } 
    
    else
    {
        Client *client = _clients[client_fd];

        //std::string password;
        std::string message(buffer);
        std::string messageNoNewline = message.substr(0, message.length() - 1);

        std::cout << "Message received from " << client_fd << ": " << message << std::endl;

        //char* pass_position = strstr(buffer, "PASS ");
//
        //if (pass_position) 
        //{    
        //    password = pass_position + 5;
        //    size_t end_pos = password.find("\r\n");
        //    if (end_pos != std::string::npos) 
        //        password = password.substr(0, end_pos);
        //    std::cout << "Password received: " << password << std::endl;
        //}
        
        if (!client->isAuth()) 
        {
            if (messageNoNewline == _password)
            {
                std::cout << "Client authenticated: " << client_fd << std::endl;
                client->setAuth(true);
                send(client_fd, "\nYou are connected\n\n", 20, 0);
            } 
            else
            {
                std::cout << "Incorrect password from client: " << client_fd << std::endl;
                send(client_fd, "\nBad password\n", 14, 0);
                removeClient(client_fd);
            } 
            return;
        }
        if (set_info_client(client_fd, messageNoNewline, messageNoNewline.find(' '), client))
            return ;
        if (!client->getChannel())
        {
            send(client_fd, "\nYou need to join a channel for send message\n \n", 48, 0);
            return ;
        }
        if (commande(client_fd, messageNoNewline, messageNoNewline.find(' '), client))
            return ;
        send_message(client_fd, message);
    }
}


//function pour remove dans _poll_fds le fd du user + _clients.erase qui supprime le socket du user 
//std::map<int, Client *> _clients; vector map pour associer int a un object pour aue chaque fd (client) 
//sois associer a lobject Client pour pouvoir manages nos users
void Server::removeClient(int client_fd)
{
    close(client_fd);
    for (int i = 1; i < MAX_CLIENTS; ++i) {
        if (_poll_fds[i].fd == client_fd) 
        {
            _poll_fds[i].fd = -1;
            break;
        }
    }
}

Channel &Server::channelExists(std::string name)
{
    for (size_t i = 0; i < (_channels.size()); i++)
        if (_channels[i]->getName() == name)
            return (*_channels[i]);
    throw std::runtime_error("channel not found");
}

std::map<int, Client *> Server::getClients()
{
    return (_clients);
}

Client * Server::getClient(int clienfd)
{
    for (std::map<int, Client *>::iterator it = _clients.begin(); it != _clients.end(); ++it) 
    {
        if (it->first == clienfd)
            return (it->second);
    }
    send(clienfd, "\nuser not found\n\n", 17, 0);
    return NULL;
}

Client * Server::getClient(std::string username)
{
    for (std::map<int, Client *>::iterator it = _clients.begin(); it != _clients.end(); ++it) 
    {
        if ((*it->second).getUsername() == username)
            return (it->second);
    }
    return NULL;
}


void Server::newChannel(Channel *channel)
{
    this->_channels.push_back(channel);
}

