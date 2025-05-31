#pragma once

class Channel;

#include "Server.hpp"

class Server;

class Client
{
private:
    int _fd;
    bool _authenticated;
    bool _isOperator;
    Channel *_channel;
    std::string _nickname;
    std::string _username;

public:
    Client(int fd);
    Client();
    ~Client();

    int getFd() const;
    std::string getNickname() const;
    std::string getUsername() const;
    Channel *getChannel() const;
    bool getOperator();

    void setOperator(bool isOperator);
    void setUsername(const std::string &username);
    void setChannel(Channel *channel);
    void setAuth(bool auth);
    void setFD(int clien_fd);

    void setNickname(const std::string &nickname);
    bool hasPermission() const;
    void joinChannel(Server &server, std::string name, int client_fd, int invite);
    bool isAuth() const;
    bool isOperator() const;
};
