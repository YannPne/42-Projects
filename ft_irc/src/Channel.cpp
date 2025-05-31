#include "../header/Server.hpp"

Channel::Channel() : _topic("Default theme"), _password(""), _invite_only(false),  _topic_op_only(false), _user_count(0), _user_limite(-1) 
{
    
} 

Channel::~Channel() {}

Client *Channel::clientExist(std::string name)
{
    for (std::map<int, Client *>::iterator it = _client.begin(); it != _client.end(); ++it)
        if ((*it->second).getUsername() == name)
            return (it->second);
    return NULL;
}

bool Channel::getInviteOnly()
{
    return (_invite_only);
}

void Channel::kick(Server &server, int client_fd, std::string username) 
{
    Client *client_to_kick = NULL;

    std::map<int, Client *> clients_server = server.getClients();

    for (std::map<int, Client *>::iterator it = clients_server.begin(); it != clients_server.end(); ++it)
        if ((*it->second).getUsername() == username) 
            client_to_kick = it->second;    

    if (!client_to_kick)
    {
        server.send_to_me(client_fd, "\nuser not found !\n\n");
        return ;
    }
    server.send_to_all(client_fd, username);
    server.send_to_all(client_fd, " has been kick !\n\n");

    _client.erase(client_to_kick->getFd());
    client_to_kick->setChannel(NULL);

    server.send_to_me(client_fd, "\nClient ");
    server.send_to_me(client_fd, username);
    server.send_to_me(client_fd, " kicked from the channel\n\n");
}

void Channel::invite(Server &server, int client_fd, std::string username)
{
    Client *client_to_invite = getClient(server, username);

    if (!client_to_invite)
    {
        server.send_to_me(client_fd, "\nUser not found !\n\n");
        std::cerr << "User not found !" << std::endl;
        return;
    }
    if (clientExist(username))
    {
        server.send_to_me(client_fd, "\nuser already in the channel !\n\n");
        std::cerr << "User already in the channel" << std::endl;
        return;
    }
    //server.send_to_me(client_fd, username);
    //server.send_to_me(client_fd, " has been invited in channel\n\n");
    client_to_invite->joinChannel(server, this->getName(), client_to_invite->getFd(), 1);
}

void Channel::topic(Server &server, int client_fd, std::string new_topic)
{
    if (this->getClient(server, client_fd)->isOperator() || this->_topic_op_only)
    {
        if (new_topic == "TOPIC")
        {
            server.send_to_me(client_fd, "\nTopic theme name : ");
            server.send_to_me(client_fd, _topic);
            server.send_to_me(client_fd, "\n\n");
            return ;
        }
        _topic = new_topic;
        server.send_to_me(client_fd, "\nThe channel topic has been changed to : ");
        server.send_to_me(client_fd, _topic);
        server.send_to_me(client_fd, "\n\n");
    }
}

void Channel::inviteOnly(Server &server, Client *client)
{
    if (!client->isOperator())
    {
        std::cerr << "You are not operator" << std::endl;
        return ;
    }
    _invite_only = !_invite_only;
    server.send_to_me(client->getFd(), "\nInvite only is ");
    server.send_to_me(client->getFd(), (_invite_only ? "enable\n\n" : "disable\n\n"));
}

void Channel::topicCmd(Server &server, Client *client) {
    // Set/remove topic command restriction for channel operators
    if (client->isOperator())
        _topic_op_only = !_topic_op_only;
    server.send_to_me(client->getFd(), "\nTopic op only is ");
    server.send_to_me(client->getFd(), (_topic_op_only ? "enable\n\n" : "disable\n\n"));
}

void Channel::passwordChannel(Server &server, Client *client, std::string password) {
    // Set/remove channel password
    if (client->isOperator() && password == "-k")
    {
        server.send_to_me(client->getFd(), "\nPassword remove\n\n");
        this->_password = "";
    }
    else
    {
        if (password.empty())
            return ;
        this->_password = password.substr(1);
        server.send_to_me(client->getFd(), "\nNew password : ");
        server.send_to_me(client->getFd(), password);
        server.send_to_me(client->getFd(), "\n\n");
    }
}

void Channel::setOpChannel(Client *client, Server &server, std::string username)
{
    // Grant/remove channel operator privilege
    if (!client->isOperator() || username.empty())
        return ;
    username = username.substr(1);
    Client *client_to_set = server.getClient(username);
    if (!client_to_set)
        return (server.send_to_me(client->getFd(), "\nUser not found\n\n"), void(0));
    client_to_set->setOperator(!client_to_set->getOperator());
    server.send_to_me(client->getFd(), "\n");
    server.send_to_me(client->getFd(), username);
    server.send_to_me(client->getFd(), "is now : ");
    server.send_to_me(client->getFd(), (client->getOperator() ? "operator !\n\n" : "user !\n\n"));
}

void Channel::setName(std::string name)
{
    _name = name;
}

void Channel::setUserCountChannel(Server &server, Client *client, std::string user_limite) 
{
    if (!client->isOperator())
       return ;
    try
    {
        if (user_limite.empty())
        {
            this->_user_limite = -1;
            server.send_to_me(client->getFd(), "\nLimite user channel remove\n\n");
            return ;
        }
        user_limite.substr(1);
        this->_user_limite = atoi(user_limite.c_str());
        server.send_to_me(client->getFd(), "\nLimite user channel set to : ");
        server.send_to_me(client->getFd(), user_limite);
        server.send_to_me(client->getFd(), "\n\n");
    }
    catch(const std::exception& e)
    {
        server.send_to_me(client->getFd(), "\n");
        server.send_to_me(client->getFd(), e.what());
        server.send_to_me(client->getFd(), "\n\n");
    }
}

std::string Channel::getPassword()
{
    return(_password);
}

std::string ft_get_password(std::string message)
{
    size_t i = 0;
    while (i < message.size() && message[i] != ' ')
        i++;
    if (i < message.size())
        i++;
    return (message.substr(i));
}

Client * Channel::getClient(Server &server, int clienfd)
{
    return (server.getClient(clienfd));
}
Client * Channel::getClient(Server &server, std::string username)
{
    return (server.getClient(username));
}

void Channel::setUsercount(int user)
{
    _user_count += user;
}

int Channel::getUserlimite()
{
    return (_user_limite);
}

int Channel::getUsercount()
{
    return (_user_count);
}

void Channel::mode(Server &server, int client_fd, std::string message) 
{
    Client *client = getClient(server, client_fd);
    if (message.empty() || message[0] != '-')
    {
        server.send_to_me(client_fd, "\nFormat: MODE -(i, t, k, o, l)\n\n");
        return;
    }
    switch (message[1]) {
        case 'i':
            inviteOnly(server, client);
            break;
        case 't':
            topicCmd(server, client);
            break;
        case 'k':
            passwordChannel(server, client, message.substr(2));
            break;
        case 'o':
            setOpChannel(client, server, message.substr(2));
            break;
        case 'l':
            setUserCountChannel(server, client, message.substr(2));
            break;
        default:
            server.send_to_me(client_fd, "\nFormat: MODE -(i, t, k, o, l)\n\n");
            break;
    }
}

std::string Channel::getName()
{
    return (_name);
}

void Channel::addClient(Client *client, int client_fd)
{
    this->_client[client_fd] = client;
    
}