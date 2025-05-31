#include "../header/Server.hpp"

Client::Client(int fd) : _fd(fd), _authenticated(false), _isOperator(false), _channel(NULL)
{
}

Client::Client() : _fd(-1), _authenticated(false), _isOperator(false), _channel(NULL)
{
}



Client::~Client()
{
}


int Client::getFd() const
{
    return (_fd);
}

bool Client::getOperator()
{
    return (_isOperator);
}
std::string Client::getNickname() const
{
    return (_nickname);
}
std::string Client::getUsername() const
{
    return (_username);
}

Channel *Client::getChannel() const
{
    return (_channel);
}

void Client::setNickname(const std::string &nickname) 
{ 
    _nickname = nickname; 
}
void Client::setUsername(const std::string& username)
{ 
    _username = username; 
}
void Client::setChannel(Channel *channel)
{ 
    _channel = channel; 
}

void Client::setFD(int client_fd)
{ 
    _fd = client_fd; 
}

void Client::joinChannel(Server &server, std::string message, int client_fd, int invite)
{ 
    std::string name = message.substr(0, message.find(' '));
    std::string pass = "";
    pass = message.substr(message.find(' ') + 1);
    try 
    {
        Channel &channel = server.channelExists(name);
        if (channel.getInviteOnly() && !invite)
        {
            server.send_to_me(client_fd, "\nUnable to join: invite only.\n\n");
            return ;
        }
        if (!channel.getPassword().empty() && !invite)
        {
            if (pass == name)
                return (server.send_to_me(client_fd ,"\nThis channel requieres a password : JOIN <name> <password>\n\n"), void(0));

            if (channel.getPassword() != pass)
                return(server.send_to_me(client_fd ,"\nWrong password !\n\n"), void(0));
        }
        if (channel.getUserlimite() != -1 && channel.getUsercount() >= channel.getUserlimite())
        {
            server.send_to_me(client_fd, "\nUnable to join: channel user limit has been reached.\n\n");
            return ;
        }
        this->setOperator(false);
        this->setChannel(&channel);
        channel.addClient(this, client_fd);
        channel.setUsercount(1);
        server.send_to_all(client_fd, "\n");
        server.send_to_all(client_fd, server.getClient(client_fd)->getUsername());
        server.send_to_all(client_fd, " join channel ! \n\n");
    }
    catch (std::runtime_error &e)
    {
        Channel *channel = new Channel;

        server.newChannel(channel);
        this->setOperator(true);
        this->setChannel(channel);
        channel->setName(name);
        channel->addClient(this, client_fd);
        channel->setUsercount(1);
        
        //server.send_to_me(client_fd, ":test JOIN :test\r\n");
        server.send_to_me(client_fd, "\nYou create new channel, you are operator\n\n");
    }
}

bool Client::hasPermission() const 
{
    return (_isOperator);
}

bool Client::isAuth() const { return _authenticated; }
void Client::setAuth(bool auth) { _authenticated = auth; }
bool Client::isOperator() const { return _isOperator; }
void Client::setOperator(bool isOperator) { _isOperator = isOperator; }
