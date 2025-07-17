#include "Server.hpp"

class Channel
{
private:
    std::map<int, Client *> _client;
    std::string _topic;
    std::string _name;
    std::string _password;
    bool _invite_only;
    bool _topic_op_only;
    int _user_count;
    int _user_limite;

public:
    Channel();
    ~Channel();

    void kick(Server &server, int client_fd, std::string message);
    void invite(Server &server, int client_fd, std::string message);
    void topic(Server &server, int client_fd, std::string message);
    void mode(Server &server, int client_fd, std::string message);
    void inviteOnly(Server &server, Client *client);
    void addClient(Client *client, int client_fd);
    void topicCmd(Server &server, Client *client);
    void passwordChannel(Server &server, Client *client, std::string password);



    void setOpChannel(Client *client, Server &server, std::string username);
    void setUserCountChannel(Server &server, Client *client, std::string users_count);
    void setUsercount(int user);
    void setName(std::string name);

    int getUserlimite();
    int getUsercount();
    bool getInviteOnly();
    std::string getPassword();
    Client *getClient(Server &server, int clienfd);
    Client *getClient(Server &server, std::string username);
    std::string getName();


    Client *clientExist(std::string name);
};
